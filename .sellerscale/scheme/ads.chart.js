import { formatNumeric } from '@/util';
import i18n from '@/i18n';

export default {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'acos',
        unit: '%',
        type: 'line',
        data: [],
        hidden: false,
        borderColor: '#3297db',
        yAxisID: 'percents',
      },
      {
        label: 'ppc_spend',
        unit: '$',
        type: 'bar',
        data: [],
        hidden: false,
        backgroundColor: '#e57',
        yAxisID: 'cash',
      },
      // {
      //   label: 'Conversion',
      //   type: 'line',
      //   data: [],
      //   borderColor: '#66bb66',
      //   yAxisID: 'percents',
      // },
    ],
  },
  options: {
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0,
      },
    },
    legend: {
      display: false,
      // position: 'top',
      // labels: {
      //   usePointStyle: true,
      //   generateLabels(chart) {
      //     return Array.from(chart.data.datasets || [], item => ({
      //       text:
      //       `${i18n.t(`dashboard.stat.${item.label}`)}${item.unit ? `, ${item.unit}` : ''}`,
      //       lineWidth: 0,
      //       strokeStyle: 'transparent',
      //       fillStyle: item.backgroundColor || item.borderColor,
      //       pointStyle: item.pointStyle,
      //     }));
      //   },
      // },
    },
    scales: {
      yAxes: [
        {
          id: 'cash',
          position: 'left',
          ticks: {
            callback: value => formatNumeric(value, '$', 0),
            autoSkip: true,
            maxTicksLimit: 7,
            fontColor: 'rgba(93, 113, 143, 1)',
          },
          gridLines: {
            color: 'rgba(210, 221, 235, .4)',
            zeroLineColor: '#d2ddec',
          },
        },
        {
          id: 'percents',
          position: 'right',
          ticks: {
            // max: 100,
            suggestedMin: 0,
            autoSkip: true,
            maxTicksLimit: 5,
            callback: value => formatNumeric(value, '%', 0),
            fontColor: 'rgba(93, 113, 143, 1)',
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
            zeroLineColor: '#d2ddec',
          },
        },
      ],
      xAxes: [
        {
          // type: 'time',
          ticks: {
            autoSkip: true,
            maxTicksLimit: 12,
            fontColor: 'rgba(93, 113, 143, 1)',
          },
          gridLines: {
            zeroLineColor: '#d2ddec',
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
    },
    tooltips: {
      mode: 'x-axis',
      callbacks: {
        label(tooltipItem) {
          switch (tooltipItem.datasetIndex) {
            case 0:
              return ` ${i18n.t('dashboard.stat.acos')}: ${formatNumeric(tooltipItem.yLabel, '%', 0)}`;
            case 1:
              return ` ${i18n.t('dashboard.stat.ppc_spend')}: ${formatNumeric(tooltipItem.yLabel, '$', 2)}`;
            default:
              return '';
          }
        },
      },
    },
  },
};
