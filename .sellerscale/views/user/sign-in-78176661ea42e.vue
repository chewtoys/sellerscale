<template>
  <MiContainer>
    <nu-grid
      columns="1fr 1fr|1fr" gap="2"
      content="center" items="center">
      <nu-flow items="center" gap="1" padding="2 0 5 0">
        <nu-block class="nu-dark-invert">
          <MiPicture width="16">
            <img src="/img/logo.png" alt="Sellerscale Logo"/>
          </MiPicture>
        </nu-block>

        <nu-flow gap="1" mod="danger" content="center" items="center" v-if="!Supports.compatible">
          <nu-icon name="exclamation" size="3"></nu-icon>
          <nu-block mod="center">
            {{ $t('warning.not_supported') }}
          </nu-block>
          <nu-grid columns="auto auto" content="center" gap="1">
            <a href="https://www.google.com/chrome/" target="_blank" title="Safari">
              <img width="64" src="/img/chrome-200.png" alt="Chrome"/>
            </a>
            <img width="64" src="/img/safari-200.png" alt="Safari"/>
          </nu-grid>
        </nu-flow>

        <nu-block padding="1" mod="center">
          <nu-heading v-if="!User.profile.firstName" v-t="'auth.sign_in.header'"></nu-heading>
          <nu-heading v-if="User.profile.firstName">
            {{ $t('auth.welcome_back', { firstName: User.profile.firstName }) }}
          </nu-heading>
        </nu-block>

        <MiForm
          v-model="formData"
          :schema="formSchema"
          v-slot="{ $invalid }"
          columns="18"
          @submit="onSubmit">
          <MiFormInput name="email"/>
          <MiFormError name="email"/>
          <MiFormInput name="password"></MiFormInput>
          <MiFormError name="password"/>
          <nu-btn
            special
            @tap="onSubmit"
            :disabled="$invalid">
            {{ $t('auth.sign_in.action') }}
          </nu-btn>
          <nu-grid style="height: 2rem" items="end center" mod="xs">
            <nu-badge theme="danger" v-if="errorCode">
              {{ $t(`server_errors.${errorCode}`) }}
            </nu-badge>
          </nu-grid>
        </MiForm>

        <nu-block>
          <nu-link @tap="$router.push('/user/signup')" special>
            {{ $t('auth.dont_have_account') }}
          </nu-link>
        </nu-block>

        <nu-block>
          <nu-link @tap="$router.push('/user/restore-password')" special>
            {{ $t('auth.forgot_password') }}
          </nu-link>
        </nu-block>

        <nu-block mod="sm">
          <InlineLangSwitcher/>
        </nu-block>
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
import formSchema from '@/scheme/sign-in.form';
import InlineLangSwitcher from '@/components/inline-lang-switcher.vue';
import Supports from '@/services/supports';

export default {
  name: 'sign-in',
  data() {
    return {
      formSchema,
      formData: {},
      User,
      errorCode: '',
      Supports,
      loading: true,
      code: '',
    };
  },
  async beforeRouteEnter(to, from, next) {
    if (await Auth.isAuthorized()) {
      next('/');
    } else {
      next();
    }
  },
  watch: {
    formData() {
      this.errorCode = null;
    },
  },
  methods: {
    onSubmit() {
      this.errorCode = null;

      Auth.signIn(this.formData)
        .then(() => {
          this.$router.push(this.$route.params.nextUrl || '/');
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
