import Logdown from 'logdown';
import lockr from 'lockr';
import API from '@/services/api';
import Notifications from '@/services/notifications';
import router from '@/router';
/* eslint-disable-next-line no-unused-vars */
import Product from '@/models/product.model';
import ProductStore from '@/stores/product.store';
import { deepCopy, cacheProps } from '@/util';
import Analytics from '@/services/analytics';

const logger = new Logdown('app.items-store');

const RAW_DATA = {};

export default class ProductsStore {
  /**
   * Type of products
   * @type {('existing'|'tracked')}
   */
  type;

  /**
   * @type {Array<ProductStore>}
   */
  items;

  /**
   * @type {Array<Product>}
   */
  collectionData;

  /**
   * @type {Promise<any>}
   */
  fetching$;

  /**
   * If TRUE then it means that initially collectionData was provided to the store
   * @type {boolean}
   */
  preloaded = false;

  /**
   * @constructor
   * @param {('existing'|'tracked')} type - type of products
   */
  constructor(type = 'existing', collectionData) {
    this.type = type;

    cacheProps(this, `unit:${this.type}`, ['collectionData']);

    if (collectionData) {
      this.preloaded = true;
    }

    if (collectionData || this.collectionData) {
      this.set(collectionData || this.collectionData);
    }
  }

  get visibleItems() {
    return this.items.filter(product => !product.data.isHidden);
  }

  get hiddenItems() {
    return this.items.filter(product => product.data.isHidden);
  }

  getById(productId) {
    return this.items.find(product => product.id === productId);
  }

  /**
   * Fetching current products from server
   * @returns {Promise<ProductsStore>}
   */
  async fetch() {
    if (this.fetching$) {
      return this.fetching$;
    }

    this.fetching$ = API.Products.getAll({ type: this.type })
      .then((collectionData) => {
        this.set(collectionData);

        delete this.fetching$;

        logger.info('fetched', this.items.length, 'item(s)');

        return this;
      })
      .then(products => this.costWarning(products));

    if (this.collectionData && !this.items) {
      return Promise.resolve(this);
    }

    return this.fetching$;
  }

  /**
   * Get product store by productId
   * @param productId
   * @returns {ProductStore}
   */
  getProductStoreById(productId) {
    return this.items.find(productStore => productStore.id === productId);
  }

  /**
   * Update products with new data
   * @param {Number} id
   * @param {typeof Product} data
   * @returns {Promise<*>}
   */
  async update(id, data) {
    const product = this.getById(id);

    return product.change(data)
      .then((isChanged) => {
        if (isChanged) {
          this.cache();
        }

        return isChanged;
      });
  }

  /**
   * Trigger product saving
   * @param {ProductStore} product
   * @param {Array<String>} fields
   * @returns {Promise<*>}
   */
  async save(product, fields = []) {
    return product.save(fields)
      .finally(() => this.cache());
  }

  /**
   * Trigger product deletion
   * @param {Array<Number>} ids
   * @returns {Promise<*>}
   */
  async delete(ids) {
    const products = ids.map(id => this.getById(id));

    this.items = this.items.filter(product => products.indexOf(product) === -1);

    return Promise.all(products.map(product => product.delete()))
      .finally(() => this.fetch())
      .finally(() => this.cache());
  }

  /**
   * Set to actuals for products
   * @param {Array<Number>} ids
   * @returns {Promise<T>}
   */
  async setActuals(ids, actualsFor) {
    const products = ids.map(id => this.getById(id));

    return Promise.all(products.map(product => product.setActuals(actualsFor)))
      // .finally(() => this.fetch())
      .finally(() => this.cache());
  }

  /**
   * Hide product
   * @param {Array<Number>} ids
   * @returns {Promise<T>}
   */
  async hide(ids) {
    const products = ids.map(id => this.getById(id));

    return Promise.all(products.map(product => product.hide()))
      .finally(() => this.fetch())
      .finally(() => this.cache());
  }

  /**
   * Show products
   * @param {Array<Number>} ids
   * @returns {Promise<T>}
   */
  async show(ids) {
    const products = ids.map(id => this.getById(id));

    return Promise.all(products.map(product => product.show()))
      .finally(() => this.fetch())
      .finally(() => this.cache());
  }

  /**
   * Set breakeven Sales Price for products
   * @param {Array<Number>} ids
   * @returns {Promise<T>}
   */
  async setBreakeventPrice(ids) {
    const products = ids.map(id => this.getById(id));

    return Promise.all(products.map(product => product.setBreakevenPrice()))
      // .finally(() => this.fetch())
      .finally(() => this.cache());
  }

  /**
   * Set breakeven ACoS for products
   * @param {Array<Number>} ids
   * @returns {Promise<T>}
   */
  async setBreakeventAcos(ids) {
    const products = ids.map(id => this.getById(id));

    return Promise.all(products.map(product => product.setBreakevenAcos()))
      // .finally(() => this.fetch())
      .finally(() => this.cache());
  }

  /**
   * Tells if there is not enough data for visible products to show metrics
   * and calculate unit economics
   * @returns {Boolean}
   */
  isDataRequired() {
    const required = this.visibleItems.length && !!this.visibleItems.find(
      product => product.data.autoCogs,
    );

    if (!required) {
      logger.info('reset cost-warning state');
      lockr.set('cost-warning:dismissed', false);
    }

    return required;
  }

  isEmpty() {
    return !this.items.length;
  }

  /**
   * Save `collectionData` to local storage
   * @see src/util.js:cacheProps()
   */
  cache() {
    logger.info('items list cached');
    this.collectionData = this.items.map(productStore => productStore.rawData);
  }

  /**
   * @private
   * @param {Array<Product>} collectionData
   */
  set(collectionData) {
    this.collectionData = deepCopy(collectionData);
    this.items = collectionData.map(productData => new ProductStore(productData));
  }

  /**
   * Temporarily method to add new tracked product
   * @returns {Promise<undefined>}
   */
  add(productData) {
    if (this.type !== 'tracked') {
      return Promise.reject(new Error('only tracked product can be added'));
    }

    logger.info('add product', productData);

    if (productData.unitLandedCost) {
      productData.productCost = productData.unitLandedCost;
      // productData.productCost = productData.unitLandedCost * 0.7;
      // productData.shippingCost = productData.unitLandedCost * 0.3;

      delete productData.unitLandedCost;
    }

    const newProductStore = new ProductStore(productData);

    return newProductStore.save()
      .then(() => {
        this.items = [...this.items, newProductStore];
        logger.info('product added', newProductStore.data);
        Analytics.event('product:add', productData);
      })
      .catch(err => logger.error(err));
  }

  /**
   * Reset shift data
   */
  resetShift() {
    logger.info('reset shift data');

    this.items.forEach((productStore) => {
      productStore.resetShift();
    });
  }

  static async getRawByAsin(asin) {
    if (!asin || asin.length !== 10) return undefined;

    if (RAW_DATA[asin]) return RAW_DATA[asin];

    const data = API.Products.getByAsin({ asin });

    RAW_DATA[asin] = data;

    return data;
  }

  costWarning(products) {
    if (this.isDataRequired()) {
      Notifications.show({
        id: 'enter_cogs',
        message: 'enter_cogs',
        action: 'enter_cogs',
        callback() {
          router.push('/unit?enter=cogs');
        },
      });
    }

    return products;
  }
}
