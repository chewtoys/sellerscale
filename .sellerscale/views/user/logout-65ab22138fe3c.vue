<template>
  <nu-grid>

  </nu-grid>
</template>

<script>
import Auth from '../../services/auth';

export default {
  name: 'logout',
  async beforeRouteEnter(to, from, next) {
    await Auth.logout();
    next('/user/signin');
  },
};

</script>
