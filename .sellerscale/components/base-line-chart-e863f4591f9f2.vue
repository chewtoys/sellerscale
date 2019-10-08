<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  name: 'base-line-chart',
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
