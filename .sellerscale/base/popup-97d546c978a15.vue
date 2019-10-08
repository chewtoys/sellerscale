<template>
  <div
    ref="root"
    class="mi-popup"
    role="popup"
    :style="{
      width: widthRem,
    }">
    <div
      class="mi-popup-inner"
      :class="{
        '-up': position === 'top',
        '-down' : position === 'bottom',
      }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import Logdown from 'logdown';
import { unitMapper } from '@/helpers/props';

const LISTEN_EVENTS = ['scroll', 'resize', 'wheel', 'touchmove'];
const logger = new Logdown('app.popup');

function setPosition(popup, el, position, sticky) {
  logger.info('set position');

  const rect = el.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  const max = document.body.offsetWidth;
  const min = 0;

  if (position === 'bottom') {
    popup.style.top = `${rect.top + rect.height}px`;
  } else if (position === 'top') {
    popup.style.top = `${rect.top - popupRect.height}px`;
  }

  if (sticky === 'left') {
    popup.style.left = `${Math.min(max, Math.max(min, rect.left))}px`;
  } else if (sticky === 'right') {
    popup.style.left = `${Math.min(max, Math.max(min, rect.left - popupRect.width + rect.width))}px`;
  } else if (sticky === 'center') {
    popup.style.left = `${Math.min(max, Math.max(min, rect.left + (rect.width / 2) - (popupRect.width / 2)))}px`;
  } else {
    popup.style.width = `${rect.width}px`;
    popup.style.left = `${rect.left}px`;
  }
}

export default {
  name: 'mi-popup',
  props: {
    position: {
      type: String,
      default: 'bottom',
    },
    sticky: {
      type: String,
    },
    width: {
      default: '21',
    },
  },
  data() {
    return { timerId: null };
  },
  mounted() {
    logger.info('created');

    this.onUpdate = this.onUpdate.bind(this);

    LISTEN_EVENTS.forEach(event => window.addEventListener(event, this.onUpdate));

    this.onUpdate();

    setTimeout(this.onUpdate, 0);
  },
  destroyed() {
    LISTEN_EVENTS.forEach(event => window.removeEventListener(event, this.onUpdate));

    logger.info('destroyed');
  },
  methods: {
    onUpdate() {
      this.setPosition();
    },
    setPosition() {
      if (!this.$refs.root) return;

      setPosition(this.$refs.root, this.$refs.root.parentNode, this.position, this.sticky);
    },
  },
  computed: {
    ...unitMapper(['width']),
  },
};
</script>

<style scoped>
.mi-popup {
  position: fixed;
  z-index: 999;
}

.mi-popup-inner {
  position: absolute;
  min-width: 100%;
}

.mi-popup-inner.-up {
  bottom: 0;
}

.mi-popup-inner.-down {
  top: 0;
}
</style>
