<template>
  <nu-grid content="center start" columns="auto 1fr" gap=".5">
    <MiPicture v-if="product && product.images && product.images.small" width="1.5" height="1.5">
      <img :src="product.images.small" :aria-labelledby="id" alt="">
    </MiPicture>
    <nu-block v-else-if="product && product.images">
      <nu-icon name="package" size="1.5" inline theme="minor"></nu-icon>
    </nu-block>
    <nu-block mod="ellipsis" :id="id">
      {{ getProductName() }}
    </nu-block>
  </nu-grid>
</template>

<script>
let globalId = 0;

export default {
  name: 'product-select-item',
  props: ['product', 'none'],
  data() {
    globalId += 1;

    return {
      id: `product-item-${globalId}`,
    };
  },
  methods: {
    getProductName() {
      if (!this.product || !this.product.id) return this.none || '–';

      if (this.product.id === 'all') {
        return this.$t('dashboard.all_products');
      }

      return this.product.name || `${this.$t('label.deleted_product')} ${this.product.asin}`;
    },
  },
};
</script>
