import Logdown from 'logdown';
import API from '@/services/api';
import AdvertisingAccountStore from './advertising-account.store';
import ItemsStore from './items.store';
import { openPopupWindow } from '@/util';
import Analytics from '@/services/analytics';

const logger = new Logdown('app.advertising-accounts-store-static');

const HOSTNAME = process.env.NODE_ENV === 'development'
  ? 'next.sellerscale.com'
  : window.location.hostname;

export const ADV_CONNECT_URL = `https://www.amazon.com/ap/oa?client_id=amzn1.application-oa2-client.b1172ff3c126476892c85d0815ad0933&scope=cpc_advertising:campaign_management&response_type=code&redirect_uri=https://${HOSTNAME}/integration/callback`;

/**
 * @class
 * @property {Array<AdvertisingAccountStore>} items
 */
export default class AdvertisingAccountsStore extends ItemsStore {
  static get api() {
    return API.AmazonAdvertisingAccounts;
  }

  static get store() {
    return AdvertisingAccountStore;
  }

  static async integrationStatus() {
    return this.api.getAll()
      .then((collection) => {
        let access = !!collection.length;
        let ready = !!collection.find(account => account.status === 'partially_synced'
          || account.lastSync);

        logger.info('integration access?', access ? 'GRANTED' : 'NO');
        logger.info('integration ready?', access ? 'YES' : 'IN SYNC');

        access = process.env.VUE_APP_FAKE_INTEGRATION_ACCESS != null
          ? process.env.VUE_APP_FAKE_INTEGRATION_ACCESS === 'true'
          : access;

        if (process.env.VUE_APP_FAKE_INTEGRATION_ACCESS != null) {
          logger.info('fake integration access?', access ? 'GRANTED' : 'NO');
        }

        ready = process.env.VUE_APP_FAKE_INTEGRATION_READY != null
          ? process.env.VUE_APP_FAKE_INTEGRATION_READY === 'true'
          : ready;

        if (process.env.VUE_APP_FAKE_INTEGRATION_READY != null) {
          logger.info('fake integration ready?', ready ? 'YES' : 'IN SYNC');
        }

        return { access, ready };
      });
  }

  // async fetch() {
  //   this.items = [];
  //
  //   return this;
  // }

  // async fetch() {
  //   this.items = [
  //     {
  //       id: 5,
  //       name: 'Amazon Account',
  //       marketplace: 'Amazon',
  //       region: 'North America',
  //       status: 'in_progress',
  //       lastSync: undefined,
  //     },
  //   ].map(itemData => new this.Store(itemData));
  //
  //   return this;
  // }

  revoke(id) {
    const account = this.getById(id);

    return account.delete()
      .then(() => this.fetch());
  }
}

export async function grandAdvertisingAccess() {
  // const window = openPopupWindow(CONNECT_URL);

  return new Promise((resolve, reject) => {
    Analytics.event('advertising-access:attempt');

    const window = openPopupWindow(ADV_CONNECT_URL);

    const timerId = setInterval(() => {
      try {
        const href = window.location.href;

        if (href == null) {
          Analytics.event('advertising-access:aborted');
          clearInterval(timerId);
          reject();
        } else if (href.endsWith('/failed')) {
          Analytics.event('advertising-access:failed');
          clearInterval(timerId);
          setTimeout(() => {
            window.close();
            reject();
          }, 1000);
        } else if (href.endsWith('/success')) {
          clearInterval(timerId);
          setTimeout(() => {
            Analytics.event('advertising-access:granted');
            window.close();
            resolve();
          }, 1000);
        }
      } catch (e) {
        // do nothing
      }
    }, 500);
  });
}
