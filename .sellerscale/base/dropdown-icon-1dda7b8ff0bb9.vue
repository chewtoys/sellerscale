<template>
  <nu-block
    class="dropdown-icon-container -nu-primary"
    :style="{ minWidth: sizeRem }"
    :place="place">
    <nu-icon
      class="mi-dropdown-icon" :class="{ '-open': value }"
      name="chevron-down" :size="size"></nu-icon>
  </nu-block>
</template>

<script>
import { unitMapper } from '@/helpers/props';

export default {
  name: 'mi-dropdown-icon',
  props: {
    value: Boolean,
    size: {
      default: 1.5,
    },
    place: {},
  },
  /**
   * @property {String} sizeRem
   */
  computed: {
    ...unitMapper(['size']),
  },
};
</script>

<style scoped>
.dropdown-icon-container {
  display: grid;
  position: relative;
  place-self: center;
}

.mi-dropdown-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1, 1);
  transition: transform var(--nu-theme-animation-time) linear;
}

.mi-dropdown-icon.-open {
  transform: translate(-50%, -50%) scale(1, -1);
}
</style>
