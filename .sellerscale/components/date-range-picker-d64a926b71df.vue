<template>
  <div class="mj-daterange-picker" :style="cssProps">
    <div class="panels-choices" v-if="availablePanels.length &gt; 1">
      <!-- <div class="panel-button"
            v-for="panel in availablePanels"
            :key="panel"
            :class="{'is-current': panel === currentPanel}"
            @click="currentPanel = panel">
        {{ getText(`panels.${panel}`) }}
      </div> -->
      <nu-btn
        v-for="panel in availablePanels"
        :key="panel"
        :special="panel === currentPanel ? '' : null"
        @tap="currentPanel = panel"
        mod="xs"
        padding=".5">
        {{ getText(`panels.${panel}`) }}
      </nu-btn>
    </div>
    <div class="preset-ranges" v-if="isPresetPicker">
      <div class="preset" v-for="entry in availablePresets" :key="entry">
        <input type="radio" v-model="preset" :id="entry" :value="entry" tabindex="-1"/>
        <label :for="entry" @click="onPresetClick(entry)">
          <span class="check"
                tabindex="0"
                @keydown="onPresetKeydown($event, entry)"></span>
          <span>{{ getText(`presets.${entry}`) }}</span>
        </label>
      </div>
    </div>
    <div class="mj-calendar"
         :class="weekSelector ? 'mj-calendar-week' : 'mj-calendar-days'" v-if="isDaysPicker">
      <div class="calendar-header">
        <!-- <div class="calendar-previous-month calendar-arrow calendar-arrow-previous"
            :aria-label="getText('previousMonth')"
            @click="changeMonth(1)">
          <nu-icon name="arrow-left" size="1.5"></nu-icon>
        </div> -->
        <nu-btn @tap="changeMonth(1)" mod="xs" color>
          <nu-icon name="chevron-left" size="1"></nu-icon>
        </nu-btn>
        <div class="calendar-month-name">{{ currentMonthName }}</div>
        <!-- <div class="calendar-previous-month calendar-arrow calendar-arrow-next"
            :aria-label="getText('nextMonth')"
            @click="changeMonth(-1)">
          <nu-icon name="arrow-right" size="1"></nu-icon>
        </div> -->
        <nu-btn @tap="changeMonth(-1)" mod="xs" color>
          <nu-icon name="chevron-right" size="1"></nu-icon>
        </nu-btn>
      </div>
      <div class="calendar-days-name">
        <div class="day" v-for="day in firstWeek" :key="day.name">
          <span>{{ day.name }}</span>
        </div>
      </div>
      <div class="calendar-days">
        <div class="day"
             v-for="day in monthDays"
             :key="day.date | date('DDMMYYYY')"
             :class="dayClasses(day)"
             @click="selectDay(day.date)"
             @mouseover="hoverizeDay(day.date)"
             @mouseleave="hoverRange = []">
          <span>{{ day.date | date('D') }}</span>
        </div>
      </div>
    </div>
    <div class="mj-calendar" v-if="isMonthsPicker">
      <div class="calendar-header">
        <!-- <div class="calendar-previous-month calendar-arrow calendar-arrow-previous"
            :aria-label="getText('previousYear')"
            @click="changeYear(1)">
          <nu-icon name="arrow-left" size="1"></nu-icon>
        </div> -->
        <nu-btn @tap="changeYear(1)" mod="xs" color>
          <nu-icon name="chevron-left" size="1"></nu-icon>
        </nu-btn>
        <div class="calendar-month-name">{{ currentYearName }}</div>
        <!-- <div class="calendar-previous-month calendar-arrow calendar-arrow-next"
            :aria-label="getText('nextYear')"
            @click="changeYear(-1)">
          <nu-icon name="arrow-right" size="1"></nu-icon>
        </div> -->
        <nu-btn @tap="changeYear(-1)" mod="xs" color>
          <nu-icon name="chevron-right" size="1"></nu-icon>
        </nu-btn>
      </div>
      <div class="calendar-months" v-if="isMonthsPanel">
        <div style="display: none;"></div>
        <nu-btn
          v-for="month in yearMonths"
          :key="month.date | date('DDMMYYYY')"
          :special="isMonthSelected(month) ? '' : null"
          @tap="selectMonth(month)"
          mod="xs" color>
          <span>{{ month.displayDate }}</span>
        </nu-btn>
        <!-- <div class="month"
            v-for="month in yearMonths"
            :key="month.date | date('DDMMYYYY')"
            @click="selectMonth(month)"
            :class="monthClasses(month)">
          <span>{{ month.displayDate }}</span>
        </div> -->
      </div>
      <div class="calendar-quarters" v-if="isQuartersPanel">
        <div class="quarter"
             v-for="(quarter, index) in yearQuarters"
             :key="index">
          <div class="legend">
            {{ getText('quarter') }} {{ ++index }}
          </div>
          <nu-btn
            :key="index"
            :special="isQuarterSelected(quarter) ? '' : null"
            items="stretch" color
            @tap="selectQuarter(quarter)">
            <div class="months">
              <div class="month" v-for="(month, index) in quarter.months" :key="index">
                <span>{{ month.displayDate }}</span>
              </div>
            </div>
          </nu-btn>
        </div>
      </div>
    </div>
    <div class="mj-calendar" v-if="isYearPicker">
      <div class="calendar-years">
        <!-- <div class="year"
            v-for="(year, index) in years"
            :key="index"
            @click="selectYear(year)"
            :class="yearClasses(year)">
          <span>{{ year.displayDate }}</span>
        </div> -->
        <nu-btn
          v-for="(year, index) in years"
          :key="index"
          :special="isYearSelected(year) ? '' : null"
          @tap="selectYear(year)">
          {{ year.displayDate }}
        </nu-btn>
      </div>
    </div>
    <div class="mj-daterange-picker-controls">
      <nu-btn
        @tap="reset"
        mod="sm">
        {{ resetLegend }}
      </nu-btn>
      <nu-btn
        special
        @tap="update"
        :disabled="!(values.from && values.to)"
        mod="sm">
        {{ submitLegend }}
      </nu-btn>
    </div>
  </div>
</template>

<script>
import { dateFilter } from 'vue-date-fns';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  isWithinRange,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import localeEn from 'date-fns/locale/en';
import localeRu from 'date-fns/locale/ru';

const locales = {
  en: localeEn,
  ru: localeRu,
};

export function affectPreset(preset, weekStartsOn) {
  const now = new Date();

  switch (preset) {
    case 'custom':
      return { from: null, to: null };
    case 'today':
      return { from: startOfDay(now), to: now };
    case 'yesterday':
      return {
        from: startOfDay(subDays(now, 1)),
        to: endOfDay(subDays(now, 1)),
      };
    case 'tomorrow':
      return {
        from: startOfDay(addDays(now, 1)),
        to: endOfDay(addDays(now, 1)),
      };
    case 'lastWeek':
      return {
        from: startOfWeek(subWeeks(now, 1), { weekStartsOn }),
        to: endOfWeek(subWeeks(now, 1), { weekStartsOn }),
      };
    case 'lastMonth':
      return {
        from: startOfMonth(subMonths(now, 1)),
        to: endOfMonth(subMonths(now, 1)),
      };
    case 'last14days':
      return { from: startOfDay(subWeeks(now, 2)), to: now };
    case 'last7days':
      return { from: startOfDay(subWeeks(now, 1)), to: now };
    case 'next7days':
      return { to: startOfDay(addWeeks(now, 1)), from: now };
    case 'last30days':
      return { from: startOfDay(subMonths(now, 1)), to: now };
    case 'next30days':
      return { to: startOfDay(addMonths(now, 1)), from: now };
    case 'last90days':
      return { from: startOfDay(subMonths(now, 3)), to: now };
    case 'next90days':
      return { to: startOfDay(addMonths(now, 3)), from: now };
    case 'last365days':
      return { from: startOfDay(subYears(now, 1)), to: now };
    case 'yearToDate':
      return { from: startOfYear(now), to: now };
    case 'next365days':
      return { to: startOfDay(addYears(now, 1)), from: now };
    default:
      return { from: null, to: null };
  }
}

export default {
  name: 'date-range-picker',

  props: {
    from: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      default: null,
    },
    begin: {
      type: String,
      default: null,
    },
    past: {
      type: Boolean,
      default: true,
    },
    future: {
      type: Boolean,
      default: true,
    },
    panel: {
      type: String,
      default: null,
    },
    yearsCount: {
      type: Number,
      default: 2,
    },
    panels: {
      type: Array,
      default: () => ['range', 'week', 'month', 'quarter', 'year'],
    },
    theme: {
      type: Object,
      default: () => ({
        primary: 'var(--nu-primary-color)',
        secondary: 'var(--nu-minor-color)',
        ternary: 'var(--nu-minor-color)',
        border: 'var(--nu-default-border-color)',
        light: 'var(--nu-default-background-color)',
        dark: 'var(--nu-default-color)',
        hovers: {
          day: 'var(--nu-default-focus-color)',
          range: 'var(--nu-default-focus-color)',
        },
      }),
    },
    width: {
      type: String,
      default: 'auto',
    },
    resetTitle: {
      type: String,
      default: null,
    },
    submitTitle: {
      type: String,
      default: null,
    },
    presets: {
      type: Array,
      default: () => ['last7days', 'lastWeek', 'last14days', 'lastMonth', 'last30days', 'custom'],
    },
  },

  data() {
    return {
      currentPanel: null,
      current: null,
      weekSelector: false,
      now: new Date().toISOString(),
      values: {
        from: null,
        to: null,
      },
      hoverRange: [],
      preset: 'custom',
    };
  },

  computed: {
    monthDays() {
      const days = [];

      const lastDayOfMonth = endOfMonth(this.current);
      const firstDayOfMonth = startOfMonth(this.current);
      const nbDaysLastMonth = ((+format(firstDayOfMonth, 'd') - 1) % 7)
        + (this.$i18n.locale === 'en' ? 1 : 0);

      let day = subDays(firstDayOfMonth, nbDaysLastMonth);

      while (isBefore(day, lastDayOfMonth) || days.length % 7 > 0) {
        days.push({
          date: day,
          selectable:
            (!!(this.future && isAfter(day, this.now)))
            || (!!(this.past && isBefore(day, this.now)))
            || isSameDay(day, this.now),
          currentMonth: isSameMonth(this.current, day),
        });
        day = addDays(day, 1);
      }

      return days;
    },

    availablePanels() {
      return this.panels;
    },

    availablePresets() {
      const presets = [...this.presets];
      const index = presets.indexOf('forever');
      if (!this.begin && index > -1) {
        presets.splice(index, 1);
      }
      return this.presets;
    },

    weekStartsOn() {
      return this.$i18n.locale === 'en' ? 0 : 1;
    },

    resetLegend() {
      return this.resetTitle ? this.resetTitle : this.getText('reset');
    },

    submitLegend() {
      return this.submitTitle ? this.submitTitle : this.getText('submit');
    },

    firstWeek() {
      const days = this.monthDays.slice(0, 7);
      const week = [];

      days.forEach((day) => {
        week.push({
          name: format(day.date, 'dd', { locale: locales[this.$i18n.locale] }),
        });
      });

      return week;
    },

    cssProps() {
      return {
        '--dp-default-width': this.width,
        '--dp-primary-color': this.theme.primary,
        '--dp-hover-day-color': this.theme.hovers.day,
        '--dp-hover-range-color': this.theme.hovers.range,
        '--dp-minor-color': this.theme.secondary,
        '--dp-ternary-color': this.theme.ternary,
        '--dp-normal-color': this.theme.light,
        '--dp-contrast-color': this.theme.dark,
        '--dp-border-color': this.theme.border,
      };
    },

    yearMonths() {
      const months = [];
      let month = startOfYear(this.current);
      while (months.length !== 12) {
        months.push({
          date: month,
          displayDate: format(month, 'MMMM', { locale: locales[this.$i18n.locale] }),
        });
        month = addMonths(month, 1);
      }
      return months;
    },

    yearQuarters() {
      const quarters = [];

      this.yearMonths.forEach((month, index) => {
        if (index % 3 === 0) {
          quarters.push({
            months: [
              this.yearMonths[index],
              this.yearMonths[index + 1],
              this.yearMonths[index + 2],
            ],
            range: {
              start: startOfDay(startOfMonth(this.yearMonths[index].date)),
              end: endOfDay(endOfMonth(this.yearMonths[index + 2].date)),
            },
          });
        }
      });

      return quarters;
    },

    years() {
      const years = [];
      let i = this.yearsCount;
      let start = this.future ? addYears(this.now, this.yearsCount) : this.now;

      i = +this.future * this.yearsCount + +this.past * this.yearsCount + 1;

      while (i !== 0) {
        years.push({
          date: start,
          displayDate: format(start, 'YYYY', { locale: locales[this.$i18n.locale] }),
        });
        start = subYears(start, 1);
        i -= 1;
      }

      return years;
    },

    currentMonthName() {
      return format(this.current, 'MMMM YYYY', { locale: locales[this.$i18n.locale] });
    },

    currentYearName() {
      return format(this.current, 'YYYY', { locale: locales[this.$i18n.locale] });
    },

    isPresetPicker() {
      return false; // this.currentPanel === 'range';
    },

    isDaysPicker() {
      return this.currentPanel === 'range' || this.currentPanel === 'week';
    },

    isMonthsPicker() {
      return this.currentPanel === 'month' || this.currentPanel === 'quarter';
    },

    isYearPicker() {
      return this.currentPanel === 'year';
    },

    isMonthsPanel() {
      return this.currentPanel === 'month';
    },

    isQuartersPanel() {
      return this.currentPanel === 'quarter';
    },
  },

  created() {
    // Parse Inputs
    Object.keys(this.values).forEach((value) => {
      this.values[value] = isValid(parse(this[value])) ? this[value] : null;
    });

    // Todo ? If from or to is null, or from is after to, both are null

    // Display current month or "to" month
    this.current = this.values.to ? this.values.to : this.now;

    // Set current panel
    this.currentPanel = this.panel || this.availablePanels[0];
  },

  watch: {
    currentPanel(panel) {
      this.switchMode(panel);
    },

    preset(preset) {
      this.current = new Date().toISOString();

      const values = affectPreset(preset, this.weekStartsOn);

      if (values) {
        this.values = values;
      }
    },
  },

  methods: {
    getText(key) {
      return this.$t(`datepicker.${key}`);
    },

    switchMode(panel) {
      this.weekSelector = panel !== 'range';
    },

    reset() {
      this.values = {
        to: null,
        from: null,
      };
      this.preset = null;
      this.$emit('reset', { to: null, from: null });
    },

    update() {
      if (!this.values.from || !this.values.to) {
        return;
      }
      this.$emit('update', {
        to: format(endOfDay(this.values.to), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
        from: format(startOfDay(this.values.from), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
        panel: this.currentPanel,
      });
    },

    changeMonth(diff) {
      this.current = subMonths(this.current, diff);
    },

    changeYear(diff) {
      this.current = subYears(this.current, diff);
    },

    selectDay(date) {
      if (this.weekSelector) {
        this.values.from = startOfWeek(date, { weekStartsOn: this.weekStartsOn });
        this.values.to = endOfWeek(date, { weekStartsOn: this.weekStartsOn });
        return;
      }
      if ((this.values.from && this.values.to) || (!this.values.from && !this.values.to)) {
        this.values.from = date;
        this.values.to = null;
      } else if (this.values.from && !this.values.to) {
        if (isBefore(date, this.values.from)) {
          this.values.from = date;
        } else {
          this.values.to = date;
          this.hoverRange = [];
        }
      }
      this.preset = 'custom';
    },

    selectQuarter(quarter) {
      this.values.from = startOfDay(startOfMonth(quarter.range.start));
      this.values.to = endOfMonth(quarter.range.end);
      this.current = this.values.to;
    },

    selectMonth(month) {
      this.values.from = startOfMonth(month.date);
      this.values.to = endOfMonth(month.date);
      this.current = this.values.to;
    },

    selectYear(year) {
      this.values.from = startOfYear(year.date);
      this.values.to = endOfYear(year.date);
      this.current = this.values.to;
    },

    hoverizeDay(date) {
      if (!this.weekSelector
        && (!(this.values.from && !this.values.to)
          || (isBefore(date, this.values.from)))) {
        this.hoverRange = [];
        return;
      }
      if (this.weekSelector) {
        this.hoverRange = [
          startOfWeek(date, { weekStartsOn: this.weekStartsOn }),
          endOfWeek(date, { weekStartsOn: this.weekStartsOn }),
        ];
      } else {
        this.hoverRange = [this.values.from, date];
      }
    },

    dayClasses(day) {
      const classes = [];

      if (day.currentMonth) {
        classes.push('is-current-month');
      }
      if (this.values.from && this.values.to
        && isWithinRange(day.date, this.values.from, this.values.to)) {
        classes.push('is-selected');
      }
      if (!day.selectable) {
        classes.push('is-disabled');
      }
      if (isSameDay(day.date, this.now)) {
        classes.push('is-today');
      }
      if (
        (!this.values.to && isSameDay(day.date, this.values.from))
        || (this.values.to && !this.values.from
        && isSameDay(day.date, this.values.from) && isSameDay(day.date, this.values.to))
        || (this.values.to && this.values.from && isSameDay(day.date, this.values.from))) {
        classes.push('is-first-range');
        classes.push('is-edge-range');
      }
      if (this.values.to && isSameDay(day.date, this.values.to)) {
        classes.push('is-last-range');
        classes.push('is-edge-range');
      }

      if (this.hoverRange.length === 2
        && isWithinRange(day.date, this.hoverRange[0], this.hoverRange[1])) {
        classes.push('is-in-range');
      }
      return classes;
    },

    isMonthSelected(month) {
      if (this.values.to && this.values.from
        && isWithinRange(month.date, this.values.from, this.values.to)) {
        return true;
      }

      return false;
    },

    isQuarterSelected(quarter) {
      if (this.values.to && this.values.from
        && isWithinRange(quarter.range.start, this.values.from, this.values.to)
        && isWithinRange(quarter.range.end, this.values.from, this.values.to)) {
        return true;
      }
      return false;
    },

    isYearSelected(year) {
      if (this.values.to && this.values.from) {
        if (isSameDay(this.values.from, startOfYear(year.date))
          && isSameDay(this.values.to, endOfYear(year.date))) {
          return true;
        }
      }
      return false;
    },

    onPresetKeydown(evt, preset) {
      if (evt.which === 13) {
        this.preset = preset;
      }
    },
    onPresetClick(preset) {
      this.preset = preset;
    },
  },

  filters: {
    date: dateFilter,
  },
};
</script>

<style lang="scss" scoped>
.mj-daterange-picker {
  text-align: left;
  min-width: 21rem;
  width: var(--dp-default-width);
  user-select: none;
  box-sizing: border-box;

  & * {
    box-sizing: border-box;
  }
}

.mj-daterange-picker .panels-choices {
  display: grid;
  grid-gap: 0 .5rem;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  border-bottom: var(--nu-pixel) solid var(--nu-theme-border-color);
  padding: .5rem .5rem;
}

.mj-daterange-picker .preset-ranges {
  padding: .5rem 1rem;
  display: flex;
  flex-wrap: wrap;
  border-bottom: var(--nu-pixel) solid var(--nu-theme-border-color);

  .preset {
    width: 50%;
    font-size: var(--size-very-small);
    height: 1rem;
    cursor: pointer;
    position: relative;
    margin: .25rem 0;

    input {
      position: absolute;
      opacity: 0;
      height: 0;
      width: 0;

      &:checked ~ label .check {
        background-color: var(--dp-primary-color);

        &::after {
          background-color: transparent;
        }
      }
    }

    label {
      display: inline-flex;
      align-items: center;

      span + span {
        margin-left: .5rem;
      }

      .check {
        display: block;
        position: relative;
        height: 1rem;
        width: 1rem;
        background-color: var(--nu-minor-color);
        border-radius: 100%;

        &::after {
          content: '';
          position: absolute;
          height: .25rem;
          width: .25rem;
          left: 50%;
          top: 50%;
          background-color: var(--nu-default-background-color);
          border-radius: 100%;
          border: .25rem solid var(--nu-default-background-color);
          transform: translateX(-50%) translateY(-50%);
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 calc(1rem / 4) var(--focus-color);
        }
      }
    }

    * {
      cursor: pointer;
    }
  }
}

.mj-calendar {
  color: var(--dp-contrast-color);
  background-color: var(--normal-color);
  padding: .5rem .5rem;

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem;

    .calendar-month-name {
      flex: 1;
      text-align: center;
      color: var(--nu-minor-color);
      font-weight: 600;
      font-size: var(--size-small);
    }

    .calendar-arrow {
      fill: var(--nu-minor-color);
      cursor: pointer;
    }
  }

  .calendar-months {
    margin-top: 1rem;
    display: grid;
    grid-gap: .5rem;
    grid-template-columns: 1fr 1fr 1fr;

    .month {
      height: 3rem;
      padding: .5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: var(--nu-pixel) solid var(--nu-theme-border-color);
      border-radius: var(--nu-theme-border-radius);
      font-size: var(--size-small);

      &:hover {
        background-color: var(--dp-hover-range-color);
      }

      &.is-selected {
        background-color: var(--dp-primary-color);
        color: var(--nu-default-background-color);
      }

      &:not(.is-disabled) {
        cursor: pointer;
      }
    }
  }

  .calendar-quarters {
    margin-top: 1rem;

    .quarter {
      display: grid;
      grid-gap: .5rem .5rem;
      grid-template-columns: 1fr 3fr;
      margin: .5rem 0;
      align-items: center;
      font-size: var(--size-small);

      &:last-child {
        margin: .5rem 0 0 0;
      }

      .month {
        font-size: var(--size-very-small);
      }

      &.is-selected .months {
        background-color: var(--dp-primary-color);
        color: var(--nu-default-background-color);
      }

      &:not(.is-disabled) .months {
        cursor: pointer;
      }
    }

    .months {
      display: grid;
      grid-gap: .5rem .5rem;
      align-items: center;
      grid-template-columns: 1fr 1fr 1fr;
      height: 2rem;

      .month {
        text-align: center;
      }
    }
  }

  .calendar-years {
    margin-top: .5rem;
    display: grid;
    grid-auto-flow: column;
    gap: .5rem;

    .year {
      height: 3rem;
      padding: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: var(--nu-pixel) solid var(--nu-theme-border-color);
      border-radius: var(--nu-theme-border-radius);
      font-size: var(--size-small);
      margin: .5rem 0;

      &:hover {
        background-color: var(--dp-hover-range-color);
      }

      &.is-selected {
        background-color: var(--dp-primary-color);
        color: var(--nu-default-background-color);
      }

      &:not(.is-disabled) {
        cursor: pointer;
      }
    }
  }

  .calendar-days-name,
  .calendar-days {
    display: flex;
    flex-wrap: wrap;

    .day {
      font-weight: 600;
      width: calc(100% / 7);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  .calendar-days-name .day {
    font-size: var(--size-very-small);
    color: var(--dp-ternary-color);
    height: 2rem;
  }

  .calendar-days .day {
    height: 2.5rem;
    font-size: var(--size-small);
    border-top: .125rem solid var(--nu-default-background-color);
    border-bottom: .125rem solid var(--nu-default-background-color);

    &:not(.is-current-month) {
      color: var(--dp-ternary-color);
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    &.is-today {
      span {
        color: var(--dp-light-color);
        font-weight: 600;
      }
    }

    &.is-in-range {
      background-color: var(--dp-hover-range-color);
    }

    &.is-first-range {
      border-top-left-radius: var(--nu-theme-border-radius);
      border-bottom-left-radius: var(--nu-theme-border-radius);
    }

    &.is-last-range {
      border-top-right-radius: var(--nu-theme-border-radius);
      border-bottom-right-radius: var(--nu-theme-border-radius);
    }

    &.is-edge-range {
      background-color: var(--dp-primary-color);
      color: var(--nu-default-background-color);
    }

    &.is-selected {
      background-color: var(--dp-primary-color);
      color: var(--nu-default-background-color);
    }

    &:not(.is-disabled) {
      cursor: pointer;
    }
  }
}

.mj-calendar.mj-calendar-days {
  .calendar-days .day {
    &:not(.is-edge-range):hover {
      background-color: var(--dp-hover-day-color);
    }
  }
}

.mj-daterange-picker-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: var(--nu-pixel) solid var(--nu-theme-border-color);
  padding: .5rem .5rem;
}

.mj-daterange-picker-reset {
  border: var(--nu-pixel) solid var(--nu-minor-background-color);
}

.mj-daterange-picker-submit {
  background-color: var(--dp-primary-background-color);
  color: var(--nu-default-background-color);

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
