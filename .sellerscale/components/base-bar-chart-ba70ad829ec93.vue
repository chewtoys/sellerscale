<script>
import { Bar, mixins } from 'vue-chartjs';
import '@/helpers/chart.extension';

const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  name: 'base-bar-chart',
  props: {
    options: {
      type: Object,
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>

<style scoped>

</style>
