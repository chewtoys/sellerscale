<template>
  <nu-input
    class="mi-input-numeric mi-input"
    :cell="cell"
    :class="{
      '-error': status === 'error',
      '-success': status === 'success',
    }"
    :place="place"
    :width="width"
    :height="height"
    :padding="padding"
    :disabled="disabled"
    :radius="radius"
    :name="name">
    <input
      :id="id"
      :placeholder="placeholder"
      @blur="onBlurHandler"
      @input="onInputHandler"
      @keydown="onKeyDownHandler"
      @focus="onFocusHandler"
      :autofocus="autofocus"
      ref="root"
      type="tel"
      v-model="amount"
      style="
        text-align: center;
      ">
  </nu-input>
</template>

<script>
import accounting from 'accounting-js';
import MiInput from '@/base/input.vue';
import { formatNumericField } from '@/util';

const ALLOWED_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '-'];

export default {
  name: 'mi-input-numeric',

  extends: MiInput,

  props: {
    /**
     * Input id
     */
    id: {
      type: String,
      required: false,
    },

    /**
     * Input name
     */
    name: {
      type: String,
      default: undefined,
    },

    /**
     * Input schema
     */
    schema: {
      type: Object,
      default: () => ({}),
    },

    /**
     * If this input has a cell type
     */
    cell: {
      type: Boolean,
      default: false,
    },

    /**
     * Value when the input is empty
     */
    emptyValue: {
      type: [Number, String],
      default: '',
      required: false,
    },

    /**
     * v-model value.
     */
    value: {
      type: [Number, String],
      default: 0,
      required: true,
    },

    /**
     * Hide input and show value in text only.
     */
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Autofocus on input.
     */
    autofocus: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Status of the input
     */
    status: {
      type: String,
    },

    place: {},
    width: {},
    height: {},
    padding: {},
  },

  data: () => ({
    amount: '',
    separator: ',',
    thousandSeparatorSymbol: ',',
    decimalSeparatorSymbol: '.',
    outputType: 'Number',
  }),

  computed: {
    /**
     * Number type of formatted value.
     * @return {Number}
     */
    amountNumber() {
      return this.unformat(this.amount);
    },

    /**
     * Number type of value props.
     * @return {Number}
     */
    valueNumber() {
      return this.unformat(this.value);
    },

    /**
     * Define format position for currency symbol and value.
     * @return {{zero: string, neg: string, pos: string}|String} format
     */
    symbolPosition() {
      if (!this.currency) return '%s%v';

      return { pos: '%s%v', neg: '-%s%v', zero: '%s0' };
    },

    /**
     * Currency symbol.
     */
    currency() {
      return this.schema.unit === 'currency' ? '$' : '';
    },

    /**
     * Number of decimals.
     * Decimals symbol are the opposite of separator symbol.
     */
    precision() {
      return this.schema.precision != null ? this.schema.precision : 2;
    },

    /**
     * Maximum value allowed.
     */
    max() {
      return this.schema.max != null
        ? this.schema.max
        : Number.MAX_SAFE_INTEGER || 9007199254740991;
    },

    /**
     * Minimum value allowed.
     */
    min() {
      return this.schema.min != null
        ? this.schema.min
        : Number.MIN_SAFE_INTEGER || -9007199254740991;
    },
  },

  watch: {
    /**
     * Watch for value change from other input with same v-model.
     * @param {Number} newValue
     */
    valueNumber(newValue) {
      if (this.$refs.root !== document.activeElement) {
        this.amount = this.format(newValue);
      }
    },

    /**
     * Immediately reflect precision changes
     */
    precision() {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);
    },

    '$i18n.locale': function onLocaleChange() {
      this.onBlurHandler();
    },
  },

  mounted() {
    // Set default value props when placeholder undefined.
    // if (!this.placeholder) {
    this.process(this.valueNumber);
    this.amount = this.format(this.valueNumber);
    // }
  },

  methods: {
    /**
     * Modify amount
     * @param {Number} inc
     */
    modify(inc) {
      const newValue = this.value + inc;

      if (newValue < this.min || newValue > this.max) return;

      this.update(newValue);
      setTimeout(() => {
        this.amount = this.format(this.valueNumber);
      }, 0);
    },
    /**
     * Handle blur event.
     * @param {Object} [e]
     */
    onBlurHandler(e) {
      if (e) {
        this.$emit('blur', e);
      }

      this.amount = this.format(this.valueNumber);
    },

    /**
     * Handle focus event.
     * @param {Object} e
     */
    onFocusHandler(e) {
      this.$emit('focus', e);

      if (this.valueNumber === 0) {
        this.amount = null;
      } else {
        // this.amount = formatNumericField(this.valueNumber, this.schema);
        this.amount = this.valueNumber;
      }

      setTimeout(() => {
        // somehow absence of this condition triggers rare error in production
        if (this.$refs.root) {
          this.$refs.root.select();
        }
      });
    },

    /**
     * Handle input event.
     */
    onInputHandler() {
      this.process(this.amountNumber);
    },

    /**
     * Handle ENTER key
     */
    onKeyDownHandler(evt) {
      if (evt.key === 'ArrowUp') {
        evt.preventDefault();
        evt.stopPropagation();
        this.modify(1);
      } else if (evt.key === 'ArrowDown') {
        evt.preventDefault();
        evt.stopPropagation();
        this.modify(-1);
      } else if (evt.key.length === 1 && !ALLOWED_KEYS.includes(evt.key)) {
        evt.preventDefault();
      } else if (evt.which === 13) {
        setTimeout(() => this.$refs.root && this.$refs.root.blur(), 0);
      }
    },

    /**
     * Validate value before update the component.
     * @param {Number} value
     */
    process(value) {
      if (value >= this.max) this.update(this.max);
      if (value <= this.min) this.update(this.min);
      if (value > this.min && value < this.max) this.update(value);
    },

    /**
     * Update parent component model value.
     * @param {Number} value
     */
    update(value) {
      const fixedValue = accounting.toFixed(value, this.precision);
      const output = this.outputType.toLowerCase() === 'string' ? fixedValue : Number(fixedValue);

      if (this.value !== output) {
        this.$emit('input', output);
      }
    },

    /**
     * Format value using symbol and separator.
     * @param {Number} value
     * @return {String}
     */
    format(value) {
      return formatNumericField(value, this.schema);
    },

    /**
     * Remove symbol and separator.
     * @param {Number} value
     * @return {Number}
     */
    unformat(value) {
      const toUnformat = typeof value === 'string' && value === '' ? this.emptyValue : value;

      return accounting.unformat(toUnformat, this.decimalSeparatorSymbol) || 0;
    },
  },
};
</script>
