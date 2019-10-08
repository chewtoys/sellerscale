<template>
  <div
    :class="{
      'mi-disabled': true,
      '-off': off,
    }">
    <div class="mi-disabled-content">
      <slot name="default"></slot>
    </div>
    <div class="mi-disabled-overlay"></div>
    <div class="mi-disabled-notice">
      <slot name="disclaimer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mi-disabled',
  props: {
    off: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.mi-disabled {
  position: relative;
}

.mi-disabled-content {
  transition: opacity var(--nu-theme-animation-time) linear;
  opacity: .33;
}

.mi-disabled-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: block;
  /*z-index: 1;*/
}

.mi-disabled.-off {
  opacity: 1;
}

.mi-disabled.-off .mi-disabled-overlay {
  display: none;
}

.mi-disabled.-off .mi-disabled-content {
  opacity: 1;
}

.mi-disabled-notice {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 1;
  pointer-events: auto;
  transition: opacity var(--normal-animation-time) linear;
  display: grid;
  place-content: center;
}

.mi-disabled.-off .mi-disabled-notice {
  opacity: 0;
  pointer-events: none;
}
</style>
