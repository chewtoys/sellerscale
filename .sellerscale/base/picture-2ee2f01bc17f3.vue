<template>
  <picture
      :style="{
        '--max-image-width': maxWidthRem,
        '--min-image-width': minWidthRem,
        '--image-width': widthRem,
        '--image-height': heightRem,
        '--image-object-fit': fit,
        margin: marginRem,
      }">
    <slot></slot>
  </picture>
</template>

<script>
import { unitMapper } from '@/helpers/props';

export default {
  name: 'mi-picture',
  props: {
    maxWidth: {},
    minWidth: {},
    width: {
      default: '100%',
    },
    height: {},
    margin: {},
    fit: {
      type: String,
      validator: val => ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(val),
      default: 'contain',
    },
  },
  computed: {
    ...unitMapper(['maxWidth', 'minWidth', 'width', 'height', 'margin']),
  },
};
</script>

<style scoped>
picture {
  display: inline-grid;
  width: 100%;
  max-height: var(--image-height);
  overflow: hidden;
}

picture img {
  display: block;
  max-width: var(--max-image-width);
  min-width: var(--min-image-width);
  width: var(--image-width);
  height: var(--image-height);
  object-fit: var(--image-object-fit);
  vertical-align: middle;
  position: relative;
  top: -.125rem;
  border-radius: calc(var(--nu-pixel) * 2);
}
</style>
