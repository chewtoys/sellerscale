import Logdown from 'logdown';
import kebabCase from 'lodash/kebabCase';
// import Supports from '@/services/supports';
import User from '@/services/user';

const logger = new Logdown('app.analytics');

let logEventFunc;
let trackEventFunc;

if (window.location.hostname === 'app.sellerscale.com' || process.env.VUE_APP_TEST_ANALYTICS === 'true') {
  logEventFunc = function logEvent(eventName, eventData) {
    eventName = eventName.split(':').map(s => kebabCase(s)).join(':');

    if (window.amplitude) {
      window.amplitude.getInstance().logEvent(eventName, eventData);
    }

    logger.info('amplitude:event', eventName, eventData);

    const gtagAction = eventName.split(':').slice(1).join(':');
    const gtagData = {};
    const gtagCategory = gtagAction ? eventName.split(':')[0] : '';

    if (gtagCategory) {
      gtagData.event_category = gtagCategory;
    }

    if (eventData) {
      gtagData.event_label = JSON.stringify(eventData);
    }

    if (window.gtag) {
      window.gtag('event', gtagAction, gtagData);
    }

    logger.info('gtag:event', gtagAction, gtagData);
  };
  trackEventFunc = function trackEvent(path) {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    const gtagData = {
      page_title: document.title,
      page_path: path,
    };

    if (User.profile.id) {
      gtagData.id = User.profile.id;
    }

    if (window.gtag) window.gtag('config', 'UA-129497412-1', gtagData);

    logger.info('gtag:track', gtagData);

    if (User.profile.id) {
      const intercomData = {
        app_id: 'oo0p2i07',

        user_id: User.profile.id,
        email: User.profile.email,
        name: (User.profile.firstName || User.profile.lastName)
          ? `${User.profile.firstName} ${User.profile.lastName}`.trim() : '',
        created_at: new Date(User.profile.created).getTime() / 1000,
      };

      if (window.Intercom) {
        window.Intercom('boot', intercomData);
      }

      logger.info('intercom:track', intercomData);

      if (window.amplitude) {
        window.amplitude.getInstance().init('d057461b87672c5f47216990a2525474', User.profile.id);
      }

      logger.info('amplitude:track', User.profile.id);

      logEventFunc('page:view', {
        path,
        title: document.title,
      });
    }
  };
} else {
  logEventFunc = function logEvent(eventName, eventData) {
    eventName = eventName.split(':').map(s => kebabCase(s)).join(':');

    if (window.amplitude) {
      window.amplitude.getInstance().logEvent(eventName, eventData);
    }

    logger.info('event', eventName, eventData);
  };
  trackEventFunc = function trackEvent(path) {
    logger.info('track', path);
  };
}

const Analytics = {
  event: logEventFunc,
  track: trackEventFunc,
};

export default Analytics;
