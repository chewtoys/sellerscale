<template>
  <nu-block class="app-chart" v-if="chartData">
    <nu-flex content="center" padding="0 0 .75 0" gap=".5|||.25" size="sm||xs|xxs">
      <nu-btn
        v-for="dataset in chartData.datasets"
        mod="transparent"
        border="0"
        padding=".5|||.25"
        :key="dataset.label"
        :theme="getLabelTheme(dataset)"
        @tap="toggleLabel(dataset)">
        <nu-icon :name="dataset.hidden ? 'circle' : 'circle-filled'"></nu-icon>
        {{ $t(`dashboard.stat.${dataset.label}`) + (dataset.unit ? `, ${dataset.unit}` : '') }}
      </nu-btn>
    </nu-flex>
    <BaseBarChart
      class="nu-dark-dim"
      ref="chart"
      v-if="chartSchema && type === 'bar'"
      :chartData="chartData"
      :options="chartOptions"
      :styles="{ height: '18rem' }">
    </BaseBarChart>
    <BaseLineChart
      class="nu-dark-dim"
      ref="chart"
      v-if="chartSchema && type === 'line'"
      :chartData="chartData"
      :options="chartOptions"
      :styles="{ height: '18rem' }">
    </BaseLineChart>
  </nu-block>
</template>

<script>
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

import lockr from 'lockr';
import BaseBarChart from '@/components/base-bar-chart.vue';
import BaseLineChart from '@/components/base-line-chart.vue';

export default {
  name: 'chart',
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: val => ['line', 'bar'].includes(val),
    },
    dataSets: {
      type: Array,
    },
    labels: {
      type: Array,
    },
    formatLabel: {
      type: Function,
    },
  },
  data() {
    return {
      chartData: null,
      chartOptions: {},
      chartSchema: null,
    };
  },
  created() {
    this.$globalEvents.$on('i18n:change', this.update);
  },
  beforeDestroy() {
    this.$globalEvents.$off('i18n:change', this.update);
  },
  mounted() {
    import(`@/scheme/${this.name}.chart.js`)
      .then(module => module.default)
      .then((chartSchema) => {
        this.chartSchema = chartSchema;
        this.chartData = chartSchema.data;
        this.chartOptions = chartSchema.options;

        this.fixScalesPosition();
        this.update();
      });
  },
  watch: {
    dataSets() {
      this.update();
    },
  },
  methods: {
    update() {
      if (this.dataSets && this.chartSchema) {
        this.dataSets.forEach((set, i) => {
          this.chartData.datasets[i].data = set;
        });

        this.chartData.datasets.forEach((dataSetConfig) => {
          dataSetConfig.hidden = lockr.get(`chart.${dataSetConfig.label}.hidden`) || false;
        });

        if (this.formatLabel) {
          this.chartData.labels = this.labels.map(this.formatLabel);
        } else {
          this.chartData.labels = [...this.labels];
        }

        this.chartData = { ...this.chartData };

        this.fixChartZero();
      }
    },
    fixChartZero() {
      setTimeout(() => {
        const chart = this.getChartInstance();

        if (!chart) return;

        delete chart.config.options.scales.yAxes[0].ticks.min;
        delete chart.config.options.scales.yAxes[0].ticks.max;

        let ticks;

        chart.update();

        if (chart.scales.units) {
          if (chart.scales.cash.max <= 0) {
            // eslint-disable-next-line prefer-destructuring
            ticks = chart.config.options.scales.yAxes[0].ticks;
            ticks.max = -chart.scales.cash.min;

            chart.update();
          }

          // eslint-disable-next-line prefer-destructuring
          ticks = chart.config.options.scales.yAxes[1];
          const maxValue = this.getMaxValue(0);
          ticks.min = (maxValue * chart.scales.cash.min / chart.scales.cash.max);
          ticks.max = maxValue;

          chart.update();

          // eslint-disable-next-line prefer-destructuring
          ticks = chart.config.options.scales.yAxes[1].ticks;

          const minTick = this.getMinNonZeroValue(chart.scales.units.ticks);
          const newMaxValue = parseInt(maxValue - (maxValue % minTick) + minTick, 10);

          ticks.min = newMaxValue * chart.scales.cash.min / chart.scales.cash.max;
          ticks.max = newMaxValue;

          chart.update();
        }
      }, 0);
    },
    getMaxValue(datasetIndex) {
      if (this.chartData && this.chartData.datasets[datasetIndex]) {
        const value = this.chartData.datasets[datasetIndex].data
          .reduce((max, val) => Math.max(max, val), 0);

        return value - (value % 5) + 5;
      }

      return 0;
    },
    getMinValue(datasetIndex) {
      if (this.chartData && this.chartData.datasets[datasetIndex]) {
        const value = this.chartData.datasets[datasetIndex].data
          .reduce((max, val) => Math.min(max, val), Number.MAX_SAFE_INTEGER);

        return value - (value % 5) - 5;
      }

      return 0;
    },
    getMinNonZeroValue(values) {
      return values.reduce((out, val) => {
        if (val > 0 && out > val) {
          return val;
        }

        return out;
      }, Number.MAX_SAFE_INTEGER);
    },
    getLabelTheme(dataset) {
      return `chart-${dataset.label.replace('_', '-')}`;
    },
    fixScalesPosition() {
      const chart = this.getChartInstance();

      if (!chart) return;

      const chartOptions = chart.config.options;

      chartOptions.scales.yAxes
        .filter(scale => scale.display !== false)
        .forEach((scale, i) => {
          if (i === 0) {
            scale.position = 'left';
            scale.gridLines.color = 'var(--nu-default-border-color)';
          } else {
            scale.position = 'right';
            scale.gridLines.color = 'transparent';
          }
        });
    },
    toggleLabel(dataset) {
      // disable toggle if there is only single visible dataset left
      if (!dataset.hidden && this.chartData.datasets.filter(ds => !ds.hidden).length < 2) {
        return;
      }

      /* eslint-disable-next-line no-param-reassign */
      dataset.hidden = !dataset.hidden;

      const scaleId = dataset.yAxisID;
      const scale = this.getScaleById(dataset.yAxisID);

      scale.display = !!this.chartData.datasets.find(ds => !ds.hidden && ds.yAxisID === scaleId);

      this.fixScalesPosition();
      this.fixChartZero();

      lockr.set(`chart.${dataset.label}.hidden`, dataset.hidden);
    },
    getChartInstance() {
      if (!this.$refs.chart || !this.$refs.chart.$data._chart) return undefined;

      return this.$refs.chart.$data._chart;
    },
    getScaleById(scaleId) {
      const { scales } = this.getChartInstance().config.options;
      const scalesList = [...(scales.yAxes || []), ...(scales.xAxes || [])];

      return scalesList.find(scale => scale.id === scaleId);
    },
  },
  components: {
    BaseBarChart,
    BaseLineChart,
  },
};
</script>

<style scoped>
.app-chart {
  width: 99%;
  margin: 0 auto;
}
</style>
