<template>
  <div class="mj-date-picker" :style="cssProps">
    <div class="mj-calendar">
      <div class="calendar-header">
        <nu-btn @tap="changeMonth(1)" mod="xs" color prevent>
          <nu-icon name="chevron-left" size="1"></nu-icon>
        </nu-btn>
        <div class="calendar-month-name">{{ currentMonthName }}</div>
        <nu-btn @tap="changeMonth(-1)" mod="xs" color prevent>
          <nu-icon name="chevron-right" size="1"></nu-icon>
        </nu-btn>
      </div>
      <nu-grid class="calendar-days-name" columns="repeat(7, 1fr)">
        <nu-block
          class="day"
          v-for="day in firstWeek" :key="day.name">
          <span>{{ day.name }}</span>
        </nu-block>
      </nu-grid>
      <nu-grid columns="repeat(7, 1fr)" class="calendar-days">
        <nu-btn
          theme="default"
          padding=".5"
          :mod="`xs ${isSameDay(day.date, now) ? 'w7' : 'w5 transparent'}`"
          :border="isSelected(day) ? '1x' : 0"
          :special="isSelected(day) ? '' : null"
          :disabled="!day.selectable"
          v-for="day in monthDays"
          :key="day.date | date('DDMMYYYY')"
          @tap="selectDay(day.date)">
          {{ day.date | date('D') }}
        </nu-btn>
      </nu-grid>
    </div>
  </div>
</template>

<script>
import { dateFilter } from 'vue-date-fns';
import {
  addDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinRange,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import localeEn from 'date-fns/locale/en';
import localeRu from 'date-fns/locale/ru';

const locales = {
  en: localeEn,
  ru: localeRu,
};

export default {
  name: 'date-range-picker',

  props: {
    value: {
      String,
      default: () => new Date().toISOString(),
    },
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
      default: false,
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
        primary: 'var(--nu-default-special-color)',
        secondary: '#2D3E50',
        ternary: '#93A0BD',
        border: '#e6e6e6',
        light: '#ffffff',
        dark: 'var(--nu-default-color)',
        hovers: {
          day: '#CCC',
          range: '#e6e6e6',
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

    weekStartsOn() {
      return this.$i18n.locale === 'en' ? 0 : 1;
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
        '--dp-default-color': this.theme.secondary,
        '--dp-ternary-color': this.theme.ternary,
        '--dp-normal-color': this.theme.light,
        '--dp-contrast-color': this.theme.dark,
        '--dp-border-color': this.theme.border,
      };
    },

    currentMonthName() {
      return format(this.current, 'MMMM YYYY', { locale: locales[this.$i18n.locale] });
    },
  },

  created() {
    // Display current month or "to" month
    this.current = this.value ? new Date(this.value).toISOString() : this.now;

    // Update Calendar
    this.updateCalendar();
  },

  methods: {
    isSameDay,

    updateCalendar() {
      // old method
    },

    getText(key) {
      return this.$t(`datepicker.${key}`);
    },

    update(date) {
      this.$emit('input', format(startOfDay(date), 'YYYY-MM-DD'));
    },

    changeMonth(diff) {
      this.current = subMonths(this.current, diff);
      this.updateCalendar();
    },

    selectDay(date) {
      this.update(date);
    },

    isSelected(day) {
      return this.value && isWithinRange(day.date, this.value, this.value);
    },

    dayClasses(day) {
      const classes = [];

      if (day.currentMonth) {
        classes.push('is-current-month');
      }
      if (this.value && isWithinRange(day.date, this.value, this.value)) {
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
  },

  filters: {
    date: dateFilter,
  },
};
</script>

<style lang="scss" scoped>
.mj-date-picker  {
  text-align: left;
  min-width: 18rem;
  /*width: var(--default-width);*/
  user-select: none;
  box-sizing: border-box;

  & * {
    box-sizing: border-box;
  }
}

.mj-calendar {
  color: var(--dp-contrast-color);
  background-color: var(--normal-color);
  padding: .5rem;

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .calendar-days-name,
  .calendar-days {
    .day {
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
    border-top: .125rem solid white;
    border-bottom: .125rem solid white;
    border-radius: var(--border-radius);

    &:hover {
      background: var(--default-color);
    }

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
      background-color: var(--hover-range-color);
    }
    &.is-first-range {
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }
    &.is-last-range {
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }
    &.is-edge-range {
      background-color: var(--dp-primary-color);
      color: white;
    }
    &.is-selected {
      background-color: var(--dp-primary-color);
      color: white;
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
</style>
