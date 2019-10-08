const matchMedia = !!window.matchMedia;

const css = window.CSS && !!window.CSS.supports;

const grid = css && CSS.supports('display: grid');

const webkit = css && CSS.supports('-webkit-appearance: none');

const moz = css && CSS.supports('-moz-appearance: none');

const chrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

const customProperties = css && CSS.supports('--custom-property: 100px');

const customElements = window.customElements && window.customElements.define;

const prefersColorScheme = (matchMedia
  && (
    window.matchMedia('(prefers-color-scheme: light)').matches
    || window.matchMedia('(prefers-color-scheme: dark)').matches
  ))
  ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  : undefined;

const prefersReducedMotion = (matchMedia
  && (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  ))
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : undefined;

const Supports = {
  grid,
  prefersColorScheme,
  prefersReducedMotion,
  customProperties,
  customElements,
  webkit,
  moz,
  chrome,
  compatible: !moz && grid && webkit && customProperties && customElements,
};

export default Supports;

window.Sellerscale = {
  ...(window.Sellerscale || {}),
  Supports,
};
