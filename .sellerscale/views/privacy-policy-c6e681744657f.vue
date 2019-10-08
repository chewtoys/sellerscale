<template>
  <MiContainer narrow>
    <MiContent v-markdown="privacyPolicy"></MiContent>
  </MiContainer>
</template>

<script>
import privacyPolicy from '@/content/privacy';

export default {
  name: 'privacy-policy',
  data() {
    return {
      privacyPolicy,
    };
  },
};
</script>
