<template>
  <nu-flex
    gap="1" items="center||start" flow="row||column"
    v-if="!User.mwsStatus" padding="0 0 1 0">
    <nu-btn
      content="stretch" items="stretch"
      special
      inline
      @tap="$router.push(`/integration`)" mod="nowrap">
      {{ $t('home.connect.seller') }}
      <nu-icon name="zap" size="1.5"></nu-icon>
    </nu-btn>

    <nu-block size="sm">
      {{ $t('home.connect.description') }}
    </nu-block>
  </nu-flex>
</template>

<script>
import User from '@/services/user';

export default {
  name: 'connect-widget',
  data() {
    return {
      User,
    };
  },
};
</script>
