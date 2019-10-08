<template>
  <nu-input
    class="mi-input"
    :class="{
      '-nu-cell': cell,
    }"
    :place="place"
    :width="width"
    :height="height"
    :padding="padding"
    :disabled="disabled"
    :autofocus="autofocus"
    :placeholder="placeholder"
    :maxlength="maxLength"
    :name="name"
    :theme="theme"
    :radius="radius"
    items="center"
    gap="0"
    columns="2.5rem 1fr 2.5rem">
    <nu-icon name="search" size="1.25"></nu-icon>
    <input
      ref="root"
      :id="id"
      @input="onChange"
      @blur="onBlur"
      @focus="onFocus"
      @keydown="onKeyDown"
      maxlength="64"
      :list="list"
      :value="value"
      :type="type">
    <nu-btn v-if="value" cursor="pointer" @tap="clear" padding="0" cell radius="0 * * 0">
      <nu-icon name="x" size="1.25" theme="danger"></nu-icon>
    </nu-btn>
  </nu-input>
</template>

<script>
import MiInput from '@/base/input.vue';

export default {
  name: 'mi-search',

  extends: MiInput,

  methods: {
    onKeyDown(evt) {
      if (evt.key === 'Escape') {
        this.clear();
        this.$refs.root.blur();
      }
    },
    clear() {
      this.onChange('');
      this.$emit('clear');
    },
  },
};
</script>
