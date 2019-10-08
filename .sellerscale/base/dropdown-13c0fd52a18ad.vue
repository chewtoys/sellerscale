<template>
  <nu-btn
    class="mi-dropdown"
    ref="selected"
    :cell="cell"
    :theme="theme"
    @tap="toggle"
    :pressed="open"
    :border="border"
    :basis="basis"
    :disabled="disabled"
    :padding="padding ? paddingRem : '.75 0'"
    content="center stretch"
    place="stretch"
    :columns="plain ? '' : '1fr 1'"
    gap=".5em"
    items="stretch"
    v-focus-outside="close"
    v-click-outside="close"
    :style="`${open ? 'z-index: 2;' : ''}${!plain ? 'padding-right: .5em !important;' : ''}`">
    <nu-block
      mod="ellipsis" v-if="!plain || hasSlot()">
      <slot name="default" :open="open" :close="close"></slot>
    </nu-block>
    <MiDropdownIcon v-if="!plain" :value="open" size="1.5em"/>
    <MiPopup
      v-if="open"
      :position="drop === 'up' ? 'top' : 'bottom'"
      :width="popupWidth"
      :sticky="sticky || (popupWidth ? 'center' : undefined)"
      @click.native="stopEvent"
      @mousedown.native="stopEvent"
      @keydown.native="stopEvent"
      @tap.native="stopEvent">
      <nu-card
        class="mi-dropdown-content"
        shadow
        border
        gap="0"
        padding="0"
        mod="wrap"
        ref="content"
        :style="{ maxHeight: maxHeightRem }">
        <nu-block mod="no-overflow" radius="calc(1br - 1bw)">
          <nu-flex flow="column">
            <slot name="content" :open="open"></slot>
          </nu-flex>
        </nu-block>
        <nu-scroll></nu-scroll>
      </nu-card>
    </MiPopup>
  </nu-btn>
</template>

<script>
import { unitMapper } from '@/helpers/props';
import { hasSlot } from '@/util';

export default {
  name: 'mi-dropdown',
  props: {
    maxHeight: {},
    popupWidth: {},
    drop: {
      type: String,
      default: 'down',
    },
    theme: String,
    padding: {
      default: '.5em',
    },
    sticky: String,
    plain: Boolean,
    icon: String,
    iconSize: {},
    placeIcon: String,
    type: String,
    cell: Boolean,
    disabled: Boolean,
    basis: {},
    depth: {},
    border: {},
  },
  data() {
    return {
      open: false,
    };
  },
  provide() {
    return {
      dropdownContext: {
        close: () => this.close(),
      },
    };
  },
  mounted() {
    this.$watch('open', (open) => {
      if (open) {
        this.$refs.content.scrollTop = 0;
      }
    });
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
    hasSlot,
    stopEvent(evt) {
      if (!evt.key && evt.key !== 'Enter') {
        evt.stopPropagation();
      }
    },
  },
  computed: {
    ...unitMapper(['height', 'popupWidth', 'maxHeight', 'padding']),
  },
  /* close MiSelect if navigation triggered */
  watch: {
    $route() {
      this.close();
    },
  },
};
</script>

<style scoped>
.mi-dropdown {
  /*z-index: unset !important;*/
}

.mi-dropdown-content {
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 9999;
  cursor: default;
}
</style>
