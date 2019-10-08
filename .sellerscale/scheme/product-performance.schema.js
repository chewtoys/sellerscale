export default function ProductPerformanceSchema() {
  const schema = {
    id: {},
    name: {},
    sales: {
      unit: 'currency',
      theme: 'inputs',
    },
    count: {
      unit: 'unit',
      theme: 'inputs',
    },
    refunds: {
      unit: 'unit',
      theme: 'costs',
    },
    refundRate: {
      unit: 'percent',
      theme: 'costs',
    },
    refundCost: {
      unit: 'currency',
      theme: 'costs',
    },
    ppcSpend: {
      unit: 'currency',
      theme: 'outputs',
    },
    acos: {
      unit: 'percent',
      theme: 'outputs',
      totalFormula(totals) {
        return totals.ppcSpend / totals.ppcSales * 100;
      },
    },
    ppcShare: {
      unit: 'percent',
      theme: 'outputs',
      totalFormula(totals) {
        return totals.ppcSales / totals.sales * 100;
      },
    },
    conversion: {
      unit: 'percent',
      theme: 'outputs',
      totalFormula(totals, items) {
        const totalPpcCount = items.reduce(
          (sum, item) => sum + (item.conversion ? item.ppcCount : 0), 0,
        );

        return totalPpcCount / totals.clicks * 100;
      },
    },
    grossProfit: {
      unit: 'currency',
      theme: 'inputs',
    },
    grossMargin: {
      unit: 'percent',
      theme: 'inputs',
      totalFormula(totals) {
        return totals.grossProfit / totals.sales * 100;
      },
    },
    roi: {
      unit: 'percent',
      theme: 'inputs',
      totalFormula(totals, items) {
        const cogs = items.reduce(
          (sum, item) => sum + (item.roi ? (item.grossMargin / item.roi) : 0), 0,
        );

        return totals.grossProfit / totals.sales / cogs * 100;
      },
    },
  };

  Object.keys(schema)
    .forEach((prop) => {
      const fieldSchema = schema[prop];

      fieldSchema.precision = fieldSchema.unit === 'percent' ? 1 : 0;
    });

  return schema;
}
