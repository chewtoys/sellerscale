import Vue from 'vue';

Vue.directive('fixate', {
  /**
   * @param {HTMLElement} el
   * @param binding
   */
  bind(el, bindings) {
    setTimeout(() => {
      const styles = window.getComputedStyle(el);
      const fixHeight = bindings.modifiers.height || !Object.keys(bindings.modifiers).length;
      const fixWidth = bindings.modifiers.width || !Object.keys(bindings.modifiers).length;

      if (fixHeight) {
        Object.assign(el.style, {
          minHeight: styles.height,
          maxHeight: styles.height,
        });
      }

      if (fixWidth) {
        Object.assign(el.style, {
          minWidth: styles.width,
          maxWidth: styles.width,
        });
      }
    }, 0);
  },
});
