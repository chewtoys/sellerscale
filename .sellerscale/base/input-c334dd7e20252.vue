<template>
  <nu-input
    class="mi-input"
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
    :name="name"
    :theme="theme"
    :radius="radius">
    <input
      ref="root"
      :id="id"
      @input="onChange"
      @blur="onBlur"
      @focus="onFocus"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :maxlength="maxLength"
      :list="list"
      :value="value"
      :type="type">
  </nu-input>
</template>

<script>
export default {
  name: 'mi-input',
  props: {
    id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      require: true,
    },
    list: {
      type: String,
    },
    value: {
      required: true,
    },
    type: {
      value: String,
      validator: val => ['text', 'email', 'url', 'tel', 'password', 'numeric'].includes(val),
      default: 'text',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '...',
    },
    status: {
      type: String,
    },
    maxLength: {},
    autofocus: {
      type: Boolean,
      default: false,
    },
    cell: Boolean,
    place: {},
    width: {},
    height: {},
    padding: {},
    theme: {},
    radius: {},
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
    onChange(evt) {
      if (typeof evt === 'string') {
        this.$emit('input', evt);
      } else {
        this.$emit('input', evt.target.value);
      }
    },
    onBlur(evt) {
      this.$emit('blur', evt.target.value);
    },
    onFocus(evt) {
      this.$emit('focus', evt.target.value);
    },
    focus() {
      this.$refs.root.focus();
    },
    putCursorAtEnd() {
      const len = this.$refs.root.value.length;

      setTimeout(() => this.$refs.root.setSelectionRange(len, len), 0);
    },
  },
};
</script>

<style>
.mi-input.-error {
  --nu-theme-border-color: var(--nu-danger-color);
}

.mi-input.-error[nu-focus] {
  --nu-theme-special-color: var(--nu-danger-focus-color);
}

.mi-input.-success {
  --nu-theme-border-color: var(--nu-success-color);
}

.mi-input.-success[nu-focus] {
  --nu-theme-special-color: var(--nu-success-focus-color);
}

.mi-input:hover:not([nu-focus]):not(:focus-within):not([disabled]) {
  background-color: var(--nu-theme-hover-color);
}
</style>
