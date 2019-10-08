import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import ProductSchema from '@/scheme/product.schema';
import ProductsStore from '@/stores/products.store';

const schema = new ProductSchema();

export default function ProductAsinForm() {
  return {
    id: 'product-asin',
    translationPrefix: 'product.',
    fields: {
      asin: {
        ...schema.asin,
        placeholder: 'asin10digit',
        validation: {
          minLength: minLength(10),
          maxLength: maxLength(10),
          required,
          isValidAsin(value) {
            if (!value || value.length !== 10) return Promise.resolve(false);

            return ProductsStore.getRawByAsin(value)
              .then(data => !!data)
              .catch(() => false);
          },
        },
      },
    },
  };
}
