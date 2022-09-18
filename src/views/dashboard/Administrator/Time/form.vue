<template>
  <v-container id="regular-tables" fluid tag="section">
    <v-card class="py-5">
      <v-card-title>
        {{
          this.$route.params.id
            ? $t("departments.editnews")
            : $t("time.AddTime")
        }}
      </v-card-title>
      <template>
        <v-form v-model="valid" @submit.prevent="submitForm()">
          <v-container fluid>
            <template>
              <v-row>
                <v-col cols="11" sm="3">
                  <v-dialog
                    ref="dialog"
                    v-model="from"
                    :return-value.sync="data.from"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="data.from"
                        label="Picker in dialog"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="from"
                      v-model="data.from"
                      full-width
                      use-seconds
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="from = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(data.from)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                  <v-card max-width="344" outlined>
                    <v-row class="mx-auto py-2 pa-0" cols="12" md="6">
                      <v-checkbox
                        v-for="(day, index) in days"
                        class="pa-2"
                        :key="day + index"
                        v-model="data.days"
                        :label="day.name"
                        :value="day.name"
                        color="orange"
                      ></v-checkbox>
                    </v-row>
                  </v-card>
                </v-col>

                <!--  -->
                <v-col cols="11" sm="3">
                  <v-menu
                    ref="menu"
                    v-model="to"
                    :close-on-content-click="false"
                    :return-value.sync="data.to"
                    transition="scale-transition"
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="data.to"
                        label="Picker in dialog"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>

                    <v-time-picker
                      v-if="to"
                      v-model="data.to"
                      full-width
                      use-seconds
                    ></v-time-picker>

                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="to = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(data.to)"
                    >
                      OK
                    </v-btn>
                  </v-menu>
                </v-col>
                <v-row class="mx-md-6 pa-12">
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="data.city_id"
                      :items="cityList"
                      item-text="name"
                      item-value="id"
                      :label="$t('area.city')"
                      outlined
                      required
                      @change="getarea(data.city_id)"
                    />

                    <v-select
                      v-model="data.assigned_areas"
                      :items="areaList"
                      item-text="name"
                      item-value="id"
                      :label="$t('time.areas')"
                      multiple
                      outlined
                      required
                    />
                    <v-select
                      v-model="data.assigned_companies[0].company_id"
                      :items="CompaniesList"
                      item-text="name"
                      item-value="id"
                      :label="$t('departments.company')"
                      outlined
                      required
                    />
                    <v-select
                      v-model="data.assigned_companies[0].categories"
                      :items="categoriesList"
                      item-text="name"
                      item-value="id"
                      :label="$t('time.Categories')"
                      multiple
                      outlined
                      required
                    />
                  </v-col>
                </v-row>
              </v-row>
            </template>

            <v-btn
              type="submit"
              class="mx-auto my-auto d-flex"
              color="green"
              :loading="loading"
              :disabled="disabled"
            >
              {{
                this.$route.params.id ? $t("actions.save") : $t("actions.add")
              }}
            </v-btn>
          </v-container>
        </v-form>
      </template>
    </v-card>
    <v-dialog v-model="editDailog" width="500">
      <v-card class="text-center">
        <base-material-card
          :title="$t('actions.UpdateConfirmation')"
          color="green"
          class="pt-12"
        >
          <v-card-text class="mt-2">
            {{ $t("actions.areYouSureToUpdate") }}
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
              color="green"
              text
              :loading="confirmLoading"
              :disabled="confirmDisabled || password.length <= 7"
              @click="updateContent()"
            >
              {{ $t("actions.save") }}
            </v-btn>
            <v-btn color="error" text @click="editDailog = false">
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
      absolute
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
      absolute
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
const cityServices = ServiceFactory.get("city");
const CompanyService = ServiceFactory.get("companies");
const areaServices = ServiceFactory.get("area");
const categoriesService = ServiceFactory.get("categories");
const Services = ServiceFactory.get("times");

export default {
  name: "timesForm",
  data: (vm) => ({
    dataLoading: false,
    valid: false,
    data: {
      days: [],
      from: null,
      to: null,
      id: null,
      assigned_companies: [{ company_id: 0, categories: [] }],
      city_id: null,
    },
    days: [
      { id: 1, name: "Sunday" },
      { id: 2, name: "Monday" },
      { id: 3, name: "Tuesday" },
      { id: 4, name: "Wednesday" },
      { id: 5, name: "Thursday" },
      { id: 6, name: "Friday" },
      { id: 7, name: "Saturday" },
    ],
    CompaniesList: [],
    categoriesList: [],
    cityList: [],
    areaList: [],
    password: "",
    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    from: false,
    to: false,
    image: null,
    editDailog: false,
    successSnackbar: false,
    errorSnackbar: false,
    timeout: 3000,
    successMessage: "",
    errorMessage: "",
    loading: false,
    disabled: false,
    confirmLoading: false,
    confirmDisabled: false,
  }),
  created() {
    if (this.$route.params.id) {
      this.fetchOneItem(this.$route.params.id);
    }
    this.getCompanies();
    this.getCategories();
    this.getcity();
  },
  methods: {
    confirm() {
      this.editDailog = true;
    },

    async submitForm() {
      const form = {
        days: this.data.days,
        from: this.data.from,
        to: this.data.to,

        // description: this.data.description,
        assigned_companies: [
          {
            company_id: this.data.assigned_companies[0].company_id,
            categories: this.data.assigned_companies[0].categories,
          },
        ],
      };
      const formData = new FormData();
      /**
       */
      function buildFormData(formData, data, parentKey) {
        if (
          data &&
          typeof data === "object" &&
          !(data instanceof Date) &&
          !(data instanceof File)
        ) {
          Object.keys(data).forEach((key) => {
            buildFormData(
              formData,
              data[key],
              parentKey ? `${parentKey}[${key}]` : key
            );
          });
        } else {
          const value = data == null ? "" : data;

          formData.append(parentKey, value);
        }
      }

      buildFormData(formData, form);

      if (this.$route.params.id) {
        this.confirm();
      } else {
        this.loading = true;
        this.disabled = true;
        this.newItem(formData);
      }
    },
    async newItem(data) {
      const item = await Services.addItem(data);
      console.log("new Item item", item);
      if (item.status === 200) {
        this.successMessage = "Successful";
        this.successSnackbar = true;
        setTimeout(() => {
          this.$router.push("/times");
        }, 1500);
      } else {
        this.errorMessage = item;
        this.errorSnackbar = true;
      }
      this.loading = false;
      this.disabled = false;
    },
    async updateContent() {
      const form = {
        days: this.data.days,
        from: this.data.from,
        to: this.data.to,
        // description: this.data.description,
        assigned_companies: [
          {
            company_id: this.data.assigned_companies[0].company_id,
            categories: this.data.assigned_companies[0].categories,
          },
        ],
      };
      const formData = new FormData();
      /**
       */
      function buildFormData(formData, data, parentKey) {
        if (
          data &&
          typeof data === "object" &&
          !(data instanceof Date) &&
          !(data instanceof File)
        ) {
          Object.keys(data).forEach((key) => {
            buildFormData(
              formData,
              data[key],
              parentKey ? `${parentKey}[${key}]` : key
            );
          });
        } else {
          const value = data == null ? "" : data;

          formData.append(parentKey, value);
        }
      }

      buildFormData(formData, form);
      const item = await Services.updateItem(this.$route.params.id, formData);
      if (item.status === 200) {
        this.editDailog = false;
        this.successMessage = "Successful";
        this.successSnackbar = true;
        setTimeout(() => {
          this.$router.push("/times");
        }, 1500);
      } else {
        this.editDailog = false;
        this.errorMessage = item;
        this.errorSnackbar = true;
      }
      this.loading = false;
      this.disabled = false;
    },
    async fetchOneItem(id) {
      this.dataLoading = true;
      const item = await Services.fetchOneItem(id);
      console.log("item.data :>> ", item.data);
      this.data = item.data;
      this.dataLoading = false;
    },
    async getCompanies() {
      const data = await CompanyService.getAllItems();
      this.CompaniesList = data.data;
    },
    async getCategories() {
      const data = await categoriesService.getAllItems();
      this.categoriesList = data.data;
    },

    async getarea(cityId) {
      const data = await areaServices.getAreaByCity(cityId);
      this.areaList = data.data;
    },
    async getcity() {
      const data = await cityServices.getAllItems();
      this.cityList = data.data;
    },
  },
};
</script>
<style>
.v-messages {
  display: none;
}

a {
  text-decoration: none;
}
</style>
