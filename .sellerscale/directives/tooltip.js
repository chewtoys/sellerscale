/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Logdown from 'logdown';
// eslint-disable-next-line
import '@/numl/numl.dev';
import { getCustomProperty, convertThemeToStyles } from '@/helpers/props';
import GlobalEvents from '@/services/global-events';

const logger = new Logdown('app.tooltip');
const body = document.body;
const Nude = window.Nude;

let TIMER = 250;
let element;
let tooltipEl;

setTimeout(() => {
  TIMER = (parseFloat(getCustomProperty(body, '--nu-theme-animation-time')) * 1000)
    + (1000 / 60);
}, 0);

const POSITIONS = ['left', 'top', 'right', 'bottom'];

const tooltipStyles = theme => (`
  position: absolute;
  padding: .5rem;
  font-size: .75rem;
  min-width: min-content;
  max-width: 22rem;
  box-sizing: border-box;
  line-height: 1.5;
  white-space: normal;
  transform: translate(-50%, -50%);
  border-radius: var(--nu-theme-border-radius);
  background-color: var(--nu-theme-background-color);
  z-index: 1000;
  opacity: 0;
  color: var(--nu-theme-color);
  transition: opacity var(--nu-theme-animation-time) linear;
  text-align: left;
  pointer-events: none;
  border: var(--nu-pixel) solid rgba(0, 0, 0, .05);
`);

function extractData(el) {
  return {
    text: el.dataset.tooltip,
    position: el.dataset.tooltipPosition || 'top',
    theme: el.dataset.tooltipTheme,
  };
}

function removeTooltip() {
  if (!tooltipEl) return;

  logger.info('destroyed');

  Nude.getElementById('root').removeChild(tooltipEl);

  tooltipEl = null;
}

function createTooltip() {
  removeTooltip();

  logger.info('created');

  const { text, theme } = extractData(element);

  tooltipEl = document.createElement('nu-block');

  tooltipEl.classList.add('mi-tooltip');

  tooltipEl.setAttribute('role', 'tooltip');

  tooltipEl.setAttribute('style', tooltipStyles(theme));
  tooltipEl.setAttribute('theme', theme || 'details');
  tooltipEl.setAttribute('shadow', '');

  tooltipEl.innerHTML = text;

  Nude.getElementById('root').appendChild(tooltipEl);
}

/**
 * @param {HTMLElement} el
 * @param binding
 */
function update(el, binding) {
  const tooltipTheme = Object.keys(binding.modifiers)
    .find(mod => POSITIONS.indexOf(mod) === -1)
    || null;
  const tooltipPosition = POSITIONS
    .reduce((pos, cur) => (binding.modifiers[cur] ? cur : pos), 'top');

  el.dataset.tooltip = binding.value;

  if (tooltipPosition != null) el.dataset.tooltipPosition = tooltipPosition;

  if (tooltipTheme != null) el.dataset.tooltipTheme = tooltipTheme;
}

function setPosition() {
  if (!tooltipEl) return;

  logger.info('set position');

  const formulaEl = tooltipEl.querySelector('.mi-tooltip-spacer');

  if (formulaEl) {
    tooltipEl.style.maxWidth = `calc(${formulaEl.getBoundingClientRect().width}px + 1rem)`;
  }

  const { position } = extractData(element);
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const max = document.body.offsetWidth - (tooltipRect.width / 2) - (16 * 2);
  const min = 16 * 2;
  const Y_OFFSET = document.body.scrollTop || document.documentElement.scrollTop;
  const X_OFFSET = document.body.scrollLeft || document.documentElement.scrollLeft;

  switch (position) {
    case 'bottom':
      tooltipEl.style.left = `${Math.min(max, Math.max(min, rect.left + (rect.width / 2))) + X_OFFSET}px`;
      tooltipEl.style.top = `${rect.top + rect.height + (tooltipRect.height / 2) + 1 + Y_OFFSET}px`;
      break;
    case 'right':
      tooltipEl.style.left = `${Math.min(max, Math.max(min, rect.left + rect.width + (tooltipRect.width / 2))) + X_OFFSET}px`;
      tooltipEl.style.top = `${rect.top + (rect.height / 2) + Y_OFFSET}px`;
      break;
    case 'left':
      tooltipEl.style.left = `${Math.min(max, Math.max(min, rect.left - (tooltipRect.width / 2))) + X_OFFSET}px`;
      tooltipEl.style.top = `${rect.top + (rect.height / 2) + Y_OFFSET}px`;
      break;
    default: // top
      tooltipEl.style.left = `${Math.min(max, Math.max(min, rect.left + (rect.width / 2))) + X_OFFSET}px`;
      tooltipEl.style.top = `${rect.top - (tooltipRect.height / 2) - 1 + Y_OFFSET}px`;
      break;
  }
}

['scroll', 'resize', 'wheel', 'touchmove', 'tap']
  .forEach(event => window.addEventListener(event, setPosition));

GlobalEvents.$on('location:beforeChange', removeTooltip);

Vue.directive('tooltip', {
  bind(el, binding) {
    update(el, binding);

    el.addEventListener('mouseenter', () => {
      element = el;

      const { text } = extractData(el);

      if (!text) return;

      createTooltip();
      setPosition();

      setTimeout(() => {
        tooltipEl.style.opacity = 1;
        setPosition();

        setTimeout(setPosition, 0);
      }, 0);
    });

    el.addEventListener('mouseleave', () => {
      if (!tooltipEl) return;

      const cachedTooltipEl = tooltipEl;

      tooltipEl.style.opacity = 0;

      setTimeout(() => {
        if (tooltipEl === cachedTooltipEl) {
          removeTooltip();
        }
      }, TIMER);
    });
  },
  update,
});
