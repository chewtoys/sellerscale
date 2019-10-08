import adblockDetect from 'adblock-detect';
import {
  addDays,
  subYears,
  subMonths,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  format,
} from 'date-fns';
import localeEn from 'date-fns/locale/en';
import localeRu from 'date-fns/locale/ru';
import accounting from 'accounting-js';
import lockr from 'lockr';
import i18n from '@/i18n';
import Analytics from '@/services/analytics';

const locales = {
  en: localeEn,
  ru: localeRu,
};

export const plural = (str, count) => {
  const words = str.split('|').map(x => x.trim());
  return count > 1 ? words[2].replace('{n}', count) : words[count];
};

export function clearObject(obj) {
  Object.keys(obj)
    .forEach((key) => {
      delete obj[key];
    });

  return obj;
}

export function replaceObject(obj, data) {
  clearObject(obj);

  Object.assign(obj, data);

  return obj;
}

export function handlePluralTemplate(messages) {
  if (typeof messages === 'object') {
    Object.keys(messages)
      .forEach((key) => {
        messages[key] = handlePluralTemplate(messages[key]);
      });
  } else if (typeof messages === 'string' && messages.indexOf('[[') >= 0) {
    const arr = [];
    const max = messages.match(/\[\[.+\]\]/g)[0].split('|').length;

    for (let i = 0; i < max; i += 1) {
      arr.push(messages.replace(/\[\[.+\]\]/g, s => s.slice(2, s.length - 2).split('|')[i] || ''));
    }

    return arr.join(' | ');
  }

  return messages;
}

export function fieldToName(fieldName) {
  return fieldName.replace(/[A-Z]/g, s => ` ${s}`).replace(/^[a-z]/i, s => s.toUpperCase());
}

export function convertSnakeToCamel(obj) {
  if (obj == null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertSnakeToCamel(item));
  }

  if (typeof obj === 'object') {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
      const item = obj[key];

      const newKey = key.replace(/_[A-Z]/gi, s => s.slice(1).toUpperCase());

      newObj[newKey] = convertSnakeToCamel(item);
    });

    return newObj;
  }

  return obj;
}

export function convertCamelToSnake(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`);
  }

  if (obj == null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertCamelToSnake(item));
  }

  if (typeof obj === 'object') {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
      const item = obj[key];

      const newKey = key.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`);

      newObj[newKey] = convertCamelToSnake(item);
    });

    return newObj;
  }

  return obj;
}

export function hasSlot(name = 'default') {
  return !!this.$slots[name] || !!this.$scopedSlots[name];
}

export function differenceInTime(daysPeriod, raw = false) {
  const result = [];
  const now = new Date();

  let future = addDays(now, daysPeriod);

  const years = differenceInYears(future, now);

  if (years > 0) {
    result.push(`${years}${i18n.locale === 'en' ? 'y' : 'г'}`);
    future = subYears(future, years);
  }

  const months = differenceInMonths(future, now);

  if (months > 0) {
    result.push(`${months}${i18n.locale === 'en' ? 'm' : 'м'}`);
    future = subMonths(future, months);
  }

  const days = differenceInDays(future, now);

  if (!years) {
    if (days > 0) {
      result.push(`${days}${i18n.locale === 'en' ? 'd' : 'д'}`);
    }
  }

  if (raw) {
    return { years, months, days };
  }

  return result.join(' '); // 1 years 4 months 13 days
}

export function differenceInTimeLong(daysPeriod) {
  const diff = differenceInTime(daysPeriod, true);

  return `
    ${diff.years ? `${i18n.tc('label.years', diff.years)} ` : ''}
    ${diff.months ? `${i18n.tc('label.months', diff.months)} ` : ''}
    ${diff.days ? i18n.tc('label.days', diff.days) : ''}
  `;
}


export function serialize(obj) {
  const str = [];

  Object.keys(obj).forEach((key) => {
    if (obj[key] != null) {
      str.push(
        `${encodeURIComponent(key)}=${obj[key] === false ? '' : encodeURIComponent(obj[key])}`,
      );
    }
  });

  return str.join('&');
}

export function stripZeros(val) {
  return val.includes('.') ? val.replace(/(\.0+|0+)(?=(%|$))/gi, '') : val;
}

export function formatNumeric(val, symbol = '', precision = 2) {
  if (val === Number.POSITIVE_INFINITY || val === Number.NEGATIVE_INFINITY
    || Number.isNaN(val) || val == null) {
    return '–';
  }

  val = String(val);

  if (symbol && i18n.te(`input_unit.${symbol}`)) {
    symbol = ` ${i18n.t(`input_unit.${symbol}`)}`;
  }

  val = accounting.formatMoney(val, {
    symbol,
    format: symbol === '$' ? { pos: '%s%v', neg: '-%s%v', zero: '%s0' } : '%v%s',
    thousand: ',',
    decimal: '.',
    precision,
  });

  // val = stripZeros(val);

  return val;
}

export function formatDate(date, template = 'YYYY-MM-DD', locale) {
  return format(date, template, { locale: locales[locale || i18n.locale] });
}

export function cacheProps(obj, namespace, props) {
  props.forEach((prop) => {
    const value = obj[prop];

    const storageKey = `${namespace}.${prop}`;
    let currentValue = lockr.get(storageKey) || value;

    lockr.set(storageKey, currentValue);

    Object.defineProperty(obj, prop, {
      set(val) {
        currentValue = val;
        lockr.set(storageKey, val);
      },
      get() {
        return currentValue;
      },
    });
  });
}

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function formatNumericField(val, schema) {
  let precision = schema.precision != null ? schema.precision : 2;
  let symbol = '';

  if (val === Number.POSITIVE_INFINITY || val === Number.NEGATIVE_INFINITY
    || Number.isNaN(val) || val == null) {
    return '–';
  }

  if (val < 0.5 / (10 ** precision)
    && val > -0.5 / (10 ** precision)) val = 0;

  if (schema.unit === 'currency') {
    symbol = '$';
  } else if (schema.unit === 'percent') {
    symbol = '%';
  } else if (i18n.te(`input_unit.${schema.unit}`)) {
    symbol = i18n.t(`input_unit.${schema.unit}`);
  } else if (schema.suffix) {
    symbol = schema.suffix;
  }

  val = String(val);

  if (val.split('.')[0].length > 3 && precision > 1) {
    precision = 1;
  }

  const formatTmp = symbol === '$'
    ? { pos: '%s%v', neg: '-%s%v', zero: '%s0' }
    : '%v%s';

  val = accounting.formatMoney(val, {
    symbol,
    format: formatTmp,
    thousand: ',',
    decimal: '.',
    precision,
  });

  val = stripZeros(val);

  return val;
}

/**
 * Shortens number with given precision
 * @param {number} num
 * @param {number} precision
 * @returns {number}
 */
export function toFixedNumber(num, precision) {
  return Number(num.toFixed(precision));
}

/**
 * Convert Object to Array of Objects
 * @param obj
 * @returns {Array<{id: string, value: *}>}
 */
export function objectToList(obj = {}, threshold = 0, sort) {
  const list = Object.keys(obj)
    .reduce((arr, prop) => {
      const value = obj[prop];

      if (threshold && Math.abs(value) >= threshold) {
        arr.push({
          id: prop,
          value,
        });
      }

      return arr;
    }, []).sort((a, b) => b.value - a.value);

  switch (sort) {
    case 'asc':
      list.sort((i1, i2) => {
        if (i1.value > i2.value) {
          return 1;
        }

        if (i1.value < i2.value) {
          return -1;
        }

        return 0;
      });
      break;
    case 'desc':
      list.sort((i1, i2) => {
        if (i1.value < i2.value) {
          return 1;
        }

        if (i1.value > i2.value) {
          return -1;
        }

        return 0;
      });
      break;
    default:
  }

  return list;
}

// TODO: activate when text is ready
export async function adBlocking() {
  return false;
  // return new Promise((resolve) => {
  //   adblockDetect(resolve);
  // });
}

export function openLink(href, target) {
  const link = document.createElement('a');

  link.href = href;

  if (target) {
    link.target = target === true ? '_blank' : target;
  }

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  Analytics.event('outerlink', { url: href });
}

const availWidth = window.screen ? window.screen.availWidth : 1280;
const availHeight = window.screen ? window.screen.availHeight : 720;

const popupLeft = availWidth - 816;
const popupTop = availHeight / 2 - 300;

export function openPopupWindow(href) {
  const win = window.open(href, 'popupWindow',
    `directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=${popupTop},left=${popupLeft},width=800,height=600`);

  window.currentPopupWindow = win;

  return win;
}

export function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function toggleClass(element, className, condition) {
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

export const MARKETPLACE_URLS = {
  ATVPDKIKX0DER: 'https://www.amazon.com/dp/',
  A2Q3Y263D00KWC: 'https://www.amazon.com.br/dp/',
  A2EUQ1WTGCTBG2: 'https://www.amazon.ca/dp/',
  A1AM78C64UM0Y8: 'https://www.amazon.com.mx/dp/',
  A1PA6795UKMFR9: 'https://www.amazon.de/dp/',
  A1RKKUPIHCS9HS: 'https://www.amazon.es/gp/product/',
  A13V1IB3VIYZZH: 'https://www.amazon.fr/dp/',
  A1F83G8C2ARO7P: 'https://www.amazon.co.uk/dp/',
  A21TJRUUN4KGV: 'https://www.amazon.in/dp/',
  APJ6JRA9NG5V4: 'https://www.amazon.it/dp/',
  A33AVAJ2PDY3EV: 'https://www.amazon.com.tr/gp/product/',
  A39IBJ37TRP1C6: 'https://www.amazon.com.au/dp/',
  A1VC38T7YXB528: 'https://www.amazon.co.jp/gp/product/',
  AAHKV2X7AFYLW: 'https://www.amazon.cn/dp/',
};

/**
 * Generates product's URL.
 * @param {String} marketplace  Product's marketplace
 * @param {String} asin         Product's ASIN
 */
export function getProductUrl(marketplaceId, asin) {
  return MARKETPLACE_URLS[marketplaceId] + asin;
}

export function openProductPage(marketplaceId, asin) {
  marketplaceId = marketplaceId || 'ATVPDKIKX0DER';
  marketplaceId = marketplaceId.split('_')[1] || marketplaceId.split('_')[0];

  const link = getProductUrl(marketplaceId, asin);

  openLink(link, '_blank');
}

export function injectScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = src;

    document.body.appendChild(script);
  });
}
