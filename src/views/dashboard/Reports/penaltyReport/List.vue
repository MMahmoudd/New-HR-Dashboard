<template>
  <v-container fluid>
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
      <v-row class="pl-4" style="margin: auto">
        <v-col cols="6" md="4">
          <v-select
            v-model="list.company_id"
            :items="CompaniesList"
            item-text="name"
            item-value="id"
            :label="$t('company')"
            outlined
            required
          />
        </v-col>
      </v-row>
    </v-card>

    <v-card>
      <v-card-title>
        {{ $t("penalty.penaltyReport") }}
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
      </v-card-title>
      <v-data-table
        v-model="selected"
        :loading="dataLoading"
        :headers="headers"
        :search="search"
        :items="List"
        item-key="id"
        show-select
        :page-count="numberOfPages"
        :options.sync="options"
        @fetchAllItems="fetchAllItems"
      >
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
const Services = ServiceFactory.get("penaltyReport");
const cityServices = ServiceFactory.get("city");
const CompanyService = ServiceFactory.get("companies");
const jobTitleServices = ServiceFactory.get("jobTitle");
// const departmentServices = ServiceFactory.get("department");

export default {
  name: "execuses",
  data: (vm) => ({
    keyword: {
      activePicker: null,
      dateFrom: null,
      dateTo: null,
    },
    list: {
      jobtitle_id: "",
      company_id: "",
      Disciplinary_Type_Description: "",
      Disciplinary_Type_Code: "",
      Discipline_Notes: "",
      Discipline_Repetition: "",
      // department_id: "",
      companies: [],
    },
    code: "",
    full_name: "",
    from_time: "",
    to_time: "",
    permission_day: "",
    sender: "",
    dircet_manager: "",
    status: "",
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

    CompaniesList: "",
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
    // DepartmentsList: [],

    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    headers: [
      {
        text: vm.$t("penalty.code"),
        sortable: false,
        value: "code",
      },
      {
        text: vm.$t("penalty.fullname"),
        sortable: false,
        value: "full_name",
      },
      {
        text: vm.$t("penalty.DisciplinaryTypeDescription"),
        sortable: false,
        value: "Disciplinary_Type_Description",
      },
      {
        text: vm.$t("penalty.DisciplinaryTypeCode"),
        sortable: false,
        value: "Disciplinary_Type_Code",
      },
      {
        text: vm.$t("penalty.DisciplineNotes"),
        sortable: false,
        value: "Discipline_Notes",
      },
      {
        text: vm.$t("penalty.DisciplineRepetition"),
        sortable: false,
        value: "Discipline_Repetition",
      },
    ],
    filename: "penaltyReport",
    bookType: "xlsx",
    autoWidth: true,
  }),
  created() {
    this.getcity();
    this.getCompanies();
    this.getjobTitl();
    // this.getDepartments();
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
      // this.cities ,this.company_id,this.department_id,this.jobtitle_id
      this.List = List.data;
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
        const tHeader = [
          "code",
          "full_name",
          "Disciplinary_Type_Description",
          "Discipline_Notes",
          "Discipline_Repetition",
        ];
        const list = List.data.map((item) => {
          return {
            code: item.code,
            full_name: item.full_name,
            Disciplinary_Type_Description: item.Disciplinary_Type_Description,
            Discipline_Notes: item.Discipline_Notes,
            Discipline_Repetition: item.Discipline_Repetition,
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
    // async getDepartments(id) {
    //   const data = await departmentServices.getDepartmentByCompanyId(id);
    //   this.DepartmentsList = data.data;
    // },

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
