<template>
  <MiContainer
    v-if="!hidden && sellerAccountsStore && advertisingAccountsStore"
    narrow>
    <nu-card border shadow>
      <nu-flex flow="column" gap="1">
        <nu-block>
          <nu-block padding="0 0 1 0">
            <nu-heading>{{ $t('home.title') }}</nu-heading>
          </nu-block>
          <nu-line></nu-line>
        </nu-block>

        <nu-block mod="bg" v-html="$markdown(sellerAccountsStore.isEmpty()
            ? $t('home.call_to_action')
            : $t('home.intro'), true)">
        </nu-block>

        <nu-line
          v-if="sellerAccountsStore.isEmpty() || advertisingAccountsStore.isEmpty()">
        </nu-line>

        <nu-block>
          <nu-btn
            v-if="sellerAccountsStore.isEmpty()"
            flow="row" content="stretch" items="stretch"
            shadow=".5"
            special
            width="max(30)"
            @tap="$router.push(`/integration`)" mod="wrap">
            <nu-pane>
              <nu-heading level="4">{{ $t('home.connect.seller') }}</nu-heading>
              <nu-icon name="zap" size="1.5"></nu-icon>
            </nu-pane>
            <nu-line></nu-line>
            <nu-block>
              {{ $t('home.connect.description') }}
            </nu-block>
          </nu-btn>

          <nu-btn
            v-if="!sellerAccountsStore.isEmpty() && advertisingAccountsStore.isEmpty()"
            flow="row" gap=".5" items="stretch"
            shadow=".5"
            special
            width="max(30)"
            @tap="connectAdvertisingAccount" mod="wrap">
            <nu-pane>
              <nu-heading level="5">{{ $t('home.connect.advertising') }}</nu-heading>
              <nu-icon name="zap" size="1.5"></nu-icon>
            </nu-pane>
            <nu-line></nu-line>
            <nu-block>
              {{ $t('home.connect.description') }}
            </nu-block>
          </nu-btn>

<!--          <nu-flex flow="column" gap=".5">-->
<!--            <p class="-nu-w6 -nu-bg">-->
<!--              {{ $t('home.get_started') }}:-->
<!--            </p>-->
<!--            <ul>-->
<!--              <li>-->
<!--                <span v-html="$markdown($t('home.step_1'), true)"></span> - -->
<!--                <span-->
<!--                  v-if="sellerAccountsStore.isEmpty() || advertisingAccountsStore.isEmpty()">-->
<!--                  {{ $t('home.step_1_1') }}-->
<!--                </span>-->
<!--                <nu-badge v-else theme="success" radius="1.5" border>-->
<!--                  <b>{{ $t('home.step_1_2') }}</b>-->
<!--                </nu-badge>-->
<!--              </li>-->
<!--              <li v-html="$markdown($t('home.step_2'))"></li>-->
<!--&lt;!&ndash;<li><b>Watch</b> our 5-minute product tutorial video.</li>&ndash;&gt;-->
<!--            </ul>-->
<!--          </nu-flex>-->


        </nu-block>

        <nu-block padding="1 0 0 0">
          <nu-heading level="2">{{ $t('home.navigation') }}</nu-heading>
          <nu-line></nu-line>
        </nu-block>

        <nu-grid columns="1fr 1fr||1fr" gap="1">

          <nu-btn
            flow="row" content="start stretch" mod="wrap"
            v-for="section in sections"
            :key="section.id"
            :disabled="section.disabled"
            shadow=".5"
            @tap="openSection(section.id)">
            <nu-pane>
              <nu-heading level="3">
                {{ $t(`title.${section.id}`) }}
                <nu-badge v-if="section.disabled" mod="xs w5" theme="primary">
                  {{ $t('label.coming_soon') }}
                </nu-badge>
              </nu-heading>
              <nu-icon :name="section.icon" size="1.5"></nu-icon>
            </nu-pane>
            <nu-line></nu-line>
            <nu-block>
              {{ $t(`home.${section.id}`) }}
            </nu-block>
          </nu-btn>

        </nu-grid>
      </nu-flex>
    </nu-card>
  </MiContainer>
</template>

<script>
import SellerAccountsStore from '@/stores/seller-accounts.store';
import AdvertisingAccountsStore, { grandAdvertisingAccess } from '@/stores/advertising-accounts.store';
import PreloadMixin from '@/mixins/preload.mixin';
import { openLink } from '@/util';

export default {
  name: 'home',
  mixins: [
    PreloadMixin((to, from) => Promise.all([
      new SellerAccountsStore().fetch(),
      new AdvertisingAccountsStore().fetch(),
      Promise.resolve(from),
    ]), function setPreloadedData([sellerAccountsStore, advertisingAccountsStore, from]) {
      this.sellerAccountsStore = sellerAccountsStore;
      this.advertisingAccountsStore = advertisingAccountsStore;

      if ((!from || !from.name) && !sellerAccountsStore.isEmpty()) {
        this.hidden = true;
        this.$router.push('/dashboard');
      }
    }),
  ],
  data() {
    return {
      hidden: false,
      sellerAccountsStore: null,
      advertisingAccountsStore: null,
      sections: [
        {
          id: 'dashboard',
          icon: 'sliders',
        },
        {
          id: 'unit',
          icon: 'layout',
        },
        {
          id: 'pnl',
          icon: 'shuffle',
        },
        {
          id: 'expenses',
          icon: 'dollar-sign',
        },
        {
          id: 'products',
          icon: 'package',
        },
        {
          id: 'inventory',
          icon: 'truck',
          disabled: true,
        },
      ],
    };
  },
  methods: {
    connectAdvertisingAccount() {
      this.preload();

      grandAdvertisingAccess()
        .then(() => this.preload())
        .catch(() => {
          // do nothing
        });
    },
    openSection(id) {
      this.$router.push(`/${id}`);
    },
  },
};
</script>
