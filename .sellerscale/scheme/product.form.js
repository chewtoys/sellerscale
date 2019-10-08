import { required, minLength } from 'vuelidate/lib/validators';
import ProductSchema from '@/scheme/product.schema';

const schema = new ProductSchema();

export default function ProductForm() {
  return {
    id: 'product',
    translationPrefix: 'product.',
    fields: {
      name: {
        ...schema.name,
        type: 'text',
        validation: {
          minLength: minLength(3),
          required,
        },
      },
      // batchSize: {
      //   ...schema.batchSize,
      //   type: 'numeric',
      //   default: 0,
      // },
      // returnRate: {
      //   ...schema.returnRate,
      //   type: 'numeric',
      //   default: 0,
      // },
      // monthlyStorageFee: {
      //   ...schema.monthlyStorageFee,
      //   type: 'numeric',
      // },
      // longTermStorageFee: {
      //   ...schema.longTermStorageFee,
      //   type: 'numeric',
      // },
      // averageInventory: {
      //   ...schema.averageInventory,
      //   type: 'numeric',
      // },
      usePrepCenter: {
        ...schema.usePrepCenter,
        type: 'checkbox',
      },
      actualsFor: {
        type: 'select',
        default: 7,
        options: [
          {
            value: 7,
            label: 'datepicker.presets.last7days',
          },
          {
            value: 14,
            label: 'datepicker.presets.last14days',
          },
          {
            value: 30,
            label: 'datepicker.presets.last30days',
          },
        ],
      },
      // salesPrice: {
      //   ...schema.salesPrice,
      //   type: 'numeric',
      // },
      // dailyUnitSales: {
      //   ...schema.dailyUnitSales,
      //   type: 'numeric',
      // },
      // acos: {
      //   ...schema.acos,
      //   type: 'numeric',
      // },
      // ppcShareSales: {
      //   ...schema.ppcShareSales,
      //   type: 'numeric',
      // },
      // dailyPromoSales: {
      //   ...schema.dailyPromoSales,
      //   type: 'numeric',
      // },
      // promoDiscount: {
      //   ...schema.promoDiscount,
      //   type: 'numeric',
      // },
      // productCost: {
      //   ...schema.productCost,
      //   type: 'numeric',
      // },
      // shippingCost: {
      //   ...schema.shippingCost,
      //   type: 'numeric',
      // },
      // unitLandedCost: {
      //   ...schema.unitLandedCost,
      //   type: 'numeric',
      // },
      // fbaFee: {
      //   ...schema.fbaFee,
      //   type: 'numeric',
      // },
      category: {
        ...schema.category,
        type: 'select',
      },
      // isHidden: {
      //   type: 'boolean',
      // },
      // weight: {
      //   type: Number,
      // },
      // height: {
      //   type: Number,
      // },
      // width: {
      //   type: Number,
      // },
      // length: {
      //   type: Number,
      // },
    },
  };
}
