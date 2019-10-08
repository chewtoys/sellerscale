import {
  email, required, minLength,
} from 'vuelidate/lib/validators';

export default {
  id: 'sign-up',
  fields: {
    // fullName: {
    //   type: 'text',
    //   validation: {
    //     minLength: minLength(2),
    //     required,
    //   },
    // },
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
        minLength: minLength(8),
        required,
      },
    },
  },
};
