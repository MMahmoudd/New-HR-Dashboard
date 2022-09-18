<template>
  <v-container id="regular-tables" fluid tag="section">
    <v-card class="py-5">
      <v-card-title>
        {{
          this.$route.params.id ? $t("Adding New Roles") : $t("roles.addroles")
        }}
      </v-card-title>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="data.name"
          :label="$t('*Roles NAME')"
          color="green"
          outlined
          required
        />
      </v-col>
      <template>
        <v-form v-model="valid" @submit.prevent="submitForm()">
          <v-container fluid class="row mx-auto">
            <template>
              <v-col
                cols="11"
                sm="3"
                v-for="(permission, index) in permissions"
                :key="permission + index"
              >
                <p>{{ permission.group_name }}</p>

                <v-card
                  max-width="344"
                  outlined
                  style="background-color: #fafafa"
                >
                  <v-row class="mx-auto py-2 pa-0" cols="12" md="6">
                    <div v-for="item in permission.permissions" :key="item.id">
                      <v-checkbox
                        class="row pa-4"
                        v-model="data.permissions"
                        :label="item.name"
                        :value="item.id"
                        color="orange"
                      ></v-checkbox>
                    </div>
                  </v-row>
                </v-card>
              </v-col>
              <!-- <v-col cols="11" sm="3">
                <v-card max-width="344" outlined>
                  <v-row class="mx-auto py-2 pa-0" cols="12" md="6">
                    <v-checkbox
                      class="pa-2"
                      v-for="(permission, index) in permissions"
                      :key="permission + index"
                      v-model="data.permissions"
                      :label="permission.name"
                      :value="permission.name"
                      color="orange"
                    ></v-checkbox>
                  </v-row>
                </v-card>
              </v-col> -->
            </template>
            <!-- <template>
              <v-col cols="11" sm="3">
                <span>Permission</span>
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
            </template> -->
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
const permissionsServices = ServiceFactory.get("permissions");
const Services = ServiceFactory.get("roles");

export default {
  name: "rolesForm",
  data: (vm) => ({
    dataLoading: false,
    valid: false,
    data: {
      days: [],
      name: "",
      permissions: [],
      assigned_companies: [{ company_id: 0, categories: [] }],
    },
    permissions: [{ id: 0, name: "" }],
    // days: [
    //   { id: 1, name: "Sunday" },
    //   { id: 2, name: "Monday" },
    //   { id: 3, name: "Tuesday" },
    //   { id: 4, name: "Wednesday" },
    //   { id: 5, name: "Thursday" },
    //   { id: 6, name: "Friday" },
    //   { id: 7, name: "Saturday" },
    // ],
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
    this.getpermissions();
  },
  methods: {
    confirm() {
      this.editDailog = true;
    },

    async submitForm() {
      const form = {
        // group_name: this.data.group_name,
        name: this.data.name,
        permissions: this.data.permissions,
        // permissions: this.data.permissions.name,

        // from: this.data.from,
        // to: this.data.to,

        // description: this.data.description,
        // assigned_companies: [
        //   {
        //     company_id: this.data.assigned_companies[0].company_id,
        //     categories: this.data.assigned_companies[0].categories,
        //   },
        // ],
        // [{ group_name:"",permissions:[{id:0,name:""}]}]
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
          this.$router.push("/roles");
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
          this.$router.push("/roles");
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
    async getpermissions() {
      const data = await permissionsServices.getAllItems();
      this.permissions = data.data;
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
