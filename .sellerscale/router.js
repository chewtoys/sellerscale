import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/home.vue';
import i18n, { loadLanguage } from '@/i18n';
import Auth from '@/services/auth';
import Analytics from '@/services/analytics';
import Actions from '@/services/actions';
import User from '@/services/user';
import GlobalEvents from '@/services/global-events';
import { adBlocking } from '@/util';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/new',
      name: 'home_new',
      component: Home,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "view-dashboard" */ './views/dashboard.vue'),
      meta: {},
    },
    {
      path: '/unit',
      name: 'unit',
      component: () => import(/* webpackChunkName: "view-unit" */ './views/unit.vue'),
      meta: {},
    },
    {
      path: '/products',
      name: 'products',
      component: () => import(/* webpackChunkName: "view-products" */ './views/products.vue'),
      meta: {},
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import(/* webpackChunkName: "view-expenses" */ './views/expenses.vue'),
      meta: {},
    },
    {
      path: '/products/:id',
      name: 'product',
      component: () => import(/* webpackChunkName: "view-product" */ './views/product.vue'),
      meta: {},
    },
    {
      path: '/pnl',
      name: 'pnl',
      component: () => import(/* webpackChunkName: "view-pnl" */ './views/pnl.vue'),
      meta: {},
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "view-about" */ './views/about.vue'),
      meta: {
        skipAuth: true,
        footer: true,
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import(/* webpackChunkName: "view-admin" */ './views/admin.vue'),
      meta: {},
    },
    {
      path: '/integration/failed',
      name: 'integration-failed',
      component: () => import(/* webpackChunkName: "view-integration-failed" */ './views/integration-failed.vue'),
      meta: {
        // TODO: implement separated flag to hide banner
        skipAuth: true,
      },
    },
    {
      path: '/integration/success',
      name: 'integration-success',
      component: () => import(/* webpackChunkName: "view-integration-success" */ './views/integration-success.vue'),
      meta: {
        // TODO: implement separated flag to hide banner
        skipAuth: true,
      },
    },
    {
      path: '/integration/callback',
      name: 'integration-callback',
      component: () => import(/* webpackChunkName: "view-integration-callback" */ './views/integration-callback.vue'),
      meta: {
        // TODO: implement separated flag to hide banner
        skipAuth: true,
      },
    },
    {
      path: '/integration',
      name: 'integration',
      component: () => import(/* webpackChunkName: "view-integration" */ './views/integration.vue'),
    },
    {
      path: '/manage-accounts',
      name: 'manage-accounts',
      component: () => import(/* webpackChunkName: "view-manage-accounts" */ './views/manage-accounts.vue'),
      meta: {},
    },
    {
      path: '/personal-settings',
      name: 'personal-settings',
      component: () => import(/* webpackChunkName: "view-personal-settings" */ './views/personal-settings.vue'),
      meta: {},
    },
    {
      path: '/subscription',
      name: 'subscription',
      component: () => import(/* webpackChunkName: "view-subscription" */ './views/subscription.vue'),
      meta: {},
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import(/* webpackChunkName: "view-pricing" */ './views/pricing.vue'),
      meta: {
        skipAuth: true,
        footer: true,
      },
    },
    {
      path: '/user/signup',
      name: 'user-sign-up',
      component: () => import(/* webpackChunkName: "view-user-sign-up" */ './views/user/sign-up.vue'),
      meta: {
        skipAuth: true,
      },
    },
    {
      path: '/user/signin',
      name: 'user-sign-in',
      component: () => import(/* webpackChunkName: "view-user-sign-in" */ './views/user/sign-in.vue'),
      meta: {
        skipAuth: true,
      },
    },
    {
      path: '/user/restore-password',
      name: 'user-restore-password',
      component: () => import(/* webpackChunkName: "view-user-restore-password" */ './views/user/restore-password.vue'),
      meta: {
        skipAuth: true,
      },
    },
    {
      path: '/user/logout',
      name: 'user-logout',
      component: () => import(/* webpackChunkName: "view-user-sign-in" */ './views/user/logout.vue'),
      meta: {
        skipAuth: true,
      },
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import(/* webpackChunkName: "view-privacy-policy" */ './views/privacy-policy.vue'),
      meta: {
        skipAuth: true,
        footer: true,
      },
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: () => import(/* webpackChunkName: "view-terms-and-conditions" */ './views/terms-and-conditions.vue'),
      meta: {
        skipAuth: true,
        footer: true,
      },
    },
    {
      path: '/ebook',
      name: 'ebook',
      component: () => import(/* webpackChunkName: "view-ebook" */ './views/ebook.vue'),
      meta: {
        skipAuth: true,
        footer: true,
      },
    },
    {
      path: '/video',
      name: 'video',
      component: () => import(/* webpackChunkName: "view-video" */ './views/video.vue'),
      meta: {
        skipAuth: true,
        footer: true,
      },
    },
    {
      path: '/adblock',
      name: 'adblock',
      component: () => import(/* webpackChunkName: "view-adblock" */ './views/adblock.vue'),
      meta: {
        skipAuth: true,
      },
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import(/* webpackChunkName: "view-demo" */ './views/demo.vue'),
      meta: {
        skipAuth: true,
      },
    },
    {
      path: '*',
      name: 'not-found',
      component: () => import(/* webpackChunkName: "view-not-found" */ './views/not-found.vue'),
      meta: {
        skipAuth: true,
        footer: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  GlobalEvents.$emit('location:beforeChange');

  await loadLanguage();
  // if route requires authorization
  if (to.matched.some(record => !record.meta.skipAuth)) {
    // if user doesn't have auth token
    if (!(await Auth.isAuthorized())) {
      // move to login page
      return next({
        name: 'user-sign-in',
        params: { nextUrl: to.fullPath },
      });
    }
  }

  await User.refreshProfile();

  User.updateProfileNotifications();

  if (await adBlocking() && to.name !== 'adblock') {
    return next({
      name: 'adblock',
      params: { nextUrl: to.fullPath },
    });
  }

  if (i18n.t(`title.${to.name}`)) {
    document.title = `${i18n.t(`title.${to.name}`)} – Sellerscale`;
    i18n.documentTitle = to.name;
  } else {
    document.title = 'Sellerscale';
    i18n.documentTitle = '';
  }

  // move next
  return next();
});

router.afterEach(async (to) => {
  GlobalEvents.$emit('location:afterChange');
  Actions.reset();

  Analytics.track(to.path);

  document.documentElement.scrollTop = 0;
});

export default router;
