<template>
  <nu-pane
    class="mi-tabs"
    gap="1"
    :mod="mod"
    :content="content"
    :items="items"
    :padding="`0 ${padding}`">
    <slot></slot>
  </nu-pane>
</template>

<script>
import MiPanel from './panel.vue';

export default {
  name: 'mi-tabs',
  props: {
    ...MiPanel.props,
    value: {},
  },
  provide() {
    return {
      tabsContext: {
        set: value => this.$emit('input', value),
        get: () => this.value,
      },
    };
  },
};
</script>
