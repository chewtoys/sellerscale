<template>
  <nu-grid
    role="header"
    content="center"
    theme="default"
    background
    border="bottom outside"
    :style="{
      zIndex: 999,
      position: 'sticky',
    }">
    <nu-grid
      theme="default"
      gap=".5|||0"
      height="4"
      columns="auto 1fr auto"
      items="stretch center"
      width="clamp(initial, 100vw, 1360px)">
      <nu-grid items="center">
        <slot name="brand"></slot>
      </nu-grid>
      <nu-grid role="navigation" gap="1" flow="column">
        <slot name="links"></slot>
      </nu-grid>
      <nu-grid content="stretch" flow="column">
        <slot name="widgets"></slot>
      </nu-grid>
    </nu-grid>
  </nu-grid>
</template>

<script>
export default {
  name: 'navbar',
  created() {

  },
  components: {},
};
</script>
