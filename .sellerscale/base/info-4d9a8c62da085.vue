<template>
  <nu-icon
    class="info-icon"
    :class="{
      '-cell': cellContext,
      [`-nu-${theme}`]: true,
    }"
    name="info"
    inline
    :size="cellContext ? .75 : '1em'"></nu-icon>
</template>

<script>
export default {
  name: 'mi-info',
  props: {
    // tooltip text
    label: String,
    // color theme
    theme: {
      type: String,
      default: 'primary',
    },
  },
  inject: {
    cellContext: {
      name: 'cellContext',
      default: false,
    },
  },
};
</script>

<style scoped>
.info-icon {
  position: relative;
  border-radius: 50%;
  cursor: help;
  top: calc(var(--nu-pixel) * -1);
  max-width: 1.25rem;
}

.info-icon.-cell {
  position: absolute;
  top: var(--nu-pixel);
  right: var(--nu-pixel);
  max-width: .75rem;
  max-height: .75rem;
}
</style>
