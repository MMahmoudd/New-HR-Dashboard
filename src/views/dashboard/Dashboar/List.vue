<template>
  <v-container id="dashboard" fluid>
    <v-card>
      <v-card-title>
        <v-spacer />
        <v-spacer />
        <v-btn
          class="mx-1 my-auto"
          color="success"
          :loading="loading"
          @click="fetchAllItems()"
        >
          {{ $t("Search") }}
        </v-btn>
      </v-card-title>

      <template>
        <v-row cols="6" md="3" style="margin: auto">
          <div class="pl-4">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="keyword.dateFrom"
                  label="from"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="keyword.dateFrom"
                :active-picker.sync="activePicker"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </div>
          <div>
            <v-menu
              ref="menu"
              v-model="menuu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="keyword.dateTo"
                  label="to"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="keyword.dateTo"
                :active-picker.sync="activePicker"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </div>
        </v-row>
      </template>
      <v-row style="margin: auto">
        <v-col cols="6" md="3">
          <v-select
            v-model="list.company_id"
            :items="CompaniesList"
            item-text="name"
            item-value="id"
            :label="$t('company')"
            outlined
            required
            @input="getDepartments(list.company_id)"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            v-model="list.department_id"
            :items="DepartmentsList"
            item-text="name"
            item-value="id"
            :label="$t('department')"
            outlined
            required
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            v-model="list.jobtitle_id"
            :items="jobTitlsList"
            item-text="name"
            item-value="id"
            :label="$t('jobTitl')"
            multiple
            outlined
            required
          />
        </v-col>
      </v-row>
    </v-card>
    <v-card>
      <!-- ///////////////////////////////////////// -->
      <v-card-title>
        {{ $t("Dashboard") }}
        <v-spacer />
        <v-spacer />
      </v-card-title>

      <v-container fluid tag="section">
        <!-- // -->
        <v-row>
          <v-row>
            <v-col>
              <img src="../../../assets/Departments.png" style="width: 15%" />
              <p>Departments : {{ List.Departments }}</p>
            </v-col>
            <v-col>
              <img src="../../../assets/Companies.png" style="width: 15%" />
              <p>Companies : {{ List.Companies }}</p>
            </v-col>
            <v-col>
              <img src="../../../assets/Cities.png" style="width: 15%" />
              <p>Cities : {{ List.Cities }}</p>
            </v-col>
            <v-col>
              <img src="../../../assets/Areas.png" style="width: 15%" />
              <p>Areas : {{ List.Areas }}</p>
            </v-col>
          </v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                {{ $t("Attendance") }}
              </v-card-title>
              <v-container>
                <pie-chart
                  v-if="List.Attendance"
                  :data="List.Attendance"
                  :labels="['late', 'have over time', 'absence']"
                />
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                {{ $t("Vacation") }}
              </v-card-title>
              <v-container>
                <pie-chart
                  v-if="List.Vacation"
                  :data="List.Vacation"
                  :labels="['Accepted', 'pending', 'refused']"
                />
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                {{ $t("Users") }}
              </v-card-title>
              <v-container>
                <pie-chart
                  v-if="List.Users"
                  :data="List.Users"
                  :labels="['Active', 'Terminated', 'Resigned']"
                />
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                {{ $t("Excuse") }}
              </v-card-title>
              <v-container>
                <pie-chart
                  v-if="List.Excuse"
                  :data="List.Excuse"
                  :labels="['Accepted', 'pending', 'refused']"
                />
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                {{ $t("mission") }}
              </v-card-title>
              <v-container>
                <pie-chart
                  v-if="List.Mission"
                  :data="List.Mission"
                  :labels="['Accepted', 'pending', 'refused']"
                />
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                {{ $t("Use App") }}
              </v-card-title>
              <v-container>
                <bar-chart
                  v-if="List.UsersUseApp"
                  :data="List.UsersUseApp"
                  :labels="['Andorid', 'ios', '', 'Huawei']"
                />
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                {{ $t("Requested For Deployment") }}
              </v-card-title>
              <v-container>
                <pie-chart
                  v-if="List.requested_for_deployment"
                  :data="List.requested_for_deployment"
                  :labels="['Accepted', 'pending', 'refused']"
                />
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- <v-dialog v-model="deleteDailog" width="500">
      <v-card class="text-center">
        <base-material-card
          :title="$t('actions.DeleteConfirmation')"
          color="error"
          class="pt-12"
        >
          <v-card-text class="mt-2">
            {{ $t("actions.areYouSureToDelete") }}
            <v-text-field
              v-model="password"
              :type="show1 ? 'text' : 'password'"
              :append-icon="show1 ? 'mdi-lock-outline' : 'mdi-lock-outline'"
              :placeholder="$t('login.password')"
              :rules="[rules.required, rules.min]"
              outlined
              @click:append="show1 = !show1"
            />
          </v-card-text>
        </base-material-card>
      </v-card>
    </v-dialog> -->
    <v-snackbar
      v-model="successSnackbar"
      color="success"
      shaped
      bottom
      right
      :timeout="timeout"
    >
      {{ successMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="errorSnackbar"
      color="red"
      shaped
      bottom
      right
      :timeout="timeout"
    >
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import PieChart from "../../../components/PieChart.vue";
import BarChart from "../../../components/BarChart.vue";
import { ServiceFactory } from "../../../services/serviceFactory";
const Services = ServiceFactory.get("home");
const cityServices = ServiceFactory.get("city");
const CompanyService = ServiceFactory.get("companies");
const jobTitleServices = ServiceFactory.get("jobTitle");
const departmentServices = ServiceFactory.get("department");

export default {
  name: "Dashboard",
  components: {
    PieChart,
    BarChart,
  },

  data: (vm) => ({
    keyword: {
      activePicker: null,
      dateFrom: null,
      dateTo: null,
    },

    chartData: {
      Books: 24,
      Magazine: 30,
      Newspapers: 10,
    },
    labels: ["Huawei", "Andorid", "ios", "sss"],
    fill: true,
    gradients: ["#774a00", "#E9BB70"],
    padding: 15,
    radius: 5,
    value: [0, 2, 5, 9, 5, 10, 3],
    width: 2,

    list: {
      jobtitle_id: "",
      company_id: "",
      department_id: "",
    },
    Cities: "",
    from_time: "",
    to_time: "",
    permission_day: "",
    sender: "",
    dircet_manager: "",
    status: "",
    menu: false,
    menuu: false,
    Areas: "",
    search: "",
    selected: [],
    dataLoading: false,
    page: 0,
    total: 0,
    numberOfPages: 0,
    options: {},
    List: [],
    cities: "",
    //  company_id:"",
    //  jobtitle_id:"",
    //  department_id:"",
    // CompaniesList:"",
    itemDetails: {},
    deleteDailog: false,
    loading: false,
    editedIndex: -1,
    successSnackbar: false,
    errorSnackbar: false,
    timeout: 3000,
    successMessage: "",
    errorMessage: "",
    disabled: false,
    password: "",
    show1: false,
    cityList: [],
    CompaniesList: [],
    jobTitlsList: [],
    DepartmentsList: [],

    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    // headers: [
    //   { text: vm.$t("Excue Start Time"), sortable: false, value: "from_time" },
    //   { text: vm.$t("Excue End Time"), sortable: false, value: "to_time" },
    //   { text: vm.$t("Excue Day"), sortable: false, value: "permission_day" },
    //   { text: vm.$t("sender"), sortable: false, value: "sender" },
    //   {
    //     text: vm.$t("DirectManager"),
    //     sortable: false,
    //     value: "dircet_manager",
    //   },
    //   { text: vm.$t("status"), sortable: false, value: "status" },

    //   { text: vm.$t("actions.actions"), value: "actions", sortable: false },
    // ],
    // filename: "execuses",
    // bookType: "xlsx",
    // autoWidth: true,
  }),
  created() {
    this.fetchAllItems();
    this.getcity();
    this.getCompanies();
    this.getjobTitl();
    this.getDepartments();
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  methods: {
    confirmDeleteItem() {
      this.deleteDailog = true;
    },
    complete(index) {
      this.list[index] = !this.list[index];
    },
    complete(index) {
      this.list[index] = !this.list[index];
    },
    async fetchAllItems() {
      // console.log('this.keyword', this.keyword)
      this.dataLoading = true;
      const { page, itemsPerPage } = this.options;

      const pageNumber = page - 1;
      const List = await Services.getAllItems(
        itemsPerPage,
        page,
        pageNumber,
        this.keyword,
        this.list
      );
      console.log(List);
      // this.cities ,this.company_id,this.department_id,this.jobtitle_id
      this.List = List.data;
      this.List.Attendance = this.List.Attendance.splice(1, 3);
      this.List.Users = this.List.Users.splice(1, 3);
      this.list.UsersUseApp = this.list.UsersUseApp.splice(0, 4);

      // this.total = List.meta.total;
      // this.numberOfPages = List.meta.current_page
      this.dataLoading = false;
    },
    async deleteItem() {
      this.loading = true;
      this.disabled = true;
      const ids = [];
      this.selected.forEach((item) => {
        ids.push(item.id);
      });
      const deleteItem = await Services.deleteItems(ids, this.password);
      if (deleteItem.status === 200) {
        this.deleteDailog = false;
        this.successMessage = "Delete Success";
        this.successSnackbar = true;
        setTimeout(() => {
          this.selected.map((item) => {
            this.editedIndex = this.List.indexOf(item);
            this.List.splice(this.editedIndex, 1);
          });
          this.selected = [];
        }, 500);
      } else {
        this.errorMessage = deleteItem;
        this.errorSnackbar = true;
      }
      this.disabled = false;
      this.loading = false;
    },
    async exportExel() {
      this.loading = true;
      const List = await Services.getAllItems();
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "Excue Start Time",
          "Excue End Time",
          "Excue Day",
          "sender",
          "DirectManager",
          "status",
        ];
        const list = List.data.map((item) => {
          return {
            from_time: item.from_time,
            to_time: item.to_time,
            permission_day: item.permission_day,
            sender: item.sender,
            dircet_manager: item.dircet_manager,
            status: item.status,
          };
        });
        const data = this.formatJson(list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.loading = false;
      });
    },
    formatJson(jsonData) {
      return jsonData.map((v) => {
        return Object.values(v);
      });
    },
    async getcity() {
      const data = await cityServices.getAllItems();
      this.cityList = data.data;
    },
    async getCompanies() {
      const data = await CompanyService.getAllItems();
      this.CompaniesList = data.data;
    },
    async getjobTitl() {
      const data = await jobTitleServices.getAllItems();
      this.jobTitlsList = data.data;
    },
    async getDepartments(id) {
      const data = await departmentServices.getDepartmentByCompanyId(id);
      this.DepartmentsList = data.data;
    },

    save(date) {
      this.$refs.menu.save(date);
    },
  },
};
</script>
<style>
.v-card {
  margin-top: 0px;
}
a {
  text-decoration: none;
}
h1 {
  font-weight: 300;
}
</style>
