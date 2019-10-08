import Logdown from 'logdown';
import API from '@/services/api';
import Product from '@/models/product.model';
import ProductSchema from '@/scheme/product.schema';
import { deepCopy } from '@/util';
import Analytics from '@/services/analytics';

const logger = new Logdown('app.items-store');
const schema = ProductSchema();

/**
 * Filter out computed and not existed properties from product data
 * @param {typeof Product} partData
 */
function filterPartData(partData) {
  Object
    .keys(partData)
    .forEach((prop) => {
      if (!(prop in schema)) {
        /* eslint-disable-next-line */
        delete partData[prop];

        logger.error('setting unknown prop', prop);
      } else if (schema[prop].computed) {
        /* eslint-disable-next-line */
        delete partData[prop];
      }
    });
}

export default class ProductStore {
  name = 'product-store';

  get id() {
    return this.data && this.data.id;
  }

  model;

  data;

  dataShift;

  rawData;

  loaded = false;

  pendingSaveProps;

  saving$;

  deleting$;

  schema;

  categories = [];

  constructor(data) {
    this.set = this.set.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.change = this.change.bind(this);

    if (typeof data === 'number') {
      this.data = { id: parseInt(data, 10) };
    } else {
      this.data = { id: parseInt(data.id, 10) };

      this.schema = new ProductSchema(data.type);

      this.set(data);

      this.loaded = true;
    }
    // else {
    //   logger.error('invalid data', data);
    //   throw new Error('invalid data');
    // }
  }

  async fetch() {
    const data = await API.Products.get(this.id);

    this.set(data);

    if (this.data.type === 'tracked') {
      this.categories = await API.Products.getCategories();
    }

    this.schema = new ProductSchema(this.data.type);

    logger.info('product loaded', this.data.id);

    this.loaded = true;

    return this;
  }

  /**
   * Save current product
   */
  async save(changedProps) {
    // no parallel saving
    if (this.saving$) {
      if (this.pendingSaveProps) {
        this.pendingSaveProps.push(...changedProps);
      } else {
        this.pendingSaveProps = changedProps;
      }

      return this.saving$;
    }

    return this.savePrivate(changedProps);
  }

  async savePrivate(changedProps = []) {
    let data;
    let props;

    if (!changedProps.length) {
      const modelData = this.model.getRaw();

      props = Object.keys(modelData)
        .reduce((arr, prop) => {
          if (this.data[prop] !== modelData[prop]) {
            arr.push(prop);
          }

          return arr;
        }, ['id']);
    } else {
      // add `id` prop to data
      props = changedProps.concat(['id']);
    }

    const itemId = this.id;

    logger.info(`product ${itemId ? 'saving' : 'creating'}`, itemId || 'NEW');

    this.saving$ = ((async () => {
      if (itemId) {
        data = await API.Products.update(props
          ? props.reduce((updatedData, prop) => {
            /* eslint-disable-next-line */
            updatedData[prop] = this.data[prop];
            return updatedData;
          }, {})
          : this.data);
      } else if (this.data.asin) {
        data = await API.Products.add({ asin: this.data.asin });
      } else {
        data = await API.Products.add(this.data);
      }

      if (this.pendingSaveProps) {
        const { pendingSaveProps } = this;

        delete this.pendingSaveProps;

        return this.savePrivate(pendingSaveProps);
      }

      logger.info(`product ${itemId ? 'saved' : 'created'}`, data.id);

      return this.set(data, true);
    })()).finally(() => {
      delete this.saving$;
    });

    return this.saving$;
  }

  /**
   * Delete current product
   * @return {Promise<*>}
   */
  async delete() {
    const itemId = this.id;

    if (this.deleting$) return this.deleting$;

    logger.info('product deleting', itemId);

    const { data } = this;

    this.deleting$ = true;

    // do not delete deletion$ promise in positive case
    // it will prevent accidental deletion of product that were already deleted
    return API.Products.delete(data.id)
      .then(() => {
        logger.info('product deleted', itemId);

        Analytics.event(`${this.name}:delete`, { id: this.id });
      }, () => {
        delete this.deleting$;
      });
  }

  /**
   * Hide current product
   * @returns {Promise<boolean>}
   */
  async hide() {
    if (this.data.isHidden) return Promise.resolve();

    return this.change({ isHidden: true });
  }

  /**
   * Show current product
   * @returns {Promise<boolean>}
   */
  async show() {
    if (!this.data.isHidden) return Promise.resolve();

    return this.change({ isHidden: false });
  }

  /**
   * Set breakevent Sales Price
   * @returns {Promise<boolean>}
   */
  setBreakevenPrice() {
    const formattedPrice = this.data.breakevenPrice;

    Analytics.event(`${this.name}:set-breakeven-price`, { id: this.id, price: formattedPrice });

    return this.change({ salesPrice: formattedPrice });
  }

  /**
   * Set breakevent ACoS
   * @returns {Promise<boolean>}
   */
  setBreakevenAcos() {
    const formattedAcos = this.data.breakevenAcos;

    Analytics.event(`${this.name}:set-breakeven-acos`, { id: this.id, acos: formattedAcos });

    return this.change({ acos: formattedAcos });
  }

  /**
   * Set actual params for product
   * @param {Number} days
   * @returns {Promise<void>}
   */
  async setActuals(days) {
    const data = await API.Products.setActuals({ id: this.id, actualsFor: days });
    const { actuals, ...otherProps } = data;

    await this.change({ ...otherProps, ...actuals });

    Analytics.event(`${this.name}:set-actuals`, { id: this.id, period: days });

    return actuals;
  }

  copy() {
    const rawData = this.model.getRaw();

    delete rawData.id;

    return new ProductStore(rawData);
  }

  /**
   * Normalize data values with precision defined in schema
   * @param data
   * @returns {*}
   */
  normalize(data) {
    // skip if schema is not defined
    if (!this.schema) return data;

    delete data.actuals;

    Object.keys(data)
      .forEach((prop) => {
        const propSchema = this.schema[prop];

        if (propSchema.unit === 'bool') {
          data[prop] = !!data[prop];
        } else if (propSchema.precision != null) {
          data[prop] = Number(Number(data[prop]).toFixed(propSchema.precision));
        }
      });

    return data;
  }

  /**
   * Reset data shift
   */
  resetShift() {
    this.dataShift = {};
  }

  /**
   * @private
   * @param {typeof Product} partData
   * @param {boolean} withoutShift
   */
  set(partData, withoutShift) {
    const changed = {};

    partData = deepCopy(partData);

    filterPartData(partData);
    this.normalize(partData);

    const oldRawData = this.model ? this.model.getRaw() : {};

    if (this.model) {
      this.model.set(partData);
    } else {
      this.model = new Product(partData);
    }

    const newRawData = this.model.getRaw();

    Object.keys(newRawData).forEach((prop) => {
      if (JSON.stringify(oldRawData[prop]) !== JSON.stringify(newRawData[prop])) {
        changed[prop] = newRawData[prop];
      }
    });

    const isSomethingChanged = !!Object.keys(changed).length;

    if (!isSomethingChanged) {
      return false;
    }

    /* regenerate data and rawData */
    const newData = this.model.get();

    if (!withoutShift) {
      this.dataShift = this.data ? Object.keys(newData)
        .reduce((changes, prop) => {
          changes[prop] = newData[prop] - this.data[prop];

          if (!changes[prop]) delete changes[prop];

          return changes;
        }, {}) : {};
    }

    this.data = this.model.get();
    this.rawData = this.model.getRaw();

    if (this.loaded && !oldRawData.id && this.data.id) {
      logger.info('new product id applied', this.id);
    }

    /* do not tell about `actualsFor` changes */
    delete changed.actualsFor;

    if (!Object.keys(changed).length) {
      return false;
    }

    if (this.loaded) {
      logger.info('product changed', changed);
    }

    return changed;
  }

  async change(data) {
    const changedProps = this.set(data);

    if (changedProps) {
      await this.save(Object.keys(changedProps));

      Analytics.event(`${this.name}:change`, { id: this.id, ...data });

      return true;
    }

    return false;
  }
}
