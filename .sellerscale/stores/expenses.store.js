import { format } from 'date-fns';
import API from '@/services/api';
import ExpenseStore from './expense.store';
import ItemsStore from './items.store';

export const EXPENSE_CATEGORIES = [
  'cogs',
  'software',
  'freelancer_fees',
  'rent',
  'external_advertising',
  'payroll',
  'payment_processing_fee',
  'product_samples',
  'product_photography',
  'legal_fees',
  'consulting_fees',
  'education',
  'general',
  'insurance',
];

export default class ExpensesStore extends ItemsStore {
  /**
   * @type {Array<ExpenseStore>}
   */
  items;

  static get api() {
    return API.Expenses;
  }

  static get store() {
    return ExpenseStore;
  }

  // async fetch() {
  //   this.items = [];
  //
  //   return this;
  // }

  getTotalOneTimeExpenses() {
    return this.items.reduce(
      (sum, expense) => sum + (expense.data.recurrence ? 0 : expense.data.amount),
      0,
    );
  }

  getTotalRecurringExpenses() {
    return this.items.reduce(
      (sum, expense) => sum + (!expense.data.recurrence ? 0 : expense.data.amount),
      0,
    );
  }

  static get defaultData() {
    return {
      recurrence: false,
      date: format(Date.now(), 'YYYY-MM-DD'),
      amount: 0,
    };
  }
}
