<template>
  <nu-pane columns="3.5 auto" items="center end">
    <nu-block>{{ $t('label.language') }}:</nu-block>
    <nu-btn-group :value="lang" @input="setLang($event.detail)" mod="xs">
      <nu-btn
        value="en">EN
      </nu-btn>
      <nu-btn
        value="ru">RU
      </nu-btn>
    </nu-btn-group>
  </nu-pane>
</template>

<script>

import i18n, { loadLanguage } from '@/i18n';
import Analytics from '@/services/analytics';

export default {
  name: 'inline-lang-switcher',
  data() {
    return {
      lang: i18n.locale,
    };
  },
  methods: {
    async setLang(lang) {
      await loadLanguage(lang);
      this.lang = lang;

      Analytics.event('lang:change', { lang });
    },
  },
};
</script>
