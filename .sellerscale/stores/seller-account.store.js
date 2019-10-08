import API from '@/services/api';
import ItemStore from '@/stores/item.store';

/**
 * @typedef SellerAccount
 * @property {Number} id
 * @property {String} name
 * @property {String} store
 * @property {String} storeRegion
 * @property {String} lastSync
 * @property {String} authToken
 */

/**
 * @class
 * @property {SellerAccount} data
 */
export default class SellerAccountStore extends ItemStore {
  static get api() {
    return API.AmazonSellerAccounts;
  }
}
