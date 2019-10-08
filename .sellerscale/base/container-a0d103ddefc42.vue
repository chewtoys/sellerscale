<template>
  <nu-flow
    class="mi-container"
    :padding="padding ? padding : '0 1'"
    :width="width || (narrow ? 'clamp(320px, 100vw, 980px)' : 'clamp(320px, 100vw, 1360px)')"
    :mod="`${mod} center-block`"
    gap="1">
    <slot></slot>
  </nu-flow>
</template>

<script>
export default {
  name: 'mi-container',
  props: {
    mod: {
      default: '',
    },
    width: {},
    narrow: Boolean,
    padding: {},
  },
};
</script>
