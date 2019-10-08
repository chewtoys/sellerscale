<template>
  <MiContainer>
    <nu-grid columns="1fr 1fr|1fr" gap="2" content="center" items="center">
      <nu-flow items="center" gap="1" padding="2 0 5 0">
        <nu-block class="nu-dark-invert">
          <MiPicture width="16">
            <img src="/img/logo.png" alt="Sellerscale Logo"/>
          </MiPicture>
        </nu-block>

        <nu-grid gap="1" mod="danger" content="center" items="center" v-if="!Supports.compatible">
          <nu-icon name="exclamation" size="3"></nu-icon>
          <nu-grid mod="center">
            {{ $t('warning.not_supported') }}
          </nu-grid>
          <nu-grid columns="auto auto" content="center" gap="1">
            <a href="https://www.google.com/chrome/" target="_blank" title="Safari">
              <img width="64" src="/img/chrome-200.png" alt="Chrome"/>
            </a>
            <img width="64" src="/img/safari-200.png" alt="Safari"/>
          </nu-grid>
        </nu-grid>

        <nu-heading
          level="1" class="-nu-center"
          v-html="$t('auth.sign_up.header')"></nu-heading>
        <nu-block
          level="1" class="-nu-center"
          padding="0 0 1 0"
          v-html="$t('auth.sign_up.sub_header')"
          color="minor" mod="w5">
        </nu-block>
        <!--<nu-heading level="3" class="-nu-center" v-html="$t('auth.sub_header')"></nu-heading>-->
        <!--        <p-->
        <!--          class="-nu-muted -nu-center"-->
        <!--          v-if="$i18n.locale === 'en'"-->
        <!--          v-html="$t('auth.motivation')">-->
        <!--        </p>-->

        <MiForm
          v-model="formData"
          :schema="formSchema"
          v-slot="{ $invalid }"
          columns="18"
          @submit="onSubmit">
          <!--          <MiFormInput name="fullName"></MiFormInput>-->
          <!--          <MiFormError name="fullName"/>-->
          <MiFormInput name="email"></MiFormInput>
          <MiFormError name="email"/>
          <MiFormInput name="password"></MiFormInput>
          <MiFormError name="password"/>
          <nu-grid>
            <nu-btn
              special
              block
              @tap="onSubmit"
              :disabled="$invalid">
              {{ $t('auth.sign_up.action') }}
            </nu-btn>
          </nu-grid>
          <nu-grid style="height: 2rem" items="end center">
            <nu-badge theme="danger" v-if="errorCode" mod="xs">
              {{ $t(`server_errors.${errorCode}`) }}
            </nu-badge>
          </nu-grid>
        </MiForm>

        <nu-block v-html="$markdown($t('auth.agree'), true)" mod="center"></nu-block>

        <nu-block>
          <nu-link @tap="$router.push('/user/signin')" special>
            {{ $t('auth.already_registered') }}
          </nu-link>
        </nu-block>

        <nu-grid mod="sm">
          <InlineLangSwitcher/>
        </nu-grid>
      </nu-flow>

      <nu-grid hidden="false|true">
        <MiPicture width="36" maxWidth="100%">
          <img src="@/assets/illustrations/happiness.svg" alt="Happiness illustration"/>
        </MiPicture>
      </nu-grid>
    </nu-grid>
  </MiContainer>
</template>

<script>
import Auth from '@/services/auth';
import User from '@/services/user';
import formSchema from '@/scheme/sign-up.form';
import InlineLangSwitcher from '@/components/inline-lang-switcher.vue';
import Analytics from '@/services/analytics';
import Supports from '@/services/supports';

export default {
  name: 'sign-up',
  data() {
    return {
      formSchema,
      formData: {},
      User,
      errorCode: '',
      Supports,
    };
  },
  async beforeRouteEnter(to, from, next) {
    if (await Auth.isAuthorized()) {
      next('/dashboard');
    } else {
      next();
    }
  },
  created() {
    this.formData.email = this.$route.query.email;
  },
  watch: {
    formData() {
      this.errorCode = null;
    },
  },
  methods: {
    onSubmit() {
      this.errorCode = null;

      // const fullName = this.formData.fullName.trim();
      // const firstName = fullName.split(/\s+/)[0];
      // const lastName = fullName.split(/\s+/)[1];

      Auth.signUp({ ...this.formData })
        .then(() => {
          Analytics.event('user:sign-up');

          this.$router.push('/new');
        })
        .catch(({ error }) => {
          this.errorCode = error;
        });
    },
  },
  components: {
    InlineLangSwitcher,
  },
};

</script>
