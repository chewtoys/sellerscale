import kebabCase from 'lodash/kebabCase';
import Logdown from 'logdown';
import Analytics from '@/services/analytics';
import { deepCopy } from '@/util';

export default class ItemStore {
  /**
   * API service getter
   * @abstract
   * @returns {{}}
   */
  static get api() {
    return {};
  }

  /**
   * Store name
   * @type {String}
   */
  name;

  /**
   * Logger instance
   * @type {Logdown}
   */
  logger;

  /**
   * API Service intance
   */
  api; // API Service

  /**
   * Item data
   * @type {Object}
   */
  data;

  /**
   * If item is loaded
   * @type {boolean}
   */
  loaded = false;

  /**
   * Promise that tells if there is a saving in the process
   */
  saving$;

  /**
   * Is data pending for save?
   * @type {boolean}
   */
  pendingSave = false;

  /**
   * Promise that tells if there is a deletion in the process
   */
  deleting$;

  /**
   * ID getter
   * @returns {String|Number}
   */
  get id() {
    return this.data ? this.data.id : undefined;
  }

  /**
   * @constructor
   * @param {Object} data
   */
  constructor(data) {
    this.name = kebabCase(this.constructor.name).replace('-store', '');
    this.api = this.constructor.api;
    this.logger = new Logdown(`app.${this.name}`);

    this.set = this.set.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.change = this.change.bind(this);

    this.data = {};

    if (typeof data === 'number') {
      this.set({ id: parseInt(String(data), 10) });
    } else {
      this.prepareData(data);

      this.set(data);

      this.loaded = true;
    }
  }

  /**
   * Fetch item data
   * @returns {Promise<ItemStore>}
   */
  async fetch() {
    const data = await this.api.get(this.id);

    this.prepareData(data);

    this.set(data);

    this.logger.info(`${this.name} loaded`, this.data.id);

    this.loaded = true;

    return this;
  }

  /**
   * Save current item
   */
  async save() {
    // no parallel saving
    if (this.saving$) {
      this.pendingSave = true;

      return this.saving$;
    }

    return this.savePrivate();
  }

  /**
   * Save current item. Async recursive method
   * @private
   * @returns {Promise<*>}
   */
  async savePrivate() {
    let data;

    this.logger.info(`${this.name} ${this.id ? 'saving' : 'creating'}`, this.id || 'NEW');

    this.saving$ = ((async () => {
      if (this.id) {
        data = await this.api.update(this.data);
      } else {
        data = await this.api.add(this.data);
      }

      this.prepareData(data);

      if (this.pendingSave) {
        return this.savePrivate();
      }

      this.logger.info(`${this.name} ${this.id ? 'saved' : 'created'}`, data.id);

      Analytics.event(`${this.name}:${this.id ? 'save' : 'add'}`, this.data);

      return this.set(data);
    })());

    this.saving$.finally(() => {
      delete this.pendingSave;
      delete this.saving$;
    });

    return this.saving$;
  }

  /**
   * Delete current item
   * @return {Promise<*>}
   */
  async delete() {
    if (!this.id) return undefined;

    if (this.deleting$) return this.deleting$;

    this.logger.info(`${this.name} deleting`, this.id);

    const { data } = this;

    this.deleting$ = true;

    // do not delete deletion$ promise in positive case
    // it will prevent accidental deletion of item that were already deleted
    return this.api.delete(data.id)
      .then(() => {
        this.logger.info(`${this.name} deleted`, this.id);

        Analytics.event(`${this.name}:delete`, { id: this.id });
      }, () => {
        delete this.deleting$;
      });
  }

  /**
   * Get item data
   * @param {Boolean} withoutId
   * @returns {Object}
   */
  getData(withoutId) {
    const data = deepCopy(this.data);

    if (withoutId) {
      delete data.id;
    }

    return data;
  }

  /**
   * Duplicate current item store
   * @returns {ItemStore}
   */
  copy() {
    const rawData = this.getData(true);

    return new this.constructor(rawData);
  }

  /**
   * Setting new data to the item
   * @param {Object} partData
   * @returns {boolean} – tells if item was changed
   */
  set(partData = {}) {
    const changed = {};
    const previous = {};

    if (this.data && this.data.id && partData.id) {
      delete partData.id;
    }

    const oldRawData = deepCopy(this.data);

    const newRawData = { ...deepCopy(this.data) };

    Object.keys(partData)
      .forEach((prop) => {
        newRawData[prop] = partData[prop];
      });

    this.prepareData(newRawData);

    Object.keys(newRawData).forEach((prop) => {
      if (JSON.stringify(oldRawData[prop]) !== JSON.stringify(newRawData[prop])) {
        if (oldRawData[prop] != null || newRawData[prop] != null) {
          changed[prop] = newRawData[prop] == null ? null : newRawData[prop];
        }
      }
    });

    const isSomethingChanged = Object.keys(changed).length;

    if (!isSomethingChanged) {
      return false;
    }

    // calculate previous object
    if (this.loaded) {
      Object.keys(changed).forEach((prop) => {
        previous[prop] = this.data[prop];
      });
    }

    // regenerate data and rawData
    this.data = newRawData;

    // if nothing changed
    if (!Object.keys(changed).length) {
      return false;
    }

    // if something changed
    if (this.loaded) {
      this.logger.info(`${this.name} changed:`, changed, 'previous:', previous);
    }

    return changed;
  }

  /**
   * Trigger change of the item data with following saving
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  async change(data) {
    const changedProps = this.set(data);

    if (changedProps) {
      await this.save();

      Analytics.event(`${this.name}:change`, { id: this.id, ...data });

      return true;
    }

    return false;
  }

  /**
   * Prepare data before applying
   * @param data
   */
  prepareData(data) {
    if (!data) {
      data = this.data;
    }

    if (data.id != null) {
      data.id = parseInt(data.id, 10) || undefined;
    }

    Object.keys(data)
      .forEach((prop) => {
        if (data[prop] == null) {
          data[prop] = null;
        }
      });

    this.constructor.prepareData(data);
  }

  /**
   * Prepare data from server before setting into the instance.
   * Abstract method.
   * @abstract
   * @param data
   * @returns {*}
   * @private
   */
  static prepareData(data) {}
}
