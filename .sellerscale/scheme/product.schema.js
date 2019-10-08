import unitSchema from '@/scheme/unit.schema';

const MAX_PRICE = 99999;
const MAX_COST = 9999;
const MAX_PERCENT = 100;
const MAX_OVERFLOW_PERCENT = 1000;
const NUMERIC_TYPES = ['percent', 'currency', 'unit', 'inch', 'lb', 'day'];

export default function ProductSchema(type = 'tracked') {
  const isTracked = type === 'tracked';

  const schema = {
    amazonId: {},

    asin: {
      type: 'text',
    },

    images: {
      type: 'object',
    },

    salesTax: {},

    ratio: {},

    isHidden: {},

    autoCogs: {
      unit: 'bool',
    },

    actualsFor: {
      unit: 'period',
      editable: true,
    },

    actuals: {
      acos: {},
      dailyPromoSales: {},
      dailyUnitSales: {},
      fbaFee: {},
      ppcShareSales: {},
      promoDiscount: {},
      referralFee: {},
      salesPrice: {},
    },

    acos: {
      unit: 'percent',
      editable: true,
      precision: 0,
      min: 0,
      max: MAX_OVERFLOW_PERCENT,
      formula: 'advertisingSpend ÷ advertisingSales',
    },

    existing: {
      unit: 'bool',
    },

    averageInventory: {
      unit: 'currency',
      precision: 1,
    },

    batchSize: {
      unit: 'unit',
      precision: 0,
      editable: true,
      max: 9999,
      min: 1,
    },

    created: {},

    dailyPromoSales: {
      unit: 'unit',
      precision: 1,
      editable: true,
    },

    dailyUnitSales: {
      unit: 'unit',
      precision: 1,
      editable: true,
    },

    fbaFee: {
      unit: 'currency',
      editable: isTracked,
      precision: 2,
    },

    height: {
      unit: 'inch',
      editable: isTracked,
      precision: 1,
      min: 0,
      max: 9999,
    },

    id: {},

    parentId: {},

    length: {
      unit: 'inch',
      editable: isTracked,
      precision: 1,
      min: 0,
      max: 9999,
    },

    longTermStorageFee: {
      unit: 'currency',
      precision: 2,
    },

    monthlyStorageFee: {
      unit: 'currency',
      precision: 2,
    },

    name: {
      type: 'text',
    },

    ppcShareSales: {
      unit: 'percent',
      editable: true,
      precision: 0,
      min: 0,
      max: MAX_PERCENT,
      formula: 'ppcSales ÷ totalDailyUnitSales',
    },

    productCost: {
      unit: 'currency',
      editable: true,
      max: MAX_PRICE,
      min: 0.01,
      precision: 2,
    },

    promoDiscount: {
      unit: 'percent',
      editable: true,
      min: 0,
      max: MAX_PERCENT,
      precision: 0,
    },

    returnRate: {
      unit: 'percent',
      editable: isTracked,
      min: 0,
      max: MAX_PERCENT,
      precision: 0,
    },

    salesPrice: {
      unit: 'currency',
      editable: true,
      precision: 2,
      min: 0,
      max: MAX_COST,
    },

    status: {},

    updated: {},

    userId: {},

    shippingCost: {
      unit: 'currency',
      editable: true,
      max: MAX_PRICE,
      min: 0,
      precision: 1,
    },

    vat: {
      unit: 'percent',
      precision: 1,
    },

    weight: {
      unit: 'lb',
      editable: isTracked,
      precision: 1,
      min: 0,
      max: 9999,
    },

    width: {
      unit: 'inch',
      editable: isTracked,
      precision: 1,
      min: 0,
      max: 9999,
    },

    unitLandedCost: {
      unit: 'currency',
      computed: true,
      formula: 'productCost + shippingCost',
      precision: 2,
    },

    referralFee: {
      unit: 'currency',
      computed: true,
      formula: 'salesPrice × referralFeePercent',
      precision: 2,
    },

    referralFeePercent: {
      unit: 'percent',
      precision: 2,
    },

    unitStorageCost: {
      unit: 'currency',
      editable: isTracked,
      precision: 2,
    },

    refundCost: {
      unit: 'currency',
      computed: true,
      precision: 2,
    },

    promoRebatesUnit: {
      unit: 'currency',
      precision: 1,
      computed: true,
    },

    amazonFees: {
      unit: 'currency',
      computed: true,
      formula: 'referralFee + fbaFee + otherFees',
      precision: 2,
    },

    ppcCost: {
      unit: 'currency',
      computed: true,
      formula: 'salesPrice × acos × ppcShare',
      precision: 2,
    },

    vatCost: {
      computed: true,
    },

    paymentProcessCost: {
      unit: 'currency',
      precision: 2,
    },

    otherCost: {
      computed: true,
      precision: 2,
    },

    otherFees: {
      unit: 'currency',
      precision: 1,
      type: 'dropdown',
      editable: type !== 'existing',
      computed: type === 'existing',
    },

    otherFeesSum: {
      unit: 'currency',
      precision: 1,
      type: 'dropdown',
      editable: false,
      computed: true,
    },

    otherFeesList: {
      type: 'object',
      computed: false,
    },

    contribMargin: {
      unit: 'currency',
      computed: true,
      precision: 1,
      min: -99999,
      max: 99999,
      formula: 'salesPrice - unitLandedCost - amazonFees - ppcCost',
    },

    contribMarginPercent: {
      unit: 'percent',
      computed: true,
      precision: 1,
      min: -99999,
      max: 99999,
      formula: 'contribMargin ÷ salesPrice',
    },

    roi: {
      unit: 'percent',
      computed: true,
      precision: 1,
      min: -99999,
      max: 99999,
      formula: 'contribMargin ÷ unitLandedCost',
    },

    paybackPeriod: {
      unit: 'time',
      computed: true,
      formula: 'landedCost ÷ totalDailyUnitSales × (salesPrice - amazonFees - ppcCost) + leadTime',
    },

    profit: {
      unit: 'currency',
      computed: true,
      precision: 0,
      min: -999999,
      max: 999999,
      formula: 'contribMargin × totalDailyUnitSales × 30',
    },

    revenue: {
      unit: 'currency',
      computed: true,
      precision: 0,
      min: -999999,
      max: 999999,
      formula: 'salesPrice × totalDailyUnitSales × 30',
    },

    category: {
      type: 'text',
    },

    type: {
      type: 'text',
      computed: true,
    },

    leadTime: {
      unit: 'day',
      editable: isTracked,
      precision: 0,
      computed: !isTracked,
      min: 0,
      max: 999,
    },

    sizeTier: {
      unit: 'tier',
      computed: true,
    },

    usePrepCenter: {
      unit: 'bool',
      editable: !isTracked,
    },

    productionTime: {
      unit: 'day',
      editable: !isTracked,
      precision: 0,
      min: 0,
      max: 999,
    },

    shippingToPrepCenterTime: {
      unit: 'day',
      editable: !isTracked,
      precision: 0,
      min: 0,
      max: 999,
    },

    shippingToFbaTime: {
      unit: 'day',
      editable: !isTracked,
      precision: 0,
      min: 0,
      max: 999,
    },

    totalDailyUnitSales: {
      unit: 'unit',
      computed: true,
      precision: 1,
    },

    breakevenPrice: {
      unit: 'currency',
      computed: true,
    },

    breakevenAcos: {
      unit: 'percent',
      computed: true,
    },

    marketplaces: {},
  };

  Object.keys(schema)
    .forEach((prop) => {
      if (schema[prop].unit && unitSchema[schema[prop].unit]) {
        schema[prop].suffix = unitSchema[schema[prop].unit].suffix;
        schema[prop].prefix = unitSchema[schema[prop].unit].prefix;
        schema[prop].placeholder = schema[prop].suffix || schema[prop].prefix;
      }

      if (NUMERIC_TYPES.includes(schema[prop].unit)) {
        schema[prop].numeric = true;
      }
    });

  return schema;
}
