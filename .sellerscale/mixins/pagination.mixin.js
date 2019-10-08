import Logdown from 'logdown';

const logger = new Logdown('app.pagination-mixin');

export default function PreloadMixin(paginationField = 'items') {
  logger.info('init');

  return {
    data() {
      return {
        page: 1,
        perPage: 10,
        paginationField,
      };
    },
    methods: {
      prevPage() {
        this.page -= 1;

        logger.info('prev page', this.page);
      },
      nextPage() {
        this.page += 1;

        logger.info('next page', this.page);
      },
      recalcPage() {
        if (this.page > this.maxPage) {
          this.resetPage();
        }
      },
      resetPage() {
        this.page = 1;

        logger.info('reset');
      },
    },
    computed: {
      itemsOnPage() {
        const pageIndex = this.page - 1;
        const products = this[this.paginationField];

        return products.slice(pageIndex * this.perPage, pageIndex * this.perPage + this.perPage);
      },
      havePrevPage() {
        const pageIndex = this.page - 1;

        return !!pageIndex;
      },
      haveNextPage() {
        return this.page < this.maxPage;
      },
      maxPage() {
        return Math.ceil(this[this.paginationField].length / this.perPage) || 1;
      },
      pageOptions() {
        const options = [];

        for (let page = 1; page <= this.maxPage; page += 1) {
          options.push({
            value: page,
            label: `${this.$t('label.page')} ${page}`,
          });
        }

        return options;
      },
    },
  };
}
