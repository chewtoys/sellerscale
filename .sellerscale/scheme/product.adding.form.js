import { required, minLength, minValue } from 'vuelidate/lib/validators';
import ProductSchema from '@/scheme/product.schema';

const schema = new ProductSchema();

export default function ProductForm() {
  return {
    id: 'product-adding',
    translationPrefix: 'product.',
    fields: {
      name: {
        ...schema.name,
        type: 'text',
        placeholder: 'tracked_name',
        validation: {
          minLength: minLength(3),
          required,
        },
      },
      salesPrice: {
        ...schema.salesPrice,
        type: 'numeric',
        validation: {
          required,
          minValue: minValue(0.01),
        },
      },
      unitLandedCost: {
        ...schema.unitLandedCost,
        type: 'numeric',
        validation: {
          required,
          minValue: minValue(0.01),
        },
      },
      fbaFee: {
        ...schema.fbaFee,
        type: 'numeric',
        validation: {
          required,
          minValue: minValue(0.01),
        },
      },
    },
  };
}
