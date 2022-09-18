<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
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
        labels: this.labels, // labels: ["Huawei", "Andorid", "ios"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#2d2924",
            data: [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000],
            data: this.data,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false }
    );
  },
};
</script>
