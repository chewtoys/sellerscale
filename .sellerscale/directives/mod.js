import Vue from 'vue';

Vue.directive('mod', {
  /**
   * @param {HTMLElement} el
   * @param binding
   */
  bind(el, binding) {
    if (binding.modifiers) {
      Object.keys(binding.modifiers)
        .forEach((mod) => {
          el.classList.add(`-nu-${mod}`);
        });
    }

    if (binding.value) {
      binding.value.split(' ')
        .forEach(mod => el.classList.add(`-nu-${mod}`));
    }
  },
  update(el, binding) {
    if (binding.oldValue) {
      binding.oldValue.split(' ')
        .forEach(mod => el.classList.remove(`-nu-${mod}`));
    }

    if (binding.value) {
      binding.value.split(' ')
        .forEach(mod => el.classList.add(`-nu-${mod}`));
    }
  },
});
