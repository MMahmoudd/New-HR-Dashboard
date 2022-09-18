<template>
  <v-card>
    <v-toolbar>
      <!-- background-color="red lighten-2" dark -->
      <!-- <v-text-field
        append-icon="mdi-microphone"
        class="mx-4"
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-magnify"
        solo-inverted
      ></v-text-field> -->

      <template v-slot:extension>
        <v-tabs background-color="red lighten-3" dark v-model="tabs" centered>
          <v-tab v-for="(n, i) in headOfPages" :key="i">{{ n }} </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-card-title class="text-h5"> hr Worker Planner </v-card-title>
            <hrWorkerPlanner></hrWorkerPlanner>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-title class="text-h5">
            absence Sheet Transaction
          </v-card-title>
          <absenceSheetTransaction></absenceSheetTransaction>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-title class="text-h5"> hr Time Attendance </v-card-title>
          <v-card-text>
            <TimeAttendance></TimeAttendance>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-title class="text-h5"> Disciplinary Action</v-card-title>
          <v-card-text>
            <penaltyReport></penaltyReport>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import penaltyReport from "./penaltyReport.vue";
import TimeAttendance from "./TimeAttendance.vue";
import hrWorkerPlanner from "./hrWorkerPlanner.vue";
import absenceSheetTransaction from "./absenceSheetTransaction.vue";

export default {
  components: {
    hrWorkerPlanner,
    absenceSheetTransaction,
    TimeAttendance,
    penaltyReport,
  },
  data() {
    return {
      headOfPages: [
        "Hr Worker Planner",
        "Absence Sheet Transaction",
        "Hr Time Attendance",
        "Disciplinary Action",
      ],
      tabs: null,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    };
  },
};
</script>
