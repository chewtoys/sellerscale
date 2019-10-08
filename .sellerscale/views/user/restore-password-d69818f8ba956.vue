<template>
  <MiContainer v-if="formData">
    <nu-grid columns="1fr 1fr|1fr" gap="2" content="center" items="center">
      <nu-flow items="center" gap="1" padding="2 0 5 0">
        <nu-block class="nu-dark-invert">
          <MiPicture width="16">
            <img src="/img/logo.png" alt="Sellerscale Logo"/>
          </MiPicture>
        </nu-block>

        <nu-heading
          level="3"
          padding="1 0 0 0"
          v-t="'auth.restore_password'"></nu-heading>

        <nu-flow gap="1" v-if="!restoreCode && !codeRequested" width="max(24)" mod="center">
          <nu-block v-html="$t('auth.enter_email')"></nu-block>

          <MiForm
            v-model="formData"
            :schema="emailFormSchema"
            v-slot="{ $invalid }"
            columns="18"
            @submit="getRestoreCode">
            <MiFormInput name="email"/>
            <MiFormError name="email"/>
            <nu-btn
              special
              @tap="getRestoreCode"
              :disabled="$invalid">
              {{ $t('auth.send_email') }}
            </nu-btn>
            <nu-grid style="height: 2rem" items="end center" mod="xs">
              <nu-badge theme="danger" v-if="errorCode">
                {{ $t(`server_errors.${errorCode}`) }}
              </nu-badge>
            </nu-grid>
          </MiForm>
        </nu-flow>

        <nu-block
          v-if="!restoreCode && codeRequested"
          v-html="$t('auth.email_sent')" width="max(24)" mod="center"></nu-block>

        <nu-flow gap="1" v-if="restoreCode && !passwordChanged" width="max(24)" mod="center">
          <nu-block v-html="$t('auth.enter_new_password')"></nu-block>

          <MiForm
            v-model="formData"
            :schema="passwordFormSchema"
            v-slot="{ $invalid }"
            columns="20"
            @submit="changePassword">
            <MiFormInput name="email" disabled></MiFormInput>
            <MiFormError name="email"/>
            <MiFormInput name="password"></MiFormInput>
            <MiFormError name="password"/>
            <nu-btn
              special
              @tap="changePassword"
              :disabled="$invalid">
              {{ $t('auth.set_new_password') }}
            </nu-btn>
            <nu-grid style="height: 2rem" items="end center" mod="xs">
              <nu-badge theme="danger" v-if="errorCode">
                {{ $t(`server_errors.${errorCode}`) }}
              </nu-badge>
            </nu-grid>
          </MiForm>
        </nu-flow>

        <nu-block
          v-if="restoreCode && passwordChanged"
          v-html="$t('auth.password_changed')" width="max(24)" mod="center"></nu-block>

        <nu-btn
          special v-if="restoreCode && passwordChanged"
          @tap="signIn">
          {{ $t('auth.continue') }}
        </nu-btn>

        <nu-block>
          <nu-link @tap="$router.push('/user/signin')" special>
            {{ $t('auth.sign_in.action') }}
          </nu-link>
        </nu-block>

        <nu-block>
          <nu-link @tap="$router.push('/user/signup')" special>
            {{ $t('auth.dont_have_account') }}
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
import StoreMixin from '@/mixins/store.mixin';
import Analytics from '@/services/analytics';

export default {
  name: 'restore-password',
  mixins: [
    StoreMixin({
      cachedEmail: '',
    }),
  ],
  data() {
    return {
      emailFormSchema: {
        id: 'send-email',
        fields: {
          email: formSchema.fields.email,
        },
      },
      passwordFormSchema: {
        id: 'reset-password',
        fields: {
          email: formSchema.fields.email,
          password: formSchema.fields.password,
        },
      },
      formData: null,
      User,
      errorCode: '',
      restoreCode: '',
      loading: true,
      codeRequested: false,
      passwordChanged: false,
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
  async mounted() {
    this.formData = {
      email: this.cachedEmail || '',
    };

    if (this.cachedEmail) {
      this.passwordFormSchema.fields.email.default = this.cachedEmail;
    }

    const { code } = this.$route.query;

    if (code) {
      this.restoreCode = code;
    }

    this.loading = true;
  },
  methods: {
    getRestoreCode() {
      Auth.getRestoreCode({ email: this.formData.email })
        .then(() => {
          this.codeRequested = true;
          this.cachedEmail = this.formData.email;

          Analytics.event('user:get-restore-code');
        })
        .catch(({ error }) => {
          this.errorCode = error;
        });
    },
    changePassword() {
      this.errorCode = null;

      Auth.changePassword({
        code: this.restoreCode,
        password: this.formData.password,
      })
        .then(() => {
          this.passwordChanged = true;

          Analytics.event('user:restorer-password');
        })
        .catch(({ error }) => {
          this.errorCode = error;
        });
    },
    signIn() {
      this.errorCode = null;

      Auth.signIn({
        email: this.cachedEmail,
        password: this.formData.password,
      })
        .then(() => {
          this.$router.push('/');
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
