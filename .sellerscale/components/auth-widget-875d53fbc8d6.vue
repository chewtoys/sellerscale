<template>
  <MiDropdown
    ref="root"
    v-if="User.profile.email"
    class="auth-widget" plain cell
    mod="transparent"
    sticky="right"
    @click.native="logToggle"
    padding=".5 .75|||.5" width="min(15)||auto">
    <template v-slot:default>
      <nu-flex flow="row-reverse" mod="xs" gap=".5|||0">
        <nu-icon name="user" size="2" mod="minor"></nu-icon>
        <nu-flow mod="right" hidden="false||true">
          <nu-block mod="w6 ellipsis">{{ User.profile.shortId }}</nu-block>
          <!--        <nu-block mod="ellipsis">Demo MWS account</nu-block>-->
          <nu-block mod="ellipsis">
            {{ currentAccount ? currentAccount.name :
            (syncing ? User.profile.mwsAccounts[0].name : $t('label.demo_account')) }}
          </nu-block>
          <nu-block
            v-if="!switchingMarketplace && !syncing"
            mod="minor w6">
            {{ currentMarketplace ? currentMarketplace.domain : 'amazon.com'}}
          </nu-block>
          <nu-block
            mod="minor w6"
            v-if="syncing && !switchingMarketplace">
            <nu-icon name="refresh-cw" theme="minor"></nu-icon>
            {{ $t('label.syncing') }}
          </nu-block>
          <nu-block mod="minor w6" v-if="switchingMarketplace">
            <nu-icon name="zap" theme="minor"></nu-icon>
            {{ $t('label.switching_marketplace') }}
          </nu-block>
        </nu-flow>
      </nu-flex>
    </template>
    <template v-slot:content>
      <nu-flow padding=".5 0 0 0">
<!--        <nu-block mod="w6 ellipsis right" padding=".25 .5" hidden="true|false">-->
<!--          {{ User.profile.shortId }}-->
<!--        </nu-block>-->
        <template v-for="account in User.profile.mwsAccounts">
          <nu-block
            :key="`header:${account.id}`"
            theme="details" background padding=".25 1" mod="xs ellipsis"
            v-tooltip.left="getAccountTooltip(account)">
            <nu-flex gap=".5">
              <nu-block grow="1" mod="w6">
                {{ account.name }}
              </nu-block>
              <nu-block v-if="account.syncStatus != null" mod="w5">
                {{ account.syncStatus }}%
              </nu-block>
              <nu-icon
                v-if="account.syncStatus != null && subscription.status !== 'expired'"
                name="refresh-cw"
                theme="minor"
                mod="rotation"></nu-icon>
              <nu-icon
                v-if="account.syncStatus == null && account.status === 'active'
                  && subscription.status !== 'expired'"
                name="check-circle"
                theme="success"></nu-icon>
              <nu-icon
                v-if="account.status === 'active' && subscription.status === 'expired'"
                name="x-circle"
                theme="danger"></nu-icon>
            </nu-flex>
          </nu-block>
          <nu-menu :key="`marketplaces:${account.id}`">
            <nu-menuitem
              v-for="marketplace in account.marketplaces"
              :key="`marketplace:${marketplace.id}`"
              padding="0 1"
              content="stretch"
              :border="currentMarketplace === marketplace ? '.25 left inside special' : null"
              :mod="currentMarketplace === marketplace ? 'primary' : ''"
              :disabled="account.status !== 'active'"
              @tap="activate(marketplace)">
              <nu-flex items="center stretch">
                <nu-block grow="1" padding=".5 0">
                  {{ marketplace.domain }}
                </nu-block>
                <nu-block mod="xs w6">
                  {{ marketplace.currency }}
                </nu-block>
              </nu-flex>
            </nu-menuitem>
          </nu-menu>
        </template>
        <nu-block v-if="!currentAccount">
          <nu-flex theme="details" background padding=".25 1" mod="w6 xs ellipsis" gap=".5">
            <nu-block grow="1">
              Demo MWS account
            </nu-block>
            <nu-icon name="check-circle" theme="success"></nu-icon>
          </nu-flex>
          <nu-block
            content="stretch" padding="0 1" mod="special"
            border=".25 left inside special">
            <nu-flex items="center stretch">
              <nu-block grow="1" padding=".5 0">
                amazon.com
              </nu-block>
              <nu-block mod="xs w6">
                USD
              </nu-block>
            </nu-flex>
          </nu-block>
        </nu-block>

        <nu-line></nu-line>

        <nu-menuitem @tap="link('/manage-accounts')">
          <nu-icon name="list"></nu-icon>
          {{ $t('manage_accounts.header') }}
        </nu-menuitem>

        <nu-line size=".25"></nu-line>

        <nu-flex
          theme="details" background padding=".25 .5" mod="xs ellipsis w6"
          content="space-between" gap=".5">
          <nu-block>
            {{ $t('subscription.status_header') }}
          </nu-block>
          <!--          <nu-icon name="check-circle" theme="success" inline></nu-icon>-->
          <nu-badge theme="success" v-if="subscription.status === 'trial'">Trial</nu-badge>
          <nu-badge theme="success" v-if="subscription.status === 'active'">Active</nu-badge>
          <nu-badge theme="danger" v-if="subscription.status === 'expired'">Expired</nu-badge>
          <nu-block v-if="subscription.status === 'trial'">
            {{ $tc('label.days_left', daysLeft) }}
          </nu-block>
        </nu-flex>

        <!--        <nu-grid-->
        <!--flow="column" gap=".5" padding=".5" color="minor" columns="auto 1fr auto" size="sm">-->
        <!--          <nu-icon name="check-circle" theme="success" inline size="1"></nu-icon>-->
        <!--          Active-->
        <!--          <nu-block>-->
        <!--            324 days left-->
        <!--          </nu-block>-->
        <!--        </nu-grid>-->

        <!--        <nu-line></nu-line>-->

        <nu-menu>
          <nu-menuitem @tap="link('/subscription')">
            <nu-icon name="dollar-sign"></nu-icon>
            {{ $t('subscription.header') }}
          </nu-menuitem>
        </nu-menu>

        <nu-line size=".25"></nu-line>

        <nu-menu>
          <nu-menuitem @tap="link('/personal-settings')">
            <nu-icon name="user"></nu-icon>
            {{ $t('personal_settings.header') }}
          </nu-menuitem>
          <nu-menuitem @tap="link('/admin')" v-if="User.profile.isAdmin">
            <nu-icon name="users"></nu-icon>
            {{ $t('admin.manage_users') }}
          </nu-menuitem>
          <nu-line></nu-line>
          <nu-menuitem @tap="link('/user/logout')">
            <nu-icon name="log-out"></nu-icon>
            {{ $t('title.logout') }}
          </nu-menuitem>
        </nu-menu>
      </nu-flow>
    </template>
  </MiDropdown>
</template>

<script>
import { differenceInDays, parse } from 'date-fns';
import User from '@/services/user';
import Analytics from '@/services/analytics';

export default {
  name: 'auth-widget',
  data() {
    return {
      User,
    };
  },
  computed: {
    currentAccount() {
      return User.getCurrentAccount();
    },
    currentMarketplace() {
      return User.getCurrentMarketplace();
    },
    syncing() {
      return User.isInitialSync();
    },
    switchingMarketplace() {
      return User.switchingMarketplace;
    },
    subscription() {
      return User.profile.subscription;
    },
    daysLeft() {
      return differenceInDays(parse(this.subscription.freeTrialEnded), Date.now()) + 1;
    },
  },
  methods: {
    logToggle() {
      Analytics.event('auth-widget:toggle');
    },
    activate(marketplace) {
      this.$refs.root.close();

      Analytics.event('auth-widget:switch-marketplace', { marketplace: marketplace.id });

      return User.switchMarketplace(marketplace);
    },
    getAccountTooltip(account) {
      if (account.syncStatus) {
        return this.$t('manage_accounts.sync_tooltip');
      }

      if (this.subscription.status === 'expired') {
        return this.$t('manage_accounts.expired_tooltip');
      }

      return '';
    },
    link(url) {
      this.$router.push(url);

      Analytics.event('auth-widget:link', { url });
    },
  },
};
</script>
