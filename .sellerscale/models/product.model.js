import ProductSchema from '@/scheme/product.schema';
import { deepCopy } from '@/util';
import calcAmazonSizeTier from '@/helpers/calc-amazon-size-tier';

const schema = ProductSchema();

export default class Product {
  id;

  parentId;

  asin;

  actualsFor = 7;

  amazonId = 0;

  acos = 0;

  amazonItemId = 0;

  averageInventory = 0;

  batchSize = 0;

  created;

  dailyPromoSales = 0;

  dailyUnitSales = 0;

  fbaFee = 0;

  height = 0;

  length = 0;

  longTermStorageFee = 0;

  monthlyStorageFee = 0;

  name = '';

  paymentProcessCost = 0;

  ppcShareSales = 0;

  productCost = 0;

  promoDiscount = 0;

  returnRate = 0;

  salesPrice = 0;

  status;

  updated;

  userId = 0;

  shippingCost = 0;

  _otherFees = 0;

  set otherFees(value) {
    if (this.type === 'tracked') {
      this._otherFees = value;
    }
  }

  get otherFees() {
    if (this.type === 'tracked') return this._otherFees;

    return Object.keys(this.otherFeesList)
      .reduce((sum, val) => sum + Number(this.otherFeesList[val]), 0);
  }

  otherFeesList = {
    fbaStorageFee: 0,
    fbaInboundTransportationFee: 0,
    variableClosingFee: 0,
    refundCommission: 0,
    fbaDisposalFee: 0,
    fbaCustomerReturnPerOrderFee: 0,
    fbaCustomerReturnPerUnitFee: 0,
    freshInboundTransportationFee: 0,
    fbaOverageFee: 0,
    fbaRemovalFee: 0,
    salesTaxCollectionFee: 0,
    fbaCustomerReturnWeightBasedFee: 0,
    labelingFee: 0,
    fbaInboundConvenienceFee: 0,
    fbaInboundTransportationProgramFee: 0,
    fbaTransportationFee: 0,
    fbaLongTermStorageFee: 0,
    bubblewrapFee: 0,
    opaqueBaggingFee: 0,
    polybaggingFee: 0,
    tapingFee: 0,
    fbaInboundDefectFee: 0,
    fbaWeightBasedFee: 0,
    couponClipFee: 0,
    couponRedemptionFee: 0,
    transportationFee: 0,
    fixedClosingFee: 0,
    highVolumeListingFee: 0,
    imagingServicesFee: 0,
    mfnPostageFee: 0,
    textbookRentalBuyoutFee: 0,
    textbookRentalExtensionFee: 0,
    textbookRentalServiceFee: 0,
    fbaFulfillmentCODFee: 0,
    fulfillmentNetworkFee: 0,
    freeReplacementRefundItems: 0,
    reversalReimbursement: 0,
    warehouseDamage: 0,
    compensatedClawback: 0,
    incorrectFeesNonItemized: 0,
    failedDisbursement: 0,
    merchantBadDebt: 0,
    warehouseLost: 0,
    missingFromInbound: 0,
  };

  vat = 0;

  weight = 0;

  width = 0;

  actuals;

  isHidden = false;

  autoCogs = false;

  /**
   * @type {Object}
   * @property {String} [small]
   * @property {String} [large]
   */
  images;

  category;

  _leadTime = 0;

  set leadTime(val) {
    if (this.type === 'tracked') {
      this._leadTime = val;
    }
  }

  get leadTime() {
    if (this.type === 'tracked') {
      return this._leadTime;
    }

    return (+this.productionTime)
      + (this.usePrepCenter ? (+this.shippingToPrepCenterTime) : 0)
      + (+this.shippingToFbaTime);
  }

  _referralFeePercent = 15;

  get referralFeePercent() {
    return this._referralFeePercent;
  }

  set referralFeePercent(value) {
    this._referralFeePercent = value;
  }

  salesTax = 0;

  ratio = 0;

  unitStorageCost = 0;

  usePrepCenter = false;

  productionTime = 0;

  shippingToPrepCenterTime = 0;

  shippingToFbaTime = 0;

  existing = false;

  marketplaces;

  /**
   * @param {typeof Product} data
   */
  constructor(data) {
    this.images = {};

    this.set(data);
  }

  set(data) {
    Object.keys(data)
      .forEach((key) => {
        const val = data[key];

        if (!(key in this) || !(key in schema)) {
          /* eslint-disable-next-line */
          console.error(`unknown key used '${key}'`);

          return;
        }

        if (val != null && !schema[key].computed) {
          if (schema[key].unit) {
            if (schema[key].unit === 'bool') {
              this[key] = !!data[key];
            } else {
              this[key] = +(data[key]);
            }
          } else {
            this[key] = data[key];
          }
        }
      });
  }

  get() {
    const productData = Object.keys(schema)
      .reduce((data, prop) => {
        /* eslint-disable-next-line */
        data[prop] = this[prop];

        return data;
      }, {});

    // delete productData.actualsFor;

    return productData;
  }

  getRaw(withoutId = false) {
    const productData = Object.keys(schema)
      .reduce((data, prop) => {
        if (!schema[prop].computed) {
          /* eslint-disable-next-line */
          data[prop] = this[prop];
        }

        return data;
      }, {});

    if (withoutId) {
      delete productData.id;
    }

    return deepCopy(productData);
  }

  get type() {
    return this.existing ? 'existing' : 'tracked';
  }

  get unitLandedCost() {
    return (+this.productCost); // + (+this.shippingCost || 0);
  }

  get referralFee() {
    return (+this.salesPrice) * this.referralFeePercent / 100;
  }

  get refundCost() {
    return ((+this.referralFee) * 0.2
      + (+this.fbaFee)) * ((+this.returnRate) / 100);
  }

  get promoRebatesUnit() {
    return (
      (+this.salesPrice)
      * (+this.promoDiscount)
      / 100.0
      * (+this.dailyPromoSales)
    ) / ((+this.dailyUnitSales) + (+this.dailyPromoSales));
  }

  get otherFeesSum() {
    return (+this.refundCost || 0)
      + (+this.promoRebatesUnit || 0)
      + (+this.unitStorageCost || 0);
  }

  get amazonFees() {
    return (+this.referralFee)
      + (+this.fbaFee)
      + (+this.otherFeesSum);
  }

  get ppcCost() {
    return (+this.salesPrice)
      * ((+this.acos) / 100)
      * ((+this.ppcShareSales) / 100);
  }

  get vatCost() {
    return (+this.vat) / 100
      * (+this.salesPrice);
  }

  get paymentProcessCost() {
    return (+this.paymentProcessCost)
      * ((+this.referralFee) + (+this.fbaFee));
  }

  get otherCost() {
    return (+this.vatCost)
      + (+this.paymentProcessCost);
  }

  get contribMargin() {
    if (+this.salesPrice === +this.breakevenPrice
      || +this.acos === +this.breakevenAcos) {
      return 0;
    }

    return (+this.salesPrice)
      - (+this.unitLandedCost)
      - (+this.amazonFees)
      - (+this.ppcCost);
  }

  get contribMarginPercent() {
    return (+this.contribMargin) / (+this.salesPrice) * 100;
  }

  get roi() {
    return (+this.contribMargin) / (+this.unitLandedCost) * 100;
  }

  get totalDailyUnitSales() {
    return (+this.dailyUnitSales) + (+this.dailyPromoSales);
  }

  get paybackPeriod() {
    return this.roi > 0
      ? ((+this.batchSize) * (+this.unitLandedCost))
      / (
        ((+this.salesPrice) - (+this.amazonFees) - (+this.ppcCost))
        * (this.totalDailyUnitSales * 30)
        // + ((+this.salesPrice * (1 - this.promoDiscount / 100))
        //   - (+this.amazonFees) - (+this.ppcCost))
        // * ((+this.dailyPromoSales) * 30)
      ) * 30 + (this.leadTime || 0)
      : undefined;
  }

  get profit() {
    return (+this.contribMargin)
      * (this.totalDailyUnitSales) * 30;
  }

  get revenue() {
    return (+this.salesPrice) * (+this.totalDailyUnitSales) * 30;
  }

  get sizeTier() {
    return calcAmazonSizeTier(this);
  }

  get breakevenPrice() {
    const {
      unitLandedCost, fbaFee, unitStorageCost,
      dailyPromoSales, promoDiscount, dailyUnitSales, returnRate, acos, ppcShareSales,
    } = this;
    const breakevenPrice = (unitLandedCost
        + fbaFee + unitStorageCost + fbaFee * (returnRate / 100))
      / (1 - 0.15
        - (promoDiscount * dailyPromoSales) / 100 / (dailyUnitSales + dailyPromoSales)
        - (acos / 100 * ppcShareSales / 100));
    return Number(breakevenPrice.toFixed(2));
  }

  get breakevenAcos() {
    const {
      unitLandedCost, amazonFees, salesPrice, ppcShareSales,
    } = this;
    let breakevenAcos = Math.max((salesPrice - unitLandedCost - amazonFees)
      / salesPrice / ppcShareSales * 100 * 100, 0);

    if (!salesPrice || !ppcShareSales) {
      breakevenAcos = 100;
    }

    return Math.ceil(breakevenAcos);
  }
}
