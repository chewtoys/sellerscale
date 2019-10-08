import camelCase from 'lodash/camelCase';
import { EXPENSE_CATEGORIES } from '@/stores/expenses.store';

export default [
  {
    id: 'grossRevenue',
    items: ['organicSales', 'ppcSales'],
    bold: true,
  },
  {
    id: 'costOfGoodsSold',
    border: true,
    // items: ['productCost', 'shippingCost', 'otherCost'],
  },
  {
    id: 'amazonFees',
    items: ['fbaFee', 'referralFee', 'storageCost', 'amazonOtherCost'],
  },
  // {
  //   id: 'advertisingCost',
  //   items: ['ppcCost', 'headlineSearchAds'],
  // },
  {
    id: 'ppcCost',
  },
  {
    id: 'grossProfit',
    // border: true,
    bold: true,
  },
  {
    id: 'overheadCosts',
    empty: false,
    border: true,
    items: EXPENSE_CATEGORIES.map(cat => camelCase(cat)),
  },
  // {
  //   id: 'operatingProfit',
  //   items: ['incomeTax'],
  // },
  {
    id: 'netProfit',
    // border: true,
    bold: true,
  },
  {
    id: 'kpi',
    border: true,
    abstract: true,
    items: ['margin', 'roi', 'refundRate', 'ppcShareSales', 'acos', 'conversion'],
    bold: true,
  },
];
