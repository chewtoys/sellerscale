import { formatNumeric } from '@/util';
import i18n from '@/i18n';

export default {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        type: 'line',
        label: 'count',
        data: [],
        hidden: false,
        borderColor: '#e57',
        yAxisID: 'units',
        pointRadius: 3,
        pointBackgroundColor: '#e57',
      },
      {
        type: 'bar',
        unit: '$',
        label: 'sales',
        data: [],
        hidden: false,
        backgroundColor: '#3297db',
        yAxisID: 'cash',
      },
      {
        type: 'bar',
        unit: '$',
        label: 'profit',
        data: [],
        hidden: false,
        backgroundColor: '#66bb66',
        yAxisID: 'cash',
        lineTension: 0,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    defaultFontFamily: '"Helvetica Neue", Helvetica, Arial',
    elements: {
      line: {
        tension: 0,
      },
    },
    tooltips: {
      mode: 'x-axis',
      callbacks: {
        label(tooltipItem) {
          switch (tooltipItem.datasetIndex) {
            case 0:
              return ` ${i18n.t('dashboard.stat.count')}: ${formatNumeric(tooltipItem.yLabel, '', 0)}`;
            case 1:
              return ` ${i18n.t('dashboard.stat.sales')}: ${formatNumeric(tooltipItem.yLabel, '$', 2)}`;
            case 2:
              return ` ${i18n.t('dashboard.stat.profit')}: ${formatNumeric(tooltipItem.yLabel, '$', 2)}`;
            default:
              return '';
          }
        },
      },
    },
    legend: {
      display: false,
      // position: 'top',
      // labels: {
      //   usePointStyle: true,
      //   boxWidth: 50,
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
            suggestedMin: 0,
            fontColor: 'rgba(93, 113, 143, 1)',
          },
          gridLines: {
            // color: 'rgba(0, 0, 0, 0)',
            color: 'rgba(210, 221, 235, .4)',
            zeroLineColor: '#d2ddec',
          },
        },
        {
          id: 'units',
          position: 'right',
          ticks: {
            // max: 100,
            suggestedMin: 0,
            autoSkip: true,
            maxTicksLimit: 7,
            callback: value => (value >= 0 ? value : ''),
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
            color: 'transparent',
            zeroLineColor: '#d2ddec',
          },
        },
      ],
    },
  },
};
