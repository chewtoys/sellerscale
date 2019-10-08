import kebabCase from 'lodash/kebabCase';
import Logdown from 'logdown';
import ItemStore from './item.store';
import { deepCopy } from '@/util';
import Analytics from '@/services/analytics';

export default class ItemsStore {
  static get store() {
    return ItemStore;
  }

  static get api() {
    return {};
  }

  /**
   * @type {Array<ItemStore>}
   */
  items;

  /**
   * API Service instance
   * @type {Object}
   */
  api;

  /**
   * @constructor
   */
  constructor(preloadedData = null) {
    this.name = kebabCase(this.constructor.name).replace('-store', '');
    this.itemName = kebabCase(this.constructor.store.name).replace('-store', '');
    this.api = this.constructor.api;
    this.Store = this.constructor.store;
    this.items = [];
    this.logger = new Logdown(`app.${this.name}`);
    this.preloadedData = preloadedData;
  }

  /**
   * Fetch data and create stores for items
   * @returns {Promise<ItemsStore>}
   */
  async fetch() {
    this.items = (this.preloadedData || await this.api.getAll())
      .map(itemData => this.create(itemData));

    this.logger.info('fetched', this.items.length, 'item(s)');

    return this;
  }

  /**
   * Change data of the item
   * @param id
   * @param {Object} data
   * @returns {Promise<Boolean>}
   */
  async change(id, data) {
    const item = this.getById(id);

    return item.change(data)
      .then((isChanged) => {
        if (isChanged) {
          this.cache();
        }

        return isChanged;
      });
  }

  /**
   * Method that tells if the store has no items
   * @returns {boolean}
   */
  isEmpty() {
    return !this.items || !this.items.length;
  }

  /**
   * Get item store by id
   * @param id
   * @returns {ItemStore}
   */
  getById(id) {
    return this.items.find(item => item.id === id);
  }

  /**
   * Delete items.
   * @param {Array<Number>} ids
   * @returns {Promise<void>}
   */
  delete(ids) {
    const items = ids.map(id => this.getById(id));

    this.items = this.items.filter(product => !items.includes(product));

    return Promise.all(items.map(item => item.delete()))
      .finally(() => this.fetch())
      .finally(() => this.cache());
  }

  /**
   * Create new Item Store
   * @private
   * @param data
   * @returns {ItemStore|*}
   */
  create(data) {
    return new this.Store({
      ...this.constructor.defaultData, ...deepCopy(data),
    });
  }

  /**
   * Add new item to the store
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async add(data = {}) {
    const store = this.create(data);

    // @TODO: catch error
    await store.save();

    this.items.push(store);

    this.cache();
  }

  /**
   * Applies changes, triggers cache
   */
  cache() {
    this.items = [...this.items];
  }

  /**
   * Default data for new items
   * @abstract
   * @static
   * @returns {{}}
   */
  static get defaultData() {
    return {};
  }
}
