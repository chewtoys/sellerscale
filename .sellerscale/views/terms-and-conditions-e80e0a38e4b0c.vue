<template>
  <MiContainer narrow>
    <MiContent v-markdown="termsAndConditions"></MiContent>
  </MiContainer>
</template>

<script>
import termsAndConditions from '@/content/terms';

export default {
  name: 'privacy-policy',
  data() {
    return {
      termsAndConditions,
    };
  },
};
</script>
