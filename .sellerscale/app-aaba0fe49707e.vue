<template>
  <nu-block
    id="root"
    gap="2"
    responsive="980px|640px|520px"
    color
    background="var(--nu-body-background-color)">
    <nu-theme
      color="#333"
      background-color="#fff"
      border-color="#d2ddec"
      special-color="#3297db"></nu-theme>
    <nu-theme
      name="body"
      color="#333"
      background-color="#f9fbfd"
      border-color="#d2ddec"
      special-color="#3297db"></nu-theme>
    <nu-theme
      name="minor"
      color="#5d718f"
      background-color="#f4f5f6"
      border-color="#d2ddec"
      special-color="#3297db"></nu-theme>
    <nu-theme
      name="read"
      color="#888"
      background-color="#fff"></nu-theme>
    <nu-theme
      name="special"
      color="#fff"
      background-color="#3297db"
      border-color="rgba(152, 203, 237, 1)"
      special-color="#fff"></nu-theme>
    <nu-theme
      name="primary"
      color="#3297db"
      background-color="#fff"></nu-theme>
    <nu-theme
      name="danger"
      color="#e63757"
      background-color="#fff"
      special-color="#e63757"></nu-theme>
    <nu-theme
      name="success"
      color="#00d97e"
      background-color="#fff"
      special-color="#fff"></nu-theme>
    <nu-theme
      name="muted"
      color="#95aac9"></nu-theme>

    <nu-theme name="empty-group" color="#5c81b6"></nu-theme>
    <nu-theme name="costs" color="#a39057" background-color="#fef8e7"></nu-theme>
    <nu-theme name="details" color="#6c7d94" background-color="#f9fbfd"></nu-theme>
    <nu-theme name="inputs" color="#799982" background-color="#effdf3"></nu-theme>
    <nu-theme name="outputs" color="#9c82b1" background-color="#f5f1f8"></nu-theme>
    <nu-theme name="cogs" color="#a39057" background-color="#fef8e7"></nu-theme>
    <nu-theme name="other-costs" color="#bb8181" background-color="#f9edf0"></nu-theme>
    <nu-theme name="ppc-cost" color="#6591ca" background-color="rgba(232, 242, 255, 1)"></nu-theme>
    <nu-theme name="payback" color="#7b8fad" background-color="#ecf6f9"></nu-theme>

    <nu-theme name="chart-count" color="#e57" background-color="#fff"></nu-theme>
    <nu-theme name="chart-sales" color="#3297db" background-color="#fff"></nu-theme>
    <nu-theme name="chart-profit" color="#66bb66" background-color="#fff"></nu-theme>
    <nu-theme name="chart-acos" color="#3297db" background-color="#fff"></nu-theme>
    <nu-theme name="chart-ppc-spend" color="#e57" background-color="#fff"></nu-theme>

    <nu-mod name="primary">color: var(--nu-primary-color);</nu-mod>
    <nu-mod name="danger">color: var(--nu-danger-color);</nu-mod>
    <nu-mod name="success">color: var(--nu-success-color);</nu-mod>
    <nu-mod name="stretched">
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    </nu-mod>
    <nu-mod name="sticky-top">
      position: sticky;
      top: 0;
    </nu-mod>
    <nu-mod name="table-sticky-left">
      position: sticky;
      left: 0;
      border-right: var(--nu-theme-border-width) solid var(--nu-theme-border-color);
      z-index: 1;
    </nu-mod>

    <nu-mod name="center-block">
      display: block;
      margin-left: auto;
      margin-right: auto;
    </nu-mod>

    <nu-mod name="dashed-border">
      border-bottom: 1px dashed var(--nu-theme-border-color);
    </nu-mod>

    <nu-mod name="rotation">
      animation: rotation 2s infinite linear;
    </nu-mod>

    <nu-line v-if="compact" size=".25" color="special"/>
    <NavBar v-if="!compact && $route.name" responsive="1220px|1050px|520px|320px">
      <template v-slot:brand>
        <nu-btn
          cell
          @tap="$router.push('/')"
          radius="0" border="0" padding="0 .5">
          <nu-block
            class="nu-dark-invert"
            width="14|2.5" height="2.5"
            place="center"
            background="left center / cover no-repeat url(/img/logo.png)"></nu-block>
        </nu-btn>
      </template>

      <template v-slot:links>
        <nu-tablist :value="$route.name" mod="minor" gap="1||calc((100vw - 340px) / 20)||0">
          <nu-tab
            value="dashboard"
            padding="0||0 .5|0 .25"
            @tap="$router.push('/dashboard')">
            <nu-icon name="bar-chart-2" size="1||2|1.5" inline></nu-icon>
            <nu-block hidden="false||true">
              {{ $t('dashboard.header') }}
            </nu-block>
          </nu-tab>
          <nu-tab
            value="unit"
            padding="0||0 .5|0 .25"
            @tap="$router.push('/unit')">
            <nu-icon name="layout" size="1||2|1.5" inline></nu-icon>
            <nu-block hidden="false||true">
              {{ $t('unit.header') }}
            </nu-block>
          </nu-tab>
          <nu-tab
            value="pnl"
            padding="0||0 .5|0 .25"
            @tap="$router.push('/pnl')">
            <nu-icon name="shuffle" size="1||2|1.5" inline></nu-icon>
            <nu-block hidden="false||true">
              {{ $t('title.pnl') }}
            </nu-block>
          </nu-tab>
          <nu-tab
            value="expenses"
            padding="0||0 .5|0 .25"
            @tap="$router.push('/expenses')">
            <nu-icon name="dollar-sign" size="1||2|1.5" inline></nu-icon>
            <nu-block hidden="false||true">
              {{ $t('expenses.header') }}
            </nu-block>
          </nu-tab>
          <nu-tab
            value="products"
            padding="0||0 .5|0 .25"
            @tap="$router.push('/products')">
            <nu-icon name="package" size="1||2|1.5" inline></nu-icon>
            <nu-block hidden="false||true">
              {{ $t('products.header') }}
            </nu-block>
          </nu-tab>
          <nu-tab
            disabled
            value="inventory"
            padding="0||0 .5|0 .25"
            @tap="$router.push('/inventory')">
            <nu-icon name="truck" size="1||2|1.5" inline></nu-icon>
            <nu-block hidden="false||true">
              {{ $t('title.inventory') }}
            </nu-block>
            <nu-block class="coming-soon" size=".666 1|||.5 .75">
              {{ $t('label.soon') }}
            </nu-block>
          </nu-tab>
        </nu-tablist>
      </template>

      <template v-slot:widgets>
        <nu-grid width="4">
          <NotificationsWidget/>
        </nu-grid>
        <nu-line orient="y" height="clamp(3, 3, 3)" place="center"></nu-line>
        <AuthWidget/>
        <!--        <LangSwitcher></LangSwitcher>-->
      </template>
    </NavBar>
    <nu-block
      height="min(100vh)"
      padding="2 0 12 0">
      <RouterView/>
    </nu-block>
    <AppFooter v-if="!compact || $route.meta.footer"></AppFooter>
    <LiveNotifications/>
  </nu-block>
</template>

<script>
import './global.css';
// import './base/index.css';
import './base-ui-loader';
import NavBar from './components/navbar.vue';
import AuthWidget from './components/auth-widget.vue';
import NotificationsWidget from './components/notifications-widget.vue';
import AppFooter from './components/footer.vue';
import LiveNotifications from './components/live-notifications.vue';

export default {
  components: {
    NavBar,
    // LangSwitcher,
    AuthWidget,
    NotificationsWidget,
    AppFooter,
    LiveNotifications,
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
  },
  computed: {
    compact() {
      return this.$route.meta && this.$route.meta.skipAuth;
    },
  },
};
</script>

<style scoped>
.coming-soon {
  position: absolute;
  bottom: 4px;
  left: 42%;
  transform: translate(-42%, 0);
  color: white !important;
  -webkit-text-fill-color: var(--nu-theme-background-color);
  background-color: var(--nu-primary-color);
  padding: 0 .5em;
  border-radius: .5em;
  font-size: .66rem;
}
</style>
