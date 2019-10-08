<template>
  <nu-flex
    gap="1" items="center||start" flow="row||column"
    v-if="User.profile.subscription.status === 'expired'" padding="0 0 1 0">
    <nu-btn
      content="stretch" items="stretch"
      special
      inline
      @tap="$router.push(`/subscription`)" mod="nowrap">
      {{ $t('actions.add_payment') }}
      <nu-icon name="zap" size="1.5"></nu-icon>
    </nu-btn>

    <nu-block size="sm" theme="danger">
      {{ $t('subscription.expired_warning') }}
    </nu-block>
  </nu-flex>
</template>

<script>
import User from '@/services/user';

export default {
  name: 'expired-widget',
  data() {
    return {
      User,
    };
  },
};
</script>
