import {
  required, minLength, minValue, maxValue,
} from 'vuelidate/lib/validators';

export const EXPENSE_CATEGORIES = [
  'software',
  'freelancer_fees',
  'rent',
  'external_advertising',
  'payroll',
  'payment_processing_fee',
  'product_samples',
  'product_photography',
  'legal_fees',
  'consulting_fees',
  'education',
  'general',
  'insurance',
];

export default function ProductForm() {
  return {
    id: 'expense',
    translationPrefix: 'expense.',
    fields: {
      description: {
        type: 'text',
        validation: {
          minLength: minLength(3),
          required,
        },
      },
      recurrence: {
        type: 'boolean',
      },
      category: {
        type: 'select',
        options: EXPENSE_CATEGORIES.reduce((options, cat) => {
          options.push({
            value: cat,
            label: `form_field.expense.categories.${cat}`,
          });

          return options;
        }, []),
      },
      amount: {
        type: 'currency',
        schema: {
          min: 0,
          max: 999999,
        },
        validation: {
          minValue: minValue(0),
          maxValue: maxValue(999999),
        },
      },
      amountOrigin: {
        type: 'numeric',
        schema: {
          min: 0,
          max: 999999,
        },
        validation: {
          minValue: minValue(0),
          maxValue: maxValue(999999),
        },
      },
      recurring: {
        type: 'boolean',
      },
      date: {
        type: 'date',
      },
      endDate: {
        type: 'date',
      },
      comment: {
        type: 'text',
      },
    },
  };
}
