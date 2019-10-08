import { required } from 'vuelidate/lib/validators';

export default function AccountForm() {
  return {
    id: 'amazon-account',
    translationPrefix: 'amazon_account.',
    fields: {
      marketplace: {
        type: 'text',
        placeholder: 'marketplace',
        options: [
          {
            value: 'amazon',
            label: 'Amazon',
          },
        ],
      },
      name: {
        type: 'text',
        // placeholder: 'choose_name',
      },
      sellerId: {
        type: 'text',
        // placeholder: 'seller_id',
        validation: {
          required,
        },
      },
      authToken: {
        type: 'text',
        // placeholder: 'auth_token',
        validation: {
          required,
        },
      },
    },
  };
}
