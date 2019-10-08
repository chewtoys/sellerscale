<template>
  <MiContainer>
    <ConnectWidget/>
    <ExpiredWidget/>

    <StickyHeader columns="auto auto||auto" items="center start">
      <nu-heading size="h1|||h3">
        {{ $t('pnl.header_statement') }}
        <MiInfo v-tooltip.bottom="$markdown($t('pnl.tooltip'))"/>
      </nu-heading>
      <nu-grid flow="column" gap="2">
        <nu-btn-group :value="String(percentage)" @input="percentage = $event.detail === 'true'">
          <nu-btn
            padding=".5 .75"
            value="false">
            <nu-icon name="dollar-sign"></nu-icon>
          </nu-btn>
          <nu-btn
            padding=".5 .75"
            value="true">
            <nu-icon name="percent"></nu-icon>
          </nu-btn>
        </nu-btn-group>

        <nu-flex gap=".5" items="center">
          <nu-block>
            {{ $t('label.year') }}:
          </nu-block>
          <MiSelect
            width="7"
            :options="yearOptions"
            :value="year"
            :disabled="integrationStatus !== 'active'"
            @input="changeYear"/>
        </nu-flex>
      </nu-grid>
    </StickyHeader>

    <nu-grid-table
      v-if="data.grossRevenue"
      :columns="`17rem repeat(${columns.length}, 1fr)`"
      gap="var(--nu-pixel) 0" radius shadow border mod="minor">
      <nu-block mod="table-sticky-left"></nu-block>
      <nu-grid
        theme="minor"
        role="columnheader"
        padding=".5"
        v-for="(column, index) in columns"
        :key="`header:${column}`"
        :mod="`xs w6 ${index === 12 ? 'uppercase' : ''}`"
        items="center">
        {{ column }}
      </nu-grid>
      <template v-for="field in schema">
        <nu-line
          v-if="field.border"
          :key="`${field.id}:border`"></nu-line>
        <nu-grid
          theme="minor"
          mod="table-sticky-left"
          :key="`${field.id}:label`"
          :padding="!isSectionEmpty(field.id) ? 0 : `.5 .5 .5 ${field.bold ? '2.5' : '3'}`"
          @mouseenter="onFieldHover(field.id)"
          @mouseleave="onFieldBlur()"
          :class="{
            '-hovered': hovered === field.id,
            '-nu-w5': !field.bold,
            '-nu-w7': field.bold,
          }">
          <nu-block v-if="isSectionEmpty(field.id)">
            {{ getLabel(field.id) }}
          </nu-block>
          <nu-btn
            v-else
            cell
            @tap="toggleRow(field.id)"
            :columns="`${field.bold ? 1.5 : '0 1.5'} 1fr`"
            gap=".5"
            padding=".5"
            items="start"
            place="stretch">
            <nu-block v-if="!field.bold"></nu-block>
            <MiDropdownIcon :value="expanded.includes(field.id)" place="center"/>
            {{ getLabel(field.id) }}
          </nu-btn>
        </nu-grid>
        <nu-block
          v-for="(column, index) in columns"
          :key="`${field.id}:${column}`"
          class="-nu-right -nu-xs -nu-monospace"
          padding=".75 .75 .25 .5"
          :class="{ '-hovered': hovered === field.id, '-nu-w6': field.bold }"
          :style="`
            --cell-line-height: ${hovered === field.id && data[field.id]
              ? Math.abs(getPercent(field.id, index))
              : 0}%;
          `">
          <span class="mi-cell-value" v-if="!field.abstract">
            {{ getValue(field.id, index) }}
          </span>
          <span
            class="mi-cell-line"
            :class="{ '-negative': getPercent(field.id, index) < 0 }"></span>
        </nu-block>
        <template
          v-if="field.items && expanded.includes(field.id)">
          <template v-for="item in field.items">
            <template v-if="field.empty !== false || !isRowEmpty(item)">
              <nu-block
                theme="minor"
                mod="table-sticky-left sm"
                :key="`${item}:label`"
                padding=".5 0 .5 3.5rem"
                @mouseenter="onFieldHover(item)"
                @mouseleave="onFieldBlur()">
                {{ getLabel(item) }}
              </nu-block>
              <nu-block
                v-for="(column, index) in columns"
                :key="`${item}:${column}`"
                class="-nu-right -nu-xs -nu-monospace"
                padding=".75 .75 .25 .5"
                :class="{ '-hovered': hovered === item, '-nu-w6': field.bold }"
                :style="`
                --cell-line-height: ${hovered === item && data[item]
                  ? Math.abs(getPercent(item, index))
                  : 0}%;
              `">
              <span class="mi-cell-value">
                {{ getValue(item, index) }}
              </span>
                <span
                  class="mi-cell-line"
                  :class="{ '-negative': getPercent(item, index) < 0 }"></span>
              </nu-block>
            </template>
          </template>
        </template>
      </template>
    </nu-grid-table>
  </MiContainer>
</template>

<script>
import { formatNumeric, formatDate, convertCamelToSnake } from '@/util';
import StickyHeader from '@/components/sticky-header.vue';
import PnlTableSchema from '@/scheme/pnl.table';
import API from '@/services/api';
import StoreMixin, { getStoredProp } from '@/mixins/store.mixin';
import PreloadMixin from '@/mixins/preload.mixin';
import User from '@/services/user';
import ReactSwitchMixin from '@/mixins/react-switch';
import ConnectWidget from '@/components/connect-widget.vue';
import ExpiredWidget from '@/components/expired-widget.vue';
import Analytics from '@/services/analytics';

const currentYear = Number(formatDate(new Date(), 'YYYY'));

const PERCENTAGE_ONLY = PnlTableSchema.find(section => section.id === 'kpi').items;

export default {
  name: 'pnl',
  mixins: [
    StoreMixin({
      year: currentYear,
      percentage: false,
      expanded: [],
    }),
    ReactSwitchMixin(),
    PreloadMixin(() => {
      const status = User.mwsStatus;

      return Promise.all([
        (async () => {
          if (status !== 'active') {
            // show demo data in case seller account is not connected or in sync
            const data = await import('@/demo/pnl.js')
              .then(module => module.default);

            return data;
          }

          return API.Pnl.getAll({ year: getStoredProp('pnl', 'year') });
        })(),
        Promise.resolve(Number(getStoredProp('pnl', 'year')) || currentYear),
      ]);
    }, function setPreloadedData(
      [data, year],
    ) {
      this.data = data;
      this.year = data.availableYears.includes(year) ? year : data.availableYears.slice(-1)[0];

      if (this.year !== year) {
        this.year = year;
        this.preload();
      }
    }),
  ],
  data() {
    return {
      integrationStatus: User.mwsStatus,
      grouping: 'month',
      groupingOptions: [
        {
          value: 'month',
          label: 'pnl.group.month',
        },
        {
          value: 'quarter',
          label: 'pnl.group.quarter',
        },
        {
          value: 'year',
          label: 'pnl.group.year',
        },
      ],
      schema: PnlTableSchema,
      data: {
        availableYears: [currentYear],
      },
      hovered: null,
      PERCENTAGE_ONLY,
      User,
    };
  },
  async created() {
    this.translateYearLabels();
  },
  watch: {
    '$i18n.locale': function onLocaleChange() {
      this.translateYearLabels();
    },
    percentage(bool) {
      Analytics.event(`pnl:format-${bool ? 'percentage' : 'dollar'}`);
    },
    async year() {
      if (User.mwsStatus !== 'active') return;

      this.data = await API.Pnl.getAll({ year: this.year });
    },
  },
  computed: {
    yearOptions() {
      return !this.data.availableYears ? [
        {
          value: currentYear,
          label: `${currentYear}`,
        },
      ] : [...this.data.availableYears].reverse().map(year => ({
        value: Number(year),
        label: `${year}`,
      }));
    },
    columns() {
      return this.$t('label.month_list').concat([this.$t('label.total')]);
    },
  },
  methods: {
    changeGrouping(value) {
      this.grouping = value;
    },
    changeYear(year) {
      this.year = year;
    },
    translateYearLabels() {
      this.yearOptions.forEach((option) => {
        option.label = option.value;
      });
    },
    onFieldHover(field) {
      this.hovered = field;
    },
    onFieldBlur() {
      this.hovered = null;
    },
    toggleRow(row) {
      if (this.expanded.includes(row)) {
        this.expanded.splice(this.expanded.indexOf(row), 1);
      } else {
        this.expanded.push(row);
      }
    },
    getLabel(field) {
      const snakeField = convertCamelToSnake(field);

      if (this.$te(`form_field.expense.categories.${snakeField}`)) {
        return this.$t(`form_field.expense.categories.${snakeField}`);
      }

      if (this.$te(`pnl.field.${field}`)) {
        return this.$t(`pnl.field.${field}`);
      }

      return this.$t(`form_field.product.${field}`);
    },
    isSectionEmpty(field) {
      const schema = this.schema.find(item => item.id === field);

      return !schema.items
        || (schema.empty === false
          && !schema.items.find(itemField => !this.isRowEmpty(itemField)));
    },
    isRowEmpty(field) {
      return this.data[field] == null || !this.data[field].find(val => val);
    },
    getValue(id, index) {
      const data = this.data;

      if (data[id] == null) return '–';

      if (PERCENTAGE_ONLY.includes(id)) {
        return formatNumeric(data[id][index], '%', 1);
      }

      if (this.percentage) {
        return formatNumeric(data[id][index] / data.grossRevenue[index] * 100, '%', 1);
      }

      return formatNumeric(data[id][index], '$', 0);
    },
    formatNumeric,
    getMaxValue(field) {
      let data = (this.data[field] || []).slice(0, -1);

      if (PERCENTAGE_ONLY.includes(field)) {
        data = data.map(val => (val ? Math.abs(val) : 0));
      } else if (this.percentage) {
        data = data.map((val, i) => (val && this.data.grossRevenue[i]
          ? Math.abs(val / this.data.grossRevenue[i])
          : 0));
      }

      return Math.max(...data) || 0;
    },
    getPercent(field, index) {
      if (index === 12) return 0;

      if (this.data[field] == null) return 0;

      const max = this.getMaxValue(field);

      let value = this.data[field][index];

      if (!PERCENTAGE_ONLY.includes(field) && this.percentage) {
        value /= this.data.grossRevenue[index];
      }

      return max ? Math.floor(value / max * 100) : undefined;
    },
  },
  components: {
    ExpiredWidget,
    ConnectWidget,
    StickyHeader,
    // CostWarning,
  },
};
</script>

<style scoped>
.mi-cell-line {
  position: absolute;
  right: 0;
  bottom: 0;
  height: var(--cell-line-height);
  width: .5rem;
  background: var(--nu-primary-color);
  border-radius: var(--nu-pixel);
  transition: height var(--nu-theme-animation-time) linear;
}

.mi-cell-line.-negative {
  top: 100%;
  bottom: auto;
  background: var(--nu-danger-color);
  z-index: 1;
}

.mi-cell-value {
  transition: color var(--nu-theme-animation-time) linear;
}

.-hovered {
  background: var(--nu-costs-background-color);
}

.-hovered .mi-cell-value {
  color: var(--nu-primary-color);
}
</style>
