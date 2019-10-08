import '@webcomponents/custom-elements';
import Logdown from 'logdown';
import 'spatial-navigation-polyfill';
import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import vOutsideEvents from 'vue-outside-events';
// eslint-disable-next-line
import '@/numl/numl.dev';
import '@/directives/markdown';
import '@/directives/mod';
import '@/directives/tooltip';
import '@/directives/fixate';
import i18n from './i18n';
import App from './app.vue';
import API from './services/api';
import GlobalEvents from './services/global-events';
import router from './router';
import './registerServiceWorker';
import markdown from '@/helpers/markdown';

if (process.env.NODE_ENV === 'development') {
  if (!localStorage.getItem('debug')) {
    localStorage.setItem('debug', 'app.*');
  }

  window.Logdown = Logdown;
  window.API = API;
} else {
  Sentry.init({
    dsn: 'https://2f9730619ace44adb952712042a8a14f@sentry.sellerscale.com/4',
    integrations: [new VueIntegration({ Vue, attachProps: true })],
  });
}

window.Sentry = Sentry;

const logger = new Logdown('app.root');

// Register Nude Framework
Vue.config.ignoredElements = [/^nu-/, /^nd-/];

const Nude = window.Nude;

Nude.elements.NuIcon.nuLoader = name => import(/* webpackChunkName: "icon" */ `@/base/icons/${name}.js`)
  .then(module => module.default);

Vue.use(vOutsideEvents);

Vue.prototype.$markdown = markdown;
Vue.prototype.$globalEvents = GlobalEvents;

new Vue({
  i18n,
  router,
  render: h => h(App),
}).$mount('#app');

if (navigator.serviceWorker) {
  let refreshing;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;

    refreshing = true;

    window.location.reload();
  });
}

logger.log('initialized');
