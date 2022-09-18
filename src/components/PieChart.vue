<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: {
    data: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels, // ["late", "have over time", "absence"],
        datasets: [
          {
            backgroundColor: ["#2d2924", "#563500", "#E9BB70"],
            data: this.data,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false }
    );
  },
};
</script>
