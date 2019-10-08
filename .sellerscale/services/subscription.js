import { injectScript, formatNumeric } from '@/util';
import API from '@/services/api';

const STRIPE_KEY = window.location.hostname === 'app.sellerscale.com'
  ? 'pk_live_Ep7skSFlNrWwTEUGR9OANZVY00B78HyvVz'
  : 'pk_test_LRDpy5dkJy04h6jWOs02meBW00kkw5anGJ';

export const PLANS = [
  {
    id: 'monthly',
    discount: 0,
  },
  {
    id: 'biannual',
    discount: 15,
  },
  {
    id: 'annual',
    discount: 30,
  },
];

export const RAW_TIERS = [
  {
    amount: 0,
    base: 9,
    percent: 0.25,
    roi: null,
  },
  {
    amount: 1000,
    base: 9,
    percent: 0.25,
    roi: 74,
  }, {
    amount: 2000,
    base: 9,
    percent: 0.25,
    roi: 186,
  }, {
    amount: 3000,
    base: 9,
    percent: 0.25,
    roi: 264,
  }, {
    amount: 4000,
    base: 9,
    percent: 0.25,
    roi: 321,
  }, {
    amount: 5000,
    base: 9,
    percent: 0.25,
    roi: 365,
  }, {
    amount: 7500,
    base: 9,
    percent: 0.25,
    roi: 441,
  }, {
    amount: 10000,
    base: 14,
    percent: 0.18,
    roi: 525,
  }, {
    amount: 12500,
    base: 14,
    percent: 0.18,
    roi: 585,
  }, {
    amount: 15000,
    base: 14,
    percent: 0.18,
    roi: 632,
  }, {
    amount: 17500,
    base: 14,
    percent: 0.18,
    roi: 669,
  }, {
    amount: 20000,
    base: 14,
    percent: 0.18,
    roi: 700,
  }, {
    amount: 25000,
    base: 14,
    percent: 0.18,
    roi: 747,
  }, {
    amount: 30000,
    base: 24,
    percent: 0.13,
    roi: 852,
  }, {
    amount: 35000,
    base: 24,
    percent: 0.13,
    roi: 907,
  }, {
    amount: 40000,
    base: 24,
    percent: 0.13,
    roi: 953,
  }, {
    amount: 45000,
    base: 24,
    percent: 0.13,
    roi: 991,
  }, {
    amount: 50000,
    base: 24,
    percent: 0.13,
    roi: 1024,
  }, {
    amount: 60000,
    base: 24,
    percent: 0.13,
    roi: 1076,
  }, {
    amount: 70000,
    base: 24,
    percent: 0.13,
    roi: 1117,
  }, {
    amount: 80000,
    base: 24,
    percent: 0.13,
    roi: 1150,
  }, {
    amount: 90000,
    base: 79,
    percent: 0.06,
    roi: 1285,
  }, {
    amount: 100000,
    base: 79,
    percent: 0.06,
    roi: 1339,
  }, {
    amount: 120000,
    base: 79,
    percent: 0.06,
    roi: 1429,
  }, {
    amount: 140000,
    base: 79,
    percent: 0.06,
    roi: 1500,
  }, {
    amount: 160000,
    base: 79,
    percent: 0.06,
    roi: 1558,
  }, {
    amount: 180000,
    base: 79,
    percent: 0.06,
    roi: 1606,
  }, {
    amount: 200000,
    base: 79,
    percent: 0.06,
    roi: 1647,
  },
];

export function formatRevenue(fee) {
  return formatNumeric(fee, '$', 0).replace(',000', 'k').replace(',500', '.5k');
}

export const TIERS = RAW_TIERS.map((tier, i) => {
  const fee = Math.round(tier.base + tier.percent / 100 * tier.amount);

  return {
    ...tier,
    id: `tier_${tier.amount}${RAW_TIERS[i + 1] ? `_${RAW_TIERS[i + 1].amount}` : ''}`,
    fee,
    label: RAW_TIERS[i + 1]
      ? `${formatRevenue(tier.amount)} – ${formatRevenue(RAW_TIERS[i + 1].amount)}`
      : `${formatRevenue(tier.amount)}+`,
    biannualDiscount: Math.round(fee * PLANS[1].discount / 100),
    biannualFee: fee - Math.round(fee * PLANS[1].discount / 100),
    annualDiscount: Math.round(fee * PLANS[2].discount / 100),
    annualFee: fee - Math.round(fee * PLANS[2].discount / 100),
  };
});

let loadingPromise = null;

const Subscription = {
  saveCard(token) {
    return API.Billing.saveCard({ token });
  },
  getCard() {
    return API.Billing.getCard();
  },
  removeCard() {
    return API.Billing.removeCard();
  },
  changePlan(plan) {
    return API.Billing.update({ plan });
  },
  getData() {
    return API.Billing.get();
  },
  applyCoupon(coupon) {
    return API.Billing.applyCoupon({ coupon });
  },
  PLANS,
  TIERS,
};

export function loadStripe() {
  loadingPromise = loadingPromise || injectScript('https://js.stripe.com/v3/')
    .then(() => {
      Subscription.stripe = window.Stripe(STRIPE_KEY);
    });

  return loadingPromise;
}

export function getCardForm() {
  const elements = Subscription.stripe.elements();
  const cardForm = elements.create('card', {
    style: {
      base: {
        color: '#333',
        fontFamily: '"Avenir Next", "Avenir", Helvetica, Ubuntu, "DejaVu Sans", Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#888',
        },
      },
      invalid: {
        color: '#e63757',
      },
    },
  });

  return cardForm;
}

export default Subscription;

export function parsePromoCode(code) {
  const match = code.match(/[0-9]+$/)[0];

  return {
    code,
    discount: Number(match.slice(-2)),
    period: Number(match.slice(0, -2)),
  };
}

window.Sellerscale = {
  ...(window.Sellerscale || {}),
  Subscription,
};
