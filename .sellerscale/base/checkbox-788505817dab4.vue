<template>
  <component
    :is="label === false ? 'div' : 'label'"
    class="mi-checkbox"
    :class="{
      '-cell': cell,
      '-disabled': disabled,
    }"
    :style="`--checkbox-size: ${sizeRem};`"
    @click="onClick"
    @keydown="onKeyDown">
    <input
      :id="id"
      class="mi-checkbox-input"
      type="checkbox"
      :checked="value"
      :disabled="disabled"
      @change="toggleValue">
    <span class="mi-checkbox-checkmark">
      <nu-icon
        class="mi-checkbox-icon -checked"
        v-if="value === true"
        :name="icon ? icon : 'check'" :size="size"/>
      <nu-icon
        class="mi-checkbox-icon -unchecked"
        v-if="value === false"
        :name="icon ? icon : 'check'" :size="size"/>
      <nu-icon
        class="mi-checkbox-icon -intermediate"
        v-if="value == null"
        name="minus" :size="size"/>
    </span>
    <span class="mi-checkbox-label" v-if="label">{{ label }}</span>
  </component>
</template>

<script>
import { unitMapper } from '@/helpers/props';

export default {
  name: 'mi-checkbox',
  props: {
    id: {},
    value: {},
    label: {},
    cell: Boolean,
    disabled: Boolean,
    icon: {},
    size: {
      default: 1,
    },
  },
  inject: {
    cellContext: {
      name: 'cellContext',
      default: false,
    },
  },
  created() {
    if (this.cellContext && this.cell) {
      this.cellContext.setPadding(0);
    }
  },
  methods: {
    toggleValue() {
      if (this.disabled) return;

      this.$emit('input', !this.value);
    },
    onClick() {
      if (this.label) return;

      this.toggleValue();
    },
    onKeyDown(evt) {
      if (this.label) return;

      if (evt.which === 13) {
        this.toggleValue();
      }
    },
  },
  computed: {
    ...unitMapper(['size']),
  },
};
</script>

<style scoped>
.mi-checkbox {
  --checkbox-size: 1rem;

  display: inline-grid;
  grid-auto-flow: column;
  place-content: center;
  place-items: center;
}

.mi-checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  -webkit-appearance: none;
}

.mi-checkbox-checkmark {
  position: relative;
  overflow: hidden;
  display: block;
  width: 1rem;
  height: 1rem;
  line-height: 1;
  border-radius: var(--small-border-radius);
  border: var(--nu-pixel) solid var(--nu-default-border-color);
  background-color: var(--nu-default-background-color);
  transition: border-color var(--nu-theme-animation-time) linear,
    box-shadow var(--nu-theme-animation-time) linear;
}

.mi-checkbox-checkmark:not(:last-child) {
  margin-right: .5rem;
}

.mi-checkbox-checkmark:last-child {
  margin-right: 0;
}

.mi-checkbox-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: opacity var(--nu-theme-animation-time) linear;
}

.mi-checkbox-icon.-unchecked {
  opacity: 0;
}

.mi-checkbox-label {
  place-self: center start;
  white-space: nowrap;
}

.mi-checkbox:hover:not(.-disabled) .mi-checkbox-checkmark {
  background-color: var(--nu-minor-background-color);
}

.mi-checkbox-input:focus ~ .mi-checkbox-checkmark {
  box-shadow: 0 0 0 calc(1rem / 8) var(--nu-default-focus-color);
}

.mi-checkbox.-disabled .mi-checkbox-checkmark {
  opacity: .5;
}

.mi-checkbox.-cell {
  box-shadow: 0 0 0 0 transparent inset;
  transition: box-shadow var(--nu-theme-animation-time) linear;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.mi-checkbox.-cell .mi-checkbox-checkmark {
  border: none;
  border-radius: 0;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  background: transparent;
}

.mi-checkbox.-cell:hover .mi-checkbox-checkmark {
  background-color: transparent;
}

.mi-checkbox.-cell .mi-checkbox-input:focus
  ~ .mi-checkbox-checkmark > .mi-checkbox-icon.-unchecked,
.mi-checkbox.-cell .mi-checkbox-input:hover
  ~ .mi-checkbox-checkmark > .mi-checkbox-icon.-unchecked{
  opacity: .2;
}

.mi-checkbox.-cell:focus-within {
  box-shadow: 0 calc(-1rem / 32) 0 calc(1rem / 4) var(--nu-theme-focus-color) inset;
}

.mi-checkbox.-cell .mi-checkbox-input:focus ~ .mi-checkbox-checkmark {
  outline: none;
  box-shadow: 0 0 0 0 transparent inset;
}

.mi-checkbox.-disabled .mi-checkbox-label {
  opacity: .5;
}
</style>
