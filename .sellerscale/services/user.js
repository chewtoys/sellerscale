import lockr from 'lockr';
import Logdown from 'logdown';
import { differenceInDays, parse } from 'date-fns';
import API from '@/services/api';
import { toggleClass } from '@/util';
import Notifications from '@/services/notifications';
import Analytics from '@/services/analytics';
import Auth from '@/services/auth';

const logger = new Logdown('app.user');
const UPDATE_PERIOD = 30000; // 30 seconds

let profileUpdateTimerId;

const User = {
  /**
   * @type {UserProfile}
   */
  profile: lockr.get('profile') || {},
  switchingMarketplace: false,
  get shortId() {
    if (this.profile.email.length < 20) {
      return this.profile.email;
    }

    return `@${this.profile.email.slice(0, User.profile.email.indexOf('@'))}`;
  },
  get mwsStatus() {
    if (!this.profile || !this.profile.mwsAccounts || !this.profile.mwsAccounts.length) return '';

    if (this.profile.mwsAccounts.find(account => account.status === 'active')) {
      return 'active';
    }

    return 'sync';
  },
  get adsStatus() {
    if (!this.profile || !this.profile.adsAccounts || !this.profile.adsAccounts.length) return '';

    if (this.profile.adsAccounts.find(profile => profile.status === 'active')) {
      return 'active';
    }

    return 'sync';
  },
  isInitialSync() {
    return this.profile.mwsAccounts.length && !User.profile.marketplace;
  },
  async refreshProfile() {
    let profile;

    if (profileUpdateTimerId) {
      clearTimeout(profileUpdateTimerId);
    }

    try {
      profile = await API.User.getProfile();

      this.setProfile(profile);
    } catch (e) {
      logger.error(e);
      // do nothing
    }

    profileUpdateTimerId = setTimeout(() => this.refreshProfile(), UPDATE_PERIOD);

    return profile;
  },
  setProfile(profile) {
    this.profile = {
      ...this.profile,
      ...profile,
    };
    this.profile.shortId = this.shortId;

    this.updateProfileNotifications();
  },
  update(data) {
    return API.User.updateProfile(data)
      .then(() => this.setProfile(data));
  },
  getCurrentAccount() {
    const id = this.profile.marketplace;
    const accounts = this.profile.mwsAccounts;

    if (!accounts.length) return null;

    return accounts
      .find(account => account.marketplaces
        .find(marketplace => marketplace.id === id));
  },
  switchMarketplace(marketplace) {
    this.switchingMarketplace = marketplace;

    const data = { marketplace: marketplace.id };

    return this.update(data)
      .finally(() => {
        Analytics.event('user:switch-marketplace', {
          marketplace: marketplace.id,
        });
        this.switchingMarketplace = false;
      });
  },
  getCurrentMarketplace() {
    const id = this.profile.marketplace;
    const account = this.getCurrentAccount();

    if (!account) return null;

    return account.marketplaces.find(marketplace => marketplace.id === id);
  },
  settings: Object.assign({
    theme: 'light',
    highContrast: 'off',
    reducedMotion: 'off',
  }, lockr.get('user.settings') || {}),
  save() {
    lockr.set('user.settings', this.settings);

    const htmlTag = document.querySelector('html');

    toggleClass(htmlTag, 'nu-prefers-color-scheme-dark', this.settings.theme === 'dark');
    toggleClass(htmlTag, 'nu-prefers-color-scheme-light', this.settings.theme === 'light');
    toggleClass(htmlTag, 'nu-prefers-color-scheme', this.settings.theme === 'auto');
    toggleClass(htmlTag, 'nu-prefers-high-contrast', this.settings.highContrast === 'on');
    toggleClass(htmlTag, 'nu-prefers-reduced-motion-reduce', this.settings.reducedMotion === 'on');
    toggleClass(htmlTag, 'nu-prefers-reduced-motion', this.settings.reducedMotion === 'auto');
  },
  async updateProfileNotifications() {
    if (!(await Auth.isAuthorized())) return;

    if (this.profile.mwsAccounts && this.profile.mwsAccounts.length) {
      Notifications.close('connect');
    }

    if (this.profile.mwsAccounts && !this.profile.mwsAccounts.length) {
      // Notifications.show({
      //   id: 'connect',
      //   message: 'demo_connect',
      //   action: 'connect',
      //   callback() {
      //     router.push('/integration');
      //   },
      // });
    } else if (this.profile.mwsAccounts
      && !this.profile.mwsAccounts.find(acc => acc.dataSynced)) {
      Notifications.close('connect');
      Notifications.show({
        id: 'sync',
        message: 'demo_sync',
      });
    } else {
      Notifications.close('connect');
      Notifications.close('sync');
    }

    if (this.profile.subscription.status === 'trial'
      && differenceInDays(parse(this.profile.subscription.freeTrialEnded), Date.now()) <= 3) {
      Notifications.show({
        id: 'trial_end_soon',
        message: 'trial_end_soon',
        action: 'subscribe',
      });
    } else {
      Notifications.close('trial_end_soon');
    }

    if (this.profile.subscription.status === 'active'
      && (!this.profile.subscription.plan || !this.profile.subscription.card)
      && differenceInDays(parse(this.profile.subscription.ended), Date.now()) <= 3) {
      Notifications.show({
        id: 'subscription_end_soon',
        message: 'subscription_end_soon',
        action: 'subscribe',
      });
    } else {
      Notifications.close('subscription_end_soon');
    }

    if (this.profile.subscription.status === 'expired') {
      Notifications.show({
        id: 'expired',
        message: 'expired',
        action: 'subscribe',
      });
    } else {
      Notifications.close('expired');
    }

    // if (this.profile.adsAccounts && this.profile.adsAccounts.length) {
    //   Notifications.show({
    //     id: 'ads_2_month_sync',
    //     message: 'ads_2_month_sync',
    //     action: 'ok_i_got_it',
    //   });
    // }
  },
};

User.save();

export default User;

window.Sellerscale = {
  ...(window.Sellerscale || {}),
  User,
};

/**
 * @typedef {Object}    Subscription
 * @property {String}   status
 * @property {String}   freeTrialEnded - Date
 * @property {String}   plan
 * @property {String}   started
 * @property {String}   tier
 * @property {String}   upcomingTier
 */

/**
 * @typedef  {Object}   Marketplace
 * @property {String}   id          E.g. {MwsAccountId}_ATVPDKIKX0DER for US marketplace.
 * @property {String}   name        Marketplace's domaine, e.g. Amazon.com, Amazon.ca etc.
 * @property {String}   currency    Three-letter ISO-4217 code, e.g. USD, EUR, GBP.
 * @property {Number}   productsCount Number of unique by ASIN products sold on this marketplace.
 */

/**
 * @typedef  {Object}         MwsAccount
 * @property {Number}         id
 * @property {String}         name
 * @property {String}         sellerId
 * @property {String}         authToken    Write only!
 * @property {Marketplace[]}  marketplaces
 * @property {String}         status       Can be:
 *                                         - `new` for new accounts which are currenly synced
 *                                           for the first time;
 *                                         - `active` for all accounts which are already synced
 *                                           and scheduled for updates
 *                                         - `disabled` for accounts with revoked by users access
 * @property {Number|String?} syncStatus   Number means percent of synced data.
 *                                         `in_progress` sting means scheduled update.
 *                                         Null means no sync at the moment.
 * @property {Date}     dataSynced
 * @property {Date}     dataStarted
 * @property {Date}     created
 * @property {Date}     updated
 */

/**
 * @typedef  {Object} AdsAccount
 * @property {Number} id
 * @property {String} accessToken  Write only
 * @property {String} refreshToken Write only
 * @property {Date}   expired
 * @property {Number|String?} syncStatus   Number means percent of synced data.
 * @property {Date}   dataSynced
 * @property {Date}   dataStarted
 * @property {String}         status       Can be:
 *                                         - `active` for all accounts which are already synced
 *                                           and scheduled for updates
 *                                         - `disabled` for accounts with revoked by users access
 * @property {Date}   created
 * @property {Date}   updated
 */

/**
 * @typedef  {Object}       UserProfile
 * @property {Number}       id
 * @property {String}       email       Unique email address.
 * @property {String?}      firstName
 * @property {String?}      lastName
 * @property {String}       status      Can be 'active', 'deleted', 'disabled'.
 *                                      Only active users can log in to the app.
 * @property {Boolean}      isAdmin
 * @property {String?}      marketplace ID of current marketplace chosen by user.
 * @property {Date}         lastLogged
 * @property {Date}         created     Sign up's date.
 * @property {Date}         updated     Date of the latest profile's update (by user).
 * @property {MwsAccount[]} mwsAccounts MWS accounts list
 * @property {AdsAccount[]}  adsAccounts Advertising accounts list
 * @property {Subscription} subscription
 * @property {Boolean}      isDiscounted Tells if there was a promo code applied
 */
