<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        {{ $t("reportingTo.reportingTo") }}
        <v-spacer />
        <v-spacer />
        <v-btn
          class="mx-1 my-auto"
          color="indigo"
          :loading="loading"
          :disabled="disabled"
          @click="exportExel()"
        >
          {{ $t("actions.export") }}
        </v-btn>
        <!-- <router-link
          :to="{ path: '/reportingToForm' }"
          color="primary"
        > -->
        <!-- <v-btn
            outlined
            class="mx-2"
            color="green"
          >
            {{ $t('actions.Add') }}
          </v-btn> -->
        <!-- </router-link> -->
      </v-card-title>
      <v-data-table
        v-model="selected"
        :loading="dataLoading"
        :headers="headers"
        :search="search"
        :items="List"
        :items-per-page="20"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50],
        }"
        item-key="id"
        show-select
        :options.sync="options"
        @fetchAllItems="fetchAllItems"
      >
        <!-- :server-items-length="total"
        :page-count="numberOfPages" -->
        <template v-if="selected.length >= 1" v-slot:top>
          <v-toolbar flat>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  fab
                  outlined
                  class="mx-2"
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                  @click="confirmDeleteItem()"
                >
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </template>
              {{ $t("actions.delete") }}
            </v-tooltip>
          </v-toolbar>
        </template>
        <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip
            bottom
          >
            <template
              v-slot:activator="{ on, attrs }"
            >
              <router-link
                :to="'/reportingToForm/' + item.id"
              >
                <v-btn
                  small
                  fab
                  outlined
                  class="mx-2"
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-pencil </v-icon>
                </v-btn>
              </router-link>
            </template>
            {{ $t('actions.edit') }}
          </v-tooltip>
        </template> -->

        <template v-slot:no-data loading>
          <p>{{ $t("actions.noData") }}</p>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="deleteDailog" width="500">
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

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red"
              text
              :loading="loading"
              :disabled="disabled || password.length <= 7"
              @click="deleteItem()"
            >
              {{ $t("actions.delete") }}
            </v-btn>
            <v-btn color="green" text @click="deleteDailog = false">
              {{ $t("actions.close") }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
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
import { ServiceFactory } from "../../../../services/serviceFactory";
const Services = ServiceFactory.get("reportingTo");
const cityServices = ServiceFactory.get("city");
const CompanyService = ServiceFactory.get("companies");
const jobTitleServices = ServiceFactory.get("jobTitle");
const departmentServices = ServiceFactory.get("department");

export default {
  name: "reportingTo",
  data: (vm) => ({
    keyword: {
      activePicker: null,
      dateFrom: null,
      dateTo: null,
    },
    list: {
      jobtitle_id: "",
      company_id: "",
      department_id: "",
    },

    menu: false,
    menuu: false,
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
    headers: [
      { text: vm.$t("reportingTo.id"), sortable: false, value: "id" },
      {
        text: vm.$t("reportingTo.DirectManager"),
        sortable: false,
        value: "DirectManager",
      },
      {
        text: vm.$t("reportingTo.Employee"),
        sortable: false,
        value: "Employee",
      },
      { text: vm.$t("reportingTo.Level"), sortable: false, value: "Level" },

      // { text: vm.$t('actions.actions'), value: 'actions', sortable: false },
    ],
    filename: "reportingTo",
    bookType: "xlsx",
    autoWidth: true,
  }),
  created() {
    this.getcity();
    this.getCompanies();
    this.getjobTitl();
    this.getDepartments();
  },

  watch: {
    options: {
      handler() {
        this.fetchAllItems();
      },
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  methods: {
    confirmDeleteItem() {
      this.deleteDailog = true;
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
      this.List = List.data;
      // this.total = List.meta.total
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
      const { page, itemsPerPage } = this.options;
      const pageNumber = page - 1;
      const List = await Services.getAllItems(
        itemsPerPage,
        page,
        pageNumber,
        this.keyword,
        this.list
      );
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["id", "DirectManager", "Employee", "Level"];
        const list = List.data.map((item) => {
          return {
            id: item.id,
            DirectManager: item.DirectManager,
            Employee: item.Employee,
            Level: item.Level,
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
    async getDepartments() {
      const data = await departmentServices.getAllItems();
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
</style>
