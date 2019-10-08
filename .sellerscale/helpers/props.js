/* eslint-disable no-param-reassign */

import kebabCase from 'lodash/kebabCase';

export function convertCustomProperties(value) {
  if (value == null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    value = String(value);
  }

  if (value.includes('var(')) return value;

  return value.replace(/--[a-z][a-z0-9-]*/g, s => `var(${s})`);
}

export function convertUnit(value) {
  if (value == null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    value = String(value);
  }

  if (value.match(/[a-z]+\(/i)) {
    return value;
  }

  return convertCustomProperties(value)
    .replace(/([\d.]+)([^a-z\d.]|$)/gi, (s, s2, s3) => `${s2}rem${s3}`);
}

/**
 * PROPERTY UTILITIES
 */

export function getCustomProperty(el, propertyName) {
  return window.getComputedStyle(el).getPropertyValue(propertyName).trim();
}

export function getBase() {
  return getCustomProperty(document.body, '--base');
}

export function convertToRem() {

}

/**
 * Extract padding into four values
 * @param {String} padding
 */
export function extractPadding(padding) {
  const div = document.createElement('div');

  div.style.padding = padding;
  div.style.visibility = 'none';

  document.body.appendChild(div);

  const styleMap = window.getComputedStyle(div);

  const data = {
    top: styleMap.paddingTop,
    right: styleMap.paddingRight,
    bottom: styleMap.paddingBottom,
    left: styleMap.paddingLeft,
    value: styleMap.padding,
  };

  document.body.removeChild(div);

  return data;
}

/**
 * MAPPERS
 */

export function unitMapper(props) {
  const data = {};

  props.forEach((prop) => {
    data[`${prop}Rem`] = function converter() {
      return convertUnit(this[prop]);
    };
  });

  return data;
}

export function propMapper(props) {
  const data = {};

  props.forEach((prop) => {
    data[`${prop}Prop`] = function converter() {
      return convertCustomProperties(this[prop]);
    };
  });

  return data;
}

export function contentAlignMapper(prop = 'contentAlign') {
  return {
    contentAlignHorizontal() {
      return this[prop].split(/\s+/)[0];
    },
    contentAlignVertical() {
      return this[prop].split(/\s+/)[1];
    },
  };
}

export const modMapper = {
  modComputed() {
    if (!this.mod) {
      return '';
    }

    if (typeof this.mod === 'object') {
      if (Array.isArray(this.mod)) {
        return ` ${this.mod.map(md => (md ? `-nu-${md}` : '')).join(' ')}`;
      }

      return Object.keys(this.mod)
        .reduce((str, key) => {
          const value = this.mod[key];

          if (!value) return str;

          return `${str} -nu-${key}`;
        }, ' ');
    }

    return ` ${this.mod.split(/\s/g).map(md => `-nu-${md}`).join(' ')}`;
  },
};

/**
 * @typedef ThemeDefaults
 * @property {String} color
 * @property {String} backgroundColor
 * @property {String} borderColor
 * @property {String} focusColor
 */

/**
 * @param {String} theme
 * @param {String} prefix
 * @param {ThemeDefaults} defaults
 * @returns {string}
 */
export function convertThemeToStyles(theme = {}, prefix = 'theme', defaults = {}) {
  prefix = kebabCase(prefix);

  if (typeof theme === 'object') {
    return Object.keys({ ...theme, ...defaults })
      .reduce((styles, prop) => `${styles}--${prefix}-${kebabCase(prop)}: ${theme[prop] || defaults[prop]};\n`, '').trim();
  }

  return `
    --${prefix}-color: var(--${theme}-color, ${defaults.color ? defaults.color : 'var(--color)'});
    --${prefix}-background-color: var(--${theme}-background-color, ${defaults.backgroundColor ? defaults.backgroundColor : 'var(--background-color)'});
    --${prefix}-border-color: var(--${theme}-border-color, ${defaults.borderColor ? defaults.borderColor : 'var(--border-color)'});
    --${prefix}-focus-color: var(--${theme}-focus-color, ${defaults.focusColor ? defaults.focusColor : 'var(--focus-color)'});
  `;
}

/**
 * @param {String} theme
 * @param {String} prefix
 * @param {ThemeDefaults} defaults
 * @returns {string}
 */
export function convertThemeToStylesDict(theme = {}, prefix = 'theme', defaults = {}) {
  prefix = kebabCase(prefix);

  if (typeof theme === 'object') {
    return Object.keys({ ...theme, ...defaults })
      .reduce((styles, prop) => {
        styles[`--${prefix}-${kebabCase(prop)}`] = theme[prop] || defaults[prop];

        return styles;
      }, {});
  }

  return {
    [`--${prefix}-color`]: `var(--${theme}-color, ${defaults.color ? defaults.color : 'var(--color)'})`,
    [`--${prefix}-background-color`]: `var(--${theme}-background-color, ${defaults.backgroundColor ? defaults.backgroundColor : 'var(--background-color)'})`,
    [`--${prefix}-border-color`]: `var(--${theme}-border-color, ${defaults.borderColor ? defaults.borderColor : 'var(--border-color)'})`,
    [`--${prefix}-focus-color`]: `var(--${theme}-focus-color, ${defaults.focusColor ? defaults.focusColor : 'var(--focus-color)'})`,
  };
}

/**
 * @param {String} theme
 * @param {String} prefix
 * @param {ThemeDefaults} defaults
 * @returns {string}
 */
export function convertThemeToProps(theme = {}, prefix = 'theme', defaults = {}) {
  if (!theme) {
    return {};
  }

  if (typeof theme === 'object') {
    return Object.keys({ ...theme, ...defaults })
      .reduce((styles, prop) => {
        styles[`${prefix}${prop}`] = theme[prop] || defaults[prop];

        return styles;
      }, {});
  }

  return {
    [`${prefix}Color`]: `var(--${theme}-color, ${defaults.color ? defaults.color : 'var(--color)'})`,
    [`${prefix}BackgroundColor`]: `var(--${theme}-background-color, ${defaults.backgroundColor ? defaults.backgroundColor : 'var(--background-color)'})`,
    [`${prefix}BorderColor`]: `var(--${theme}-border-color, ${defaults.borderColor ? defaults.borderColor : 'var(--border-color)'})`,
    [`${prefix}FocusColor`]: `var(--${theme}-focus-color, ${defaults.focusColor ? defaults.focusColor : 'var(--focus-color)'})`,
  };
}

/**
 * Extract color theme colors from color theme name.
 * @param {String} prefix - custom properties prefix for extracted colors
 * @param {Object} defaults - default values
 * @param {String} prop - component theme property.
 *   To avoid confusion use it only if there are several theme properties.
 * @returns {Object}
 */
export function themeMapper(prefix, defaults = {}, prop = 'theme') {
  return {
    [`${prop}Styles`]() {
      return convertThemeToStyles(this[prop], prefix, defaults);
    },
    [`${prop}StylesDict`]() {
      return convertThemeToStylesDict(this[prop], prefix, defaults);
    },
    [`${prop}Props`]() {
      return convertThemeToProps(this[prop], prefix, defaults);
    },
  };
}

export const customPropertiesMapper = {
  propsComputed() {
    return this.props
      ? Object.keys(this.props)
        .reduce(
          (style, prop) => (this.props[prop] != null
            ? `${style}--${kebabCase(prop)}: ${convertUnit(this.props[prop])};`
            : style),
          '',
        )
      : '';
  },
};

/**
 * Validators
 */

export function contentAlignValidator(val) {
  const [hor, ver] = val.split(/\s+/);

  return ['left', 'center', 'right', 'inherit'].includes(hor)
    && ['top', 'middle', 'bottom', 'inherit'].includes(ver);
}

export function textAlignValidator(val) {
  return ['left', 'right', 'center'].includes(val);
}

export function alignSelfValidator(val) {
  return ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'].includes(val);
}
