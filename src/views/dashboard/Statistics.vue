<template>
  <v-container id="dashboard" fluid tag="section">
    <!-- // -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            {{ $t("Excuse") }}
          </v-card-title>
          <v-container>
            <pie-chart />
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            {{ $t("statistics.companiesStatistics") }}
          </v-card-title>
          <v-container>
            <bar-chart />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PieChart from "../../components/PieChart.vue";
import BarChart from "../../components/BarChart.vue";
export default {
  name: "Dashboard",
  components: {
    PieChart,
    BarChart,
  },
  data() {
    return {
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      fill: true,
      gradients: ["#774a00", "#E9BB70"],
      padding: 15,
      radius: 5,
      value: [0, 2, 5, 9, 5, 10, 3],
      width: 2,
    };
  },
  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    },
  },
};
</script>
<style lang="scss">
h1 {
  font-weight: 300;
}
</style>
