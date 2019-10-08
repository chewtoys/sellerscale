import { required, minLength } from 'vuelidate/lib/validators';

export default {
  id: 'profile',
  fields: {
    firstName: {
      type: 'text',
      validation: {
        minLength: minLength(2),
        required,
      },
    },
    lastName: {
      type: 'text',
      validation: {
        minLength: minLength(2),
        required,
      },
    },
  },
};
