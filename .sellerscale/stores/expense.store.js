import API from '@/services/api';
import ItemStore from '@/stores/item.store';

/**
 * @typedef Expense
 * @property {Number} id
 * @property {String} [description] - migrate from `name`
 * @property {String} [category]
 * @property {String} [date]
 * @property {String} [endDate] - migrate to `null`
 * @property {String} [currentDate] - client side only
 * @property {Number} [amount]
 * @property {Number} [amountOrigin] - migrate to `null`
 * @property {Boolean} [recurrence] - migrate from `recurring`
 * @property {Number} [productId]
 * @property {Number} [marketplace] - not supported
 * @property {Number} [attachments] - not supported
 * @property {Number} [comment]
 */

export default class ExpenseStore extends ItemStore {
  static get api() {
    return API.Expenses;
  }

  static prepareData(data) {
    if (data.amount) {
      data.amount = Number(data.amount) || 0;
    }

    if (data.productId) {
      data.productId = Number(data.productId) || 0;
    }
  }
}
