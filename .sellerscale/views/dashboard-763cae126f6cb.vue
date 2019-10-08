<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <MiContainer v-if="Stats">
    <ConnectWidget/>
    <ExpiredWidget/>

    <nu-block>
      <nu-heading size="h1|||h3">{{ $t('dashboard.header') }}</nu-heading>
    </nu-block>

    <nu-grid gap="1" padding="1 0 0 0">
      <StickyHeader gap=".5" columns="1fr" padding="1 1 .5 1">
        <nu-flex flow="row|column" content="space-between" gap=".5">
          <nu-flex flow="row||column" gap=".5" width="100%">
            <MiDropdown
              ref="dateDropdown"
              width="17"
              sticky="center"
              :disabled="isDemo"
              popupWidth="16">
              {{ formattedRange }}
              <template v-slot:content>
                <DateRangePicker
                  ref="dateRangePicker"
                  :to="toDateString"
                  :from="fromDateString"
                  :future="false"
                  panel="range"
                  :locale="$i18n.locale"
                  @update="updateRange"/>
              </template>
            </MiDropdown>

            <nu-flex gap=".5">
              <MiSelect
                width="17"
                :options="Stats.products"
                :disabled="isDemo"
                primary="id"
                maxHeight="20"
                :value="Stats.selectedProductId"
                @input="Stats.selectProduct">
                <template v-slot:selected="{ option }">
                  <ProductSelectItem :product="option"/>
                </template>
                <template v-slot:option="{ option }">
                  <ProductSelectItem :product="option"/>
                </template>
              </MiSelect>

              <nu-btn
                :pressed="Stats.groupByParent"
                @tap="Stats.setParentGrouping(!Stats.groupByParent)"
                :disabled="isDemo"
                mod="lg"
                v-tooltip.bottom="$t('dashboard.tooltip.group_by_parent')">
                <nu-icon name="package" size="1.25"></nu-icon>
              </nu-btn>
            </nu-flex>
          </nu-flex>

          <nu-flex
            v-if="Stats.availableGrouping.length > 1"
            gap=".5"
            items="center stretch"
            content="center end"
            hidden="false|true"
            mod="nowrap">
            <nu-block>
              {{ $t('dashboard.group_data') }}
            </nu-block>
            <nu-block>
              <nu-btn-group
                ref="periods"
                :value="Stats.groupPeriod"
                @input="setGroupPeriod($event.detail)">
                <nu-btn
                  v-for="period in Stats.availableGrouping"
                  :key="period"
                  :value="period"
                  :disabled="isDemo"
                  padding=".5 .75">
                  {{ $t(`dashboard.period.${period}`) }}
                </nu-btn>
              </nu-btn-group>
            </nu-block>
          </nu-flex>
        </nu-flex>
        <!-- height compensation -->
        <nu-block v-if="isDemo"></nu-block>
        <nu-flex
          v-else
          column="1 / -1" gap=".5" mod="|scroll">
          <nu-btn
            v-for="preset in rangePresets"
            :key="preset.name"
            :tabindex="isDateRangeCurrent(preset) ? -1 : 0"
            :mod="`md ${isDateRangeCurrent(preset) ? '' : 'transparent'}`"
            padding=".5"
            :border="isDateRangeCurrent(preset) ? 'inside' : '0'"
            @tap="setPreset(preset.from, preset.to, preset.name)"
            :theme="isDateRangeCurrent(preset)
              ? 'details' : 'primary'">
            {{ $t(`datepicker.presets.${preset.name}`) }}
          </nu-btn>
        </nu-flex>
      </StickyHeader>

      <nu-grid
        flow="row"
        gap="1" columns="repeat(5, 1fr)|repeat(3, 1fr)|repeat(2, 1fr)">
        <template v-for="metric in ['sales', 'count']">
          <MiDropdown
            @click.native="logToggleTile(metric)"
            plain :key="metric" padding="1" shadow
            :disabled="!parseInt(Stats[metric].total, 10)">
            <template v-slot:default="{ open }">
              <nu-flow gap=".5">
                <nu-pane>
                  <nu-heading level="6">{{ $t(`dashboard.stat.${metric}`) }}</nu-heading>
                  <MiDropdownIcon size="1.5" :value="open"/>
                </nu-pane>
                <nu-line></nu-line>
                <nu-block mod="xl w7">
                  {{ formatNumeric(Stats[metric].total, metric === 'sales' ? '$' : '', 0) }}
                </nu-block>
              </nu-flow>
            </template>
            <template v-slot:content>
              <nu-flex gap="1" padding="1" items-basis="1/2">
                <nu-grid items="center" gap=".5" mod="w7">
                  <nu-grid theme="primary">
                    {{ $t('dashboard.stat.organic') }}
                  </nu-grid>
                  <nu-line theme="primary"></nu-line>
                  <nu-block>
                    {{ formatNumeric(Stats[metric].organic, metric === 'sales' ? '$' : '', 0) }}
                  </nu-block>
                  <nu-grid v-if="Stats.sales.total">
                    {{ formatNumeric(Stats[metric].organic / Stats[metric].total * 100, '%', 0) }}
                  </nu-grid>
                </nu-grid>

                <nu-grid items="center" gap=".5" mod="w7">
                  <nu-block theme="primary">
                    {{ $t('dashboard.stat.ppc') }}
                  </nu-block>
                  <nu-line theme="primary"></nu-line>
                  <nu-block>
                    {{ formatNumeric(Stats[metric].ppc, metric === 'sales' ? '$' : '', 0) }}
                  </nu-block>
                  <nu-block v-if="Stats.sales.total">
                    {{ formatNumeric(Stats[metric].ppc / Stats[metric].total * 100, '%', 0) }}
                  </nu-block>
                </nu-grid>
              </nu-flex>
            </template>
          </MiDropdown>
        </template>

        <MiDropdown
          @click.native="logToggleTile('costs')"
          plain popupWidth="25" padding=".5" shadow
          :disabled="!parseInt(Stats.costs.total, 10)">
          <template v-slot:default="{ open }">
            <nu-flex flow="column" gap=".5" padding=".5">
              <nu-pane>
                <nu-heading level="6">{{ $t('dashboard.stat.costs') }}</nu-heading>
                <MiDropdownIcon :value="open" size="1.5"/>
              </nu-pane>
              <nu-line></nu-line>
              <nu-block mod="xl w7">{{ formatNumeric(Stats.costs.total, '$', 0) }}</nu-block>
            </nu-flex>
          </template>
          <template v-slot:content>
            <nu-flex
              flow="column" padding="1" gap=".75"
              mod="sm" style="line-height: 1rem !important;">
              <template v-for="cost in detailedCosts">
                <nu-flex :key="cost.id" :mod="cost.value < 0 ? 'success' : ''">
                  <nu-block v-t="`product.otherFees.${cost.id}`"></nu-block>
                  <nu-block
                    grow="1"
                    style="border-bottom: var(--nu-pixel) dotted var(--border-color);"/>
                  <nu-block mod="w6">
                    {{ formatNumeric(cost.value, '$', 0) }}
                  </nu-block>
                </nu-flex>
              </template>
            </nu-flex>
          </template>
        </MiDropdown>

        <template v-for="metric in ['profit', 'margin']">
          <nu-card :key="metric" shadow border>
            <nu-flex flow="column" gap=".5">
              <nu-pane>
                <nu-heading level="6">{{ $t(`dashboard.stat.${metric}`) }}</nu-heading>
                <nu-icon
                  :name="metric === 'profit' ? 'dollar-sign' : 'percent'"
                  size="1.25"></nu-icon>
              </nu-pane>
              <nu-line></nu-line>
              <nu-block mod="xl w7">
                {{ formatNumeric(Stats[metric], metric ==='profit' ? '$' : '%', 0) }}
              </nu-block>
            </nu-flex>
          </nu-card>
        </template>
      </nu-grid>

      <nu-grid
        v-if="Stats.fromDate !== Stats.toDate || isDemo"
        role="section"
        gap="1"
        columns="1fr 1fr|1fr">
        <nu-card shadow border="1x|||top bottom" space="0|||0 1" radius="1x|||0">
          <nu-flex flow="column" gap=".5">
            <nu-heading level="6">{{ $t('dashboard.chart.sales_profit') }}</nu-heading>

            <nu-line></nu-line>

            <MiDisabled :off="!Stats.noSalesData()">
              <Chart
                name="sales"
                type="bar"
                :dataSets="Stats.salesDataSets"
                :labels="Stats.salesLabels"
                :formatLabel="getFormatLabel()"/>
              <template v-slot:disclaimer>
                <nu-grid
                  mod="xl w7"
                  v-html="$t('dashboard.chart.no_data')"/>
              </template>
            </MiDisabled>
          </nu-flex>
        </nu-card>

        <nu-card shadow border="1x|||top bottom" space="0|||0 1" radius="1x|||0">
          <nu-flex flow="column" gap=".5">
            <nu-heading level="6">{{ $t('dashboard.chart.acos_conversion') }}</nu-heading>

            <nu-line></nu-line>

            <MiDisabled :off="User.adsStatus === 'active' && !Stats.noAdsData() || isDemo">
              <Chart
                name="ads"
                type="bar"
                :dataSets="Stats.adsDataSets"
                :labels="Stats.adsLabels"
                :formatLabel="getFormatLabel()"/>
              <template v-slot:disclaimer>
                <nu-grid
                  v-if="User.mwsStatus && User.adsStatus !== 'active'"
                  mod="w6">
                  <nu-btn special @tap="connectAds()">
                    {{ $t('home.connect.advertising') }}
                  </nu-btn>
                </nu-grid>
                <nu-grid
                  v-else
                  mod="xl w7"
                  v-html="$t('dashboard.chart.no_data')"></nu-grid>
              </template>
            </MiDisabled>
          </nu-flex>
        </nu-card>
      </nu-grid>

      <ProductPerformanceTable
        ref="performance"
        :items="Stats.performance"
        hidden="false||true"
        :demo="isDemo"/>
    </nu-grid>
  </MiContainer>
</template>

<script>
import { parse } from 'date-fns';
import { capitalize } from 'lodash';
import Stats from '@/services/stats';
import { formatNumeric, formatDate, objectToList } from '@/util';
import ProductSelectItem from '@/components/product-select-item.vue';
import ProductPerformanceTable from '@/components/product-performance.table.vue';
import StickyHeader from '@/components/sticky-header.vue';
import { grandAdvertisingAccess } from '@/stores/advertising-accounts.store';
import PreloadMixin from '@/mixins/preload.mixin';
import { affectPreset } from '@/components/date-range-picker.vue';
import User from '@/services/user';
import ReactSwitchMixin from '@/mixins/react-switch';
import ConnectWidget from '@/components/connect-widget.vue';
import ExpiredWidget from '@/components/expired-widget.vue';
import Analytics from '@/services/analytics';

const chartLabelMap = {
  daily: {
    ru: 'D MMM',
    en: 'MMM D',
  },
  weekly: {
    ru: 'D MMM',
    en: 'MMM D',
    // ru: 'DD.MM',
    // en: 'MM-DD',
  },
  monthly: {
    ru: 'MMM',
    en: 'MMM',
  },
};

export default {
  name: 'dashboard',
  mixins: [PreloadMixin(() => Promise.all([
    (async () => {
      if (User.mwsStatus !== 'active') {
        const productsData = await import('@/demo/products.existing.js')
          .then(module => module.default);
        const statsData = await import('@/demo/stat.js')
          .then(module => module.default);

        return (new Stats({}, statsData, productsData)).fetch();
      }

      const stats = new Stats({});

      if (stats.items) {
        stats.fetch();

        return stats;
      }

      return (new Stats({})).fetch();
    })(),
  ]), function setPreloadedData([StatsService]) {
    this.Stats = StatsService;
  }), ReactSwitchMixin()],
  props: {
    msg: String,
  },
  data() {
    return {
      User,
      /**
       * @type {Stats}
       */
      Stats: null,
      // detailedCosts: ['ads', 'referral', 'storage', 'fba', 'other'],
      rangePresets: [
        'yesterday',
        'last7days',
        'last14days',
        'last30days',
        'last90days',
        'yearToDate',
      ].map((preset) => {
        const { from, to } = affectPreset(preset);

        return { name: preset, from: formatDate(from), to: formatDate(to) };
      }),
    };
  },
  mounted() {
    function watchStatus() {
      // Pool backend every 30 seconds until data is ready
      if (User.mwsStatus === 'sync') {
        setTimeout(async () => {
          await this.preload();

          watchStatus.call(this);
        }, 30000);
      }
    }

    setTimeout(() => watchStatus.call(this), 1000);
  },
  computed: {
    isDemo() {
      return this.User.mwsStatus !== 'active';
    },
    toDateString() {
      return formatDate(this.to);
    },
    fromDateString() {
      return formatDate(this.from);
    },
    formattedRange() {
      return `${formatDate(this.isDemo ? '2019-05-01' : this.from, 'D MMM YYYY', this.$i18n.locale)} - ${formatDate(this.isDemo ? '2019-05-31' : this.to, 'D MMM YYYY', this.$i18n.locale)}`;
    },
    from() {
      return parse(this.Stats.fromDate);
    },
    to() {
      return parse(this.Stats.toDate);
    },
    detailedCosts() {
      const costs = { ...this.Stats.costs };

      delete costs.total;

      return objectToList(costs, 1, 'desc');
    },
    periodOptions() {
      return this.Stats.availableGrouping.map(period => ({
        value: period,
        label: this.$t(`dashboard.period.${period}`),
      }));
    },
    dataRequired() {
      return this.Stats.products.length && !!this.Stats.products.find(
        product => product.id !== 'all' && product.autoCogs,
      );
    },
  },
  watch: {
    async productId(productId) {
      await this.Stats.selectProduct(productId);
    },
    'Stats.adsDataSets': function onStatItemsChange() {
      if (this.$refs.performance) {
        this.$refs.performance.resetPage();
      }
    },
  },
  methods: {
    formatNumeric,
    formatDate,
    capitalize,
    async updateRange({ from, to }) {
      this.$refs.dateDropdown.close();

      await this.Stats.setRange(formatDate(from), formatDate(to));

      Analytics.event('dashboard:datepicker', { from, to });
    },
    getFormatLabel() {
      // if (this.Stats.groupPeriod === 'weekly') {
      //   return `${formatDate(startOfWeek(label), chartLabelMap.weekly[this.$i18n.locale])}
      //     – ${formatDate(endOfWeek(label), chartLabelMap.weekly[this.$i18n.locale])}`;
      // }

      return label => formatDate(label, chartLabelMap[this.Stats.groupPeriod][this.$i18n.locale]);
    },
    async connectAds() {
      try {
        await grandAdvertisingAccess();
        await this.preload();
      } catch (e) {
        // do nothing
      }
    },
    setPreset(from, to, id) {
      this.Stats.setRange(from, to);

      if (this.Stats.groupPeriod !== 'daily') {
        this.Stats.setGroupPeriod('daily');
      }

      Analytics.event('dashboard:preset', { id });
    },
    isDateRangeCurrent(preset) {
      return this.fromDateString === preset.from && this.toDateString === preset.to;
    },
    setGroupPeriod(period) {
      this.Stats.setGroupPeriod(period);

      Analytics.event('dashboard:group-period', { period });
    },
    logToggleTile(id) {
      Analytics.event(`dashboard:tile-${id}`);
    },
  },
  components: {
    ExpiredWidget,
    ConnectWidget,
    ProductSelectItem,
    ProductPerformanceTable,
    Chart: () => import(/* webpackChunkName: "component-chart" */ '@/components/chart.vue'),
    DateRangePicker: () => import(/* webpackChunkName: "component-date-picker" */ '@/components/date-range-picker.vue'),
    StickyHeader,
  },
};
</script>
