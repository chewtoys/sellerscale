<template>
  <MiContainer narrow>
    <nu-heading size="h1|||h3">
      {{ $t('manage_accounts.header') }}
    </nu-heading>
    <nu-line></nu-line>

    <nu-flow gap="3" padding="1 0 0 0">
      <nu-flow name="mws-accounts" gap="1">
        <StickyHeader items="center">
          <nu-heading level="2" size="h2||h4|h5">MWS accounts</nu-heading>
          <nu-btn
            mod="sm"
            @tap="$router.push('/integration')"
            special>
            {{ $t('settings.seller.connect') }}
          </nu-btn>
        </StickyHeader>

        <nu-flow v-for="(account, index) in User.profile.mwsAccounts" gap=".5" :key="account.id">
          <MiModal ref="editNameModal" width="20" v-slot="{ resolve, reject }">
            <nu-flow gap=".5" padding=".5">
              <nu-block mod="w6">
                Account name:
              </nu-block>
              <nu-input>
                <input
                  v-model="accountName"
                  maxlength="48"
                  @keydown.enter="account.name.trim().length && resolve()"/>
              </nu-input>
              <nu-line></nu-line>
              <nu-grid gap="1" columns="1fr 1fr">
                <nu-btn special @tap="resolve" :disabled="!account.name.trim().length">
                  Save
                </nu-btn>
                <nu-btn @tap="reject">
                  Cancel
                </nu-btn>
              </nu-grid>
            </nu-flow>
          </MiModal>

          <nu-pane>
            <nu-heading level="4">
              <nu-flex gap="1" items="center">
                <nu-btn
                  id="edit-btn"
                  @tap="openEditModal(account, index)"
                  padding="0 .5" border="0" mod="transparent" color=":hover[special]">
                  {{ account.name }}
                  <nu-icon
                    name="edit"
                    opacity="0 #edit-btn:hover[1]"
                    transition="opacity"
                    inline></nu-icon>
                </nu-btn>

                <nu-block
                  v-if="switchingMarketplace
                    && account.marketplaces.includes(switchingMarketplace)"
                  mod="sm primary">
                  <nu-icon name="zap" inline></nu-icon>
                  {{ $t('label.switching_marketplace') }}
                </nu-block>
              </nu-flex>
            </nu-heading>
            <nu-flex gap=".5">
<!--              <nu-btn-->
<!--                @tap="sync(account.id)" special-->
<!--                mod="xs"-->
<!--                disabled>-->
<!--                {{ $t(`actions.sync`) }}-->
<!--              </nu-btn>-->
              <nu-btn
                @tap="revoke(account.id)" theme="danger" special
                v-tooltip="$t('manage_accounts.delete_tooltip')"
                mod="xs"
                disabled>
                {{ $t(`actions.revoke`) }}
              </nu-btn>
            </nu-flex>
          </nu-pane>
          <MwsAccountsTable
            :account="account"
            :active="User.profile.marketplace"
            @activate="activate"
            :disabled="!!switchingMarketplace"/>
        </nu-flow>
      </nu-flow>

      <nu-flow name="advertising-accounts" gap="1">
        <StickyHeader items="center">
          <nu-heading level="2" size="h2||h4|h5">Advertising accounts</nu-heading>
          <nu-btn
            mod="sm"
            @tap="connectAds()"
            special>
            {{ $t('settings.advertising.connect') }}
          </nu-btn>
        </StickyHeader>

        <AdsAccountsTable :items="User.profile.adsAccounts"/>
      </nu-flow>
    </nu-flow>
  </MiContainer>
</template>

<script>
import Logdown from 'logdown';
import formSchema from '@/scheme/amazon-account.form';
import AdsAccountsTable from '@/components/ads-accounts.table.vue';
import MwsAccountsTable from '@/components/mws-accounts.table.vue';
import { grandAdvertisingAccess } from '@/stores/advertising-accounts.store';
import StickyHeader from '@/components/sticky-header.vue';
import StoreMixin from '@/mixins/store.mixin';
import User from '@/services/user';
import API from '@/services/api';

const logger = new Logdown('accounts-manager');

export default {
  name: 'manage-accounts',
  mixins: [
    StoreMixin({
      showInstructions: true,
    }),
  ],
  data() {
    return {
      formSchema,
      ssId: '178331505128',
      ssName: 'Sellerscale',
      accountId: null,
      formData: null,
      dirty: false,
      amazonLink: 'https://sellercentral.amazon.com/gp/mws/registration/register.html?signInPageDisplayed=2&developerName=Sellerscale&devMWSAccountId=178331505128',
      accounts: [],
      store: null,
      advertisingAccountsStore: null,
      User,
      accountName: '',
    };
  },
  methods: {
    activate(marketplace) {
      return User.switchMarketplace(marketplace);
    },
    openEditModal(account, index) {
      const currentName = account.name;

      this.accountName = currentName;

      this.$refs.editNameModal[index].open()
        .then(() => API.AmazonSellerAccounts.update({
          id: account.id,
          name: this.accountName,
        }))
        .then(() => User.refreshProfile())
        .catch(() => {
          account.name = currentName;
        });
    },
    async connectAds() {
      try {
        await grandAdvertisingAccess();
        await User.refreshProfile();
      } catch (e) {
        // do nothing
      }
    },
  },
  computed: {
    switchingMarketplace() {
      return User.switchingMarketplace;
    },
  },
  components: {
    StickyHeader,
    AdsAccountsTable,
    MwsAccountsTable,
  },
};
</script>
