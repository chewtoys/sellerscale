<template>
  <nu-btn-group
    :name="name"
    :place="place"
    :width="width"
    :height="height"
    :padding="padding">
    <nu-icon
      color="minor" name="dollar-sign" size="1" border radius=".5 0 0 .5" width="2"></nu-icon>
    <nu-input
      class="mi-input-currency mi-input"
      :class="{
      '-nu-no-overflow': true,
      '-error': status === 'error',
      '-success': status === 'success',
    }"
      :disabled="disabled">
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
      padding-left: 0;
      padding-right: 0;
    ">
    </nu-input>
  </nu-btn-group>
</template>

<script>
import MiNumeric from '@/base/input-numeric.vue';

export default {
  name: 'mi-input-currency',

  extends: MiNumeric,
};
</script>

<style scoped>
.mi-input-currency {
  --nu-focus-inset: inset 0 0;
}

/*.spin-buttons {*/
/*  border-left: var(--nu-pixel) solid var(--border-color);*/
/*}*/
</style>
