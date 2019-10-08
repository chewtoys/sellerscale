import API from '@/services/api';
import ItemStore from '@/stores/item.store';

/**
 * @typedef AdvertisingAccount
 * @property {Number} id
 * @property {String} name
 * @property {String} store
 * @property {String} storeRegion
 * @property {String} sellerId
 * @property {String} authToken
 */

/**
 * @class
 * @property {AdvertisingAccount} data
 */
export default class AdvertisingAccountStore extends ItemStore {
  static get api() {
    return API.AmazonSellerAccounts;
  }
}
