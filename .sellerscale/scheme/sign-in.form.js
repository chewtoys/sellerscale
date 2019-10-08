import { email, required, minLength } from 'vuelidate/lib/validators';

export default {
  id: 'sign-in',
  fields: {
    email: {
      type: 'email',
      validation: {
        email,
        required,
      },
    },
    password: {
      type: 'password',
      validation: {
        minLength: minLength(6),
        required,
      },
    },
  },
};
