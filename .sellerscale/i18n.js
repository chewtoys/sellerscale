import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import lockr from 'lockr';
import Logdown from 'logdown';
import detectBrowserLanguage from 'detect-browser-language';
import { handlePluralTemplate } from './util';
import { setTitle } from './services/window';
import GlobalEvents from './services/global-events';

const logger = new Logdown('app.i18n');

const defaultGetChoiceIndex = VueI18n.prototype.getChoiceIndex;

// pluralization for Russian language
VueI18n.prototype.getChoiceIndex = function getChoiceIndex(choice, choicesLength) {
  // this === VueI18n instance, so the locale property also exists here
  if (this.locale !== 'ru' || choicesLength < 4) {
    // proceed to the default implementation
    return defaultGetChoiceIndex.bind(this)(choice, choicesLength);
  }

  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (!teen && endsWithOne) {
    return 1;
  }

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return (choicesLength < 4) ? 2 : 3;
};

// find all languages
const langFiles = require.context(
  './lang',
  false,
  /\w+\.js$/,
);

const availableLanguages = langFiles.keys()
  .map(fileName => fileName.match(/(\w+)\.js$/i)[1]);

const userLanguage = detectBrowserLanguage().split('-')[0];

logger.info('user language', userLanguage);

const defaultLanguage = !availableLanguages.includes(userLanguage)
  ? availableLanguages[0] : userLanguage;

logger.info('preferred language', userLanguage);

// set current language
let currentLanguage = (lockr.get('lang') || defaultLanguage).toLowerCase();

// Set of loaded languages
const loadedLanguages = [];

// connect VueI18n
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: currentLanguage, // set locale
  fallbackLocale: 'en', // set locale messages
  silentTranslationWarn: true, // process.env.NODE_ENV === 'production',
});

/**
 *
 * @param lang
 * @returns {*}
 */
function change(lang) {
  i18n.locale = lang;

  axios.defaults.headers.common['Accept-Language'] = lang;

  document.querySelector('html').setAttribute('lang', lang);

  if (i18n.documentTitle) {
    setTitle(i18n.t(`title.${i18n.documentTitle}`));
  }

  lockr.set('lang', lang.toUpperCase());

  currentLanguage = lang;

  logger.info(`language changed to "${lang}"`);

  GlobalEvents.$emit('i18n:change');

  return lang;
}

async function loadMessages(lang) {
  const msgs = await import(/* webpackChunkName: "lang" */ `@/lang/${lang}`);

  i18n.setLocaleMessage(lang, handlePluralTemplate(msgs.default));
  loadedLanguages.push(lang);

  logger.info(`"${lang}" language loaded`);

  return lang;
}

export async function loadLanguage(lang) {
  const toLang = lang || currentLanguage;

  if (!availableLanguages.includes(toLang)) {
    throw new Error(`language "${toLang}" is not available`);
  }

  if (currentLanguage !== toLang || !loadedLanguages.includes(toLang)) {
    if (!loadedLanguages.includes(toLang)) {
      await loadMessages(toLang);
    }

    change(toLang);
  }

  return toLang;
}

export default i18n;
