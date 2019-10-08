<template>
  <div
    ref="root"
    class="mi-cell-input"
    :class="{
      '-dropdown': isDropdown,
      '-disabled': disabled,
      '-warning': hasWarning,
      '-inside': inside,
    }"
    @keydown="onRootKeydown"
    @click="onClick"
    @touchstart="onTouchStart"
    @dblclick="transferFocus"
    v-tooltip="fullFormattedTime"
    :title="name"
    :tabindex="inside || disabled || isDropdown ? undefined : 0">
    <MiInputNumeric
      cell
      ref="input"
      v-if="schema.unit !== 'time' && !disabled && !isDropdown && inside"
      :disabled="!inside"
      :schema="schema"
      @keydown="onRootKeydown"
      @blur="onBlur"
      padding=".75 0"
      v-model="currentValue">
    </MiInputNumeric>
    <MiDropdown
      cell
      plain
      padding=".75 .5"
      v-else-if="isDropdown"
      popupWidth="26"
      style="--color: var(--nu-minor-color);">
      <template v-slot:default="{ open }">
        <nu-grid mod="center">{{ formattedValue }}</nu-grid>
        <MiDropdownIcon :value="open" size="1" class="dropdown-icon"/>
      </template>
      <template v-slot:content>
        <nu-grid padding="1" gap=".5" mod="sm" style="line-height: 1rem;">
          <nu-grid
            v-for="cost in objectToList(product.data.otherFeesList, 0.1)"
            :key="cost.id"
            columns="auto 1fr auto">
            <nu-grid v-t="`product.otherFees.${cost.id}`"></nu-grid>
            <nu-grid
              style="border-bottom: var(--nu-pixel) dotted var(--border-color);
                margin-bottom: .5em">
            </nu-grid>
            <nu-grid mod="w6">
              {{ formatNumeric(cost.value, '$', 2) }}
            </nu-grid>
          </nu-grid>
        </nu-grid>
      </template>
    </MiDropdown>
    <span
      class="mi-cell-input-value"
      v-else v-text="formattedValue"></span>
    <nu-block
      class="mi-cell-input-shift"
      :class="{
        '-negative': valueShift < 0,
      }"
      mod="xxs"
      radius=".5br"
      v-if="valueShift && valueShiftFormatted"
      v-html="valueShiftFormatted">
    </nu-block>
  </div>
</template>

<script>
import {
  differenceInTime, formatNumericField, formatNumeric, objectToList,
} from '@/util';
import { clearSelection } from '@/services/window';
import Analytics from '@/services/analytics';

export default {
  name: 'mi-cell-input',
  props: {
    id: String,
    name: String,
    value: {},
    schema: {
      type: Object,
      default: () => ({ unit: 'unit' }),
    },
    shift: Boolean,
    invertShift: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    product: {},
  },
  data() {
    return {
      currentDisabled: true,
      currentValue: undefined,
      inside: false,
    };
  },
  inject: {
    cellContext: {
      name: 'cellContext',
      default: false,
    },
  },
  created() {
    if (this.cellContext) {
      this.cellContext.setPadding(0);
    }
  },
  mounted() {
    this.currentValue = this.value;

    this.$watch('value', (value) => {
      if (this.currentValue !== value) {
        this.currentValue = value;
      }
    });

    // this.$watch('currentValue', (value) => {
    //   if (!this.disabled && this.value !== value) {
    //     this.$emit('input', value);
    //     this.$emit('update');
    //   }
    // });
  },
  computed: {
    symbol() {
      return this.schema.prefix || this.suffix || '';
    },
    suffix() {
      return this.$te(`input_unit.${this.schema.unit}`)
        ? this.$t(`input_unit.${this.schema.unit}`)
        : (this.schema.suffix || '');
    },
    position() {
      return this.schema.prefix ? 'prefix' : 'suffix';
    },
    disabledComputed() {
      return this.disabled || this.currentDisabled;
    },
    formattedValue() {
      if (this.schema.unit === 'time') {
        return this.formattedTime;
      }

      return formatNumericField(this.currentValue, this.schema);
    },
    formattedTime() {
      return differenceInTime(this.value) || 'Never';
    },
    fullFormattedTime() {
      if (this.schema.unit !== 'time') return '';

      if (!this.value) return '';

      const diff = differenceInTime(this.value, true);

      return `<span class="-nu-nowrap">
        ${diff.years ? `${this.$tc('label.years', diff.years)} ` : ''}
        ${diff.months ? `${this.$tc('label.months', diff.months)} ` : ''}
        ${diff.days ? this.$tc('label.days', diff.days) : ''}
      </span>`;
    },
    isDropdown() {
      return this.schema.type === 'dropdown'
        && this.schema.editable !== true
        && objectToList(this.product.data.otherFeesList, 0.1).length;
    },
    valueShift() {
      if (!this.shift) return 0;

      const shift = this.product.dataShift[this.id];

      if (!this.product.dataShift[this.id]) return 0;

      if (this.schema.unit === 'time') {
        return -shift;
      }

      return shift;
    },
    valueShiftFormatted() {
      const shift = this.valueShift;

      const formattedValue = this.schema.unit === 'time'
        ? differenceInTime(Math.abs(shift))
        : formatNumericField(Math.abs(shift), this.schema);

      if (!formattedValue) return '';

      const icon = (shift > 0 && !this.invertShift) || (shift < 0 && this.invertShift) ? 'arrow-up' : 'arrow-down';

      return `<nu-icon name="${icon}" size=".75"></nu-icon> ${formattedValue}`;
    },
    hasWarning() {
      return (this.id === 'productCost' || this.id === 'shippingCost') && !this.value;
    },
  },
  methods: {
    transferFocus() {
      if (this.isDropdown) return;

      this.inside = true;

      this.$nextTick(() => {
        const input = this.$refs.input;

        if (input) input.focus();
      });
    },
    restoreFocus() {
      this.inside = false;

      this.$nextTick(() => {
        this.$refs.root.focus();
        clearSelection();

        if (this.currentValue !== this.value) {
          Analytics.event('unit:update-cell', {
            id: this.name,
            value: this.currentValue,
          });

          this.$emit('input', this.currentValue);
          this.$emit('update');
        }
      });
    },
    onChange() {

    },
    onBlur() {
      this.restoreFocus();
    },
    toggleInside() {
      if (!this.inside) {
        this.transferFocus();
      } else {
        this.restoreFocus();
      }
    },
    onRootKeydown(evt) {
      if (this.isDropdown) return;

      if (((evt.key >= 0 && evt.key < 10) || evt.key === '.') && !this.inside) {
        this.currentValue = evt.key;
        this.toggleInside();

        evt.preventDefault();

        this.$nextTick(() => {
          const input = this.$refs.input;

          input.amount = evt.key;
          input.putCursorAtEnd();
        });

        return;
      }

      if (evt.which === 13) {
        this.toggleInside();

        evt.preventDefault();
        evt.stopPropagation();

        return;
      }

      if (evt.which === 9 && this.inside) {
        this.restoreFocus();
      }

      if (evt.which === 27 && this.inside) {
        this.currentValue = this.value;
        this.restoreFocus();
      }
    },
    onTouchStart(evt) {
      this.transferFocus();

      evt.preventDefault();
    },
    onClick() {
      if (document.activeElement !== this.$refs.root) return;

      clearSelection();
    },
    formatNumeric,
    objectToList,
  },
};
</script>

<style scoped>
.mi-cell-input {
  display: grid;
  place-content: stretch;
  place-self: stretch;
  transition: box-shadow var(--nu-theme-animation-time) linear;
  cursor: default;
}

.mi-cell-input.-inside {
  cursor: text;
}

.mi-cell-input.-warning {
  box-shadow: 0 0 0 calc(1rem / 8) var(--nu-danger-focus-color) inset;
}

.mi-cell-input.-dropdown {
  background-color: var(--nu-default-background-color);
}

.mi-cell-input-value {
  place-self: center;
  color: var(--nu-minor-color);
  padding: .75rem 0;
  white-space: nowrap;
}

.dropdown-icon {
  position: absolute;
  right: var(--nu-pixel);
  top: 50%;
  transform: translate(0, -50%);
}

.mi-cell-input:focus {
  outline: none;
  box-shadow: 0 0 0 calc(1rem / 8) var(--nu-primary-color) inset;
}

.mi-cell-input >>> .mi-input > input, .mi-cell-input:not(.-disabled) >>> .mi-cell-input-value {
  color: var(--nu-theme-color) !important;
  -webkit-text-fill-color: var(--nu-theme-color) !important;
}

.mi-cell-input-shift {
  position: absolute;
  top: calc(1rem * -0.25 - var(--nu-pixel));
  left: 50%;
  transform: translate(-50%, 0);
  padding: var(--nu-pixel) .5em;
  color: var(--nu-theme-background-color);
  font-weight: 600;
  background: var(--nu-success-color);
  white-space: nowrap;
}

.mi-cell-input-shift > nu-icon {
  bottom: .3rem;
}

.mi-cell-input-shift.-negative {
  background: var(--nu-danger-color);
}

</style>
