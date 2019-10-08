import {
  email, required, minLength, sameAs,
} from 'vuelidate/lib/validators';

export default {
  id: 'account',
  fields: {
    email: {
      type: 'text',
      validation: {
        email,
        required,
      },
    },
    currentPassword: {
      type: 'password',
      validation: {
        required,
        minLength: minLength(6),
      },
    },
    newPassword: {
      type: 'password',
      validation: {
        minLength: minLength(6),
      },
    },
    confirmPassword: {
      type: 'password',
      validation: {
        minLength: minLength(6),
        sameAs: sameAs('newPassword'),
      },
    },
  },
};
