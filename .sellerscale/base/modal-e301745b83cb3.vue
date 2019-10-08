<template>
  <Trap :disabled="!shown" class="trap">
    <nu-grid
      class="mi-modal"
      content="center"
      items="start center" v-if="shown">
      <nu-card
        class="mi-modal-card"
        :width="width"
        :height="height"
        padding="0" shadow border>
        <slot :resolve="resolve" :reject="reject"></slot>
      </nu-card>
    </nu-grid>
  </Trap>
</template>

<script>
import Trap from 'vue-focus-lock';
import { scrollBlock } from '@/services/window';

export default {
  name: 'mi-modal',
  props: {
    width: {
      default: 30,
    },
    height: {},
  },
  data() {
    return {
      resolve: null,
      reject: null,
      shown: false,
    };
  },
  methods: {
    open() {
      this.show();

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      }).finally(() => {
        this.hide();
      });
    },
    show() {
      this.shown = true;
      scrollBlock(true);
    },
    hide() {
      this.shown = false;
      scrollBlock(false);
    },
  },
  /**
   * @property widthRem
   * @property heightRem
   */
  components: {
    Trap,
  },
};
</script>

<style scoped>
.mi-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  max-height: 100%;
  overflow: auto;
  padding: 1rem;
}

.mi-modal-card {
  margin: 1rem 0;
}

.trap {
  position: fixed;
  z-index: 999;
}
</style>
