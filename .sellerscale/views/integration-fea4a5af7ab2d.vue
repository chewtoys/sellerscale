<template>
  <MiContainer
    narrow>
    <StickyHeader>
      <nu-heading>{{ $t('integration.header') }}</nu-heading>
    </StickyHeader>

    <nu-grid
      columns="auto 1fr" gap="1" items="start"
      v-if="phase > 0">
      <nu-grid row="1 / span 2">
        <nu-icon name="check" size="3" mod="success"></nu-icon>
      </nu-grid>
      <div>
        <span v-html="$t('settings.seller.connected')"></span>&nbsp;<span
        v-if="phase === 1"
        v-html="$t('settings.seller.connect_next')"></span>
      </div>
      <nu-btn
        v-if="phase === 1"
        special
        @tap="connectAdvertisingAccount"
        icon="arrow-right-circle" placeIcon="end" iconSize="1.25">
        {{ $t('settings.advertising.connect') }}
      </nu-btn>
    </nu-grid>

    <nu-grid
      columns="auto 1fr" gap="1" items="center start"
      v-if="phase === 2">
      <nu-grid>
        <nu-icon name="check" size="3" mod="success"></nu-icon>
      </nu-grid>
      <nu-grid>
        <span v-html="$t('settings.advertising.connected')"></span>
      </nu-grid>
    </nu-grid>

    <nu-grid
      columns="auto 1fr" gap="1" items="center start"
      v-if="phase === 2">
      <nu-grid row="1 / span 2" place="start">
        <nu-icon name="thumbs-up" size="3" mod="success"></nu-icon>
      </nu-grid>
      <nu-grid height="3" items="center">
        <p v-html="$markdown($t('integration.complete'))"></p>
      </nu-grid>
    </nu-grid>

    <nu-grid v-if="phase === 0" columns="2 1fr" gap="1" items="start stretch">
      <nu-block mod="relative minor">
        <nu-icon name="circle" size="2"></nu-icon>
        <nu-grid padding=".125 0 0 0" mod="stretched w6 md" items="center">1</nu-grid>
      </nu-block>
      <nu-block>
        {{ $t('integration.step_1_1') }}
        <nu-link @tap="openAmazonCentral">
          <nu-icon name="external-link" inline></nu-icon>
          Seller Central
        </nu-link>
        {{ $t('integration.step_1_2') }}:
        <nu-block padding=".5 1">
          <nu-block>Developer's Name: <b>Sellerscale</b></nu-block>
          <nu-block>Developer ID: <b>178331505128</b></nu-block>
        </nu-block>
      </nu-block>

      <nu-block mod="relative minor">
        <nu-icon name="circle" size="2"></nu-icon>
        <nu-grid padding=".125 0 0 0" mod="stretched w6 md" items="center">2</nu-grid>
      </nu-block>
      <nu-block v-html="$markdown($t('integration.step_2'), true)">
      </nu-block>

      <nu-block mod="relative minor">
        <nu-icon name="circle" size="2"></nu-icon>
        <nu-grid padding=".125 0 0 0" mod="stretched w6 md" items="center">3</nu-grid>
      </nu-block>
      <nu-block v-html="$markdown($t('integration.step_3'), true)">
      </nu-block>

      <nu-block mod="relative minor">
        <nu-icon name="circle" size="2"></nu-icon>
        <nu-grid padding=".125 0 0 0" mod="stretched w6 md" items="center">4</nu-grid>
      </nu-block>
      <nu-block>
        <nu-flow items="start" gap="1">
          <nu-block v-html="$markdown($t('integration.step_4'), true)">
          </nu-block>
          <nu-block
            width="clamp(initial, 100%, 617px)"
            padding="45% 0 0 0"
            background="no-repeat left / contain url(/img/amazon/screenshot.png)">
          </nu-block>
        </nu-flow>
      </nu-block>

      <nu-block mod="relative minor">
        <nu-icon name="circle" size="2"></nu-icon>
        <nu-grid padding=".125 0 0 0" mod="stretched w6 md" items="center">5</nu-grid>
      </nu-block>
      <nu-block>
        {{ $t('integration.step_5') }}:
        <nu-flow padding=".5 2 0 1" mod="md" gap="1">
          <nu-block>
            <nu-block mod="w6">Seller ID</nu-block>
            <nu-input>
              <input v-model="account.sellerId"/>
            </nu-input>
          </nu-block>
          <nu-block>
            <nu-block mod="w6">MWS Auth Token</nu-block>
            <nu-input>
              <input v-model="account.authToken"/>
            </nu-input>
          </nu-block>
        </nu-flow>
      </nu-block>

      <nu-block mod="relative minor">
        <nu-icon name="circle" size="2"></nu-icon>
        <nu-grid padding=".125 0 0 0" mod="stretched w6 md" items="center">6</nu-grid>
      </nu-block>
      <nu-block>
        {{ $t('integration.step_6') }}:
        <nu-flow padding=".5 2 0 1" mod="md" gap="1">
          <nu-block>
            <nu-block mod="w6">{{ $t('integration.account_name') }}</nu-block>
            <nu-input>
              <input v-model="account.name"/>
            </nu-input>
          </nu-block>
          <nu-flow gap=".5" items="start">
            <nu-btn
              special
              @tap="connect"
              :disabled="!isFormValid || loading">Connect
            </nu-btn>
            <nu-block v-if="showError" mod="danger" size="sm">
              {{ this.error }}
            </nu-block>
          </nu-flow>
        </nu-flow>
      </nu-block>
    </nu-grid>
  </MiContainer>
</template>

<script>
import StickyHeader from '@/components/sticky-header.vue';
import SellerAccountStore from '@/stores/seller-account.store';
import { grandAdvertisingAccess } from '@/stores/advertising-accounts.store';
import Analytics from '@/services/analytics';
import { openPopupWindow, pause } from '@/util';
import User from '@/services/user';
import ReactSwitchMixin from '@/mixins/react-switch';
import { MWS_CONNECT_URL } from '@/stores/seller-accounts.store';
import { scrollTop } from '@/services/window';

export default {
  name: 'integration',
  mixins: [
    ReactSwitchMixin(),
  ],
  data() {
    return {
      account: {
        sellerId: '',
        authToken: '',
        name: '',
        marketplace: 'amazon',
      },
      amazonLink: MWS_CONNECT_URL,
      showError: false,
      error: '',
      loading: false,
      phase: 0,
      User,
    };
  },
  computed: {
    isFormValid() {
      return this.account.sellerId.length > 2
        && this.account.authToken.length > 2
        && this.account.name.length > 2;
    },
  },
  mounted() {
    let phase = this.$route.query.phase;

    if (!phase) return;

    phase = parseInt(phase, 10);

    if (phase >= 0 && phase < 3) {
      this.phase = phase;
    }
  },
  methods: {
    async connect() {
      const account = new SellerAccountStore(this.account);

      this.showError = false;
      this.loading = true;

      try {
        Analytics.event('mws-access:grant', this.account);

        await account.save();

        Analytics.event('mws-access:granted', this.account);
      } catch ({ error }) {
        this.showError = true;

        const errorKey = `server_errors.${error}`;

        this.error = this.$te(errorKey) ? this.$t(errorKey) : this.$t('label.something_went_wrong');
      }

      this.loading = false;

      if (!this.showError) {
        await User.refreshProfile();

        this.phase += 1;

        scrollTop();

        User.updateProfileNotifications();

        if (window.currentPopupWindow) {
          window.currentPopupWindow.close();
        }
      }
    },
    openAmazonCentral() {
      openPopupWindow(this.amazonLink);
    },
    connectAdvertisingAccount() {
      grandAdvertisingAccess()
        .then(() => {
          this.phase += 1;

          scrollTop();

          User.updateProfileNotifications();

          setTimeout(() => {
            this.$router.push('/dashboard');
          }, 3000);
        })
        .catch(() => {}); // do nothing
    },
  },
  components: {
    StickyHeader,
  },
};
</script>
