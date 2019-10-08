import Logdown from 'logdown';
import lockr from 'lockr';
import API from '@/services/api';
import { formatDate, cacheProps } from '@/util';
import Analytics from '@/services/analytics';

const GROUP_PERIODS = ['daily', 'weekly', 'monthly'];
const METRICS = ['costs', 'count', 'margin', 'profit', 'sales'];

const logger = new Logdown('app.stats');

/**
 * @typedef ProductPerformance
 * id {number} – product id
 * name {string} – product name
 * grossProfit {number}
 * grossMargin {number}
 * roi {number}
 * unitsSold {number}
 * refunds {number}
 * refundsCost {number}
 * ppcSpend {number}
 * acos {number}
 * ppcShare {number}
 * conversion {number}
 */

export default class Stats {
  name = 'stats';

  products;

  performance;

  /**
   * @property {String} total
   * @property {String} ads
   * @property {String} referral
   * @property {String} storage
   * @property {String} fba
   * @property {String} other
   */
  costs;

  count = 0;

  margin = 0;

  profit = 0;

  sales = 0;

  groupPeriod = 'weekly';

  availableGrouping;

  groupByParent = false;

  fromDate = '2018-07-01';

  toDate = '2018-09-30';

  salesDataSets;

  salesLabels;

  selectedProductId;

  items;

  rawStatsData;

  rawProductsData;

  constructor({
    from, to, groupPeriod, groupByParent,
  } = {}, rawStatsData, rawProductsData) {
    this.rawStatsData = rawStatsData;
    this.rawProductsData = rawProductsData;

    this.costs = {};
    this.products = [];
    this.performance = [];

    this.availableGrouping = ['daily', 'weekly'];

    this.salesDataSets = [[], [], []];
    this.salesLabels = [];

    this.adsDataSets = [[], [], []];
    this.adsLabels = [];

    cacheProps(this, 'stats', [
      'products',
      'performance',
      'sales',
      'costs',
      'count',
      'profit',
      'margin',
      'salesDataSets',
      'salesLabels',
      'adsDataSets',
      'adsLabels',
      'groupByParent',
      'availableGrouping',
      'groupPeriod',
      'fromDate',
      'toDate',
      'selectedProductId',
    ]);

    if (from != null || to != null) {
      this.setRange(from || this.fromDate, to || this.toDate);
    }

    if (groupPeriod != null) {
      this.setGroupPeriod(groupPeriod || 'weekly');
    }

    if (groupByParent != null) {
      this.setParentGrouping(groupByParent);
    }

    // this.items = [];
  }

  async fetch() {
    const products = this.rawProductsData
      || await API.Products.getAll({ isParent: this.groupByParent, type: 'existing' });

    this.setProducts(products);

    logger.info('fetched', products.length, 'product(s)');

    const stats = this.rawStatsData || await API.Stats.get({
      from: formatDate(this.fromDate),
      to: formatDate(this.toDate),
      groupBy: this.groupPeriod,
      groupByParent: this.groupByParent,
      itemId: this.selectedProductId === 'all'
        ? undefined
        : this.selectedProductId,
      detailedCosts: true,
    });

    logger.info('fetched', stats.salesCollection.length, 'stat item(s)');

    this.availableGrouping = stats.availableGrouping;
    this.groupPeriod = stats.groupBy;

    (this.groupByParent
      ? API.Products.getAll({ isParent: false, type: 'existing' })
      : Promise.resolve(products))
      .then((allProducts) => {
        stats.products.forEach((productPerf) => {
          const productData = allProducts.find(product => product.id === productPerf.id);

          if (productData && productData.images.small) {
            productPerf.image = productData.images.small;
          }
        });

        this.performance = stats.products;
      });

    this.setItems(stats.salesCollection, stats.adsCollection);

    METRICS.forEach((metric) => {
      if (typeof stats[metric] === 'object' && stats[metric] != null) {
        this[metric] = Object.keys(stats[metric])
          .reduce((obj, prop) => {
            /* eslint-disable-next-line no-param-reassign */
            obj[prop] = Number(stats[metric][prop]);

            return obj;
          }, {});
      } else {
        this[metric] = Number(stats[metric]);
      }

      lockr.set(`stats.${metric}`, this[metric]);
    });

    // TODO: delete after backend implementation
    if (typeof this.sales === 'object') return this;

    this.sales = {
      total: this.sales,
      organic: this.sales * 0.75,
      ppc: this.sales * 0.25,
    };
    this.count = {
      total: this.count,
      organic: this.count * 0.75,
      ppc: this.count * 0.25,
    };

    return this;
  }

  setItems(salesItems, adsItems) {
    const salesDataSets = [];
    salesDataSets.push(salesItems.map(item => Number(item.count) || null));
    salesDataSets.push(salesItems.map(item => Number(item.sales) || 0));
    salesDataSets.push(salesItems.map(item => Number(item.profit) || 0));

    this.salesDataSets = salesDataSets;
    this.salesLabels = salesItems.map(item => item.timestamp);

    const adsDataSets = [];
    adsDataSets.push(adsItems.map(item => Number(item.acos) || null));
    adsDataSets.push(adsItems.map(item => Number(item.ppc) || null));
    // adsDataSets.push(adsItems.map(item => Number(item.conversion) * 100 || null));

    this.adsDataSets = adsDataSets;
    this.adsLabels = adsItems.map(item => item.timestamp);
  }

  selectProduct = async (productId) => {
    if (this.selectedProductId !== productId) {
      this.selectedProductId = productId;

      return this.fetch();
    }

    Analytics.event('dashboard:productpicker', { id: productId });

    return Promise.resolve();
  };

  setProducts(products) {
    this.products = [{ id: 'all', name: 'All products' }, ...products]
      .filter(product => !product.isHidden);

    if (!this.products.map(product => product.id).includes(this.selectedProductId)) {
      this.selectedProductId = 'all';
    }
  }

  setRange = async (from, to) => {
    if (from !== this.fromDate || to !== this.toDate) {
      this.fromDate = from;
      this.toDate = to;

      return this.fetch();
    }

    return Promise.resolve();
  }

  setGroupPeriod = async (period) => {
    const transformedPeriod = period.toLowerCase();

    if (GROUP_PERIODS.includes(transformedPeriod)) {
      if (this.groupPeriod !== transformedPeriod) {
        this.groupPeriod = transformedPeriod;

        return this.fetch();
      }
    } else {
      logger.error('incorrect period:', period);
    }

    return Promise.resolve();
  }

  noSalesData() {
    // return !!this.salesDataSets[0].some(item => item);
    return !this.salesDataSets[0].some(item => item);
  }

  noAdsData() {
    return !this.adsDataSets[1].some(item => item);
  }

  setParentGrouping = async (bool) => {
    if (typeof bool !== 'boolean') {
      logger.error('incorrect parent grouping param:', bool);
    }

    if (this.groupByParent !== bool) {
      this.groupByParent = bool;

      Analytics.event('dashboard:grouping', { value: bool });

      return this.fetch();
    }

    return Promise.resolve();
  }
}
