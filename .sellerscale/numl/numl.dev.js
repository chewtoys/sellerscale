var Nude = (function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "body {\n  --nu-base: 16px;\n  --nu-pixel: 1px;\n\n  --nu-default-border-radius: 0.5rem;\n  --nu-default-padding: 0.5rem;\n  --nu-default-border-width: 1px;\n  --nu-default-animation-time: 0.08s;\n  --nu-default-color: rgba(51, 51, 51, 1);\n  --nu-default-background-color: rgba(255, 255, 255, 1);\n  --nu-default-border-color: rgba(210, 221, 236, 1);\n  --nu-default-special-color: rgba(24, 133, 217, 1);\n  --nu-default-shadow-color: rgba(0, 0, 0, 0.2);\n  --nu-default-special-background-color: rgba(255, 255, 255, 1);\n  --nu-default-shadow-intensity: 0.2;\n  --nu-default-shadow-opacity: 0.1;\n  --nu-default-focus-color: rgba(139, 194, 236, 1);\n  --nu-default-heading-color: rgba(71, 71, 71, 1);\n  --nu-default-hover-color: rgba(24, 133, 217, 0.1);\n  --nu-default-special-hover-color: rgba(255, 255, 255, 0.1);\n  --nu-default-special-shadow-opacity: 0.35538111934997146;\n\n  --nu-theme-border-radius: var(--nu-default-border-radius);\n  --nu-theme-padding: var(--nu-default-padding);\n  --nu-theme-border-width: var(--nu-default-border-width);\n  --nu-theme-animation-time: var(--nu-default-animation-time);\n  --nu-theme-color: var(--nu-default-color);\n  --nu-theme-background-color: var(--nu-default-background-color);\n  --nu-theme-border-color: var(--nu-default-border-color);\n  --nu-theme-special-color: var(--nu-default-special-color);\n  --nu-theme-shadow-color: var(--nu-default-shadow-color);\n  --nu-theme-special-background-color: var(--nu-default-special-background-color);\n  --nu-theme-shadow-intensity: var(--nu-default-shadow-intensity);\n  --nu-theme-shadow-opacity: var(--nu-default-shadow-opacity);\n  --nu-theme-focus-color: var(--nu-default-focus-color);\n  --nu-theme-heading-color: var(--nu-default-heading-color);\n  --nu-theme-hover-color: var(--nu-default-hover-color);\n  --nu-theme-special-hover-color: var(--nu-default-special-hover-color);\n  --nu-theme-special-shadow-opacity: var(--nu-default-special-shadow-opacity);\n}\n\nbody:not(.nu-prevent-defaults) {\n  line-height: 1;\n}\n\nbody:not(.nu-prevent-defaults) > *:not([size]) {\n  line-height: 1.5;\n}\n\n.nu-defaults, body:not(.nu-prevent-defaults) {\n  margin: 0;\n  padding: 0;\n  font-family: 'Avenir Next', 'Avenir', Helvetica, Ubuntu, 'DejaVu Sans', Arial, sans-serif;\n  font-size: var(--nu-base);\n  color: var(--nu-theme-color);\n  background: var(--nu-theme-background-color);\n  font-weight: 400;\n  word-spacing: calc(1rem / 8);\n  min-height: 100vh;\n  text-align: left;\n  text-size-adjust: none;\n}\n\n.nu-defaults:not(body) {\n  line-height: 1.5;\n}\n\n[nu-hidden] {\n  display: none !important;\n}\n\nhtml.nu-prefers-high-contrast.nu-prefers-color-scheme-dark body {\n  filter: invert(100%) brightness(0.666) contrast(1.5) brightness(1.5) invert(100%);\n}\n\n@media (prefers-color-scheme: dark) {\n  html.nu-prefers-color-scheme body {\n    background: rgba(32, 32, 32, 1);\n  }\n\n  html.nu-prefers-color-scheme .nu-dark-invert {\n    filter: invert(100%) hue-rotate(180deg);\n  }\n\n  html.nu-prefers-color-scheme .nu-dark-dim {\n    filter: invert(5%);\n  }\n\n  html.nu-prefers-high-contrast.nu-prefers-color-scheme body {\n    filter: invert(100%) brightness(0.666) contrast(1.5) brightness(1.5) invert(100%);\n  }\n}\n\n@media (prefers-color-scheme: light) {\n  html.nu-prefers-high-contrast.nu-prefers-color-scheme body {\n    filter: brightness(.5) contrast(1.5) brightness(2);\n  }\n}\n\nhtml.nu-prefers-high-contrast:not(.nu-prefers-color-scheme):not(.nu-prefers-color-scheme-dark) body {\n  filter: brightness(.5) contrast(1.5) brightness(2);\n}\n\nhtml.nu-prefers-color-scheme-dark body {\n  background: rgba(43, 43, 43, 1);\n}\n\nhtml.nu-prefers-color-scheme-dark .nu-dark-invert {\n  filter: invert(95%) hue-rotate(180deg);\n}\n\nhtml.nu-prefers-color-scheme-dark .nu-dark-dim {\n  filter: invert(5%);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .nu-prefers-reduced-motion [nu-themes], .nu-prefers-reduced-motion [theme] {\n    --nu-theme-animation-time: 0.001s;\n  }\n}\n\n.nu-prefers-reduced-motion-reduce [nu-themes], .nu-prefers-reduced-motion-reduce [theme] {\n  --nu-theme-animation-time: 0.001s !important;\n}\n";
  styleInject(css);

  /**
   * Dict for all browser built-in colors.
   * It's included to support such declarations in themes.
   * Without such dict it would be impossible to declare computed color properties in themes.
   * @type {Object}
   */
  const THEME_COLOR_ATTRS_LIST = [
    'color',
    'background-color',
    'special-color',
    'border-color',
    'shadow-color',
    'heading-color',
    'hover-color',
    'special-hover-color',
    'special-background-color',
    'focus-color',
    'minor-color',
    'minor-background-color',
    'special-minor-color',
  ];

  /**
   * Required root element attribute.
   * @type {String}
   */
  const ROOT_CONTEXT = 'html';

  /**
   * Script injection.
   * @param {String} src
   * @returns {Promise<*>}
   */
  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.onload = resolve;
      script.onerror = reject;
      script.async = true;
      script.src = src;

      document.body.appendChild(script);
    });
  }

  /**
   * Custom units dict
   * @type {Object}
   */
  const CUSTOM_UNITS = {
    'br': 'var(--nu-theme-border-radius)',
    'bw': 'var(--nu-theme-border-width)',
    'p': 'var(--nu-theme-padding)',
  };

  const COLOR_LIST = [...THEME_COLOR_ATTRS_LIST].map(color => color.replace('-color', ''));

  function colorUnit(style, initial) {
    return (color) => {
      if (color == null) return;

      if (!color) color = initial;

      if (color === 'text') return { [style]: 'var(--nu-theme-color)' };

      if (COLOR_LIST.includes(color)) {
        return { [style]: `var(--nu-theme-${color}-color)` };
      }

      return { [style]: color };
    };
  }

  /**
   * Unit conversion for attribute values.
   * @param {String} unit - String for conversion.
   * @param {String} [multiplier] - If presented then use multiply custom unit (for example `2x`).
   * @returns {string|*}
   */
  function convertUnit(unit, multiplier) {
    if (!unit) return unit;

    if (!unit.includes('(')) {
      unit = unit
        .replace(/\d+\/\d+/g, val => {
          const tmp = val.split('/');
          return ((Number(tmp[0]) / Number(tmp[1])) * 100).toFixed(4) + '%';
        })
        .replace(/([\d.]+)([^a-z\d%.]|$)/gi, (s, s2, s3) => `${s2}rem${s3}`);
    }

    if (multiplier) {
      unit = convertCustomUnit(unit, 'x', multiplier);
    }

    for (let customUnit of Object.keys(CUSTOM_UNITS)) {
      unit = convertCustomUnit(unit, customUnit, CUSTOM_UNITS[customUnit]);
    }

    return unit;
  }

  /**
   * Returns simple unit handler for the attribute.
   * @param {String} name - Attribute name.
   * @param {String} [suffix] - Query suffix for styles.
   * @param {String} [multiplier] - Multiplier option.
   * @param {String} [empty] - Default value if empty value is provided.
   * @param {Boolean|String} [property] - Duplicate style as custom property.
   * @param {Boolean} [convert] - Do unit conversion for value or not.
   * @returns {null|Object}
   */
  function unit(name, { suffix, multiplier, empty, property, convert } = {}) {
    const propertyName = !property
      ? null
      : typeof property === 'boolean'
        ? `--nu-${name}`
        : property;
    const propertyUsage = `var(${propertyName})`;

    if (suffix && property) {
      return function (val) {
        if (val == null) return null;

        if (!val && !empty) return null;

        val = convert ? convertUnit(val || empty, multiplier) : val || empty;

        return {
          $suffix: suffix,
          [name]: propertyUsage,
          [propertyName]: val,
        };
      };
    } else if (suffix) {
      return function (val) {
        if (val == null) return null;

        if (!val && !empty) return null;

        val = convert ? convertUnit(val || empty, multiplier) : val || empty;

        return {
          $suffix: suffix,
          [name]: val,
        };
      };
    } else if (property) {
      return function (val) {
        if (val == null) return null;

        if (!val && !empty) return null;

        val = convert ? convertUnit(val || empty, multiplier) : val || empty;

        return {
          [name]: propertyUsage,
          [propertyName]: val,
        };
      };
    }

    return function (val) {
      if (val == null) return null;

      if (!val && !empty) return null;

      val = convert ? convertUnit(val || empty, multiplier) : val || empty;

      return { [name]: val };
    };
  }

  /**
   * Returns unit handler for dimensional attributes.
   * @param {String} name - Attribute name.
   * @param {String} $suffix - Query suffix for styles.
   * @returns {null|Object}
   */
  function sizeUnit(name, $suffix) {
    return val => {
      if (val) {
        if (val.startsWith('clamp(')) {
          const values = val.slice(6, -1).split(',');

          return {
            $suffix,
            [name]: convertUnit(values[1]),
            [`min-${name}`]: convertUnit(values[0]),
            [`max-${name}`]: convertUnit(values[2])
          };
        } else if (val.startsWith('minmax(')) {
          const values = val.slice(7, -1).split(',');

          return {
            $suffix,
            [`min-${name}`]: convertUnit(values[0]),
            [`max-${name}`]: convertUnit(values[1])
          };
        } else if (val.startsWith('min(')) {
          return {
            $suffix,
            [`min-${name}`]: convertUnit(val.slice(4, -1))
          };
        } else if (val.startsWith('max(')) {
          return {
            $suffix,
            [`max-${name}`]: convertUnit(val.slice(4, -1))
          };
        }

        return {
          $suffix,
          [name]: convertUnit(val)
        };
      }

      return val;
    };
  }

  /**
   * Return a parent element that satisfy to provided selector.
   * @param {Element} element
   * @param {String} selector
   * @returns {undefined|Element}
   */
  function getParent(element, selector) {
    const elements = [...document.querySelectorAll(selector)];

    while ((element = element.parentNode) && !elements.includes(element)) {
    }

    return element;
  }

  /**
   * Return a closest element that satisfy to provided selector.
   * @TODO: improve search algorithm.
   * @param {Element} element
   * @param {String} selector
   * @returns {undefined|Element}
   */
  function invertQuery(element, selector) {
    const origElement = element;

    let prevElement = element;

    do {
      const found = [...element.querySelectorAll(selector)];

      if (found) {
        if (found.includes(prevElement) && prevElement !== origElement) {
          return prevElement;
        }

        const foundEl = found.find(el => el !== origElement);

        if (foundEl) return foundEl;
      }

      prevElement = element;
    } while (element = element.parentNode);
  }

  /**
   * Return a closest element that has provided id.
   * @param {Element} element
   * @param {String} id
   * @returns {undefined|Element}
   */
  function invertQueryById(element, id) {
    return invertQuery(element, `[id^="${id}--"], [id="${id}"]`);
  }

  /**
   * Write log to console.
   * @param args
   */
  function log(...args) {
    {
      console.log('nude:', ...args);
    }
  }

  /**
   * Write warning to console
   * @param args
   */
  function warn(...args) {
    {
      console.warn('nude:', ...args);
    }
  }

  /**
   * Write error to console.
   * @param args
   */
  function error(...args) {
    {
      console.error('nude:', ...args);
    }
  }

  const ID_MAP = {};

  /**
   * Return current id of the element and generate it if it's no presented.
   * @param {Element} el
   * @returns {String}
   */
  function generateId(element) {
    let name = element.id;

    if (name && name.includes('--')) return name;

    name = name || 'nu';

    if (name !== 'nu') {
      element.setAttribute('nu-id', name);
    }

    if (!ID_MAP[name]) {
      ID_MAP[name] = 0;
    }

    const id = (ID_MAP[name] += 1);

    element.id = `${name}--${id}`;

    return element.id;
  }

  const dim = document.createElement('div');
  const dimStyle = dim.style;

  /**
   * Extract rgba channels for color.
   * @param {String} color – CSS color string.
   * @returns {Number[]} – Array with values: Red channel, Green channel, Blue channel, Alpha channel.
   */
  function extractColor(color, ignoreAlpha = false) {
    if (typeof color !== 'string') return null;

    dimStyle.color = '';
    dimStyle.color = (window.HTML_COLORS && window.HTML_COLORS[color.toLowerCase()]) || color;

    const arr = !dimStyle.color
      ? null // incorrect color
      : dimStyle.color
        .slice(dimStyle.color.indexOf('(') + 1, -1)
        .split(', ')
        .map(Number);

    if (!arr) return arr;

    if (ignoreAlpha) {
      return arr.slice(0, 3);
    }

    arr[3] = arr[3] || 1;

    return arr;
  }

  /**
   * Set alpha channel to the color.
   * @param {String|Array} color
   * @param {Number} alpha
   * @returns {String}
   */
  function setAlphaChannel(color, alpha = 1) {
    const rgba = typeof color === 'string' ? extractColor(color) : color;

    if (!rgba) return rgba;

    return colorString(...rgba.slice(0, 3), alpha);
  }

  /**
   * Generate RGBA color string.
   * @param {Number} red
   * @param {Number} green
   * @param {Number} blue
   * @param {Number} alpha
   * @returns {String}
   */
  function colorString(red, green, blue, alpha = 1) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  /**
   * Convert color to RGBA declaration.
   * @param {String|Array} color
   * @param {Boolean} ignoreAlpha
   * @returns {undefined|String}
   */
  function generalizeColor(color, ignoreAlpha = false) {
    if (!color) return color;

    const rgba = extractColor(color, ignoreAlpha);

    if (!rgba) return;

    return colorString(...rgba, 1);
  }

  /**
   * Smart color inversion.
   * @param {String|Array} color
   * @param {Number} min - minimal value for color channel
   * @param {Number} max - maximum value for color channel
   * @returns {String}
   */
  function invertColor(color, min = 0, max = 255) {
    const rgba = extractColor(color);

    return colorString(
      ...hueRotate(
        rgba.map((v, i) => {
          if (i === 3) return v;

          const inv = 255 - v;

          return Math.round((inv * (max - min)) / max + min);
        })
      )
    );
  }

  /**
   * Rotate color hue. It is used in dark theme generation.
   * @param {String|Array} color
   * @param {Number} angle
   * @returns {Array}
   */
  function hueRotate(color, angle = 180) {
    const rgba = typeof color === 'string' ? extractColor(color) : color;
    const hsl = rgbToHsl(...rgba);

    hsl[0] = (hsl[0] + angle / 360) % 1;

    const rotated = hslToRgb(...hsl).concat([rgba[3]]);

    return rotated;
  }

  /**
   * Get luminance of the color.
   * @param {String|Array} color
   * @returns {Number} - Float value from 0 to 1.
   */
  function getLuminance(color) {
    color = extractColor(color, true).map(n => n / 255);

    const [r, g, b] = color;

    return Math.sqrt(r * r * 0.241 + g * g * 0.691 + b * b * 0.068);
  }

  /**
   * Calculate middle color.
   * @param {String|Array} clr1
   * @param {String|Array} clr2
   * @param {Number} pow - middle color distance from clr1 (0) to clr2 (1).
   * @returns {String}
   */
  function mixColors(clr1, clr2, pow = 0.5) {
    const color1 = extractColor(clr1, true);
    const color2 = extractColor(clr2, true);

    const color = color1.map((c, i) => parseInt((color2[i] - c) * pow + c));

    return colorString(color[0], color[1], color[2], 1);
  }

  /**
   * Calculate contrast ratio between 2 colors.
   * Uses luminance formula.
   * @param {String|Array} clr1
   * @param {String|Array} clr2
   * @returns {Number} - contrast ratio between 0 and 1.
   */
  function contastRatio(clr1, clr2) {
    return Math.abs(getLuminance(clr1) - getLuminance(clr2));
  }

  /**
   * Split style into 4 directions. For example padding.
   * @param {String} style
   * @returns {String[]}
   */
  function splitDimensions(style) {
    dimStyle.padding = '';
    dimStyle.padding = style;

    return dimStyle.padding
      ? [dimStyle.paddingTop, dimStyle.paddingRight, dimStyle.paddingBottom, dimStyle.paddingLeft]
      : null;
  }

  /**
   * Event bindings for active elements.
   * Enable focus and active states.
   * Should be bind to the element before call.
   */
  function bindActiveEvents() {
    this.addEventListener('click', evt => {
      if (evt.nuHandled) return;

      evt.nuHandled = true;

      if (!this.hasAttribute('disabled')) {
        this.nuTap();
      }
    });

    this.addEventListener('keydown', evt => {
      if (this.hasAttribute('disabled') || evt.nuHandled) return;

      evt.nuHandled = true;

      if (evt.key === 'Enter') {
        this.nuTap();
      } else if (evt.key === ' ') {
        evt.preventDefault();
        this.nuSetMod('active', true);
      }
    });

    this.addEventListener('keyup', evt => {
      if (this.hasAttribute('disabled') || evt.nuHandled) return;

      evt.nuHandled = true;

      if (evt.key === ' ') {
        evt.preventDefault();
        this.nuSetMod('active', false);
        this.nuTap();
      }
    });

    this.addEventListener('blur', evt => this.nuSetMod('active', false));

    this.addEventListener('mousedown', () => {
      this.nuSetMod('active', true);
    });

    ['mouseleave', 'mouseup'].forEach(eventName => {
      this.addEventListener(eventName, () => {
        this.nuSetMod('active', false);
      });
    });
  }

  /**
   * Kebab to camel case conversion.
   * @param {String str
   * @returns {string}
   */
  function toCamelCase(str) {
    return str.replace(/\-[a-z]/g, s => s.slice(1).toUpperCase());
  }

  /**
   * Camel to kebab case conversion.
   * @param {String} str
   * @returns {String}
   */
  function toKebabCase(str) {
    return str.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`).replace(/^\-/, '');
  }

  /* colors */
  function rgbToHsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);

    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h, s, l];
  }

  function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
   * Dict of element`s states with their selectors.
   * @type {Object}
   */
  const STATES_MAP = {
    focus: '[nu-focus]',
    hover: ':hover',
    pressed: '[aria-pressed="true"]',
    disabled: '[disabled]',
    active: '[nu-active]',
    sticky: '[nu-sticky]',
  };

  /**
   * Extract state values from single value.
   * Example: "blue :active[red]"
   * Example output: [{ '': 'blue' }, { 'active': 'red' }}]
   * @param {String} attrValue
   * @returns {Object[]}
   */
  function splitStates(attrValue) {
    const tmp = attrValue.split(/[\s^]+(?=[\:#])/g);

    let id;

    let stateMaps = tmp
      .map(val => {
        if (!val) return;

        /**
         * If true then val applies on element state.
         * If false then val applies on parent state.
         * @type {Boolean}
         */
        const idMatch = val.match(/^#([a-z\-]+)/);

        if (idMatch && idMatch[1] && id && idMatch[1] !== id) {
          return warn('too complex state (skipped):', `"${attrValue}"`);
        }

        id = idMatch ? idMatch[1] : null;

        const tmp2 = val.replace(/.*?\:/, '').split(/\[|\]/g);

        if (tmp2.length === 1) {
          return {
            states: [],
            parentStates: [],
            notStates: [],
            parentNotStates: [],
            value: val
          };
        }

        const states = tmp2[0].split(':');

        {
          const notFound = states.find(s => !STATES_MAP[s]);

          if (notFound) {
            warn('state not found:', notFound);
          }
        }

        return {
          states: !id ? states : [],
          parentStates: id ? states : [],
          notStates: [],
          parentNotStates: [],
          value: tmp2[1].trim(),
        };
      })
      .filter(val => val);

    for (let i = 0; i < stateMaps.length; i++) {
      for (let j = i + 1; j < stateMaps.length; j++) {
        const map1 = stateMaps[i];
        const map2 = stateMaps[j];

        [['states', 'notStates'], ['parentStates', 'parentNotStates']].forEach(([sKey, nKey]) => {
          const diffStates1 = map2[sKey].filter(s => !map1[sKey].includes(s));
          const diffStates2 = map1[sKey].filter(s => !map2[sKey].includes(s));

          map1[nKey].push(...diffStates1);
          map2[nKey].push(...diffStates2);
        });
      }
    }

    return stateMaps.map(stateMap => {
      return {
        $prefix: id && (stateMap.parentStates.length || stateMap.parentNotStates.length)
          ? `[nu-id="${id}"]`
          + stateMap.parentStates.map(s => STATES_MAP[s]).join('')
          + stateMap.parentNotStates.map(s => `:not(${STATES_MAP[s]})`).join('')
          : null,
        $suffix: stateMap.states.map(s => STATES_MAP[s]).join('')
          + stateMap.notStates.map(s => `:not(${STATES_MAP[s]})`).join(''),
        value: stateMap.value,
      };
    });
  }

  /**
   * Calculate the style that needs to be applied based on corresponding attribute.
   * @param {String} name - Attribute name.
   * @param {String} value - Original attribute name.
   * @param {Object} attrs - Map of attribute handlers.
   * @returns {String|Object|Array}
   */
  function computeStyles(name, value, attrs, defaults) {
    if (value == null) return;

    // Style splitter for states system
    if (value.match(/[\:\#][a-z0-9\-\:]+\[/)) {
      // split values between states
      const states = splitStates(value);

      const arr = states.reduce((arr, state) => {
        const styles = (computeStyles(name, state.value, attrs, defaults) || []).map(stls => {
          /**
           * @TODO: review that function
           */
          if (state.$suffix) {
            stls.$suffix = `${state.$suffix}${stls.$suffix || ''}`;
          }

          if (state.$prefix) {
            stls.$prefix = `${stls.$prefix || ''}${state.$prefix}`;
          }

          return stls;
        });

        if (styles.length) {
          arr.push(...styles);
        }

        return arr;
      }, []);

      return arr;
    }

    const attrValue = attrs[name];

    if (!attrValue) return null;

    switch (typeof attrValue) {
      case 'string':
        return value ? [{ [attrValue]: value }] : null;
      case 'function':
        const styles = attrValue(value, defaults);

        if (!styles) return null;

        // normalize to array
        return Array.isArray(styles) ? styles : [styles];
      default:
        return null;
    }
  }

  /**
   * Convert single custom unit.
   * @param {String} value - Input string.
   * @param {String} unit - Unit string.
   * @param {String} multiplier - Multiplier string.
   * @returns {String}
   */
  function convertCustomUnit(value, unit, multiplier) {
    return value.replace(
      new RegExp(`[0-9\.]+${unit}(?![a-z])`, 'gi'),
      s => `calc(${multiplier} * ${s.slice(0, -unit.length)})`
    );
  }

  function excludeMod(str, mod) {
    const regexp = new RegExp(`(^|[^a-z])${mod}([^a-z]|$)`);
    if (str.match(regexp, 'i')) {
      return str.replace(regexp, s => s.replace(mod, '')).trim();
    }

    return;
  }

  function parseAllValues(value) {
    return value
      ? value.split('|').reduce((arr, value) => {
        splitStates(value).forEach(state => arr.push(state.value));

        return arr;
      }, [])
      : [];
  }

  function svgElement(svgText) {
    dim.innerHTML = svgText;

    const svgNode = dim.childNodes[0];

    dim.removeChild(svgNode);

    return svgNode;
  }

  const TASKS = [];
  const TASK_EVENT = 'nude:task';

  function setImmediate(callback) {
    TASKS.push(callback);

    window.postMessage(TASK_EVENT, '*');
  }

  window.addEventListener('message', function (event) {
    if (event.data !== TASK_EVENT) return;

    for (let task of TASKS) {
      task();
    }

    TASKS.splice(0);
  });

  const map = {};
  const testEl = document.createElement('div');

  function injectStyleTag(css, name) {
    css = css || '';

    const style = document.createElement('style');

    if (name) {
      style.dataset.nuName = name;
    }

    style.appendChild(document.createTextNode(css));

    document.head.appendChild(style);

    return style;
  }

  function attrsQuery(attrs) {
    return Object.keys(attrs)
      .reduce((query, attr) => {
        const val = attrs[attr];

        return `${query}${val != null ? `[${attr}="${val}"]` : `:not([${attr}])`}`
      }, '');
  }

  function stylesString(styles) {
    {
      Object.keys(styles)
        .forEach(style => {
          const value = String(styles[style]);

          if (value
            && !style.startsWith('-')
            && !CSS.supports(style, value.replace('!important', ''))
            && !value.endsWith('-reverse')) {
            warn('unsupported style detected:', `{ ${style}: ${value}; }`);
          }
        });
    }

    return Object.keys(styles)
      .reduce((string, style) => `${string}${styles[style] ? `${style}:${styles[style]}` : ''};`, '');
  }

  function generateCSS(query, styles, context = '') {
    if (!styles || !styles.length) return;

    return styles.map(map => {
      let currentQuery = query;

      if (map.$suffix) {
        currentQuery += map.$suffix;
      }

      if (map.$prefix) {
        if (currentQuery.startsWith('#')) {
          const index = currentQuery.indexOf(' ');

          currentQuery = `${currentQuery.slice(0, index)} ${map.$prefix} ${currentQuery.slice(index)}`;
        } else {
          currentQuery = `${map.$prefix} ${currentQuery}`;
        }
      }

      delete map.$suffix;
      delete map.$prefix;

      return `${context}${currentQuery}{${stylesString(map)}}`;
    }).join('\n');
  }

  function parseStyles(str) {
    return str
    .split(/;/g)
    .map(s => s.trim())
    .filter(s => s)
    .map(s => s.split(':'))
    .reduce((st, s) => {
      st[s[0]] = s[1].trim();
      return st;
    }, {});
  }

  function injectCSS(name, selector, css) {
    const element = injectStyleTag(css, name);

    {
      try {
        testEl.querySelector(selector);
      } catch(e) {
        warn('invalid selector detected', selector, css);
      }
    }

    if (map[name]) {
      const el = map[name].element;

      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }

    map[name] = {
      selector,
      css,
      element,
    };

    return map[name];
  }

  function removeCSS(name) {
    if (!map[name]) return;

    const el = map[name].element;

    el.parentNode.removeChild(el);
  }

  function hasCSS(name) {
    return !!map[name];
  }

  const css$1 = {
    has(name) {
      return !!map[name];
    },
  };

  const MAP = {};

  function set(name, styles, context = '') {
    if (!name.match(/^[a-z\-0-9]+$/i)) {
      return error('modifier name is not valid', name);
    }

    // clean empty styles
    Object.keys(styles)
      .forEach(name => {
        if (!styles[name] || !styles[name].trim()) {
          delete styles[name];
          return;
        }

        if (!styles[name].endsWith('!important')) {
          styles[name] += ' !important';
        }
      });

    MAP[name] = styles;

    const selector = `
    ${context} [data-nu-mod="${name}"],
    ${context} [data-nu-mod*=" ${name} "],
    ${context} [data-nu-mod^="${name} "],
    ${context} [data-nu-mod$=" ${name}"],
    ${context} [data-nu-mod-${name}],
    ${context} [nu-mod-${name}],
    ${context} .-nu-${name}
`;

    injectCSS(
      `mod:${name}:${context}`,
      selector,
      `${selector}{${stylesString(styles)}}`);
  }

  function get(name = '') {
    const names = name.trim().split(/\s+/g);

    return names.reduce((styles, modName) => {
      {
        if (!MAP[modName] && !document.querySelector(`nu-mod[name="${modName}"]`)) {
          warn('undefined modifier is used', `"${modName}"`);
        }
      }

      Object.assign(styles, MAP[modName] || {});

      return styles;
    }, {});
  }

  function extend(name, styles) {
    const modStyles = MAP[name];

    if (!modStyles) {
      error('modifier is not found', name);
      return;
    }

    Object.assign(modStyles, styles);

    set(name, modStyles);
  }

  const Modifiers = {
    set,
    get,
    extend,
  };

  const SIZES = {
    xxs: [.666, 1],
    xs: [.75, 1],
    sm: [.875, 1.5],
    md: [1, 1.5],
    lg: [1.25, 2],
    xl: [1.5, 2],
    xxl: [2, 2.5],
    h1: [2, 2.5, 700],
    h2: [1.8, 2.5, 700],
    h3: [1.6, 2, 700],
    h4: [1.4, 2, 700],
    h5: [1.2, 1.5, 700],
    h6: [1, 1.5, 500],
  };

  Object.keys(SIZES).forEach((size) => {
    Modifiers.set(size, {
      'font-size': `${SIZES[size][0]}rem`,
      'line-height': `${SIZES[size][1]}rem`,
      'font-weight': size.startsWith('h') ? String(SIZES[size][2]) : '',
    });
  });

  ['i', 'italic'].forEach(name => set(name, { 'font-style': 'italic' }));
  ['u', 'underline'].forEach(name => set(name, { 'text-decoration': 'underline' }));
  ['s', 'strikethrough'].forEach(name => set(name, { 'text-decoration': 'line-through' }));
  [1,2,3,4,5,6,7,8,9].forEach(index => set(`w${index}`, { 'font-weight': `${index}00` }));
  ['uppercase', 'lowercase'].forEach(name => set(name, { 'text-transform': name }));
  ['baseline', 'sub', 'super', 'text-top', 'text-bottom', 'middle', 'top', 'bottom'].forEach(name => set(name, { 'vertical-align': name }));

  ['left', 'right', 'center', 'justify'].forEach(name => set(name, { 'text-align': name}));

  set('content-box', { 'box-sizing': 'content-box' });
  set('border-box', { 'box-sizing': 'border-box' });
  set('monospace', { 'font-family': 'monospace' });
  set('spacing', { 'letter-spacing': 'var(--nu-pixel)' });
  set('ellipsis', {
    'max-width': '100%',
    'overflow': 'hidden',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
  });
  set('wrap', { 'white-space': 'normal' });
  set('nowrap', { 'white-space': 'nowrap' });
  set('scroll', { 'overflow': 'auto' });
  set('no-overflow', { 'overflow': 'hidden' });

  set('rounded', { 'border-radius': 'var(--nu-theme-border-radius)' });
  set('round', { 'border-radius': '9999rem' });
  set('ellipse', { 'border-radius': '50%' });
  set('relative', { 'position': 'relative' });

  set('color', { 'color': 'var(--nu-theme-color)' });
  set('background', { 'background-color': 'var(--nu-theme-background-color)' });
  set('special', { 'color': 'var(--nu-theme-special-color)' });
  set('minor', { 'color': 'var(--nu-theme-minor-color)' });
  set('transparent', { 'background-color': 'transparent' });
  set('swap', { 'color': 'var(--nu-theme-background-color)', 'background-color': 'var(--nu-theme-color)' });

  const DOUBLE_DISPLAY = ['block', 'table', 'flex', 'grid'];

  const ATTRS_MAP = {};
  const DEFAULTS_MAP = {};

  /**
   * List of all Nude tags.
   * @type {String[]}
   */
  const TAG_LIST = [];

  /**
   * @class
   * @abstract
   */
  class NuBase extends HTMLElement {
    /**
     * Element tag name.
     * @returns {String}
     */
    static get nuTag() {
      return '';
    }

    /**
     * Parent element
     */
    static get nuParent() {
      return Object.getPrototypeOf(this);
    }

    /**
     * @private
     */
    static get nuAllAttrs() {
      return (
        ATTRS_MAP[this.nuTag] ||
        (ATTRS_MAP[this.nuTag] = {
          ...(this.nuParent.nuAllAttrs || {}),
          ...this.nuAttrs
        })
      );
    }

    /**
     * Element attribute config.
     * @returns {Object}
     */
    static get nuAttrs() {
      return {
        id: '',
      };
    }

    /**
     * List of attributes.
     * @returns {Array}
     */
    static get nuAttrsList() {
      return Object.keys(this.nuAllAttrs);
    }

    /**
     * Element default attribute values.
     * They are used only to generate initial CSS for elements.
     */
    static get nuDefaults() {
      return {
        display: 'none',
      };
    }

    /**
     * @private
     */
    static get nuAllDefaults() {
      return (
        DEFAULTS_MAP[this.nuTag] ||
        (DEFAULTS_MAP[this.nuTag] = {
          ...(this.nuParent.nuAllDefaults || {}),
          ...this.nuDefaults,
        })
      );
    }

    /**
     * @private
     * @returns {String[]}
     */
    static get observedAttributes() {
      return this.nuAttrsList;
    }

    static nuInit() {
      const tag = this.nuTag;

      if (!tag || TAG_LIST.includes(tag)) return;

      TAG_LIST.push(tag);

      let el = this,
        css = '';

      do {
        if (!el.nuCSS) break;
        if (el.nuCSS === (el.nuParent && el.nuParent.nuCSS)) continue;

        css = `${el.nuCSS(this)}${css}`;
      } while ((el = el.nuParent));

      const allAttrs = this.nuAllAttrs;
      const allDefaults = this.nuAllDefaults;

      let defaultsCSS = '';

      Object.keys(allDefaults)
        .forEach(name => {
          const value = allDefaults[name];

          if (value == null) return;

          const styles = computeStyles(name, String(value), allAttrs, allDefaults);

          if (!styles) return;

          const query = name === 'mod' ? tag : `${tag}:not([${name}])`;

          defaultsCSS += generateCSS(query, styles);
        });

      injectStyleTag(`${css}${defaultsCSS}`, tag);

      customElements.define(tag, this);

      log('custom element registered', tag);

      return tag;
    }

    /**
     * @private
     * @param {String} name
     * @param {*} oldValue
     * @param {*} value
     */
    attributeChangedCallback(name, oldValue, value) {
      {
        if (this.hasAttribute('debug')) {
          this.nuDebug('attribute changed', { name, oldValue, value });
        }
      }

      this.nuChanged(name, oldValue, value);
    }

    /**
     * @private
     */
    connectedCallback() {
      this.nuConnected();

      this.nuIsMounted = true;
    }

    /**
     * @private
     */
    disconnectedCallback() {
      this.nuDisconnected();
    }

    /**
     * Get ID of the element. Generate it if it's not presented.
     * @returns {String}
     */
    get nuId() {
      if (this.id && this.id.includes('--')) return this.id;

      return generateId(this);
    }

    /**
     * Set a local modifier.
     * @param {String} name
     * @param {String|boolean|*} value - TRUE sets attribute without false, FALSE = removes attribute.
     */
    nuSetMod(name, value) {
      const mod = `nu-${name}`;

      if (value === false || value == null) {
        this.removeAttribute(mod);
      } else {
        this.setAttribute(mod, value === true ? '' : value);
      }
    }

    /**
     * Check if element have a local modifier with specific name.
     * @param {String} name
     * @returns {boolean}
     */
    nuHasMod(name) {
      const mod = `nu-${name}`;

      return this.hasAttribute(mod);
    }

    /**
     * Emit custom event.
     * @param {String} name
     * @param {*} detail
     */
    nuEmit(name, detail = null) {
      this.dispatchEvent(
        new CustomEvent(name, {
          detail,
          bubbles: !this.hasAttribute('prevent')
        })
      );
    }

    /**
     * Attribute change reaction.
     * @param {String} name
     * @param {*} oldValue
     * @param {*} value
     */
    nuChanged(name, oldValue, value) {
      if (name === 'id') {
        return this.nuId;
      }
    }

    /**
     * Called when element is connected to the DOM.
     * Can be called more than once.
     * While using frameworks this method can be fired without element having parentNode.
     */
    nuConnected() {
      setTimeout(() => (this.nuParent = this.parentNode));
    }

    /**
     * Called when element is disconnected from the DOM.
     * Can be called more than once.
     */
    nuDisconnected() {
    }

    /**
     * Get parent that satisfies specified selector
     * @param {String} selector
     */
    nuQueryParent(selector) {
      return getParent(this, selector);
    }

    /**
     * Get closest element that satisfies specified selector
     * @param {String} selector
     */
    nuInvertQuery(selector) {
      return invertQuery(this, selector);
    }

    /**
     * Get closest element that satisfies specified selector
     * @param {String} id
     */
    nuInvertQueryById(id) {
      return invertQueryById(this, id);
    }

    /**
     * Write message to the console.
     * Works only if `debug` attribute is presented on the element.
     * @param args
     */
    nuDebug(...args) {
      {
        if (this.hasAttribute('debug')) {
          log({ $: this }, ...args);
        }
      }
    }
  }

  const THEME_SCHEME_ATTRS = [
    ...THEME_COLOR_ATTRS_LIST,
    'shadow-intensity',
    'shadow-opacity',
    'special-shadow-opacity',
  ];

  const THEME_ATTRS_LIST = [
    ...THEME_COLOR_ATTRS_LIST,
    'border-radius',
    'border-width',
    'padding',
    'shadow-intensity',
    'shadow-opacity',
    'animation-time',
    'special-shadow-opacity',
  ];

  function isColorScheme(themeName) {
    return themeName.endsWith('-dark') || themeName.endsWith('-light');
  }

  function getMainThemeName(themeName) {
    return themeName.replace('-dark', '').replace('-light', '');
  }

  function convertThemeName(theme, name) {
    const colorScheme = isColorScheme(name);

    return Object.keys(theme).reduce((map, style) => {
      if (colorScheme && THEME_SCHEME_ATTRS.includes(style)) return map;

      map[style.replace('theme', name)] = theme[style];

      return map;
    }, {});
  }

  function generateTheme(props, darkProps, parentProps) {
    const color = generalizeColor(props.color || parentProps.color);
    const backgroundColor = generalizeColor(props.backgroundColor || parentProps.backgroundColor);
    const specialColor = generalizeColor(props.specialColor || parentProps.specialColor);
    const borderColor = generalizeColor(props.borderColor || parentProps.borderColor);

    const lightTheme = {
      color,
      backgroundColor,
      borderColor,
      specialColor,
      minorColor: generalizeColor(props.minorColor),
      minorBackgroundColor: generalizeColor(props.minorBackgroundColor),
      borderRadius: convertUnit(props.borderRadius || parentProps.borderRadius),
      padding: convertUnit(props.padding || parentProps.padding),
      borderWidth: convertUnit(props.borderWidth || parentProps.borderWidth),
      shadowColor: generalizeColor(props.shadowColor || parentProps.shadowColor),
      specialBackgroundColor: props.specialBackgroundColor,
      // Use parent shadow intensity value only if both shadow color and shadow intensity
      // are not specified in the props
      shadowIntensity: props.shadowIntensity || (!props.shadowColor && parentProps.shadowIntensity),
      focusColor: generalizeColor(props.focusColor),
      headingColor: generalizeColor(props.headingColor),
      hoverColor: generalizeColor(props.hoverColor),
      specialHoverColor: generalizeColor(props.specialHoverColor),
      animationTime: props.animationTime || parentProps.animationTime,
    };

    lightTheme.specialBackgroundColor = lightTheme.specialBackgroundColor
      || (contastRatio(lightTheme.specialColor, lightTheme.backgroundColor) * 1.5 > contastRatio(lightTheme.specialColor, lightTheme.color)
        ? lightTheme.backgroundColor : lightTheme.color);

    let darkTheme;

    if (getLuminance(lightTheme.color) < getLuminance(lightTheme.backgroundColor)) {
      darkTheme = Object.keys(lightTheme)
        .reduce((vars, varName) => {
          if ((THEME_COLOR_ATTRS_LIST.includes(toKebabCase(varName)))
            && lightTheme[varName]
            && varName !== 'shadowColor') {
            vars[varName] = generalizeColor(darkProps[varName]) || invertColor(lightTheme[varName], 32);
          } else {
            vars[varName] = generalizeColor(darkProps[varName]) || lightTheme[varName];
          }

          return vars;
        }, {});

      const specialLightLuminance = getLuminance(lightTheme.specialColor);
      const specialDarkLuminance = getLuminance(darkTheme.specialColor);

      if (specialLightLuminance < specialDarkLuminance && specialLightLuminance > .3
        || specialLightLuminance > specialDarkLuminance && specialDarkLuminance < .3) {
        Object.assign(darkTheme, {
          specialColor: generalizeColor(darkProps.specialColor) || lightTheme.specialColor,
        });
      }

      darkTheme.specialBackgroundColor = generalizeColor(darkProps.specialBackgroundColor)
        || (contastRatio(darkTheme.specialColor, lightTheme.backgroundColor) * 1.5 > contastRatio(darkTheme.specialColor, lightTheme.color)
          ? lightTheme.backgroundColor : lightTheme.color);
    } else {
      darkTheme = { ...lightTheme };
    }

    return [lightTheme, darkTheme].map((theme, i) => {
      Object.assign(theme, {
        shadowIntensity: Number(theme.shadowIntensity
          || extractColor(theme.shadowColor)[3]),
        minorColor: theme.minorColor
          || mixColors(mixColors(theme.color, theme.specialColor, .2), theme.backgroundColor, .2),
        minorBackgroundColor: theme.minorBackgroundColor
          || mixColors(mixColors(theme.backgroundColor, theme.specialColor, .1), theme.color, .1),
        focusColor: theme.focusColor
          || mixColors(theme.specialColor, theme.backgroundColor),
        headingColor: theme.headingColor
          || (getLuminance(lightTheme.backgroundColor) > getLuminance(lightTheme.color)
            ? mixColors(theme.color, theme.backgroundColor, .1)
            : theme.color),
        hoverColor: setAlphaChannel(theme.hoverColor
          || theme.specialColor, .1),
        specialHoverColor: setAlphaChannel(theme.specialHoverColor
          || theme.specialBackgroundColor, .06),
      });

      const shadowIntensity = Math.min(Number(theme.shadowIntensity), 1);

      theme.shadowOpacity = Math.min(shadowIntensity
        * (.7 - getLuminance(theme.backgroundColor) * .5) * 5, 1);
      theme.specialShadowOpacity = Math.min(shadowIntensity
        * (.7 - getLuminance(theme.specialColor) * .5) * 5, 1);

      // if dark mode
      if (i && getLuminance(theme.specialBackgroundColor) > .9) {
        theme.specialColor = mixColors(theme.specialColor, 'rgba(0, 0, 0)', .1);
        theme.specialBackgroundColor = mixColors(theme.specialBackgroundColor, 'rgba(0, 0, 0)', .1);
      }

      theme.specialMinorColor = theme.specialMinorColor
          || mixColors(theme.specialBackgroundColor, theme.specialColor, .2);

      return Object.keys(theme).reduce((map, propName) => {
        map[`--nu-theme-${toKebabCase(propName)}`] = theme[propName];

        return map;
      }, {});
    });
  }

  const PLACE_VALUES = [
    'content', 'items', 'self'
  ].map((name) => {
    return CSS.supports(`place-${name}`, 'stretch stretch')
      ? `place-${name}` : function(val) {
        const values = val && val.trim().split(/\s+/);

        return val ? {
          [`align-${name}`]: values[0],
          [`justify-${name}`]: values[1] || values[0],
        } : null;
      };
  });

  const FLEX_MAP = {
    row: 'margin-right',
    column: 'margin-bottom',
    'row-reverse': 'margin-left',
    'column-reverse': 'margin-top'
  };

  const SIZINGS = {
    content: 'content-box',
    border: 'border-box',
  };

  const STROKE_STYLES = [
    'inside',
    'center',
    'outside',
  ];

  const BORDER_STYLES = [
    ...STROKE_STYLES,
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
  ];

  const DIRECTIONS = ['top', 'right', 'bottom', 'left'];
  const DIRECTIONS_HANDLERS = {
    top(val, outside) {
      return `0 calc(${val} * ${outside ? -1 : 1})`;
    },
    right(val, outside) {
      return `calc(${val} * ${outside ? 1 : -1}) 0`;
    },
    bottom(val, outside) {
      return `0 calc(${val} * ${outside ? 1 : -1})`;
    },
    left(val, outside) {
      return `calc(${val} * ${outside ? -1 : 1}) 0`;
    },
  };

  const plugins = {
    cursor: 'cursor',
    responsive: ''
  };

  const RESPONSIVE_ATTR = 'responsive';
  const backgroundUnit = colorUnit('background-color', 'background');
  const baseColorUnit = colorUnit('color', 'text');

  /**
   * @class
   * @abstract
   */
  class NuElement extends NuBase {
    static get nuTag() {
      return ''; // abstract tag
    }

    /**
     * Element ARIA Role.
     * @returns {String}
     */
    static get nuRole() {
      return '';
    }

    /**
     * Element attribute config.
     * @returns {Object}
     */
    static get nuAttrs() {
      return {
        /**
         * Handler to declare custom properties.
         * @private
         * @param {String} val - String that contains name and value of the property.
         * @returns {null|Object}
         */
        var(val) {
          if (!val) return null;

          const tmp = val.split(':');

          return { [tmp[0]]: convertUnit(tmp[1]) };
        },
        /**
         * CSS Display value.
         * @param val
         */
        display(val) {
          if (!val) return;

          return DOUBLE_DISPLAY.includes(val)
            ? [{
              $suffix: ':not([inline])',
              display: val,
            }, {
              $suffix: '[inline]',
              display: `inline-${val}`,
            }]
            : { display: val };
        },
        width: sizeUnit('width'),
        height: sizeUnit('height'),
        sizing(val) {
          val = SIZINGS[val];

          if (!val) return null;

          return { 'box-sizing': val };
        },
        radius: unit('border-radius', {
          multiplier: 'var(--nu-theme-border-radius)',
          empty: 'var(--nu-theme-border-radius)',
          property: true,
          convert: true,
        }),
        'items-radius': unit('border-radius', {
          suffix: '>:not([radius])',
          multiplier: 'var(--nu-theme-border-radius)',
          empty: 'var(--nu-theme-border-radius)',
          property: true,
          convert: true,
        }),
        padding: unit('padding', {
          multiplier: 'var(--nu-theme-padding)',
          empty: 'var(--nu-theme-padding)',
          convert: true,
        }),
        'items-padding': unit('padding', {
          suffix: '>:not[padding]',
          multiplier: 'var(--nu-theme-padding)',
          empty: 'var(--nu-theme-padding)',
          convert: true,
        }),
        space(val) {
          if (!val) return;

          val = convertUnit(val);

          const spaces = splitDimensions(val).map(sp =>
            !sp.match(/^0[^\.]/) ? `calc(${sp} * -1)` : ''
          );

          return {
            'margin-top': spaces[0],
            'margin-right': spaces[1],
            'margin-bottom': spaces[2],
            'margin-left': spaces[3]
          };
        },
        border(val) {
          if (val == null) return val;

          let style = 'solid';
          let dirs = [];
          let color = 'var(--nu-theme-border-color)';

          const newVal = excludeMod(val, 'special');

          if (newVal != null) {
            val = newVal;
            color = 'var(--nu-theme-special-color)';
          }

          for (let s of BORDER_STYLES) {
            const newVal = excludeMod(val, s);

            if (newVal != null) {
              val = newVal;
              style = s;
            }
          }

          for (let s of DIRECTIONS) {
            const newVal = excludeMod(val, s);

            if (newVal != null) {
              val = newVal;
              dirs.push(s);
            }
          }

          val = val
            ? convertUnit(val, 'var(--nu-theme-border-width)')
            : 'var(--nu-theme-border-width)';

          if (style === 'center') {
            val = `calc(${val} / 2)`;
          }

          if (style === 'hidden') {
            style = 'solid';
            color = 'transparent';
          }

          if (STROKE_STYLES.includes(style)) {
            if (dirs.length) {
              return {
                '--nu-stroke-shadow': dirs.map(dir => {
                  let pos = DIRECTIONS_HANDLERS[dir];

                  return `${style !== 'inside' ? pos(val, true) : '0 0'} 0 ${dirs.length ? 0 : val} ${color},
                  inset ${style !== 'outside' ? pos(val) : '0 0'} 0 ${dirs.length ? 0 : val} ${color}`;
                }).join(','),
              };
            }

            return {
              '--nu-stroke-shadow': `0 0 0 ${style !== 'inside' ? val : 0} ${color},
            inset 0 0 0 ${style !== 'outside' ? val : 0} ${color}`,
            };
          }

          const border = `${val} ${style} ${color}`;

          if (dirs.length) {
            return dirs.reduce((styles, dir) => {
              styles[`border-${dir}`] = border;

              return styles;
            }, {});
          }

          return { border };
        },
        shadow(val) {
          if (val == null) return val;

          const depth = val === '' ? '1rem' : convertUnit(val, '.5rem');

          return {
            '--nu-depth-shadow': `0 0 ${depth} rgba(0, 0, 0, calc(var(--nu-theme-shadow-opacity) / ${(Number(val) ||
            1) * 2}))`,
          };
        },
        /**
         * CSS Flow value. Used for flex and grid layouts.
         * @param val
         * @returns {*[]}
         */
        flow(val, defaults) {
          if (!val) return;

          const flexValue = `${val} nowrap`;
          const isFlexByDefault = defaults.display.endsWith('flex');
          const isGridByDefault = defaults.display.endsWith('grid');
          const isGridValue = CSS.supports('grid-auto-flow', val);
          const isFlexValue = CSS.supports('flex-flow', flexValue);

          const dirStyle = FLEX_MAP[val];
          const arr = [];

          if (isGridValue) {
            if (isGridByDefault) {
              arr.push({
                $suffix: ':not([display])',
                'grid-auto-flow': val,
              });
            } else {
              arr.push({
                $suffix: '[display$="grid"]',
                'grid-auto-flow': val,
              });
            }
          }

          if (isFlexValue) {
            if (isFlexByDefault) {
              arr.push({
                $suffix: ':not([display])',
                'flex-flow': flexValue,
              }, {
                $suffix: `:not([display])>:not(:last-child)`,
                [dirStyle]: 'var(--nu-flex-gap)',
              });
            }

            arr.push({
              $suffix: '[display$="flex"]',
              'flex-flow': flexValue,
            }, {
              $suffix: `[display$="flex"]>:not(:last-child)`,
              [dirStyle]: 'var(--nu-flex-gap)',
            });
          }

          return arr;
        },
        /**
         * CSS Gap value. Used for flex and grid layouts.
         * @param val
         * @returns {*}
         */
        gap(val, defaults) {
          val = convertUnit(val || '0');

          const isFlexByDefault = defaults.display.endsWith('flex');
          const isGridByDefault = defaults.display.endsWith('grid');

          const arr = [{
            $suffix: '[display$="grid"]',
            'grid-gap': val,
          }, {
            $suffix: `[display$="flex"]>*`,
            '--nu-flex-gap': val,
          }];

          if (isGridByDefault) {
            arr.push({
              $suffix: ':not([display])',
              'grid-gap': val,
            });
          }

          if (isFlexByDefault) {
            arr.push({
              $suffix: `:not([display])>*`,
              '--nu-flex-gap': val,
            });
          }

          return arr;
        },
        order: 'order',
        grow: 'flex-grow',
        shrink: 'flex-shrink',
        basis: unit('flex-basis', { convert: true }),
        'items-basis': unit('flex-basis', { suffix: '>:not([basis])', convert: true }),
        'items-grow': unit('flex-grow', { suffix: '>:not([grow])' }),
        'items-shrink': unit('flex-shrink', { suffix: '>:not([shrink])' }),
        'place-content': PLACE_VALUES[0],
        'place-items': PLACE_VALUES[1],
        'content': PLACE_VALUES[0],
        'items': PLACE_VALUES[1],
        'template-areas': 'grid-template-areas',
        areas: 'grid-template-areas',
        'auto-flow': 'grid-auto-flow',
        'template-columns': unit('grid-template-columns', { convert: true }),
        'template-rows': unit('grid-template-rows', { convert: true }),
        columns: unit('grid-template-columns', { convert: true }),
        rows: unit('grid-template-rows', { convert: true }),
        column: 'grid-column',
        row: 'grid-row',
        area: 'grid-area',
        'place-self': PLACE_VALUES[2],
        place: PLACE_VALUES[2],
        /**
         * Apply theme to the element by providing specific custom properties.
         * @param {String} val - Theme name.
         * @returns {*}
         */
        theme(val) {
          if (val == null) return;

          if (!val) val = 'default';

          const colorScheme = isColorScheme(val);
          const mainThemeName = getMainThemeName(val);

          const themeStyles = THEME_ATTRS_LIST.reduce((obj, name) => {
            if (colorScheme && THEME_SCHEME_ATTRS.includes(name)) {
              obj[`--nu-theme-${name}`] = `var(--nu-${mainThemeName}-${name})`;
            } else {
              obj[`--nu-theme-${name}`] = `var(--nu-${val}-${name})`;
            }

            return obj;
          }, {});

          themeStyles.color = themeStyles['--nu-theme-color'];

          return themeStyles;
        },
        color(val) {
          if (val == null) return;

          if (val.includes(' ')) {
            const tmp = val.split(' ');

            return {
              ...baseColorUnit(tmp[0]),
              ...backgroundUnit(tmp[1]),
            };
          }

          return baseColorUnit(val);
        },
        background(val) {
          if (val && (val.includes('url(') || val.includes('gradient'))) {
            return {
              background: val,
            };
          }

          return backgroundUnit(val);
        },
        transform(val) {
          return val ? { 'transform': val } : null;
        },
        /**
         * Apply modifier styles.
         * @param {String} val - String that contains modifiers separated by space.
         */
        mod(val) {
          if (!val) return;

          return Modifiers.get(val);
        },
        cursor(val) {
          return val
            ? {
              cursor: val
            }
            : null;
        },
        size(val) {
          if (!val) return null;

          const tmp = val.trim().split(/\s+/);
          const values = [];

          values[0] = SIZES[tmp[0]] ? String(SIZES[tmp[0]][0]) : tmp[0];

          if (!tmp[1] && SIZES[tmp[0]]) {
            values[1] = String(SIZES[tmp[0]][1]);
          } else {
            values[1] = SIZES[tmp[1]] ? String(SIZES[tmp[1]][1]) : tmp[1];
          }

          return {
            'font-size': convertUnit(values[0]),
            'line-height': convertUnit(values[1] || '1.5')
          };
        },
        hidden(val) {
          if (val !== 'true' && val !== '') return null;

          return { display: 'none !important' };
        },
        opacity(val) {
          if (val == null) return;

          return { opacity: val };
        },
        transition(val) {
          if (val == null) return;

          val = val.split(',').map(s => `${s} var(--nu-theme-animation-time) linear`).join(',');

          return { transition: val };
        },
        ...plugins,
        controls: '',
        label: '',
        labelledby: '',
        describedby: '',
      };
    }

    /**
     * @private
     * @returns {String[]}
     */
    static get nuAttrsList() {
      return Object.keys(this.nuAllAttrs);
    }

    /**
     * Element default attribute values.
     * They are used only to generate initial CSS for elements.
     */
    static get nuDefaults() {
      return {
        display: 'inline-block',
        sizing: 'border',
      };
    }

    /**
     * Element initialization logic
     */
    static nuCSS({ nuTag }) {
      return `
      ${nuTag}[nu-hidden] {
        display: none !important;
      }
      ${nuTag}{
        --nu-depth-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        --nu-stroke-shadow: 0 0 0 0 rgba(0, 0, 0, 0), inset 0 0 0 0 rgba(0, 0, 0, 0);
        --nu-toggle-shadow: 0 0 0 0 rgba(0, 0, 0, 0) inset;

        box-shadow: var(--nu-stroke-shadow),
          var(--nu-toggle-shadow),
          var(--nu-depth-shadow);
      }
    `;
    }

    /**
     * @private
     * @returns {String[]}
     */
    static get observedAttributes() {
      return this.nuAttrsList;
    }

    get nuRole() {
      return this.getAttribute('role') || this.constructor.nuRole;
    }

    set nuRole(value) {
      this.setAttribute('role', value);
    }

    constructor() {
      super();

      this.nuTabIndex = 0;
      this.nuRef = null;
      this.nuThemes = {};
    }

    /**
     * @private
     */
    connectedCallback() {
      const nuRole = this.constructor.nuRole;

      if (!this.hasAttribute('role') && nuRole) {
        this.setAttribute('role', nuRole);
      }

      this.nuConnected();

      this.nuIsMounted = true;
    }

    /**
     * @private
     * @param {String} name
     * @param {*} oldValue
     * @param {*} value
     */
    attributeChangedCallback(name, oldValue, value) {
      super.attributeChangedCallback(name, oldValue, value);

      if (value == null || !this.constructor.nuAllAttrs[name]) return;

      this.nuApplyCSS(name, value);
    }

    /**
     * Generate CSS for specific query, attribute and its value.
     * Is used as separate method to provide API for decorators.
     * @param {String} query - CSS query to apply styles.
     * @param {String} name - attribute (handler) name.
     * @param {String} value - attribute value (handler argument).
     * @returns {undefined|String} - output css
     */
    nuGetCSS(query, name, value) {
      const isResponsive = value.includes('|');

      if (isResponsive) {
        this.nuSetMod(RESPONSIVE_ATTR, true);

        // if (value !== this.getAttribute(name)) return;

        let respEl = this;

        while (respEl && (!respEl.getAttribute || !respEl.getAttribute(RESPONSIVE_ATTR) || !respEl.nuResponsive)) {
          respEl = respEl.parentNode;
        }

        if (!respEl) {
          setTimeout(() => {
            const newValue = this.getAttribute(name);

            if (value !== newValue) return;

            this.nuApplyCSS(name, value);
          }, 100);

          return;
        }

        const values = value.split('|');
        const styles = values.map((val, i) => {
          // if default value
          if (val && !val.trim()) return;

          // if repeat value
          if (!val) {
            // if first element - nothing to repeat
            if (!i) return;

            for (let j = i - 1; j >= 0; j--) {
              if (values[j]) {
                val = values[j];
                break;
              }
            }

            if (!val) {
              // nothing to repeat;
              return;
            }
          }

          const stls = computeStyles(name, val, this.constructor.nuAllAttrs, this.constructor.nuAllDefaults);

          return generateCSS(query, stls);
        });

        return respEl.nuResponsive()(styles);
      }

      let styles = computeStyles(name, value, this.constructor.nuAllAttrs, this.constructor.nuAllDefaults);

      return generateCSS(query, styles);
    }

    /**
     * Create and apply CSS based on element's attributes.
     * @param {String} name
     * @param {*} value
     * @param {*} force - replace current CSS rule
     */
    nuApplyCSS(name, value, force = false) {
      // do not handle [var] attribute, it's for nu-var purposes.
      if (name === 'var') return;

      const isResponsive = value.includes('|');

      let query;

      if (isResponsive) {
        query = `${this.nuGetContext(RESPONSIVE_ATTR)}${this.nuGetQuery(
        { [name]: value },
        this.getAttribute(RESPONSIVE_ATTR)
      )}`;
      } else {
        query = this.nuGetQuery({ [name]: value });
      }

      if (hasCSS(query)) {
        if (!force) return;

        removeCSS(query);
      }

      const css = this.nuGetCSS(query, name, value);

      if (css) {
        injectCSS(query, query, css);
      }
    }

    /**
     * Set aria attribute.
     * @param {String} name
     * @param {Boolean|String} value
     */
    nuSetAria(name, value) {
      if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      }

      if (value == null) {
        this.removeAttribute(`aria-${name}`);
      } else {
        this.setAttribute(`aria-${name}`, value);
      }
    }

    /**
     * Build a query with current tag name and provided attribute value.
     * @param {Object} attrs - dict of attributes with their values.
     * @param {Boolean} useId - add ID to the query.
     * @returns {string}
     */
    nuGetQuery(attrs = {}, useId) {
      return `${useId ? '' : this.constructor.nuTag}${useId ? `#${this.nuId}` : ''}${attrsQuery(
      attrs
    )}`;
    }

    /**
     * Make element focusable or temporarily disable that ability.
     * @param {boolean} bool
     */
    nuSetFocusable(bool) {
      if (bool) {
        (this.nuRef || this).setAttribute('tabindex', this.nuTabIndex);
      } else {
        (this.nuRef || this).removeAttribute('tabindex');
      }

      if (this.nuFocusable) return;

      (this.nuRef || this).addEventListener('focus', () => {
        this.nuSetMod('focus', true);
      });

      (this.nuRef || this).addEventListener('blur', () => {
        this.nuSetMod('focus', false);
      });

      if (document.activeElement === this.nuRef) {
        this.nuSetMod('focus', true);
      }

      this.nuFocusable = true;
    }

    /**
     * Called when element is connected to the DOM.
     * Can be called twice or more.
     * While using frameworks this method can be fired without element having parentNode.
     */
    nuConnected() {
    }

    /**
     * Attribute change reaction.
     * @param {String} name
     * @param {*} oldValue
     * @param {*} value
     */
    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      switch (name) {
        case RESPONSIVE_ATTR:
          generateId(this);

          setTimeout(() => {
            if (this.getAttribute(RESPONSIVE_ATTR) !== value) return;
            /**
             * @type {NuElement[]}
             */
            const elements = this.querySelectorAll('[nu-responsive]');

            [...elements].forEach(el => {
              if (el.nuApplyCSS) {
                [...el.attributes].forEach(({ name, value }) => {
                  if (!el.constructor.nuAttrsList.includes(name) || !value.includes('|')) return;

                  el.nuApplyCSS(name, value, true);
                });
              }
            });
          }, 0);
          break;
        case 'label':
        case 'valuemin':
        case 'valuemax':
        case 'valuenow':
        case 'setsize':
        case 'posinset':
          this.nuSetAria(name, value);
          break;
        case 'controls':
        case 'labelledby':
        case 'describedby':
        case 'owns':
        case 'flowto':
        case 'activedescendant':
          setImmediate(() => {
            const ariaValue = value.split(/\s+/g).map((id) => {
              const link = this.nuInvertQueryById(id);

              if (!link) return '';

              return generateId(link);
            }).join(' ');

            if (ariaValue.trim()) {
              this.nuSetAria(name, ariaValue);
            }
          });
          break;
      }
    }

    /**
     * Return responsive decorator for the styles set.
     * @returns {*}
     */
    nuResponsive() {
      const points = this.getAttribute('responsive');

      if (this.nuReponsiveFor === points) return this.nuResponsiveDecorator;

      this.nuReponsiveFor = points;

      if (!points) {
        return (this.nuResponsiveDecorator = styles => styles);
      }

      const tmpPoints = points.split(/\|/);

      const mediaPoints = tmpPoints.map((point, i) => {
        if (!i) {
          return `@media (min-width: ${point})`;
        }

        const prevPoint = tmpPoints[i - 1];

        return `@media (max-width: calc(${prevPoint} - 1px)) and (min-width: ${point})`;
      });

      mediaPoints.push(`@media (max-width: calc(${tmpPoints.slice(-1)[0]} - 1px))`);

      return (this.nuResponsiveDecorator = styles => {
        return mediaPoints
          .map((point, i) => {
            let stls;

            if (styles[i]) {
              stls = styles[i];
            } else {
              for (let j = i - 1; j >= 0; j--) {
                if (styles[j]) {
                  stls = styles[j];
                  break;
                }
              }
            }

            return `${point}{\n${stls || ''}\n}\n`;
          })
          .join('');
      });
    }

    /**
     * Get query context of the current element.
     * It find all parent elements with provided attribute and built sequence with their ids.
     * @param {String} attrName
     * @returns {String} - CSS query
     */
    nuGetContext(attrName) {
      let context = '',
        el = this;

      while ((el = el.parentNode)) {
        if (el.getAttribute && el.getAttribute(attrName) && el.nuId) {
          context = `#${el.nuId} ${context}`;
        }
      }

      return context;
    }

    /**
     * Declare theme in current context.
     * @param {String} name – Theme name.
     * @param {Object} props - Light theme props.
     * @param {Object} props - Dark theme props.
     */
    nuDeclareTheme(name, props, darkProps = {}) {
      if (
        this.nuThemes[name] &&
        this.nuThemes[name].styleElement &&
        this.nuThemes[name].styleElement.parentNode
      ) {
        let el = this.nuThemes[name].styleElement;

        el.parentNode.removeChild(el);
      }

      if (!props) {
        delete this.nuThemes[name];
        this.nuSetMod(`themes`, Object.keys(this.nuThemes).join(' '));

        return;
      }

      if (name !== 'default' && this.nuThemes.default) {
        props = {
          ...{
            ...this.nuThemes.default.light,
            ...this.nuThemes.default.dark
          },
          ...props
        };
      }

      generateId(this);

      const parentStyles = window.getComputedStyle(this.parentNode);
      const parentProps = THEME_ATTRS_LIST.reduce((map$$1, name) => {
        const themeName = toKebabCase(name);
        const propName = `--nu-default-${themeName}`;
        const value = parentStyles.getPropertyValue(propName);

        if (value) {
          map$$1[toCamelCase(name)] = value;
        }

        return map$$1;
      }, {});

      [props, darkProps].forEach(themeProps => {
        Object.keys(themeProps).forEach(name => {
          if (themeProps[name] && ~themeProps[name].indexOf('var(')) {
            const varName = themeProps[name].trim().slice(4, -1);

            themeProps[name] = parentStyles.getPropertyValue(varName).trim();
          }
        });
      });

      const [lightTheme, darkTheme] = generateTheme(props, darkProps, parentProps);

      const baseQuery = `#${this.nuId}`;
      const forceLightStyles = stylesString(convertThemeName(lightTheme, `${name}-light`));
      const forceDarkStyles = stylesString(convertThemeName(darkTheme, `${name}-dark`));
      const lightStyles = stylesString(convertThemeName(lightTheme, name));
      const darkStyles = stylesString(convertThemeName(darkTheme, name));
      const defaultStyles =
        name === 'default'
          ? stylesString(
          THEME_ATTRS_LIST.reduce((obj, attr) => {
            obj[`--nu-theme-${attr}`] = `var(--nu-${name}-${attr})`;

            return obj;
          }, {})
          )
          : '';
      const commonCSS = `
      ${defaultStyles ? `${baseQuery}{${defaultStyles}}` : ''}
      ${baseQuery}{${forceLightStyles}${forceDarkStyles}}
    `;

      let styleElement;

      if (matchMedia('(prefers-color-scheme)').matches) {
        styleElement = injectCSS(
          `theme:${name}:${baseQuery}`,
          baseQuery,
          `
        ${commonCSS}
        @media (prefers-color-scheme: dark) {
          html.nu-prefers-color-scheme ${baseQuery}{${darkStyles}}
          html.nu-prefers-color-scheme-dark ${baseQuery}{${darkStyles}}
          html.nu-prefers-color-scheme-light ${baseQuery}{${lightStyles}}
        }
        @media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
          html.nu-prefers-color-scheme ${baseQuery}{${lightStyles}}
          html.nu-prefers-color-scheme-light ${baseQuery}{${lightStyles}}
          html.nu-prefers-color-scheme-dark ${baseQuery}{${darkStyles}}
        }
        html:not(.nu-prefers-color-scheme):not(.nu-prefers-color-scheme-light):not(.nu-prefers-color-scheme-dark) ${baseQuery}{${lightStyles}}
      `
        ).element;
      } else {
        styleElement = injectCSS(
          `theme:${baseQuery}`,
          baseQuery,
          `
        ${commonCSS}
        html:not(.nu-prefers-color-scheme-dark) ${baseQuery}{${lightStyles}}
        html.nu-prefers-color-scheme-dark ${baseQuery}{${darkStyles}}
      `
        ).element;
      }

      this.nuThemes[name] = {
        light: lightStyles,
        dark: darkStyles,
        styleElement
      };

      this.nuSetMod(`themes`, Object.keys(this.nuThemes).join(' '));
    }
  }

  class NuBlock extends NuElement {
    static get nuTag() {
      return 'nu-block';
    }

    static get nuDefaults() {
      return {
        display: 'block',
      };
    }
  }

  class NuGrid extends NuBlock {
    static get nuTag() {
      return 'nu-grid';
    }

    static get nuDefaults() {
      return {
        display: 'grid',
        flow: 'row',
      };
    }
  }

  const LEVELS = [1,2,3,4,5,6];

  class NuHeading extends NuBlock {
    static get nuTag() {
      return 'nu-heading';
    }

    static get nuRole() {
      return 'heading';
    }

    static get nuAttrs() {
      return {
        level(val) {
          if (!val || !LEVELS.includes(Number(val))) val = 1;

          return [{
            $suffix: ':not([size])',
            'font-size': `${SIZES[`h${val}`][0]}rem`,
            'line-height': `${SIZES[`h${val}`][1]}rem`,
          }, {
            'font-weight': `${SIZES[`h${val}`][2]}`,
          }];
        },
      };
    }

    static get nuDefaultLevel() {
      return 1;
    }

    static get nuDefaults() {
      return {
        level: 1,
        color: 'var(--nu-theme-heading-color)',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        position: relative;
      }
    `;
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      switch (name) {
        case 'level':
          if (!value) value = 1;

          if (!LEVELS.includes(Number(value))) {
            return warn('invalid heading level', value);
          }

          this.nuSetAria('level', value);
          break;
      }
    }

    nuConnected() {
      super.nuConnected();

      if (!this.hasAttribute('level')) {
        this.nuChanged('level');
      }
    }
  }

  let featherPromise;

  class NuIcon extends NuBlock {
    static get nuTag() {
      return 'nu-icon';
    }

    static get nuRole() {
      return 'img';
    }

    static nuLoader(name) {
      return (
        featherPromise ||
        (featherPromise = !window.feather
          ? injectScript('https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.22.1/feather.js')
          : Promise.resolve())
      ).then(() => window.feather.icons[name].toSvg());
    }

    static get nuAttrs() {
      return {
        size(val) {
          const converted = convertUnit(val || '');

          return val ? {
            'min-width': converted,
            'min-height': converted,
            '--nu-size': converted,
          } : null;
        },
        name(val, defaults) {
          return val
            ? {
              $suffix: ` > [name="${val}"]`,
              display: `${defaults.display} !important`,
            } : null;
        },
      };
    }

    static get nuDefaults() {
      return {
        display: 'inline-block',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-size: 1em;

        position: relative;
        vertical-align: middle;
        min-width: 1em;
        min-height: 1em;
        background-color: transparent !important;
      }

      ${nuTag} > svg {
        position: absolute;
        left: 50%;
        top: 50%;
        width: var(--nu-size);
        height: var(--nu-size);
        transform: translate(-50%, -50%);
      }

      ${nuTag} > :not(svg) {
        display: none;
      }

      ${nuTag}[inline] {
        bottom: 0.0675em;
      }
    `;
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      if (name === 'name') {
        const names = parseAllValues(value);

        // empty tag
        this.innerHTML = '';

        names.forEach(name => {
          if (this.querySelector(`svg[name="${name}"]`)) return;

          this.constructor.nuLoader(name).then(svg => {
            const svgNode = svgElement(svg);

            svgNode.setAttribute('name', name);
            svgNode.style.display = 'none';

            this.appendChild(svgNode);
          });
        });
      }
    }

    nuUpdateTheme(attrTheme) {
      super.nuUpdateTheme(attrTheme);
    }
  }

  class NuLine extends NuBlock {
    static get nuTag() {
      return 'nu-line';
    }

    static get nuRole() {
      return 'separator';
    }

    static get nuAttrs() {
      return {
        orient(val) {
          if (val === 'y') {
            return {
              'min-width': 'var(--nu-line-size)',
              'max-width': 'var(--nu-line-size)',
              'min-height': '100%',
              'max-height': '100%',
              'grid-row': '1 / -1',
            };
          } else {
            return {
              'min-height': 'var(--nu-line-size)',
              'max-height': 'var(--nu-line-size)',
              'min-width': '100%',
              'max-width': '100%',
              'grid-column': '1 / -1',
            };
          }
        },
        size: unit('--nu-line-size'),
        background: null,
      };
    }

    static get nuDefaults() {
      return {
        place: 'stretch',
        orient: 'x',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-line-size: var(--nu-theme-border-width);

        position: relative;
        line-height: 0;
        background-color: currentColor !important;
        color: var(--nu-theme-border-color);
      }

      ${nuTag}[special]:not([color]) {
        color: var(--nu-theme-special-color);
      }
    `;
    }
  }

  class NuFlex extends NuBlock {
    static get nuTag() {
      return 'nu-flex';
    }

    static get nuDefaults() {
      return {
        display: 'flex',
        flow: 'row',
        gap: 0,
      };
    }
  }

  class NuPane extends NuFlex {
    static get nuTag() {
      return 'nu-pane';
    }

    static get nuDefaults() {
      return {
        'place-content': 'stretch space-between',
        'place-items': 'center',
        gap: .5,
        width: '100%',
      };
    }
  }

  class NuCard extends NuBlock {
    static get nuTag() {
      return 'nu-card';
    }

    static get nuDefaults() {
      return {
        padding: '2x',
        color: '',
        background: '',
        border: '1x',
        radius: '1x',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        transition: background var(--nu-theme-animation-time) linear,
          color var(--nu-theme-animation-time) linear,
          box-shadow var(--nu-theme-animation-time) linear,
          transform var(--nu-theme-animation-time) linear,
          border var(--nu-theme-animation-time) linear,
          border-radius var(--nu-theme-animation-time) linear;
        position: relative;
        scrollbar-width: none;
      }
    `;
    }
  }

  class NuFlow extends NuFlex {
    static get nuTag() {
      return 'nu-flow';
    }

    static get nuDefaults() {
      return {
        flow: 'column',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag}{
        align-content: stretch;
        justify-content: flex-start;
        align-items: stretch;
      }
    `;
    }
  }

  function focusable(tag, { force, cell } = {}) {
    const context = force
      ? ''
      : `html.nu-focus-enabled `;

    return `
    ${tag} {
      --nu-focus-color: transparent;
      --nu-focus-inset: ${cell ? 'inset' : '0 0'};
      --nu-focus-shadow: var(--nu-focus-inset) 0 0.1875rem var(--nu-focus-color);

      outline: none;
    }

    ${context}${tag}:not([disabled])::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      border-radius: var(--nu-border-radius);
      box-shadow: var(--nu-focus-shadow);
      transition: box-shadow var(--nu-theme-animation-time) linear;
    }
    ${context}${tag}:not([disabled])[nu-focus] {
      z-index: 10;
    }
    ${context}${tag}:not([disabled])[nu-focus] {
      --nu-focus-color: var(--nu-theme-focus-color);
    }
    ${context}${tag}:not([disabled])[nu-focus]${cell ? '' : '[cell]'} {
      --nu-focus-inset: inset 0 0;
    }
  `;
  }

  class NuAbstractBtn extends NuGrid {
    static get nuTag() {
      return 'nu-abstract-btn';
    }

    static get nuRole() {
      return 'button';
    }

    static get nuAttrs() {
      return {
        disabled: '',
        pressed: '',
        href: '',
        target: '',
        controls: '',
        value: '',
        background: colorUnit('background-color', 'background'),
      };
    }

    static get nuDefaults() {
      return {
        display: 'inline-grid',
        padding: '1x',
        color: 'inherit',
        background: '',
        radius: '',
        mod: 'nowrap',
        flow: 'column',
        content: 'center',
        gap: .5,
        transition: 'box-shadow, color, background-image, background-color',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-toggle-color: transparent;
        --nu-depth-color: transparent;
        --nu-hover-color: transparent;
        --nu-depth-shadow: 0 0 0 rgba(0, 0, 0, 0);

        position: relative;
        user-select: none;
        vertical-align: middle;
        opacity: 1;
        z-index: 0; /* to make :hover::after z-index work as expected */
        background-image: linear-gradient(to right, var(--nu-hover-color), var(--nu-hover-color));
      }

      ${nuTag}[tabindex] {
        cursor: pointer;
      }

      ${nuTag}[disabled] {
        opacity: .5;
        cursor: default;
      }

      ${nuTag}[nu-active] {
        z-index: 2;
      }

      ${nuTag}[aria-pressed="true"] {
        z-index: 1;
      }

      ${focusable(nuTag)}
    `;
    }

    nuConnected() {
      super.nuConnected();

      if (!this.hasAttribute('pressed')) {
        this.nuSetValue(false);
      }

      this.nuSetFocusable(!this.hasAttribute('disabled'));

      bindActiveEvents.call(this);

      setTimeout(() => {
        if (!this.parentNode) return;

        switch (this.parentNode.tagName) {
          case 'NU-BTN-GROUP':
            if (this.parentNode.nuGetValue()) {
              this.setAttribute('role', 'radio');
            }
            break;
          case 'NU-MENU':
            this.setAttribute('role', 'menuitem');
            break;
          case 'NU-TABLIST':
            this.setAttribute('role', 'tab');
            break;
          default:
            return;
        }

        if (this.parentNode.nuSetValue) {
          this.parentNode.nuSetValue(this.parentNode.nuGetValue(), false);
        }
      }, 0);
    }

    nuTap() {
      if (this.hasAttribute('disabled')) return;

      this.nuEmit('tap');

      const parent = this.parentNode;
      const value = this.nuGetValue();

      if (value && parent.nuSetValue && parent.nuGetValue() !== value) {
        parent.nuSetValue(value);
      }
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      switch (name) {
        case 'disabled':
          this.nuSetMod('disabled', value != null);
          this.nuSetFocusable(value == null);
          break;
        case 'pressed':
          value = value != null;

          if (value && parent.nuSetValue) {
            parent.nuSetValue(value);
          } else {
            this.nuSetValue(value);
          }

          break;
        case 'value':
          if (this.parentNode && this.parentNode.nuSetValue) {
            this.parentNode.nuSetValue(this.parentNode.nuGetValue());
          }
          break;
      }
    }

    nuSetValue(value) {
      this.nuSetAria('pressed', value);

      setImmediate(() => {
        if (this.nuRole !== 'tab') return;

        if (value !== this.pressed) return;

        const controlsName = this.getAttribute('controls');

        if (!controlsName) return;

        const link = this.nuInvertQueryById(controlsName);

        if (link && link.nuSetMod) {
          const linkId = generateId(link);
          const tabId = generateId(this);

          link.nuSetAria('controls', linkId);
          link.nuSetAria('labelledby', tabId);
          link.nuSetMod('hidden', !value);

          if (!link.nuRole) {
            link.nuRole = 'tabpanel';
          }
        }
      });
    }

    get pressed() {
      return this.getAttribute('aria-pressed') === 'true';
    }

    nuGetValue() {
      return this.getAttribute('value') || this.getAttribute('controls');
    }
  }

  class NuBtn extends NuAbstractBtn {
    static get nuTag() {
      return 'nu-btn';
    }

    static get nuDefaults() {
      return {
        padding: '1x 2x',
        border: '1x',
        radius: '1x',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-toggle-color: transparent;
        --nu-toggle-shadow: 0 0 .75em 0 var(--nu-toggle-color) inset;
      }

      ${nuTag}:not([disabled])[tabindex]:hover {
        --nu-hover-color: var(--nu-theme-hover-color);
      }

      ${nuTag}[disabled][aria-pressed="true"],
      ${nuTag}[nu-active]:not([disabled]):not([aria-pressed="true"]),
      ${nuTag}[aria-pressed="true"][role="radio"][nu-active]:not([disabled]),
      ${nuTag}[aria-pressed="true"]:not([disabled]):not([nu-active]) {
        --nu-toggle-color: rgba(0, 0, 0, var(--nu-theme-shadow-opacity));
      }

      ${nuTag}[special]:not([background]) {
        --nu-theme-shadow-opacity: var(--nu-theme-special-shadow-opacity);
        --nu-theme-hover-color: var(--nu-theme-special-hover-color);
        --nu-theme-heading-color: var(--nu-theme-special-background-color);
        background-color: var(--nu-theme-special-color) !important;
        color: var(--nu-theme-special-background-color) !important;
      }
      
      ${nuTag}[special]:not([background]) > * {
        --nu-theme-border-color: var(--nu-theme-special-background-color);
        --nu-theme-hover-color: --nu-theme-special-hover-color;
      }

      ${nuTag}[cell] {
        align-self: stretch;
        justify-self: stretch;
        width: 100%;
        height: 100%;
      }
      
      ${nuTag}[cell]:not([radius]) {
        --nu-border-radius: 0;
      }
      
      ${nuTag}[cell]:not([border]) {
        border: none;
      }
    `;
    }
  }

  class NuTab extends NuAbstractBtn {
    static get nuTag() {
      return 'nu-tab';
    }

    static get nuRole() {
      return 'tab';
    }

    static get nuDefaults() {
      return {
        padding: '.5x 0',
        background: 'transparent',
        radius: 0,
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-toggle-color: transparent;
        --nu-depth-color: transparent;
        --nu-stroke-color: transparent;

        --nu-toggle-shadow: 0 calc(-1 * var(--nu-theme-border-width)) 0 0 var(--nu-toggle-color) inset;
        --nu-depth-shadow: 0 0 0 rgba(0, 0, 0, 0);
      }

      ${nuTag}[nu-active][tabindex]:not([disabled]):not([nu-toggled]),
      ${nuTag}[nu-toggled]:not([disabled]):not([tabindex]) {
        --nu-toggle-shadow: 0 calc(1em / 16 * -3) 0 0 var(--nu-toggle-color) inset;
        --nu-toggle-color: var(--nu-theme-special-color);
      }

      ${nuTag}[special] {
        color: var(--nu-theme-special-color) !important;
      }

      ${nuTag}:not([disabled])[tabindex]:hover {
        --nu-toggle-color: var(--nu-theme-special-color);
      }

      ${nuTag}[nu-active][tabindex]:not([disabled]):not([aria-pressed="true"]),
      ${nuTag}[aria-pressed="true"]:not([disabled]):not([nu-active]) {
        --nu-toggle-shadow: 0 calc(1em / 16 * -3) 0 0 var(--nu-toggle-color) inset;
        --nu-toggle-color: var(--nu-theme-special-color);
      }
    `;
    }
  }

  class NuSwitch extends NuBlock {
    static get nuTag() {
      return 'nu-switch';
    }

    static get nuRole() {
      return 'switch';
    }

    static get nuAttrs() {
      return {
        disabled: '',
        checked: '',
      };
    }

    static get nuDefaults() {
      return {
        display: 'inline-block',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-depth-color: transparent;
        --nu-border-radius: calc(var(--nu-size) / 2);
        --nu-switch-color: rgba(0, 0, 0, 0);

        --nu-border-shadow: inset 0 0 0 var(--nu-theme-border-width) var(--nu-theme-border-color);
        --nu-depth-shadow: 0 .25rem 1.5rem var(--nu-depth-color);
        --nu-background-color: var(--nu-theme-background-color);
        --nu-switch-shadow: 0 0 1rem 0 var(--nu-switch-color) inset;

        --nu-size: 2em;
        --nu-circle-padding: calc(var(--nu-theme-border-width) * 4);
        --nu-circle-size: calc(var(--nu-size) - var(--nu-circle-padding) * 2);
        --nu-circle-offset: var(--nu-circle-padding);
        --nu-circle-opacity: 1;
        --nu-circle-border-radius: calc(var(--nu-circle-size) / 2);
        --nu-circle-background-color: var(--nu-theme-special-color);

        position: relative;
        width: calc(var(--nu-size) * 2);
        height: var(--nu-size);
        border-radius: var(--nu-border-radius);
        background-color: var(--nu-background-color);
        cursor: pointer;
        box-shadow: var(--nu-depth-shadow),
          var(--nu-switch-shadow),
          var(--nu-border-shadow);
        transition: box-shadow var(--nu-theme-animation-time) linear,
        filter var(--nu-theme-animation-time) linear;
        user-select: none;
        vertical-align: middle;
      }

      ${nuTag}::after {
        content: "";
        position: absolute;
        display: block;
        width: var(--nu-circle-size);
        height: var(--nu-circle-size);
        pointer-events: none;
        left: 0;
        top: var(--nu-circle-padding);
        transform: translate(var(--nu-circle-offset), 0);
        transition: transform var(--nu-theme-animation-time) linear,
          opacity var(--nu-theme-animation-time) linear,
          background-color var(--nu-theme-animation-time) linear;
        background-color: var(--nu-circle-background-color);
        border-radius: var(--nu-circle-border-radius);
        /*box-shadow: var(--nu-border-shadow);*/
        opacity: var(--nu-circle-opacity);
      }

      ${nuTag}[disabled] {
        opacity: .5;
        cursor: default;
      }

      ${nuTag}[aria-checked="true"] {
        --nu-background-color: var(--nu-theme-special-color);
        --nu-circle-offset: calc(var(--nu-size) * 2 - var(--nu-circle-padding) - var(--nu-circle-size));
        --nu-circle-opacity: 1;
        --nu-circle-background-color: var(--nu-theme-background-color);
      }

      ${nuTag}[nu-active]:not([disabled]):not([aria-checked="true"]) {
        --nu-switch-color: rgba(0, 0, 0, var(--nu-theme-shadow-opacity));
      }
      
      ${nuTag}[nu-active][aria-checked="true"]:not([disabled]) {
        --nu-switch-color: rgba(0, 0, 0, var(--nu-theme-special-shadow-opacity));
      }

      ${focusable(nuTag)}
    `;
    }

    constructor() {
      super();
    }

    nuConnected() {
      super.nuConnected();

      this.nuSetValue(this.getAttribute('checked'));

      this.nuSetFocusable(!this.hasAttribute('disabled'));

      bindActiveEvents.call(this);
    }

    get value() {
      return this.getAttribute('aria-checked') === 'true';
    }

    nuTap() {
      this.nuToggle();

      this.nuEmit('tap');
    }

    nuSetValue(value) {
      if (value) {
        this.nuSetAria('checked', true);
      } else {
        this.nuSetAria('checked', false);
      }
    }

    nuToggle() {
      this.nuSetValue(!this.value);
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      switch (name) {
        case 'disabled':
          this.nuSetMod('disabled', value != null);
          this.nuSetFocusable(value == null);
          break;
        case 'checked':
          this.nuSetValue(value != null);
          break;
      }
    }
  }

  class NuGridTable extends NuGrid {
    static get nuTag() {
      return 'nu-grid-table';
    }

    static get nuRole() {
      return 'grid';
    }

    static get nuAttrs() {
      return {
        padding: unit('padding', {
          suffix: '>*:not([padding]):not(nu-line)',
          convert: true,
        }),
      };
    }

    static get nuDefaults() {
      return {
        gap: 'var(--nu-theme-border-width)',
        background: 'var(--nu-theme-border-color)',
        color: 'var(--nu-theme-color)',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        overflow: auto;
      }
      ${nuTag}:not([gap]) {
        grid-gap: var(--nu-theme-border-width);
      }
      ${nuTag} > :not([background]) {
        background-color: var(--nu-theme-background-color);
      }
      ${nuTag}:not([padding]) > *:not([padding]):not(nu-line) {
        padding: .5rem;
      }
      ${nuTag} > * {
        position: relative;
      }
    `;
    }

    nuConnected() {
      super.nuConnected();
    }
  }

  class NuBadge extends NuElement {
    static get nuTag() {
      return 'nu-badge';
    }

    static get nuAttrs() {
      return {
        border: NuBlock.nuAttrs.border,
        radius: NuBlock.nuAttrs.radius,
        shadow: NuBlock.nuAttrs.shadow,
      };
    }

    static get nuDefaults() {
      return {
        background: 'text',
        padding: '0 .5em',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-border-radius: .5rem;
        --nu-depth-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        --nu-stroke-shadow: 0 0 0 0 var(--nu-theme-border-color), inset 0 0 0 0 var(--nu-theme-border-color);

        box-shadow: var(--nu-stroke-shadow), var(--nu-depth-shadow);
        border-radius: var(--nu-border-radius);
        white-space: nowrap;
      }
      ${nuTag}:not([color]) {
        color: var(--nu-theme-background-color) !important;
      }
      ${nuTag}[special]:not([background]) {
        background-color: var(--nu-theme-special-color) !important;
      }
      ${nuTag}[special]:not([color]) {
        color: var(--nu-theme-special-background-color) !important;
      }
    `;
    }
  }

  class NuBadge$1 extends NuElement {
    static get nuTag() {
      return 'nu-link';
    }

    static get nuRole() {
      return 'link';
    }

    static get nuDefaults() {
      return {
        color: 'special',
        mod: 'nowrap',
        cursor: 'pointer',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        position: relative;
        transition: box-shadow var(--nu-theme-animation-time) linear;
        text-decoration: underline;
        font-weight: bolder;
        box-shadow: inset 0 -0.1875em transparent;
        outline: none;
      }

      ${nuTag}:hover {
        z-index: 1;
        text-decoration-style: double;
      }

      ${ROOT_CONTEXT}.nu-focus-enabled ${nuTag}:focus,
      ${nuTag}:active {
        z-index: 1;
        box-shadow: inset 0 -0.1875em var(--nu-theme-special-background-color);
      }

      ${nuTag}::before {
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        pointer-events: none;
        transition: opacity var(--nu-theme-animation-time) linear;
        box-shadow: inset 0 -0.1875em var(--nu-theme-special-color);
        opacity: 0;
      }

      ${ROOT_CONTEXT}.nu-focus-enabled ${nuTag}:focus::before,
      ${nuTag}:active::before {
        box-shadow: inset 0 -0.1875em var(--nu-theme-special-color);
        opacity: .5;
      }
    `;
    }

    nuTap() {
      NuBtn.prototype.nuTap.call(this);

      const href = this.getAttribute('href');

      if (!href) return;

      const target = this.getAttribute('target');
      const link = document.createElement('a');

      link.href = href;

      if (target) {
        link.target = target;
      }

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    }

    nuGetValue() {
      return this.getAttribute('href');
    }

    nuConnected() {
      super.nuConnected();

      this.setAttribute('tabindex', '0');

      bindActiveEvents.call(this);
    }
  }

  class NuInput extends NuBlock {
    static get nuTag() {
      return 'nu-input';
    }

    static get nuAttrs() {
      return {
        autofocus: '',
        disabled: '',
        value: '',
        maxlength: '',
        name: '',
        padding: unit('--nu-padding', {
          multiplier: 'var(--nu-theme-padding)',
          empty: 'var(--nu-theme-padding)',
          convert: true,
        }),
      };
    }

    static get nuDefaults() {
      return {
        display: 'grid',
        flow: 'column',
        radius: '',
        padding: '1x',
        mod: 'center',
        background: '',
        border: '1x',
        place: 'stretch',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-depth-color: transparent;
        --nu-depth-shadow: 0 0 0 var(--nu-theme-border-width) var(--nu-depth-color);

        position: relative;
        outline: none;
      }

      ${nuTag} input {
        padding: var(--nu-padding);
        width: 100%;
        max-width: 100%;
        min-width: 100%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        -webkit-appearance: none;
        background: transparent;
        color: inherit;
        border: none;
        outline: none;
        border-radius: inherit;
        box-sizing: border-box;
      }
      
      ${nuTag} input:not(:first-child) {
        padding-left: 0;
      }
      
      ${nuTag} input:not(:last-child) {
        padding-right: 0;
      }

      ${nuTag} input[disabled] {
        color: var(--minor-color);
        background: var(--minor-background-color);
        -webkit-text-fill-color: var(--minor-color);
        -webkit-opacity: 1;
      }

      ${nuTag} input::placeholder {
        -webkit-text-fill-color: currentColor;
        color: currentColor;
        opacity: .5;
      }
      
      ${nuTag} nu-icon:not([width]) {
        width: calc(var(--nu-padding) * 2 + 1em);
      }

      ${nuTag}[cell] {
        width: 100%;
        height: 100%;
      }
      
      ${nuTag}[cell]:not([radius]) {
        --nu-border-radius: 0rem;
      }
      
      ${nuTag}[cell]:not([border]) {
        border: none;
      }

      ${focusable(nuTag, { force: true })}
    `;
    }

    nuCSSRef() {
      this.nuRef = this.querySelector('input');
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      switch (name) {
        case 'disabled':
          this.nuCSSRef();

          if (this.nuRef) {
            this.nuRef.disabled = value != null;
            this.nuSetFocusable(value != null);
          }

          break;
      }
    }

    nuConnected() {
      super.nuConnected();

      setTimeout(() => {
        this.nuChanged('disabled', '', this.getAttribute('disabled'));

        if (this.nuRef && !this.nuRef.hasAttribute('placeholder')) {
          this.nuRef.setAttribute('placeholder', '...');
        }
      });
    }
  }

  class NuScroll extends NuElement {
    static get nuTag() {
      return 'nu-scroll';
    }

    static get nuRole() {
      return 'scrollbar';
    }

    static get nuAttrs() {
      return {
        orientation: '',
        size: unit('--nu-line-size'),
        color: '--nu-line-color',
      };
    }

    static get nuDefaults() {
      return {
        display: 'block',
      };
    }

    nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-line-color: var(--nu-theme-special-color);
        --nu-line-size: .25rem;
        --nu-line-offset: 0%;
        --nu-line-length: 0%;

        position: absolute;
        top: 0;
        transform: translate(0, var(--nu-line-offset));
        right: var(--nu-pixel);
        height: var(--nu-line-length);
        width: var(--nu-line-size);
        line-height: 0;
        background-color: var(--nu-line-color);
        opacity: .5;
        transition: opacity var(--nu-theme-animation-time) linear,
          transform calc(var(--nu-theme-animation-time) / 2) ease-out;
        border-radius: .25rem;
        pointer-events: none;
      }

      [data-nu-no-scroll]::-webkit-scrollbar {
        display: none;
      }
    `;
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      if (name === 'orientation') {
        this.nuSetMod('horizontal', value !== 'horizontal');
        this.nuSetAria('orientation', value === 'horizontal' ? null : 'vertical');
      }
    }

    nuConnected() {
      this.nuUpdate();

      ['wheel', 'scroll'].forEach(eventName => {
        this.parentNode.addEventListener(eventName, () => {
          this.nuUpdate();
        });
      });

      this.parentNode.dataset.nuNoScroll = '';
    }

    nuUpdate() {
      const parent = this.parentNode;

      const offsetHeight = parent.offsetHeight;
      const scrollHeight = parent.scrollHeight;
      const scrollTop = parent.scrollTop;

      if (Math.abs(offsetHeight - scrollHeight) < 2) {
        this.style.setProperty('--line-offset', '');
        this.style.setProperty('--line-length', '');
      } else {
        this.style.setProperty('--line-offset', `calc(${Math.round(scrollTop / scrollHeight * offsetHeight)}px + ${scrollTop}px)`);
        this.style.setProperty('--line-length', `${Math.round(offsetHeight / scrollHeight * 100)}%`);
      }
    }
  }

  const FLOW_ATTR = NuFlex.nuAllAttrs.flow;

  class NuBtnGroup extends NuFlex {
    static get nuTag() {
      return 'nu-btn-group';
    }

    static get nuRole() {
      return 'radiogroup';
    }

    static get nuAttrs() {
      return {
        padding: '',
        value: '',
        flow(val, defaults) {
          if (!val) return;

          return [
            ...FLOW_ATTR(val, defaults),
            {
              $suffix: `:not([gap]) > :first-child:not(:last-child)`,
              '--nu-border-radius': val.startsWith('row')
                ? 'var(--nu-item-border-radius) 0 0 var(--nu-item-border-radius) !important'
                : 'var(--nu-item-border-radius) var(--nu-item-border-radius) 0 0 !important'
            },
            {
              $suffix: `:not([gap]) > :last-child:not(:first-child)`,
              '--nu-border-radius': val.startsWith('row')
                ? '0 var(--nu-item-border-radius) var(--nu-item-border-radius) 0 !important'
                : '0 0 var(--nu-item-border-radius) var(--nu-item-border-radius) !important'
            }
          ];
        },
        border(val) {
          if (val == null) return val;

          const width = val ? convertUnit(val) : 'var(--nu-theme-border-width)';

          return {
            $suffix: ':not([border])',
            '--nu-border-shadow': `var(--nu-border-inset, 0 0) 0 ${width} var(--nu-theme-border-color)`,
            '--nu-flex-gap': `calc(${width} * -1)`
          };
        },
      };
    }

    static get nuDefaults() {
      return {
        flow: 'row',
        gap: 'calc(var(--nu-theme-border-width) * -1)',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-border-radius: var(--nu-theme-border-radius);
        --nu-item-border-radius: var(--nu-border-radius);

        border-radius: var(--nu-border-radius, .5rem);
      }
      ${nuTag} > * {
        --nu-flex-gap: calc(var(--nu-theme-border-width) * -1);

        flex-grow:1;
      }
      ${nuTag}:not([gap]) > * {
        --nu-flex-gap: calc(var(--nu-theme-border-width) * -1);
      }
      ${nuTag}:not([gap]) > :not(:last-child):not(:first-child) {
        --nu-border-radius: 0 !important;
      }
      ${nuTag}:not([gap]) > :last-child:first-child {
        --nu-border-radius: inherit !important;
      }
    `;
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      switch (name) {
        case 'value':
          this.nuSetValue(value, false);

          break;
      }
    }

    nuConnected() {
      super.nuConnected();

      const value = this.getAttribute('value');

      if (value) {
        this.nuSetValue(value, false);
      } else {
        setTimeout(() => {
          const el = this.querySelector(`nu-btn[value]`);

          if (el) {
            this.nuSetValue(el.nuGetValue());
          }
        }, 0);
      }
    }

    nuGetValue() {
      const value = this.getAttribute('value');

      if (value) {
        const el = this.querySelector(`nu-btn[aria-pressed="true"]`);

        if (el) {
          return el.getAttribute('value');
        } else {
          return value;
        }
      }
    }

    nuSetValue(value, announce = true) {
      setTimeout(() => {
        [...this.childNodes].forEach(el => {
          if (el.tagName !== 'NU-BTN') return;

          // if (el.hasAttribute('disabled')) return;

          if (el.getAttribute('value') === value) {
            el.nuSetAria('checked', true);
            el.nuSetFocusable(false);
            el.nuSetValue(true);
          } else {
            el.nuSetAria('checked', false);
            el.nuSetFocusable(true);
            el.nuSetValue(false);
          }
        });

        if (announce) {
          this.nuEmit('input', value);
        }
      }, 0);
    }
  }

  class NuMenu extends NuFlow {
    static get nuTag() {
      return 'nu-menu';
    }

    static get nuRole() {
      return 'menu';
    }
  }

  class NuMenuitem extends NuAbstractBtn {
    static get nuTag() {
      return 'nu-menuitem';
    }

    static get nuRole() {
      return 'menuitem';
    }

    static get nuDefaults() {
      return {
        background: 'transparent',
        width: '100%',
        content: 'center start',
        radius: 0,
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        --nu-toggle-color: transparent;
        --nu-depth-color: transparent;
        --nu-focus-inset: inset 0 0;
      }

      ${nuTag}:not([disabled])[tabindex]:hover {
        --nu-hover-color: var(--nu-theme-hover-color);
      }

      ${nuTag}[nu-active][tabindex]:not([disabled]):not([nu-toggled]),
      ${nuTag}[nu-toggled]:not([disabled]):not([tabindex]) {
        --nu-toggle-color: rgba(0, 0, 0, var(--nu-theme-shadow-opacity));
      }

      ${nuTag}[special] {
        background-color: var(--nu-theme-special-color) !important;
        color: var(--nu-theme-special-background-color) !important;
      }
    `;
    }
  }

  class NuTablist extends NuFlex {
    static get nuTag() {
      return 'nu-tablist';
    }

    static get nuRole() {
      return 'tablist';
    }

    static get nuAttrs() {
      return {
        value: '',
      };
    }

    static get nuDefaults() {
      return {
        gap: 1,
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag}:not([gap]) > * {
        --nu-flex-gap: 1rem;
      }
    `;
    }

    nuChanged(name, oldValue, value) {
      super.nuChanged(name, oldValue, value);

      if (!this.nuIsMounted) return;

      switch (name) {
        case 'value':
          this.nuSetValue(value, false);

          break;
      }
    }

    nuConnected() {
      super.nuConnected();

      setTimeout(() => {
        const value = this.nuGetValue();

        if (value) {
          this.nuSetValue(value, false);
        } else {
          setTimeout(() => {
            const el = this.querySelector(`nu-tab[value]:not([disabled]), nu-tab[controls]:not([disabled])`);

            if (el) {
              this.nuSetValue(el.nuGetValue());
            }
          }, 0);
        }
      }, 0);
    }

    nuGetValue() {
      const value = this.getAttribute('value');

      if (value) {
        const el = this.querySelector(`nu-tab[aria-pressed="true"]:not([disabled])`);

        return el ? el.nuGetValue() : value;
      }
    }

    nuSetValue(value, announce = true) {
      setTimeout(() => {
        [...this.childNodes].forEach(el => {
          if (el.tagName !== 'NU-TAB') return;

          if (el.nuGetValue() === value) {
            el.nuSetValue(true);
            el.nuSetAria('selected', true);
            el.nuSetFocusable(false);
          } else {
            el.nuSetValue(false);
            el.nuSetAria('selected', false);
            el.nuSetFocusable(true);
          }
        });

        if (announce) {
          this.nuEmit('input', value);
        }
      }, 0);
    }
  }

  const UP = 'up';
  const DOWN = 'down';
  const LEFT = 'left';
  const RIGHT = 'right';
  const TOP = 'top';
  const BOTTOM = 'bottom';

  const DIR_MAP = {
    [UP]: BOTTOM,
    [RIGHT]: LEFT,
    [DOWN]: TOP,
    [LEFT]: RIGHT,
  };

  const DIR_MAP_ZERO = {
    [UP]: TOP,
    [RIGHT]: RIGHT,
    [DOWN]: BOTTOM,
    [LEFT]: LEFT,
  };

  class NuTriangle extends NuElement {
    static get nuTag() {
      return 'nu-triangle';
    }

    static get nuAttrs() {
      return {
        dir(val) {
          val = val || 'up';

          const zeroSide = DIR_MAP_ZERO[val];

          if (!zeroSide) return;

          const mainSide = DIR_MAP[val];

          return {
            border: 'calc(var(--nu-triangle-basis) / 2) solid transparent',
            [`border-${zeroSide}`]: '0',
            [`border-${mainSide}-color`]: 'currentColor',
            [`border-${mainSide}-width`]: 'var(--nu-triangle-height)',
          };
        },
        size(val) {
          if (!val) return;

          const tmp = val.split(/\s+/);

          return {
            '--nu-triangle-basis': convertUnit(tmp[1] || String(tmp[0] * 2)),
            '--nu-triangle-height': convertUnit(tmp[0]),
          };
        },
      };
    }

    static get nuDefaults() {
      return {
        display: 'block',
        dir: 'up',
        size: '.5em 1em',
        color: 'border',
        mod: 'no-overflow',
      };
    }

    static nuCSS({ nuTag }) {
      return `
      ${nuTag} {
        width: 0;
        height: 0;
        vertical-align: middle;
      }
      ${nuTag}[inline] {
        position: relative;
        bottom: 0.0675em;
      }
    `;
    }
  }

  class NuDecorator extends NuBase {
    nuConnected() {
      super.nuConnected();

      if (!this.parentNode) return;
    }

    get nuParentContext() {
      return `#${this.parentNode.nuId}`;
    }
  }

  function extractTheme(el) {
    return THEME_ATTRS_LIST.reduce((theme, name) => {
      const attrValue = el.getAttribute(name);

      if (!attrValue) return theme;

      const tmp = attrValue.split('|');

      theme.light[toCamelCase(name)] = tmp[0];
      theme.dark[toCamelCase(name)] = tmp[1];

      return theme;
    }, { light: {}, dark: {} });
  }

  class NuTheme extends NuDecorator {
    static get nuTag() {
      return 'nu-theme';
    }

    static get nuAttrsList() {
      return THEME_ATTRS_LIST;
    }

    nuChanged(name, oldValue, value) {
      if (!this.nuIsMounted) return;

      this.nuApply();
    }

    nuConnected() {
      super.nuConnected();

      // run only once
      if (this.nuIsMounted) return;

      setTimeout(() => this.nuApply());
    }

    nuDisconnected() {
      super.nuDisconnected();

      const name = this.getAttribute('name');

      // remove theme
      if (this.nuParent) {
        this.nuParent.nuDeclareTheme(name || 'default');
      }
    }

    nuApply() {
      const name = this.getAttribute('name');
      let theme = extractTheme(this);

      if (!name) {
        const defaultThemeEl = [...this.parentNode.querySelectorAll('nu-theme:not([name])')]
          .find(el => el.parentNode === this.parentNode);

        if (defaultThemeEl) {
          const defaultTheme = extractTheme(defaultThemeEl);

          theme = {
            light: {
              ...defaultTheme.light,
              ...theme.light,
            },
            dark: {
              ...defaultTheme.dark,
              ...theme.dark,
            },
          };
        }
      }

      this.parentNode.nuDeclareTheme(name || 'default', theme.light, theme.dark);
    }
  }

  class NuMod extends NuDecorator {
    static get nuTag() {
      return 'nu-mod';
    }

    static get nuAttrsList() {
      return ['name'];
    }

    nuConnected() {
      super.nuConnected();

      this.nuApply();
    }

    nuApply() {
      const parent = this.parentNode;
      const name = this.getAttribute('name');
      const context = this.nuParentContext;

      if (!name) {
        return error(`modifier name is not specified`, this);
      }

      setTimeout(() => {
        Modifiers.set(name, parseStyles(this.innerText), context);
        [...parent.querySelectorAll(`
        ${context} [mod="${name}"],
        ${context} [mod*=" ${name} "],
        ${context} [mod^="${name} "],
        ${context} [mod$=" ${name}"]
      `)].forEach(el => {
          if (el.nuApplyCSS) {
            el.nuApplyCSS('mod', el.getAttribute('mod'), true);
          }
        });
      }, 0);
    }
  }

  class NuVar extends NuDecorator {
    static get nuTag() {
      return 'nu-var';
    }

    static get nuAttrsList() {
      return ['name', 'value'];
    }

    nuConnected() {
      super.nuConnected();

      this.nuApply();
    }

    nuApply() {
      const parent = this.parentNode;
      const name = this.getAttribute('name');
      const value = this.getAttribute('value');
      const context = this.nuParentContext;

      if (!name || !value) {
        return error(`modifier name or value is not specified`, this);
      }

      setTimeout(() => {
        const fullValue = value
          .split('|')
          .map(val => `${name}:${val}`)
          .join('|')
          .replace(/\[.+?\]/gi, s => `[${name}:${s.slice(1, -1)}]`);
        const css = parent.nuGetCSS(context, 'var', fullValue);

        injectCSS(`var:${name}:${context}`, context, css);
      }, 0);
    }
  }

  let enableTimerId, disableTimerId;

  function enableFocus() {
    if (enableTimerId) return;

    enableTimerId = setTimeout(() => {
      const root = document.querySelector(ROOT_CONTEXT);

      if (root) {
        root.classList.add('nu-focus-enabled');
      }

      enableTimerId = 0;
    }, 100);
  }

  function disableFocus() {
    if (disableTimerId) return;

    disableTimerId = setTimeout(() => {
      const root = document.querySelector(ROOT_CONTEXT);

      if (root) {
        root.classList.remove('nu-focus-enabled');
      }

      disableTimerId = 0;
    }, 100);
  }

  window.addEventListener('mousedown', disableFocus);
  window.addEventListener('keydown', enableFocus);

  const Nude = {
    tags: {},
    modifiers: Modifiers,
    css: css$1,
    helpers: {
      invertColor,
      hueRotate,
      injectScript,
      extractColor,
      setAlphaChannel,
      generalizeColor,
      getLuminance,
      splitStates,
      convertCustomUnit,
      splitDimensions,
      excludeMod,
      parseAllValues,
      mixColors,
      setImmediate,
    },
  };

  Nude.init = (...elements) => {
    elements.forEach(el => {
      // if tag is already registered then skip
      if (Nude.tags[el.nuTag]) return;

      el.nuInit();

      Nude.tags[el.nuTag] = el;
    });
  };

  Nude.getElementById = function(id) {
    return document.querySelector(`[nu-id="${id}"]`);
  };

  Nude.getElementsById = function(id) {
    return document.querySelectorAll(`[nu-id="${id}"]`);
  };

  Nude.elements = {
    NuGrid,
    NuBlock,
    NuHeading,
    NuBtn,
    NuTab,
    NuCard,
    NuIcon,
    NuLayout: NuFlow,
    NuLine,
    NuPane,
    NuGridTable,
    NuBadge,
    NuInput,
    NuScroll,
    NuSwitch,
    NuFlex,
    NuBtnGroup,
    NuTablist,
    NuMenu,
    NuMenuItem: NuMenuitem,
    NuLink: NuBadge$1,
    NuTheme,
    NuMod,
    NuVar,
    NuDecorator,
    NuAbstractBtn,
    NuTriangle,
  };

  Nude.init(
    ...Object.values(Nude.elements),
  );

  Nude.elements.NuBase = NuBase;

  window.Nude = Nude;

  return Nude;

}());
