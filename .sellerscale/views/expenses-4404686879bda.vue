<template>
  <MiContainer v-if="expensesStore && productsStore">
    <nu-theme
      name="expense"
      color="rgba(93, 113, 143, 1)"
      background-color="#fff"
      border-color="rgba(93, 113, 143, 1)"></nu-theme>

    <datalist id="expense-name-options">
      <option v-for="option in $t('expenses.options')" :key="option" :value="option"/>
    </datalist>
    <nu-pane>
      <nu-heading size="h1|||h3">
        {{ $t('expenses.header') }}
        <MiInfo v-tooltip.bottom="$t('expenses.tooltip.header')"></MiInfo>
      </nu-heading>
      <nu-flex gap=".5">
        <nu-btn
          special
          :disabled="activeExpense && !activeExpense.id"
          @tap="addExpense">
          <nu-icon name="plus-circle"></nu-icon>
          {{ $t('expenses.add') }}
        </nu-btn>
        <nu-btn
          class="wide-only"
          v-if="!isSidebarShown"
          @tap="toggleFilters">
          <nu-icon name="filter"></nu-icon>
          {{ $t('expenses.show_filters') }}
        </nu-btn>
      </nu-flex>
    </nu-pane>
    <nu-card
      shadow border
      gap="1">
      <nu-flex
        gap="1"
        content="start stretch"
        items="stretch">
        <nu-block class="wide-only" name="sidebar" v-if="isSidebarShown" basis="13" shrink="0">
          <nu-flow gap="1" mod="sticky-top" padding="1 0 0 0" space="1 0 0 0">
            <nu-pane>
              <nu-heading level="3">{{ $t('expenses.filters') }}</nu-heading>
              <nu-btn @tap="toggleFilters" mod="xs">
                {{ $t('actions.hide') }}
              </nu-btn>
            </nu-pane>
            <!--            <nu-line></nu-line>-->
            <nu-block>
              <nu-flow gap=".5">
                <template
                  v-for="preset in presets">
                  <nu-grid
                    v-if="preset.label !== 'search' || query.length"
                    :key="preset.label">
                    <nu-btn
                      content="center start"
                      padding=".5 .75"
                      :theme="preset.theme"
                      :border="preset.label !== currentPreset ? 'hidden' : ''"
                      @tap="changePreset(preset.label, true)">
                      <nu-icon
                        :name="`circle${currentPreset === preset.label ? '-filled' : ''}`">
                      </nu-icon>
                      <nu-block mod="ellipsis">
                        {{ $t(`expenses.filter.${preset.label}`) }}
                        <nu-block
                          v-if="preset.label === 'search' && query.length"
                          mod="xs ellipsis">
                          <nu-icon name="search" inline></nu-icon>
                          {{ query }}
                        </nu-block>
                      </nu-block>
                    </nu-btn>
                  </nu-grid>
                </template>
              </nu-flow>
            </nu-block>
          </nu-flow>
        </nu-block>
        <nu-line
          class="wide-only" v-if="isSidebarShown" orient="y"></nu-line>
        <nu-block
          grow="1"
          flow="column"
          name="expenses-container"
          :hidden="activeExpense ? 'false||true' : 'false'">
          <nu-pane columns="auto 20" padding="0 0 1" content="start space-between">
            <nu-flex items="center" gap=".5" mod="nowrap" size="h3||h4|h6">
              <nu-heading level="3" v-if="currentPreset !== 'search'" size="inherit">
                {{ $t(`expenses.filter.${currentPreset}`) }}
              </nu-heading>
              <nu-heading level="3" v-else size="inherit">
                {{ $t('expenses.found') }}
              </nu-heading>
              <nu-badge
                theme="minor" mod="w6" size="md||sm|xs">
                {{ totalExpenses }}
              </nu-badge>
            </nu-flex>
            <MiSearch
              :value="currentPreset === 'search' ? query : ''"
              v-if="expensesStore && marketplaceExpenses.length"
              @input="onSearchInput"></MiSearch>
          </nu-pane>
          <nu-block>
            <nu-block
              v-if="!groupedExpenses.length"
              mod="w6" padding="0 0 0 1">
              {{ $t(`expenses.none${currentPreset === 'search' ? '_found' : ''}`) }}
            </nu-block>
            <nu-flex flow="column" gap=".5">
              <nu-block
                v-for="month in groupedExpenses"
                :key="formatDate(month.date, 'MMM YYYY')">
                <nu-flex
                  flow="column"
                  gap=".5">
                  <nu-flex
                    class="-nu-bg-main"
                    flow="column"
                    gap=".5"
                    mod="sticky-top" padding=".5 1 0 0"
                    style="z-index: 2; margin-right: -1rem !important;">
                    <nu-pane>
                      <nu-block mod="w6 bg" theme="default">
                        {{ month.formattedDate }}
                      </nu-block>
                      <nu-badge
                        v-if="!query.length"
                        mod="w6 monospace minor" theme="minor"
                        style="color: var(--background-color) !important;">
                        {{ formatNumeric(month.total, '$') }}
                      </nu-badge>
                    </nu-pane>
                    <nu-line color="var(--color)"></nu-line>
                  </nu-flex>
                  <nu-block v-if="!month.dates.length" mod="i" padding="0 0 0 1">
                    No expenses
                  </nu-block>
                  <nu-block
                    v-for="date in month.dates"
                    :key="date.date">
                    <nu-flex gap=".5">
                      <nu-block
                        padding=".25 0">
                        <nu-block
                          style="top: 3rem !important;"
                          mod="center sticky-top"
                          padding="0 0 .25 0">
                          <nu-icon name="calendar" size="2"></nu-icon>
                          <nu-block mod="stretched xs w7 center" padding=".85 0 0 0">
                            {{ date.day }}
                          </nu-block>
                        </nu-block>
                      </nu-block>
                      <nu-line
                        orient="y" column="2"
                        color="var(--color)"></nu-line>
                      <nu-block grow="1">
                        <nu-flex flow="column" gap=".25">
                          <nu-btn
                            grow="1"
                            v-for="expense in date.expenses"
                            :key="expense.id"
                            theme="expense"
                            padding=".5"
                            :border="activeExpense
                              && expense.id === activeExpense.id ? '' : 'hidden'"
                            columns="1fr auto"
                            items="stretch"
                            gap="0"
                            @tap="setActiveExpense(expense)">
                            <nu-block>
                              <nu-block mod="ellipsis" column="1 / -1">
                                {{ expense.description }}
                                <nu-icon
                                  v-if="expense.comment"
                                  name="message-square"
                                  v-tooltip="expense.comment"></nu-icon>
                              </nu-block>

                              <nu-grid
                                columns="minmax(0, auto) minmax(2rem, 1fr) auto"
                                items="end stretch"
                                gap=".5">
                                <nu-block mod="xs ellipsis">
                                  <nu-badge theme="details">
                                    {{ $t(`form_field.expense.categories.${expense.category}`) }}
                                  </nu-badge>
                                  <template v-if="expense.productId">
                                    &nbsp;
                                    <nu-icon name="package" inline></nu-icon>
                                    {{ getProductName(expense.productId) }}
                                  </template>
                                </nu-block>

                                <nu-block padding="0 0 .25 0" place="end stretch">
                                  <nu-block mod="dashed-border"></nu-block>
                                </nu-block>
                              </nu-grid>
                            </nu-block>

                            <nu-grid
                              mod="w6 monospace" place="end" gap=".5"
                              flow="column" items="center">
                              <nu-icon name="repeat" v-if="expense.recurrence"></nu-icon>
                              {{ formatNumeric(expense.amount, '$') }}
                            </nu-grid>
                          </nu-btn>
                        </nu-flex>
                      </nu-block>
                    </nu-flex>
                  </nu-block>
                </nu-flex>
              </nu-block>
            </nu-flex>
          </nu-block>
        </nu-block>
        <template v-if="activeExpense">
          <nu-line
            orient="y"
            :hidden="activeExpense ? 'false||true' : 'false'"></nu-line>
          <nu-block mod="relative" basis="20||100%" shrink="0">
            <nu-flex
              flow="column"
              gap=".5" mod="sticky-top"
              style="margin-top: -1rem;"
              padding="1 0 0 0">
              <nu-scroll></nu-scroll>
              <nu-block>
                <nu-block mod="w6 sm">
                  {{ $t('form_field.expense.description') }}
                  <nu-icon
                    theme="primary"
                    size=".75" name="info" inline
                    v-tooltip.main="$t('label.required_field')"/>
                </nu-block>
                <MiInput
                  ref="description"
                  v-model="activeExpense.description"></MiInput>
              </nu-block>
              <nu-grid>
                <nu-block mod="w6 sm">
                  {{ $t('form_field.expense.category') }}
                </nu-block>
                <MiSelect
                  v-model="activeExpense.category"
                  :options="categoryOptions"
                  @input="onCategoryChange"></MiSelect>
              </nu-grid>
              <nu-grid columns="auto 1fr" gap=".5">
                <nu-block mod="w6 sm">
                  {{ $t('form_field.expense.recurrence') }}
                </nu-block>
                <nu-block mod="w6 sm">
                  <nu-switch
                    mod="xs"
                    :checked="activeExpense.recurrence"
                    @tap="activeExpense.recurrence = !activeExpense.recurrence"></nu-switch>
                </nu-block>
                <template>
                  <nu-flex mod="w6 sm" items="center start">
                    <nu-block>
                      {{ $t(`form_field.expense.${activeExpense.recurrence ? 'period' : 'date'}`) }}
                    </nu-block>
                  </nu-flex>
                  <nu-pane mod="xs w5" content="stretch" columns="1fr 1fr 1.5">
                    <MiDateInput v-model="activeExpense.date"/>
                    <template v-if="activeExpense.recurrence">
                      <nu-btn
                        v-if="!activeExpense.endDate"
                        mod="xs nowrap" special place="stretch" padding=".5" gap="0"
                        @tap="addEndDate">
                        <nu-icon name="plus-circle"></nu-icon>
                        {{ $t('form_field.expense.endDate') }}
                      </nu-btn>
                      <template v-else>
                        <MiDateInput
                          v-model="activeExpense.endDate"/>
                        <nu-btn
                          mod="md"
                          special
                          padding=".5 .25"
                          @tap="removeEndDate">
                          <nu-icon
                            name="x"></nu-icon>
                          <!-- v-tooltip="$t('expense.tooltip.clearRecurrenceEndDate')"-->
                        </nu-btn>
                      </template>
                    </template>
                  </nu-pane>
                </template>
              </nu-grid>
              <nu-grid v-if="!activeExpense.recurrence">
                <nu-block mod="w6 sm">
                  {{ $t('form_field.expense.productId') }}
                </nu-block>
                <MiSelect
                  :options="productsOptions"
                  primary="id"
                  v-model="activeExpense.productId"
                  :disabled="activeExpense.recurrence">
                  <template v-slot:selected="{ option }">
                    <ProductSelectItem :product="option" :none="$t('expenses.general')"/>
                  </template>
                  <template v-slot:option="{ option }">
                    <ProductSelectItem :product="option" :none="$t('expenses.general')"/>
                  </template>
                </MiSelect>
              </nu-grid>
              <nu-block>
                <nu-block mod="w6 sm">
                  {{ $t('form_field.expense.marketplace') }}

                  <nu-badge mod="xs" theme="details">
                    {{ $t('label.coming_soon') }}
                  </nu-badge>
                </nu-block>
              </nu-block>
              <nu-block>
                <nu-block mod="w6 sm">
                  {{ $t('form_field.expense.receipt') }}

                  <nu-badge mod="xs" theme="details">
                    {{ $t('label.coming_soon') }}
                  </nu-badge>
                </nu-block>
              </nu-block>
              <nu-block>
                <nu-block mod="w6 sm">
                  {{ $t('form_field.expense.amount') }}
                  <nu-icon
                    theme="primary"
                    size=".75" name="info" inline
                    v-tooltip.main="$t('label.required_field')"/>
                </nu-block>
                <nu-pane columns="1fr 1fr">
                  <MiInputCurrency
                    :schema="{ min: 0, max: 999999 }"
                    v-model="activeExpense.amount"></MiInputCurrency>
                </nu-pane>
              </nu-block>
              <nu-block></nu-block>
              <nu-grid columns="3fr 2fr" gap=".5">
                <nu-btn special @tap="saveExpense" :disabled="!isFormValid">
                  {{ $t(`actions.${activeExpense.id ? 'save' : 'add'}`) }}
                </nu-btn>
                <nu-btn
                  v-if="activeExpense.id" theme="danger" special
                  @tap="deleteExpense" :disabled="!isFormValid">
                  {{ $t(`actions.delete`) }}
                </nu-btn>
                <nu-btn
                  v-if="!activeExpense.id"
                  @tap="cancel">
                  {{ $t(`actions.cancel`) }}
                </nu-btn>
              </nu-grid>
            </nu-flex>
          </nu-block>
        </template>
      </nu-flex>
    </nu-card>
  </MiContainer>
</template>

<script>
import {
  startOfMonth, addMonths, getDate, lastDayOfMonth, min as minDate, setDate,
  isAfter, isBefore,
} from 'date-fns';
import ExpensesStore, { EXPENSE_CATEGORIES } from '@/stores/expenses.store';
import ProductsStore from '@/stores/products.store';
import PreloadMixin from '@/mixins/preload.mixin';
import StoreMixin from '@/mixins/store.mixin';
import { formatNumeric, formatDate } from '@/util';
import { focus } from '@/services/window';
import FormSchema from '@/scheme/expense.form';
import ProductSelectItem from '@/components/product-select-item.vue';
import ReactSwitchMixin from '@/mixins/react-switch';
import User from '@/services/user';
import Analytics from '@/services/analytics';

export default {
  name: 'expenses',
  mixins: [PreloadMixin(() => Promise.all([
    new ExpensesStore().fetch(),
    new ProductsStore('existing').fetch(),
  ]), function setPreloadedData([expensesStore, productsStore]) {
    this.expensesStore = expensesStore;
    this.productsStore = productsStore;
  }), StoreMixin({
    isSidebarShown: false,
    query: '',
    currentPreset: 'all',
  }), ReactSwitchMixin()],
  data() {
    return {
      /**
       * @type {ExpensesStore}
       */
      expensesStore: null,
      /**
       * @type {ProductsStore}
       */
      productsStore: null,
      presets: [
        {
          label: 'all',
          theme: 'ppc-cost',
        },
        {
          label: 'onetime',
          theme: 'details',
        },
        {
          label: 'recurring',
          theme: 'inputs',
        },
        {
          label: 'cogs',
          theme: 'cogs',
        },
        {
          label: 'search',
          theme: 'minor',
        },
      ],
      activeExpense: null,
      formSchema: FormSchema(),
      categoryOptions: EXPENSE_CATEGORIES.reduce((options, cat) => {
        options.push({
          value: cat,
          label: `form_field.expense.categories.${cat}`,
        });

        return options;
      }, []),
      User,
    };
  },
  watch: {
    query(value) {
      if (value) {
        this.activeExpense = null;
      }
    },
    activeExpense(expense) {
      if (expense && this.query && !expense.id) {
        this.changePreset(this.previousPreset || 'all');
      }
    },
    'activeExpense.date': function onStartDateChange(date, oldDate) {
      if (!this.activeExpense || !this.activeExpense.endDate || !oldDate || !date) return;

      if (this.activeExpense.endDate && isAfter(date, this.activeExpense.endDate)) {
        this.activeExpense.date = this.activeExpense.endDate;
      }
    },
    'activeExpense.endDate': function onEndDateChange(endDate, oldEndDate) {
      if (!this.activeExpense || !this.activeExpense.date || !oldEndDate || !endDate) return;

      if (this.activeExpense.date && isBefore(endDate, this.activeExpense.date)) {
        this.activeExpense.endDate = this.activeExpense.date;
      }
    },
  },
  mounted() {
    const { add } = this.$route.query;

    setTimeout(() => {
      if (add || (this.expensesStore && !this.marketplaceExpenses.length)) {
        this.$router.push('/expenses');

        this.addExpense();

        setTimeout(() => {
          focus(this.$refs.description);
        }, 50);
      }
    }, 50);
  },
  computed: {
    productsOptions() {
      return [
        ...(this.activeExpense.category === 'cogs' ? [] : [{ id: undefined }]),
        ...this.productsStore
          ? this.productsStore.items.map(product => product.data)
          : []];
    },
    months() {
      let month = this.firstMonth;

      const months = [];

      while (month <= new Date()) {
        const nextMonth = addMonths(month, 1);

        months.push({
          date: month,
          endDate: minDate(nextMonth.getTime(), new Date()),
        });

        month = nextMonth;
      }

      return months.reverse();
    },
    firstMonth() {
      return startOfMonth(new Date(Math.min(
        ...this.marketplaceExpenses.map(expense => new Date(expense.data.date).getTime()),
      )));
    },
    productIds() {
      return this.productsStore.items.map(product => product.id);
    },
    marketplaceExpenses() {
      return this.expensesStore.items
        .filter(expense => !expense.data.productId
          || this.productIds.includes(expense.data.productId));
    },
    filteredExpenses() {
      switch (this.currentPreset) {
        case 'all':
          return this.marketplaceExpenses;
        case 'onetime':
          return this.marketplaceExpenses.filter(expense => !expense.data.recurrence);
        case 'recurring':
          return this.marketplaceExpenses.filter(expense => expense.data.recurrence);
        case 'cogs':
          return this.marketplaceExpenses.filter(expense => expense.data.category === 'cogs');
        case 'search':
          return this.foundExpenses;
        default:
          return [];
      }
    },
    foundExpenses() {
      const query = this.query.toLowerCase().trim();

      if (!query) {
        return this.marketplaceExpenses;
      }

      return this.marketplaceExpenses
        .filter(expense => !query.split(/\s+/g)
          .find(q => !((expense.data.description || '').toLowerCase().includes(q)
            || (expense.data.comment || '').toLowerCase().includes(q)
            || formatNumeric(expense.data.amount, '$').includes(q)
            || String(expense.data.amount).includes(q)
            || (expense.data.productId
              && (this.getProductName(expense.data.productId) || '').toLowerCase().includes(q))
            || (expense.data.date || '').includes(q)
            || formatDate(expense.data.date, 'MMMM YYYY').toLowerCase().includes(q)
            || (this.$t(`form_field.expense.categories.${expense.data.category}`) || '')
              .toLowerCase().includes(q))));
    },
    totalExpenses() {
      return this.groupedExpenses.reduce(
        (total, group) => total
          + group.dates.reduce((sum, date) => sum + date.expenses.length, 0),
        0,
      );
    },
    groupedExpenses() {
      return this.months.map((month) => {
        month.datesMap = {};

        const lastDay = getDate(lastDayOfMonth(month.date));

        const oneTimeExpenses = this.filteredExpenses
          .filter(expense => !expense.data.recurrence
            && new Date(expense.data.date) >= month.date
            && new Date(expense.data.date) < month.endDate)
          .map(expense => ({ ...expense.data }));
        const recurrentExpenses = this.filteredExpenses
          .filter(expense => expense.data.recurrence)
          .filter((expense) => {
            const originalDay = getDate(expense.data.date);
            const expenseDay = Math.min(originalDay, lastDay);
            const date = new Date(expense.data.date);
            const expenseDate = setDate(month.date, expenseDay);
            const endDate = new Date(expense.data.endDate);

            expense.data.currentDate = formatDate(
              expenseDate,
              'YYYY-MM-DD',
            );

            return date < month.endDate
              && expenseDate < new Date()
              && (!expense.data.endDate
                || expenseDate < endDate);
          })
          .map(expense => ({ ...expense.data }));

        [...oneTimeExpenses, ...recurrentExpenses].forEach((expense) => {
          const date = expense.currentDate || expense.date;
          const day = getDate(date);

          if (!month.datesMap[day]) {
            month.datesMap[day] = { day, expenses: [] };
          }

          month.datesMap[day].expenses.push(expense);
        });

        month.dates = Object.values(month.datesMap)
          .sort((a, b) => new Date(b.day) - new Date(a.day));

        month.formattedDate = formatDate(month.date, 'MMMM YYYY');

        month.total = month.dates.reduce(
          (total, date) => total
            + date.expenses.reduce((sum, expense) => sum + expense.amount, 0),
          0,
        );

        return month;
      }).filter(month => month.dates.length);
    },
    isFormValid() {
      const data = this.activeExpense;

      return !(data.description.length < 3
        || data.data >= data.endDate
        || data.amount <= 0);
    },
  },
  methods: {
    changePreset(preset, reset) {
      this.currentPreset = preset;

      setTimeout(() => {
        if (reset) {
          this.cancel();
        }

        if (preset !== 'search') {
          this.previousPreset = '';
        }
      });
    },
    setFocusOnLastLine() {
      setTimeout(
        () => [...document.querySelectorAll('[name=expense-name]')].slice(-1)[0].focus(),
        0,
      );
    },
    async addExpense() {
      this.activeExpense = {
        description: '',
        category: 'general',
        amount: 20,
        amountOrigin: 0,
        recurrence: false,
        date: formatDate(new Date(), 'YYYY-MM-DD'),
        endDate: null,
      };

      this.changePreset('all');
    },
    formatNumeric,
    formatDate,
    getProductName(id) {
      const expense = this.productsStore.getById(id);

      return expense ? expense.data.name : '';
    },
    cancel() {
      this.activeExpense = null;
    },
    addEndDate() {
      this.activeExpense.endDate = formatDate(new Date(), 'YYYY-MM-DD');
      this.activeExpense = { ...this.activeExpense };
    },
    removeEndDate() {
      this.activeExpense.endDate = null;
      this.activeExpense = { ...this.activeExpense };
    },
    async saveExpense() {
      const id = this.activeExpense && this.activeExpense.id;

      if (id) {
        this.expensesStore.getById(id).change(this.activeExpense);
      } else {
        this.expensesStore.add(this.activeExpense);
      }

      this.cancel();
    },
    async deleteExpense() {
      const id = this.activeExpense && this.activeExpense.id;

      this.cancel();

      if (id) {
        await this.expensesStore.delete([id]);
      }
    },
    onCategoryChange(category) {
      if (category === 'cogs' && !this.activeExpense.productId) {
        this.activeExpense.productId = this.productsOptions[0].id;
      }

      this.activeExpense.recurrence = ['payroll', 'rent', 'software'].includes(category);
    },
    setActiveExpense(expense) {
      if (!this.activeExpense || this.activeExpense.id !== expense.id) {
        this.activeExpense = { ...expense };
      } else {
        this.activeExpense = null;
      }
    },
    toggleFilters() {
      this.isSidebarShown = !this.isSidebarShown;

      Analytics.event(`expenses:filters-${this.isSidebarShown ? 'show' : 'hide'}`);
    },
    onSearchInput(value) {
      if (this.currentPreset === 'search' && !value) {
        this.changePreset(this.previousPreset || 'all', true);
      } else if (value && this.currentPreset !== 'search') {
        this.previousPreset = this.currentPreset;
        this.changePreset('search', true);
      }

      this.query = value || '';
    },
  },
  components: {
    // ExpensesTable,
    // StickyHeader,
    ProductSelectItem,
  },
};
</script>

<style scoped>
@media (max-width: 1300px) {
  .wide-only {
    display: none;
  }
}
</style>
