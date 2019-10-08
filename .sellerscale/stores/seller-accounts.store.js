import Logdown from 'logdown';
import API from '@/services/api';
import SellerAccountStore from './seller-account.store';
import ItemsStore from './items.store';

const logger = new Logdown('app.seller-accounts-store-static');

export const MWS_CONNECT_URL = 'https://sellercentral.amazon.com/gp/mws/registration/register.html?signInPageDisplayed=2&developerName=Sellerscale&devMWSAccountId=178331505128';

/**
 * @typedef IntegrationStatus
 * @property {Boolean} access – is MWS access granted?
 * @property {Boolean} ready – is MWS data ready?
 */

/**
 * @class
 * @property {Array<SellerAccountStore>} items
 */
export default class SellerAccountsStore extends ItemsStore {
  static get api() {
    return API.AmazonSellerAccounts;
  }

  static get store() {
    return SellerAccountStore;
  }

  static async integrationStatus() {
    return this.api.getAll()
      .then((collection) => {
        let access = collection.length;
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
  //       // region: 'North America',
  //       sellerId: '1932483234',
  //       status: 'in_progress',
  //       lastSync: '1 May 2019 23:19',
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
