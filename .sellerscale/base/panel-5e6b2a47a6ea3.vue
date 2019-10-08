<template>
  <component
    ref="root"
    :is="tagComputed"
    class="mi-panel"
    :role="role"
    :class="modComputed"
    :style="`
      ${propsComputed}
      ${name         ? `grid-area: ${name};` : ''}
      ${col          ? `grid-column: ${col};` : ''}
      ${row          ? `grid-row: ${row};` : ''}
      ${gapRem       ? `gap: ${gapRem};` : ''}
      ${paddingRem   ? `padding: ${paddingRem};` : ''}
      ${place        ? `place-self: ${place};` : ''}
      ${flow         ? `grid-auto-flow: ${flow};` : ''}
      ${areas        ? `grid-template-areas: ${areas};` : ''}
      ${colsRem      ? `grid-template-columns: ${colsRem};` : ''}
      ${rowsRem      ? `grid-template-rows: ${rowsRem};` : ''}
      ${content ? `place-content: ${content};` : ''}
      ${items   ? `place-items: ${items};` : ''}
      ${width        ? `width: ${widthRem};` : ''}
      ${height       ? `height: ${heightRem};` : ''}
      ${theme        ? `color: var(--${theme}-color,var(--${theme}-color));` : ''}
      ${theme        ? `background-color: var(--${theme}-background-color);` : ''}
    `">
    <slot></slot>
  </component>
</template>

<script>
import { unitMapper, modMapper, customPropertiesMapper } from '@/helpers/props';

export default {
  name: 'mi-panel',
  props: {
    name: String,
    tag: String,
    role: String,
    place: String,
    col: String,
    row: String,
    areas: String,
    cols: String,
    rows: String,
    gap: {},
    padding: {},
    flow: String,
    content: String,
    items: String,
    width: String,
    height: String,
    theme: String,
    mod: {},
    props: {
      type: Object,
      default: () => {},
    },
  },
  /**
   * @property {String} paddingRem
   * @property {String} gapRem
   * @property {String} colsRem
   * @property {String} rowsRem
   * @property {String} widthRem
   * @property {String} heightRem
   * @property {String} modComputed
   * @property {String} propsComputed
   */
  computed: {
    ...unitMapper(['gap', 'padding', 'cols', 'rows', 'width', 'height']),
    ...modMapper,
    ...customPropertiesMapper,
    tagComputed() {
      return this.tag || 'div';
    },
  },
};
</script>

<style scoped>
.mi-panel {
  display: grid;
  box-sizing: border-box;
}
</style>
