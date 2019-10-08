import Vue from 'vue';
import i18n from '@/i18n';
import markdown from '@/helpers/markdown';

/**
 * @param {HTMLElement} el
 * @param binding
 */
function update(el, binding) {
  const id = binding.value;

  const content = i18n.te(id) ? i18n.t(id) : id;

  /* eslint-disable no-param-reassign */
  el.innerHTML = markdown(content || '');
}

Vue.directive('markdown', {
  bind: update,
  update,
});
