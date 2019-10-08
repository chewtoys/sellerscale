<template>
  <MiContainer v-if="existingProductsStore && trackedProductsStore">
    <ConnectWidget/>
    <ExpiredWidget/>

    <ActualizeModal :store="existingProductsStore" ref="actualize"/>

    <nu-pane flow="row||column" content="space-between||flex-start" items="stretch">
      <nu-heading size="h1|||h3">
        {{ $t('unit.header') }}
        <MiInfo v-tooltip.bottom="$t('unit.tooltip.header')"/>
      </nu-heading>
      <nu-flex gap=".5" items="center">
        <nu-block>
          {{ $t('unit.products') }}:
        </nu-block>
        <nu-btn-group :value="showTable" @input="showTable = $event.detail">
          <nu-btn value="existing">
            {{ $t('unit.existing') }}
          </nu-btn>
          <nu-btn value="tracked">
            {{ $t('unit.tracked') }}
          </nu-btn>
        </nu-btn-group>
      </nu-flex>
    </nu-pane>

    <AddingProductModal ref="addingProductModal"/>

    <nu-line></nu-line>

    <nu-block>
      <nu-flow v-if="showTable === 'existing'" gap="1">
        <nu-block>
          <nu-flow gap="1">
            <nu-pane>
              <nu-flex gap=".5" items="center">
                <nu-heading level="4" size="h4|||h5">
                  {{ $t('unit.existing_products') }}
                  <MiInfo v-tooltip.bottom="$t('unit.tooltip.existing')"/>
                </nu-heading>
              </nu-flex>
              <nu-flex gap="1" items="center">
                <nu-block
                  mod="xs primary right"
                  hidden="false||true"
                  v-html="$t('warning.parent_asin_coming_soon')"></nu-block>
                <nu-btn
                  v-if="!isDemo && existingProductsStore.items.length"
                  special mod="w5"
                  @tap="actualizeAll"
                  v-tooltip.left="$t('unit.tooltip.actualize')">
                  {{ $t('actions.actualize') }}
                </nu-btn>
              </nu-flex>
            </nu-pane>
          </nu-flow>
        </nu-block>

        <UnitTable
          ref="existing"
          v-if="existingProductsStore.items.length"
          :schema="existingTableSchema"
          :store="existingProductsStore"
          :actions="['actuals', 'hide', 'show', 'breakeven']"
          :demo="isDemo"></UnitTable>

        <nu-pane
          v-if="existingProductsStore.items.length && expensesStore"
          items="start stretch" flow="row||column-reverse">
          <nu-card
            padding="0" v-if="showProfitAndLoss" gap="0"
            radius="1x|||0" space="0|||0 1"
            width="auto|||calc(100% + 2rem)"
            mod="no-overflow" shadow>
            <nu-pane
              padding=".5">
              <nu-heading level="6" class="-nu-w7">
                {{ $t('pnl.header') }}
                <MiInfo v-tooltip.bottom="$t('unit.tooltip.pnl')"/>
              </nu-heading>
              <nu-btn @tap="showProfitAndLoss = false" mod="xs">
                {{ $t('actions.hide') }}
              </nu-btn>
            </nu-pane>
            <nu-grid>
              <nu-line></nu-line>
              <ProfitAndLossTable
                class="profit-and-loss"
                :products="existingProductsStore"
                :expenses="expensesStore"/>
            </nu-grid>
          </nu-card>

          <nu-btn
            v-else
            special
            @tap="showProfitAndLoss = true">
            {{ $t('actions.show') }} {{ $t('pnl.header') }}
          </nu-btn>

          <nu-card
            padding=".5 1" mod="shadow border nowrap">
            <nu-pane content="start" gap="1">
              <nu-pane gap=".5">
                <span>{{ $t('unit.table.total_profit') }}:</span>
                <b>{{ totalProfit() ? formatNumeric(totalProfit(), '$', 0) : '–' }}</b>
              </nu-pane>
              <nu-pane gap=".5" column="2">
                <span>{{ $t('unit.table.total_revenue') }}:</span>
                <b>{{ totalRevenue() ? formatNumeric(totalRevenue(), '$', 0) : '–' }}</b>
              </nu-pane>
            </nu-pane>
          </nu-card>
        </nu-pane>
      </nu-flow>

      <nu-flow gap="1" v-if="showTable === 'tracked'">
        <nu-grid gap="1">
          <nu-pane items="center">
            <nu-heading level="4" size="h4|||h5">
              {{ $t('unit.tracked_products') }}
              <MiInfo v-tooltip.bottom="$t('unit.tooltip.tracked')"/>
            </nu-heading>
            <nu-flex gap=".5">
              <nu-btn special @tap="addProduct">{{ $t('actions.add_product') }}
              </nu-btn>
            </nu-flex>
          </nu-pane>
          <nu-grid
            v-if="!trackedProductsStore.items.length"
            span="1 / span 2" row="2" gap="1">
            <nu-line></nu-line>
            <nu-grid>
              <span v-t="'products.no_tracked'"></span>
            </nu-grid>
          </nu-grid>
        </nu-grid>

        <UnitTable
          ref="tracked"
          v-if="showTable === 'tracked' && trackedProductsStore.items.length"
          :schema="trackedTableSchema"
          :store="trackedProductsStore"
          :actions="['delete', 'breakeven']"></UnitTable>
      </nu-flow>

    </nu-block>

  </MiContainer>
</template>

<script>
import ProductsStore from '@/stores/products.store';
import ExpensesStore from '@/stores/expenses.store';
import UnitTable from '@/components/unit.table.vue';
import ProfitAndLossTable from '@/components/profit-and-loss.table.vue';
import TableSchema from '@/scheme/unit-economics.table';
import AddingProductModal from '@/components/adding-product.modal.vue';
import ActualizeModal from '@/components/actualize.modal.vue';
import StoreMixin from '@/mixins/store.mixin';
import PreloadMixin from '@/mixins/preload.mixin';
import Analytics from '@/services/analytics';
import { formatNumeric } from '@/util';
import { focus } from '@/services/window';
import User from '@/services/user';
import ReactSwitchMixin from '@/mixins/react-switch';
import ConnectWidget from '@/components/connect-widget.vue';
import ExpiredWidget from '@/components/expired-widget.vue';

export default {
  name: 'unit-economics',
  props: {},
  mixins: [
    StoreMixin({
      showProfitAndLoss: false,
      showTable: 'existing',
    }),
    ReactSwitchMixin(),
    PreloadMixin(() => Promise.all([
      (async () => {
        if (User.mwsStatus !== 'active') {
          // show demo data in case seller account is not connected or in sync
          const collectionData = await import('@/demo/products.existing.js')
            .then(module => module.default);

          return new ProductsStore('existing', collectionData);
        }

        return (new ProductsStore('existing')).fetch();
      })(),
      (new ProductsStore('tracked')).fetch(),
      (new ExpensesStore()).fetch(),
    ]), function setPreloadedData(
      [existingProductsStore, trackedProductsStore, expensesStore],
    ) {
      this.existingProductsStore = existingProductsStore;
      this.trackedProductsStore = trackedProductsStore;
      this.expensesStore = expensesStore;
    }),
  ],
  data() {
    return {
      /**
       * @type {ProductsStore}
       */
      existingProductsStore: null,
      /**
       * @type {ProductsStore}
       */
      trackedProductsStore: null,
      /**
       * @type {ExpensesStore}
       */
      expensesStore: null,
      existingTableSchema: TableSchema('existing'),
      trackedTableSchema: TableSchema('tracked'),
      User,
    };
  },
  watch: {
    '$route.query': function onRouteQueryChange() {
      this.enterCogsFocus();
    },
  },
  async mounted() {
    this.enterCogsFocus();
  },
  methods: {
    enterCogsFocus() {
      const { enter: enterCogs } = this.$route.query;

      setTimeout(() => {
        if (enterCogs) {
          this.$router.push('/unit');

          this.showTable = 'existing';

          setTimeout(() => {
            focus('[name="productCost"] .mi-cell-input');
          }, 50);
        }
      }, 50);
    },
    addProduct() {
      this.$refs.addingProductModal.open()
        .then(async (productData) => {
          await this.trackedProductsStore.add(productData);

          Analytics.event('product:add', productData);
        })
        .catch(() => {
        });
    },
    openCogs() {
      this.$refs.existing.setFolded(false, 'costs');
    },
    // totalProfit() {
    //   return this.$refs.existing ? this.$refs.existing.totalProfit : '–';
    // },
    // totalRevenue() {
    //   return this.$refs.existing ? this.$refs.existing.totalRevenue : '–';
    // },
    formatNumeric,
    actualizeAll() {
      Analytics.event('unit:open-actualize');

      this.$refs.actualize.open(this.visibleIds)
        .catch(() => {
          // @TODO: handle error
        });
    },
    totalProfit() {
      return this.existingProductsStore.items
        .filter(product => !product.data.isHidden)
        .reduce((totalProfit, productStore) => totalProfit + (productStore.data.profit || 0), 0);
    },
    totalRevenue() {
      return this.existingProductsStore.items
        .filter(product => !product.data.isHidden)
        .reduce((totalRevenue, productStore) => totalRevenue + (productStore.data.revenue || 0), 0);
    },
  },
  computed: {
    isDemo() {
      return this.User.mwsStatus !== 'active';
    },
    visibleIds() {
      return this.$refs.existing && this.$refs.existing.visibleProducts.map(product => product.id);
    },
  },
  components: {
    ExpiredWidget,
    ConnectWidget,
    UnitTable,
    AddingProductModal,
    ProfitAndLossTable,
    ActualizeModal,
  },
};
</script>
