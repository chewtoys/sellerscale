<template>
  <MiContainer narrow>
    <nu-heading padding="2 0 1">
      Sellerscale&nbsp;is&nbsp;like&nbsp;an&nbsp;automated, rapidly&#8209;evolving
      financial&nbsp;advisor for&nbsp;Amazon&nbsp;sellers.
    </nu-heading>
    <nu-flow gap="1">
      <nu-block>
        We built Sellerscale to address a problem that our founder Paul faced as an Amazon seller:
        it was hard to understand profitability and stay on top of his Amazon financials.
      </nu-block>
      <nu-block>
        Profitability is highly dynamic - it changes every day as a function of ACoS, organic sales
        percentage, pricing, and other drivers. This makes it extremely important to understand how
        changes in these drivers impact profit margins and ROI. Unfortunately, none of the existing
        analytics software enabled this level of analysis, and most available solutions also
        happened to be clunky and… uninspiring.
      </nu-block>
      <nu-block>
        That’s why we decided to build Sellerscale - a modern, beautifully-designed financial
        management app for Amazon sellers. A system that not only lets you monitor real-time sales
        and advertising performance, but also enables you to go much deeper through so-called "unit
        economics” analysis.
      </nu-block>
      <nu-block>
        We are a small team of long-time Amazon sellers, technologists and product leaders. And what
        drives our team is a burning desire to build world-class software to help Amazon sellers
        worldwide create profitable, sustainable e-commerce businesses and achieve their wildest
        business objectives.
      </nu-block>
      <nu-block>
        We’d love to have you as our user, and learn from you in order to make our product more and
        more valuable over time. If you have any feedback for us, please shoot us a line at
        <nu-link href="mailto:hello@sellerscale.com" special>hello@sellerscale.com</nu-link>
      </nu-block>
      <nu-block mod="i">
        Happy selling,<br/>
        Sellerscale Team
      </nu-block>
      <nu-block mod="uppercase">
        <nu-heading level="2" size="h2|h3|h4">
          JOIN SELLERSCALE NOW
        </nu-heading>
      </nu-block>
      <nu-block mod="lg|md">
      <span>
        Sign&nbsp;up&nbsp;in&nbsp;seconds&nbsp;to&nbsp;start&nbsp;mastering
        your&nbsp;Amazon&nbsp;financials.
      </span><br/>
      </nu-block>

      <nu-block>
        <nu-btn-group size="lg 2|md||xs" inline>
          <nu-input width="20||14|12" padding=".5 1">
            <input
              ref="input" class="input-field" placeholder="Email"
              v-model="email" @keydown.enter="start()"/>
          </nu-input>
          <nu-btn class="get-started" mod="w5" special @tap="start()">
            Get Started
          </nu-btn>
        </nu-btn-group>
      </nu-block>
    </nu-flow>
  </MiContainer>
</template>

<script>
import { openLink } from '@/util';

export default {
  name: 'about',
  methods: {
    start() {
      if (!this.email.trim()) {
        this.$refs.input.focus();

        return;
      }

      openLink(`/user/signup?email=${this.email}`, true);
    },
  },
};
</script>
