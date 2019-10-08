<template>
  <MiContainer narrow gap="2">
    <nu-flow gap="1">
      <nu-heading level="1" size="h1|||h3">
        {{ $t('personal_settings.header') }}
      </nu-heading>
      <nu-line></nu-line>
    </nu-flow>
    <nu-flow gap="2">
      <nu-flow gap="1">
        <StickyHeader>
          <nu-heading level="2">{{ $t('settings.interface.header') }}</nu-heading>
        </StickyHeader>
        <nu-grid items="center start" columns="auto 1fr" gap=".5">
          <nu-block>{{ $t('settings.interface.theme') }}:</nu-block>
          <nu-btn-group :value="settings.theme" @input="changeTheme($event.detail)">
            <nu-btn value="light">{{ $t('label.light') }}</nu-btn>
            <nu-btn value="dark">{{ $t('label.dark') }}</nu-btn>
            <nu-btn value="auto">{{ $t('label.auto') }}</nu-btn>
          </nu-btn-group>
          <nu-block>{{ $t('settings.interface.reduced_motion') }}:</nu-block>
          <nu-btn-group :value="settings.reducedMotion" @input="changeReducedMotion($event.detail)">
            <nu-btn value="off">{{ $t('label.off') }}</nu-btn>
            <nu-btn value="on">{{ $t('label.on') }}</nu-btn>
            <nu-btn value="auto">{{ $t('label.auto') }}</nu-btn>
          </nu-btn-group>
          <nu-block>{{ $t('settings.interface.high_contrast') }}:</nu-block>
          <nu-btn-group
            :value="settings.highContrast"
            @input="changeHighContrast($event.detail)">
            <nu-btn value="off">{{ $t('label.off') }}</nu-btn>
            <nu-btn value="on">{{ $t('label.on') }}</nu-btn>
          </nu-btn-group>
        </nu-grid>
      </nu-flow>
      <MiForm
        ref="profileForm"
        :schema="profileForm"
        v-model="profileData"
        v-slot="{ $invalid, $changed }"
        @validation="profileChanged"
        columns="repeat(3, 1fr)"
        gap="1">
        <StickyHeader column="1 / span 3">
          <nu-heading level="2">{{ $t('personal_settings.data') }}</nu-heading>
        </StickyHeader>
        <nu-grid>
          <MiFormLabel name="firstName"></MiFormLabel>
          <MiFormInput name="firstName" :placeholder="false"></MiFormInput>
        </nu-grid>
        <nu-grid>
          <MiFormLabel name="lastName"></MiFormLabel>
          <MiFormInput name="lastName" :placeholder="false"></MiFormInput>
        </nu-grid>
      </MiForm>
      <MiForm
        ref="accountForm"
        :schema="accountForm"
        v-model="accountData"
        v-slot="{ $invalid, $changed, $v }"
        @input="accountChanged"
        columns="repeat(3, 1fr)||1fr"
        gap="1"
        padding="1 0 0 0">
        <StickyHeader column="1 / span 3||1fr">
          <nu-heading level="2">{{ $t('settings.profile.account_information') }}</nu-heading>
        </StickyHeader>
        <nu-grid>
          <MiFormLabel name="email"></MiFormLabel>
          <MiFormInput name="email" :placeholder="false"></MiFormInput>
        </nu-grid>
        <nu-grid>
          <MiFormLabel name="newPassword"></MiFormLabel>
          <MiFormInput name="newPassword" :placeholder="false"></MiFormInput>
        </nu-grid>
        <nu-grid>
          <MiFormLabel name="confirmPassword"></MiFormLabel>
          <MiFormInput name="confirmPassword" :placeholder="false"></MiFormInput>
        </nu-grid>
        <nu-grid row="3 / span 2||auto" column="3 / span 1||auto">
          <nu-card mod="transparent" shadow border>
            <MiContent v-markdown="'settings.profile.password_requirements'"></MiContent>
          </nu-card>
        </nu-grid>
        <nu-block
          column="1 / span 2||1"
          mod="minor">
          <p>{{ $t('settings.profile.email_notice') }}</p>
        </nu-block>
        <nu-grid>
          <MiFormLabel name="currentPassword"></MiFormLabel>
          <MiFormInput name="currentPassword" :placeholder="false"></MiFormInput>
        </nu-grid>
        <nu-grid flow="column" column="1 / span 2||1" content="start" gap=".5">
          <nu-btn
            @tap="changeEmail" special
            :disabled="!isEmailChangeAllowed($v)">
            {{ $t('settings.profile.change_email') }}
          </nu-btn>

          <nu-btn
            @tap="changePassword" special
            :disabled="!isPasswordChangeAllowed($v)">
            {{ $t('settings.profile.change_password') }}
          </nu-btn>
        </nu-grid>
        <nu-grid column="1 / span 2||1">
          <MiContent style="font-size: var(--size-very-small)">
            <p>
              <nu-badge theme="danger" v-if="accountErrorCode">
                {{ $t(`server_errors.${accountErrorCode}`) }}
              </nu-badge>
            </p>
          </MiContent>
        </nu-grid>
      </MiForm>
    </nu-flow>
  </MiContainer>
</template>

<script>
import profileForm from '@/scheme/profile.form';
import accountForm from '@/scheme/account.form';
import User from '@/services/user';
import API from '@/services/api';
import StickyHeader from '@/components/sticky-header.vue';
import Supports from '@/services/supports';
import Analytics from '@/services/analytics';

export default {
  name: 'personal-settings',
  data() {
    return {
      profileForm,
      User,
      settings: User.settings,
      Supports,
      profileData: {
        firstName: User.profile.firstName,
        lastName: User.profile.lastName,
      },
      accountForm,
      accountData: {
        email: User.profile.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      accountErrorCode: null,
    };
  },
  computed: {
    // saveProfileDisabled() {
    //
    // },
  },
  methods: {
    saveProfile() {
      API.User.updateProfile(this.profileData);
    },
    profileChanged({ invalid }) {
      if (!invalid) {
        // save profile data
        this.saveProfile();

        Analytics.event('user:change-name');
      }
    },
    accountChanged() {
      this.accountErrorCode = '';
    },
    isEmailChangeAllowed($v) {
      return !$v.email.$invalid && !$v.currentPassword.$invalid;
    },
    isPasswordChangeAllowed($v) {
      return !!(!$v.currentPassword.$invalid
        && !$v.newPassword.$invalid && !$v.confirmPassword.$invalid
        && this.accountData.newPassword);
    },
    changeEmail() {
      API.User.updateProfile({
        email: this.accountData.email,
        oldPassword: this.accountData.currentPassword,
      }).then(() => {
        Analytics.event('user:change-email');

        window.location.reload();
      }, ({ error }) => {
        this.accountErrorCode = error;
      });
    },
    changePassword() {
      API.User.updateProfile({
        oldPassword: this.accountData.currentPassword,
        password: this.accountData.newPassword,
      }).then(() => {
        Analytics.event('user:change-password');
        window.location.reload();
      }, ({ error }) => {
        this.accountErrorCode = error;
      });
    },
    changeTheme(theme) {
      User.settings.theme = theme;

      User.save();

      this.settings = { ...User.settings };

      Analytics.event('interface:change', { theme: User.settings.theme });
    },
    changeHighContrast(bool) {
      User.settings.highContrast = bool;

      User.save();

      this.settings = { ...User.settings };

      Analytics.event('interface:change', { highContrast: bool });
    },
    changeReducedMotion(option) {
      User.settings.reducedMotion = option;

      User.save();

      this.settings = { ...User.settings };

      Analytics.event('interface:change', { reducedMotion: option });
    },
  },
  components: {
    StickyHeader,
  },
};
</script>
