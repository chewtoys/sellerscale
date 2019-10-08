<template>
  <MiContainer narrow>
    <ConnectWidget/>
    <nu-heading size="h1|||h3">
      {{ $t('subscription.header') }}
    </nu-heading>
    <nu-card responsive="980px|540px|420px|340px">
      <nu-flow gap="1">
        <template>
          <!--          <nu-heading level="2" padding="0 0 0 0" border="1x bottom">-->
          <!--            {{ $t('subscription.current_plan') }}-->
          <!--          </nu-heading>-->

          <nu-grid columns="1fr 1fr|1fr" gap="1" content="start stretch">
            <nu-flex
              gap="1|.5" mod="left nowrap" flow="row|column">
              <nu-flex width="min(8)" flow="column|row" content="space-between" items="|center">
                <nu-heading
                  color="minor"
                  level="5" size="1 1.5" mod="w5 uppercase"
                  v-html="$t('subscription.status_label')">
                </nu-heading>
                <nu-block
                  size="lg" padding=".5 0 0 0|0" mod="w5"
                  :theme="billing.status === 'expired' ? 'danger' : ''">
                  {{ $t(`subscription.status.${billing.status}`) }}
                </nu-block>
              </nu-flex>

              <template v-if="billing.upcomingTier">
                <nu-line orient="y|x"></nu-line>

                <nu-flex width="min(8)" flow="column|row" content="space-between">
                  <nu-heading
                    color="minor"
                    level="5" size="1 1.5" mod="w5 uppercase"
                    v-html="$t('subscription.upcoming_cost')">
                  </nu-heading>
                  <nu-flex gap=".5" items="baseline">
                    <nu-block mod="w6" size="2 2.5">
                      {{ formatNumeric(getTierFee(upcomingTier), '$', 0) }}
                    </nu-block>
                    <nu-block size="1 1.5" color="minor">/{{ $t('label.month_short') }}</nu-block>
                  </nu-flex>
                </nu-flex>

                <nu-line orient="y|x"></nu-line>

                <nu-flex width="min(8)" flow="column|row" content="space-between" items="|center">
                  <nu-heading
                    color="minor"
                    level="5" size="1 1.5" mod="w5 uppercase"
                    v-html="$t('subscription.revenue_tier')">
                  </nu-heading>
                  <nu-block size="xl||lg" padding=".5 0 0 0|0" mod="w5">
                    {{ upcomingTier.label }}
                  </nu-block>
                </nu-flex>

                <nu-line orient="y|x"></nu-line>

                <nu-flex width="min(8)" flow="column|row" content="space-between" items="|center">
                  <nu-heading
                    color="minor"
                    level="5" size="1 1.5" mod="w5 uppercase"
                    v-html="$t('subscription.monthly_revenue')">
                  </nu-heading>
                  <nu-block size="xl||lg" padding=".5 0 0 0|0" mod="w5">
                    {{ formatNumeric(billing.upcomingSales, '$', 0) }}
                  </nu-block>
                </nu-flex>
              </template>

              <template v-if="billing.ended || (card && billing.plan)">
                <nu-line orient="y|x"></nu-line>

                <nu-flex
                  width="min(8)" flow="column|row" content="space-between" items="|center">
                  <nu-heading
                    color="minor"
                    level="5" size="1 1.5" mod="w5 uppercase"
                    v-html="billing.ended || billing.freeTrialEnded
                    ? (card && billing.plan
                      ? $t('subscription.next_charge')
                      : $t('subscription.end_date'))
                    : '–'">
                  </nu-heading>
                  <nu-block size="lg" padding=".5 0 0 0|0" mod="w5">
                    {{ card && billing.plan
                    ? formatDate(billing.ended || billing.freeTrialEnded)
                    : (billing.freeTrialEnded
                    ? formatDate(billing.freeTrialEnded)
                    : '–') }}
                  </nu-block>
                </nu-flex>
              </template>

              <template v-if="!billing.upcomingTier">
                <nu-line orient="y|x"></nu-line>

                <nu-flex width="min(8)" flow="column|row" content="space-between" items="|center">
                  <nu-heading
                    color="minor"
                    level="5" size="1 1.5" mod="w5 uppercase"
                    v-html="$t('subscription.upcoming_cost')">
                  </nu-heading>
                  <nu-flex gap=".5" items="baseline">
                    <nu-block size="md 2">
                      {{ User.mwsStatus === 'sync'
                      ? $t('subscription.upcoming_tier_notice')
                      : '–' }}
                    </nu-block>
                  </nu-flex>
                </nu-flex>
              </template>
            </nu-flex>
          </nu-grid>

          <nu-flex gap=".5" items="center stretch">
            <nu-btn
              v-if="(billing.status === 'active' && !billing.plan) || (billing.plan && !card)"
              special @tap="updateCard" :disabled="loading">
              {{ $t('actions.resume_subscription') }}
            </nu-btn>
            <nu-btn v-else-if="!billing.plan" special @tap="subscribe" :disabled="loading">
              {{ $t('actions.subscribe') }}
            </nu-btn>
            <nu-btn v-else @tap="cancelSubscription" theme="danger" :disabled="loading">
              {{ $t('actions.cancel_subscription') }}
            </nu-btn>
          </nu-flex>

          <nu-card
            color="minor"
            width="max(28)"
            padding=".5 1"
            size="sm"
            v-html="$markdown($t('subscription.disclaimer'), true)"></nu-card>

          <nu-flow v-if="!billing.coupon" gap=".5">
            <nu-flex gap=".5" items="center">
              <nu-block mod="w6">PROMO CODE</nu-block>
              <MiInput v-model="coupon"></MiInput>
              <nu-btn @tap="applyCoupon" special>
                {{ $t('actions.apply') }}
              </nu-btn>
            </nu-flex>
            <nu-block v-if="couponError" theme="danger">
              {{ $t('subscription.invalid_coupon') }}
            </nu-block>
          </nu-flow>
          <nu-flex v-else gap=".5">
            <nu-block>{{ $t('subscription.coupon_applied') }}:</nu-block>
            <nu-block theme="success">
              {{ promoCode.discount }}%
              {{ $tc(`label.coupon`, promoCode.period) }}
            </nu-block>
          </nu-flex>
        </template>

        <nu-flow v-if="card" gap="1">
          <nu-heading level="4" padding="2 0 0 0" border="1x bottom">
            {{ $t('subscription.payment_method') }}
          </nu-heading>
          <nu-flow v-if="card">
            <nu-flex gap=".5">
              <nu-block mod="w6">
                {{ card.brand }}
              </nu-block>
              <nu-block mod="w6">
                XXXX-XXXX-XXXX-{{ card.last4 }}
              </nu-block>
            </nu-flex>
            <nu-flex gap=".5" color="minor">
              <nu-block>
                {{ card.country }}
              </nu-block>
              <nu-block>
                Expires: {{ card.expMonth }} / {{ card.expYear }}
              </nu-block>
            </nu-flex>
          </nu-flow>

          <nu-flex gap=".5">
            <nu-btn v-if="billing.plan" special @tap="updateCard" :disabled="loading">
              {{ $t(`actions.${card ? 'update' : 'add'}_card`) }}
            </nu-btn>
            <nu-btn theme="danger" @tap="removeCard" v-if="card" :disabled="loading">
              {{ $t('actions.remove_card') }}
            </nu-btn>
          </nu-flex>
        </nu-flow>

        <template v-if="invoices.length">
          <nu-heading level="2" padding="2 0 0 0" border="1x bottom">
            {{ $t('subscription.past_invoices') }}
          </nu-heading>

          <nu-grid-table
            gap="1bw 0" columns="auto auto auto auto" border radius>
            <nu-block theme="minor" mod="w6">
              {{ $t('subscription.invoice.applied_tier') }}
            </nu-block>
            <nu-block theme="minor" mod="w6 right">
              {{ $t('subscription.invoice.date') }}
            </nu-block>
            <nu-block theme="minor" mod="w6 right">
              {{ $t('subscription.invoice.cost') }}
            </nu-block>
            <nu-block theme="minor" mod="w6 right">
              {{ $t('subscription.invoice.receipt') }}
            </nu-block>

            <template v-for="invoice in invoices">
              <nu-block :key="`name.${invoice.id}`" mod="nowrap">
                {{ getPlanName(invoice.planId) }}
                /
                {{ getTier(invoice.tierId).label }}
              </nu-block>
              <nu-block :key="`date.${invoice.id}`" mod="right nowrap">
                {{ invoice.date }}
              </nu-block>
              <nu-block :key="`cost.${invoice.id}`" mod="right">
                {{ formatNumeric(invoice.cost, '$', 0) }}
              </nu-block>
              <nu-block :key="`receipt.${invoice.id}`" mod="right">
                <nu-link special :href="invoice.url">
                  {{ $t('subscription.download_as_pdf') }}
                </nu-link>
              </nu-block>
            </template>
          </nu-grid-table>

        </template>
      </nu-flow>
    </nu-card>

    <MiModal ref="cardModal" width="24" v-slot="{ reject }">
      <nu-flow gap="1" padding="1">
        <nu-pane border="bottom" padding="0 0 .5 0">
          <nu-heading level="4" mod="w6">
            Update Credit Card
          </nu-heading>
          <nu-block
            width="8"
            height="2"
            background="no-repeat center / contain url(/img/powered_by_stripe@3x.png)">
          </nu-block>
        </nu-pane>
        <nu-block>
          <nu-block mod="w6" size="sm">Card number</nu-block>
          <nu-input>
            <nu-block ref="cardNumber" padding=".5">
            </nu-block>
          </nu-input>
        </nu-block>
        <nu-block theme="danger">
          {{ cardError || ' ' }}
        </nu-block>
        <nu-line></nu-line>
        <nu-grid gap=".5" columns="1fr 1fr">
          <nu-btn special @tap="saveCard" :disabled="loading">
            <nu-block v-if="loading">
              <nu-icon name="zap" inline></nu-icon>
              {{ $t('label.saving') }}
            </nu-block>
            <nu-block v-else>
              {{ $t('actions.save') }}
            </nu-block>
          </nu-btn>
          <nu-btn @tap="reject">
            {{ $t('actions.cancel') }}
          </nu-btn>
        </nu-grid>
      </nu-flow>
    </MiModal>

    <MiModal ref="confirmRemoveModal" width="clamp(20,24,100%)" v-slot="{ resolve, reject }">
      <nu-flow gap="1" padding="1">
        <nu-block v-html="$markdown($t('subscription.delete_warning'), true)"></nu-block>
        <nu-line></nu-line>
        <nu-grid gap="1" columns="1fr 1fr">
          <nu-btn special @tap="resolve" theme="danger">
            {{ $t('actions.delete') }}
          </nu-btn>
          <nu-btn @tap="reject">
            {{ $t('actions.cancel') }}
          </nu-btn>
        </nu-grid>
      </nu-flow>
    </MiModal>

    <MiModal
      ref="confirmCancelSubscription"
      width="clamp(20,100%,42)" v-slot="{ resolve, reject }">
      <nu-flow gap="1" padding="1">
        <nu-block v-html="$markdown($t('subscription.cancel_warning'), true)"></nu-block>
        <nu-line></nu-line>
        <nu-grid gap="1" columns="1fr 1fr" content="start">
          <nu-btn special @tap="resolve" theme="danger">
            {{ $t('label.yes') }}, {{ $t('actions.cancel_subscription').toLowerCase() }}
          </nu-btn>
          <nu-btn @tap="reject">
            {{ $t('label.no') }}
          </nu-btn>
        </nu-grid>
      </nu-flow>
    </MiModal>
  </MiContainer>
</template>

<script>
import Subscription, {
  loadStripe, getCardForm, PLANS, TIERS, parsePromoCode,
} from '@/services/subscription';
import User from '@/services/user';
import PreloadMixin from '@/mixins/preload.mixin';
import { formatNumeric, formatDate } from '@/util';
import ConnectWidget from '@/components/connect-widget.vue';

export default {
  name: 'subscription',
  components: { ConnectWidget },
  mixins: [
    PreloadMixin(async () => Promise.all([
      Subscription.getCard().catch(() => null),
      Subscription.getData(),
    ]), function setPreloadedDate([card, billing]) {
      this.card = card;
      this.billing = billing;
    }),
  ],
  data() {
    return {
      cardError: '',
      User,
      card: null,
      PLANS,
      TIERS,
      FEES: ['fee', 'biannualFee', 'annualFee'],
      tierId: 'tier_180000_200000',
      invoices: [
        //   {
        //   id: 123,
        //   planId: 'monthly',
        //   tierId: 'tier_180000_200000',
        //   date: '2019-09-14',
        //   cost: 14,
        //   url: '#',
        // }
      ],
      coupon: '',
      couponError: '',
      billing: {},
      planToChange: {
        id: 'monthly',
        amount: 9,
        discount: 3,
      },
      loading: false,
    };
  },
  computed: {
    subscription() {
      return this.User.profile.subscription;
    },
    currentTier() {
      return this.TIERS.find(tier => tier.id === this.billing.tier);
    },
    upcomingTier() {
      return this.TIERS.find(tier => tier.id === this.billing.upcomingTier);
    },
    changePlanNotice() {
      const amount = formatNumeric(this.planToChange.amount, '$', 0);
      const discount = this.planToChange.discount
        ? formatNumeric(this.planToChange.discount, '$', 0)
        : null;
      const date = this.billing.plan ? formatDate(this.billing.ended
        || this.billing.freeTrialEnded)
        : null;
      const plan = this.$t(`subscription.plan.${this.planToChange.id}`);

      const part = (n, data) => this.$t(`subscription.change_plan_notice_part${n}`, data);

      return `${part(1, {
        plan,
        amount,
      })}${date ? part(2, { date }) : ''}${date ? `${part(3)}${discount ? part(4, { discount }) : ''}` : ''}${date ? part(5) : '.'}`;
    },
    promoCode() {
      if (this.billing.coupon) {
        return parsePromoCode(this.billing.coupon);
      }

      return {};
    },
  },
  methods: {
    async updateCard() {
      await loadStripe();
      const cardForm = getCardForm();

      this.cardForm = cardForm;

      setTimeout(() => {
        cardForm.mount(this.$refs.cardNumber);
      });

      cardForm.addEventListener('change', (event) => {
        this.cardError = event.error
          ? (!event.error.message || this.$t('subscription.card_error'))
          : '';
      });

      return this.$refs.cardModal.open();
    },
    saveCard() {
      const card = this.cardForm;
      this.loading = true;

      return Subscription.stripe.createToken(card)
        .then(async (result) => {
          if (result.error) {
            this.cardError = result.error.message;
          } else {
            this.cardError = '';

            await Subscription.saveCard(result.token.id);
            await this.preload();

            this.$refs.cardModal.resolve();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async removeCard() {
      this.$refs.confirmRemoveModal.open()
        .then(async () => {
          await Subscription.removeCard();

          await this.preload();
        });
    },
    formatNumeric,
    getDiscount(index) {
      switch (index) {
        case 1:
          return this.upcomingTier.biannualDiscount * 12;
        case 2:
          return this.upcomingTier.annualDiscount * 12;
        default:
      }

      return 0;
    },
    getPlanName(id) {
      if (!id) return '';

      return `${this.$t(`subscription.plan.${id}`)} ${this.$t('label.plan')}`;
    },
    getTier(id) {
      return TIERS.find(tier => tier.id === id);
    },
    async changePlan(id) {
      if (id === User.profile.subscription.plan) return;

      const plan = this.getPlanById(id);

      this.planToChange = {
        amount: this.getPlanFee(plan, this.upcomingTier),
        discount: this.getPlanDiscount(plan, this.upcomingTier),
        id,
      };

      this.$refs.confirmChangePlan.open()
        .then(async () => {
          await Subscription.changePlan(id);
          await this.preload();
        });
    },
    getPlanById(id) {
      return PLANS.find(plan => plan.id === id) || 'monthly';
    },
    getPlanFee(plan, tier) {
      switch (plan.id) {
        case 'monthly':
          return tier.fee;
        case 'biannual':
          return tier.biannualFee * 6;
        case 'annual':
          return tier.annualFee * 12;
        default:
          return tier.fee;
      }
    },
    getPlanDiscount(plan, tier) {
      switch (plan.id) {
        case 'monthly':
          return tier.discount;
        case 'biannual':
          return tier.biannualDiscount * 6;
        case 'annual':
          return tier.annualDiscount * 12;
        default:
          return tier.fee;
      }
    },
    getTierFee(tier) {
      if (!tier) return 0;

      const plan = this.getPlanById(this.billing.plan);

      return this.getPlanFee(plan, tier);
    },
    formatDate,
    async subscribe() {
      const haveActiveCard = !!this.card;

      if (!this.card) {
        await this.updateCard();
      }

      try {
        this.loading = true;
        // select plan only in case there was no active card before subscription
        // otherwise adding card will activate plan automatically
        if (haveActiveCard) {
          await Subscription.changePlan('monthly');
        }
        await this.preload();
      } catch (e) {
        // nothing
      } finally {
        this.loading = false;
      }
    },
    async cancelSubscription() {
      try {
        this.loading = true;

        await this.$refs.confirmCancelSubscription.open();
        await Subscription.changePlan(null);
        await this.preload();
      } catch (e) {
        // nothing
      }

      this.loading = false;
    },
    async applyCoupon() {
      const coupon = this.coupon.trim();

      try {
        await Subscription.applyCoupon(coupon);
        await this.preload();
      } catch (e) {
        this.couponError = true;
      }
    },
  },
};
</script>

<style scoped>
.discount {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
