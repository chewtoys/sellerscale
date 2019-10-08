/* eslint-disable no-param-reassign */

import ProductSchema from './product.schema';

export default function UnitEconomicsTableSchema(type = 'tracked') {
  const schema = ProductSchema(type);

  const unitTableSchema = {
    groups: [
      {
        id: 'inputs',
        theme: 'inputs',
        columnTheme: 'inputs',
        columns: [
          {
            id: 'salesPrice',
            foldable: false,
            editable: true,
          },
          {
            id: 'dailyUnitSales',
            foldable: false,
            editable: true,
          },
          {
            id: 'acos',
            foldable: false,
            editable: true,
          },
          {
            id: 'ppcShareSales',
            foldable: false,
            editable: true,
          },
          {
            id: 'dailyPromoSales',
            foldable: true,
            editable: true,
          },
          {
            id: 'promoDiscount',
            foldable: true,
            editable: true,
          },
        ],
      },
      {
        id: 'costs',
        theme: 'costs',
        columnTheme: 'costs',
        columns: [
          {
            id: 'productCost',
            foldable: false,
            editable: true,
          },
          // {
          //   id: 'shippingCost',
          //   foldable: true,
          //   editable: true,
          //   link: 'plus',
          // },
          // {
          //   id: 'unitLandedCost',
          //   foldable: false,
          //   link: 'sum',
          // },
          {
            id: 'referralFee',
            foldable: true,
            theme: 'other-costs',
          },
          {
            id: 'fbaFee',
            foldable: true,
            editable: true,
            theme: 'other-costs',
            link: 'plus',
          },
          {
            id: 'otherFees',
            foldable: true,
            theme: 'other-costs',
            link: 'plus',
          },
          {
            id: 'amazonFees',
            foldable: false,
            theme: 'other-costs',
            link: 'sum',
          },
          {
            id: 'ppcCost',
            foldable: false,
            theme: 'ppc-cost',
          },
        ],
      },
      {
        id: 'outputs',
        theme: 'outputs',
        columnTheme: 'outputs',
        shift: true,
        columns: [
          {
            id: 'contribMargin',
            foldable: false,
          },
          {
            id: 'contribMarginPercent',
            foldable: false,
          },
          {
            id: 'roi',
            foldable: false,
          },
          {
            id: 'paybackPeriod',
            size: 'minmax(5rem, auto)',
            foldable: false,
            invertShift: true,
          },
          {
            id: 'profit',
            foldable: false,
          },
          {
            id: 'revenue',
            foldable: false,
          },
        ],
      },
    ],
  };

  unitTableSchema.columns = [];

  unitTableSchema.groups.forEach((group) => {
    group.columns.forEach((column) => {
      column.group = group;
      column.schema = schema[column.id];
      column.color = column.color || group.color;
      column.backgroundColor = column.backgroundColor || group.backgroundColor;
      column.theme = column.theme || group.columnTheme;
      column.shift = column.shift != null ? column.shift : group.shift;
      column.invertShift = column.invertShift != null ? column.invertShift : group.invertShift;

      if (column.foldable) {
        column.folded = true;
        group.foldable = true;
      }

      unitTableSchema.columns.push(column);
    });

    unitTableSchema.columns.slice(-1)[0].lastInGroup = true;
  });

  return unitTableSchema;
}
