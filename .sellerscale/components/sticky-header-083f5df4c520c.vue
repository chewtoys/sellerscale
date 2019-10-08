<template>
  <nu-grid
    class="sticky-header -nu-bg-body"
    :gap="gap || 1"
    :padding="padding || '1 1 1 1'"
    :columns="cols || 'auto auto'"
    :content="content || 'stretch space-between'"
    :space="space || '1 1 0 1'"
    border="bottom">
    <slot></slot>
  </nu-grid>
</template>

<script>
import MiPanel from '@/base/panel.vue';

export default {
  name: 'sticky-header',
  props: {
    padding: {},
    cols: {},
    content: {},
    space: {},
    gap: {},
  },
};
</script>

<style>
.sticky-header {
  position: sticky;
  top: 0;
  box-shadow: 0 0 1rem .5rem var(--nu-body-background-color);
  z-index: 99;
}
</style>
