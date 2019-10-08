<template>
  <MiContainer v-if="existingProductsStore" narrow>
    <ConnectWidget/>
    <ExpiredWidget/>

    <StickyHeader>
      <nu-heading size="h1|||h3">
        {{ $t('products.header') }}
      </nu-heading>
    </StickyHeader>

    <AddingProductModal ref="addingProductModal"/>

    <nu-block>
      <nu-flow gap="1">
        <!--        <StickyHeader>-->
        <!--          <nu-heading level="2" v-t="'products.existing'"></nu-heading>-->
        <!--        </StickyHeader>-->

        <MiContent v-if="!existingProductsStore.items.length" padding="1">
          <p>
            <nu-badge theme="primary" v-t="'products.no_existing'"></nu-badge>
          </p>
        </MiContent>
        <ProductsTable
          v-if="existingProductsStore.items.length"
          :store="existingProductsStore" :demo="isDemo"/>
      </nu-flow>

      <!--      <nu-flow gap="1">-->
      <!--        <StickyHeader>-->
      <!--          <nu-heading level="2" v-t="'products.tracked'"></nu-heading>-->
      <!--          <nu-btn special v-t="'actions.add_product'" @tap="addProduct"></nu-btn>-->
      <!--        </StickyHeader>-->
      <!--        <MiContent v-if="!trackedProductsStore" padding="1">-->
      <!--          <p>-->
      <!--            <nu-badge theme="primary" v-t="'products.no_tracked'"></nu-badge>-->
      <!--          </p>-->
      <!--        </MiContent>-->
      <!--        <ProductsTable v-if="trackedProductsStore" :store="trackedProductsStore"/>-->
      <!--      </nu-flow>-->
    </nu-block>
  </MiContainer>
</template>

<script>
import ProductsStore from '@/stores/products.store';
import ProductSchema from '@/scheme/product.schema';
import ProductsTable from '@/components/products.table.vue';
import AddingProductModal from '@/components/adding-product.modal.vue';
import StickyHeader from '@/components/sticky-header.vue';
import { formatNumeric } from '@/util';
import PreloadMixin from '@/mixins/preload.mixin';
import User from '@/services/user';
import ReactSwitchMixin from '@/mixins/react-switch';
import ConnectWidget from '@/components/connect-widget.vue';
import ExpiredWidget from '@/components/expired-widget.vue';

export default {
  name: 'products',
  mixins: [PreloadMixin(() => Promise.all([
    (async () => {
      if (User.mwsStatus !== 'active') {
        const collectionData = await import('@/demo/products.existing.js')
          .then(module => module.default);

        return new ProductsStore('existing', collectionData);
      }

      return (new ProductsStore('existing')).fetch();
    })(),
    (new ProductsStore('tracked')).fetch(),
  ]), function setPreloadedData([existingProductsStore, trackedProductsStore]) {
    this.existingProductsStore = existingProductsStore;
    this.trackedProductsStore = trackedProductsStore;

    this.existingProductsStore.items.sort((a, b) => (a.data.name && !b.data.name ? -1 : 1));
  }), ReactSwitchMixin()],
  data() {
    return {
      existingProductsStore: null,
      trackedProductsStore: null,
      existingProductSchema: new ProductSchema('existing'),
      trackedProductSchema: new ProductSchema('tracked'),
      User,
    };
  },
  computed: {
    isDemo() {
      return this.User.mwsStatus !== 'active';
    },
  },
  methods: {
    addProduct() {
      this.$refs.addingProductModal.open()
        .then(productData => this.trackedProductsStore.add(productData))
        .catch(() => {
        });
    },
    formatNumeric,
  },
  components: {
    ExpiredWidget,
    ConnectWidget,
    ProductsTable,
    AddingProductModal,
    StickyHeader,
  },
};
</script>
