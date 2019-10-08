<template>
  <div
    class="mi-autocomplete-input"
    v-focus-outside="onBlur"
    v-click-outside="onBlur">
    <MiInput
      :id="id"
      :name="name"
      :value="value"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :status="status"
      :autofocus="autofocus"
      :cell="cell"
      @focus.native="onFocus"
      @input="onInput"
      autocomplete="off"
      style="padding-right: 1.5rem;"
    />
    <MiDropdownIcon
      class="mi-autocomplete-input-icon" :value="focused && !!filteredOptions.length"/>
    <transition name="fade">
      <MiPopup
        v-if="focused && !!filteredOptions.length"
        :position="drop === 'up' ? 'top' : 'bottom'">
        <nu-menu class="mi-autocomplete-input-options">
          <nu-menuitem
            v-for="option in filteredOptions"
            :key="option"
            @tap="selectValue(option)">
            {{ option }}
          </nu-menuitem>
        </nu-menu>
      </MiPopup>
    </transition>
  </div>
</template>

<script>
import MiInput from './input.vue';

export default {
  name: 'mi-autocomplete-input',
  props: {
    ...MiInput.props,
    options: {
      default: [],
    },
    drop: {
      type: String,
      default: 'down',
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      setTimeout(() => {
        this.focused = false;
      }, 100);
    },
    onInput($event) {
      this.$emit('input', $event);
    },
    selectValue(value) {
      this.onInput(value);

      this.focused = false;
    },
  },
  computed: {
    filteredOptions() {
      if (!this.value) return [...this.options];

      return this.options.filter(
        option => option.startsWith(this.value) && option.length !== this.value.length,
      );
    },
  },
};
</script>

<style scoped>
.mi-autocomplete-input {
  display: grid;
  place-content: stretch;
  place-self: stretch;
}

.mi-autocomplete-input-icon {
  position: absolute !important;
  right: .5rem;
  top: 0;
  bottom: 0;
}

.mi-autocomplete-input-options {
  display: grid;
  grid-template-columns: 1fr;
  overflow-y: auto;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  border: var(--nu-pixel) solid var(--border-color);
  overflow-x: hidden;
  box-shadow: var(--card-shadow);
  box-sizing: border-box;
  z-index: 999;
}
</style>
