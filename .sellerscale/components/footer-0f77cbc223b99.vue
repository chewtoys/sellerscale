<template>
  <nu-block responsive="720px">
    <nu-line></nu-line>
    <MiContainer width="clamp(auto, 100%, 84)">
      <nu-grid
        columns="auto 1fr auto|auto"
        rows="auto auto|auto auto auto auto auto auto"
        flow="column"
        padding="1 0 2 0"
        gap="1 2"
        mod="nowrap">
        <nu-heading level="5">{{ $t('footer.site_map') }}</nu-heading>
        <nu-block>
          <ul>
            <li>
              <nu-link
                special
                href="https://intercom.help/sellerscale/en/collections/1490463-sellerscale-knowledge-base"
                target="_blank">
                {{ $t('footer.base') }}
              </nu-link>
            </li>
            <li>
              <nu-link @tap="link('/privacy-policy')" special>
                {{ $t('title.privacy-policy') }}
              </nu-link>
            </li>
            <li>
              <nu-link @tap="link('/terms-and-conditions')" special>
                {{ $t('title.terms-and-conditions') }}
              </nu-link>
            </li>
            <li>
              <nu-link @tap="link('/about')" special>
                {{ $t('footer.about') }}
              </nu-link>
            </li>
          </ul>
        </nu-block>

        <nu-heading level="5">{{ $t('footer.contact_us') }}</nu-heading>
        <nu-block>
          <ul>
            <li>
              <nu-link href="mailto:hello@sellerscale.com" special>
                hello@sellerscale.com
              </nu-link>
            </li>
            <li>
              <nu-link href="https://www.facebook.com/sellerscale" target="_blank" special>
                Facebook
              </nu-link>
            </li>
          </ul>
        </nu-block>

        <nu-block place="end|center">
          Copyright © 2019 Sellerscale
        </nu-block>
        <nu-block place="start end|center">
          <InlineLangSwitcher></InlineLangSwitcher>
        </nu-block>
      </nu-grid>
    </MiContainer>
  </nu-block>
</template>

<script>
import InlineLangSwitcher from '@/components/inline-lang-switcher.vue';
import Analytics from '@/services/analytics';

export default {
  name: 'app-footer',
  components: {
    InlineLangSwitcher,
  },
  methods: {
    link(url) {
      this.$router.push(url);

      Analytics.event('footer:link', { url });
    },
  },
};
</script>
