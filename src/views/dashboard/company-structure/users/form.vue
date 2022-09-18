<template>
  <v-container id="regular-tables" fluid tag="section">
    <v-card class="py-5">
      <v-card-title>
        {{
          this.$route.params.id
            ? $t("departments.editnews")
            : $t("add Employees")
        }}
      </v-card-title>

      <template>
        <v-form v-model="valid" @submit.prevent="submitForm()">
          <v-container fluid>
            <v-col class="mx-auto" cols="12" sm="6" md="3">
              <v-avatar color="grey lighten-2 " size="100">
                <v-col v-if="data.image" sm="6">
                  <img :src="data.image" alt="logo" width="100" />
                </v-col>
                <v-file-input
                  class="justify-sm-center"
                  show-size
                  outlined
                  color="green"
                  label="upload Logo"
                  placeholder="upload Logo"
                  prepend-icon="mdi-camera"
                  accept="image/png, image/jpeg, image/bmp"
                  truncate-length="15"
                  @change="onNewLogoSelected"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="green">
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-avatar>
            </v-col>
            <div>
              <v-row>
                <v-col sm="6">
                  <v-col sm="8">
                    <v-text-field
                      v-model="data.full_name"
                      :label="$t('FullName')"
                      color="green"
                      outlined
                      required
                      append-icon="mdi-map-marker"
                    />
                  </v-col>
                  <v-row no-gutters>
                    <v-col class="mx-3" cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="data.first_name"
                        :label="$t('FirstName')"
                        color="green"
                        outlined
                        required
                      />
                    </v-col>
                    <br />
                    <v-col class="mx-2" cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="data.last_name"
                        :label="$t('LastName')"
                        color="green"
                        outlined
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="data.nationalId"
                      :label="$t('nationalId')"
                      color="green"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="data.buisness_mobile"
                      :label="$t('Bussniess Mobile')"
                      color="green"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="data.private_mobile"
                      :label="$t('Private Mobile')"
                      color="green"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="data.email"
                      :label="$t('email')"
                      color="green"
                      :rules="[rules.required, rules.email]"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="8">
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
                          v-model="data.start_date"
                          :label="$t('StartDate')"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="data.start_date"
                        :active-picker.sync="activePicker"
                        :max="
                          new Date(
                            Date.now() - new Date().getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .substr(0, 10)
                        "
                        min="1950-01-01"
                        @change="save"
                      ></v-date-picker>
                    </v-menu>
                    <!--  -->
                    <pr />
                    <!-- <span class="left">Authorization areas.</span> -->
                  </v-col>
                </v-col>
                <v-col md="6">
                  <v-col cols="12" md="8">
                    <v-select
                      v-model="data.company_id"
                      :items="CompaniesList"
                      item-text="name"
                      item-value="id"
                      :label="$t('company')"
                      outlined
                      required
                      @input="getDepartments(data.company_id)"
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="data.code"
                      :label="$t('Code')"
                      color="green"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-select
                      v-model="data.department_id"
                      :items="DepartmentsList"
                      item-text="name"
                      item-value="id"
                      :label="$t('department')"
                      outlined
                      required
                      @input="getjobTitl(data.department_id)"
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-select
                      v-model="data.jobtitle_id"
                      :items="jobTitlsList"
                      item-text="name"
                      item-value="id"
                      :label="$t('jobTitl')"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-select
                      v-model="data.category_id"
                      :items="categoriesList"
                      item-text="name"
                      item-value="id"
                      :label="$t('categories')"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="data.serial_mobile"
                      :label="$t('serial mobile ')"
                      color="green"
                      outlined
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-select
                      v-model="data.roles"
                      :items="rolesList"
                      item-text="name"
                      item-value="id"
                      :label="$t('roles')"
                      multiple
                      outlined
                      required
                    />
                  </v-col>

                  test
                </v-col>
              </v-row>
            </div>
            <div>
              <span class="mt-6">Direct Manger</span>
              <v-row>
                <v-col cols="12" md="4" mt="4">
                  <v-select
                    v-model="data.directmanagers[0].manager_id"
                    :items="usersList"
                    item-text="FullName"
                    item-value="id"
                    :label="$t('Direct manager')"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="data.directmanagers[0].level"
                    :items="levels"
                    item-text="text"
                    item-value="value"
                    :label="$t('level')"
                    outlined
                    required
                  />
                </v-col>
                <!--  -->
                <v-btn class="mx-1" fab dark color="indigo">
                  <v-icon dark> mdi-plus </v-icon>
                </v-btn>
              </v-row>
            </div>
            <div>
              <span class="mt-6">Authorization areas.</span>
              <v-row>
                <v-col cols="12" md="4" mt="4">
                  <v-select
                    v-model="data.city_id"
                    :items="cityList"
                    item-text="name"
                    item-value="id"
                    :label="$t('City')"
                    outlined
                    required
                    @change="getarea(data.city_id)"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="data.areas"
                    :items="areaList"
                    item-text="name"
                    item-value="id"
                    :label="$t('aree')"
                    multiple
                    outlined
                    required
                  />
                </v-col>
              </v-row>
            </div>
            <v-row class="mx-md-16 px-md-16">
              <!-- <v-col sm="6">
                <v-text-field
                  v-model="data.full_name"
                  :label="$t('FullName')"
                  color="green"
                  outlined
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.first_name"
                  :label="$t('FirstName')"
                  color="green"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.last_name"
                  :label="$t('LastName')"
                  color="green"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.nationalId"
                  :label="$t('nationalId')"
                  color="green"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.buisness_mobile"
                  :label="$t('Bussniess Mobile')"
                  color="green"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.private_mobile"
                  :label="$t('Private Mobile')"
                  color="green"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.email"
                  :label="$t('email')"
                  color="green"
                  :rules="[rules.required, rules.email]"
                  outlined
                  required
                />
              </v-col> -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.password"
                  :label="$t('password')"
                  color="green"
                  outlined
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.c_password"
                  :label="$t('conferm password')"
                  color="green"
                  outlined
                  required
                />
              </v-col>
              <!-- <v-col cols="12" md="6">
                <v-text-field
                  v-model="data.code"
                  :label="$t('Code')"
                  color="green"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">

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
                      v-model="data.start_date"
                      :label="$t('StartDate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="data.start_date"
                    :active-picker.sync="activePicker"
                    :max="
                      new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                    "
                    min="1950-01-01"
                    @change="save"
                  ></v-date-picker>
                </v-menu>
              </v-col> -->
              <!-- <v-avatar color="orange" size="62">
                <v-col v-if="data.image" cols="12" md="6">
                  <img :src="data.image" alt="logo" width="100" />
                </v-col>
                <v-file-input
                  show-size
                  outlined
                  color="green"
                  label="upload Logo"
                  placeholder="upload Logo"
                  prepend-icon="mdi-camera"
                  accept="image/png, image/jpeg, image/bmp"
                  truncate-length="15"
                  @change="onNewLogoSelected"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="green">
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-avatar> -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.company_id"
                  :items="CompaniesList"
                  item-text="name"
                  item-value="id"
                  :label="$t('company')"
                  outlined
                  required
                />
              </v-col> -->

              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.category_id"
                  :items="categoriesList"
                  item-text="name"
                  item-value="id"
                  :label="$t('categories')"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.jobtitle_id"
                  :items="jobTitlsList"
                  item-text="name"
                  item-value="id"
                  :label="$t('jobTitl')"
                  multiple
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.department_id"
                  :items="DepartmentsList"
                  item-text="name"
                  item-value="id"
                  :label="$t('department')"
                  multiple
                  outlined
                  required
                />
              </v-col> -->
              <!--  -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.directmanagers[0].manager_id"
                  :items="usersList"
                  item-text="FullName"
                  item-value="id"
                  :label="$t('Direct manager')"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.directmanagers[0].level"
                  :items="levels"
                  item-text="text"
                  item-value="value"
                  :label="$t('level')"
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.city_id"
                  :items="cityList"
                  item-text="name"
                  item-value="id"
                  :label="$t('City')"
                  multiple
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.areas"
                  :items="areaList"
                  item-text="name"
                  item-value="id"
                  :label="$t('aree')"
                  multiple
                  outlined
                  required
                />
              </v-col> -->
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="data.roles"
                  :items="rolesList"
                  item-text="name"
                  item-value="id"
                  :label="$t('roles')"
                  multiple
                  outlined
                  required
                />
              </v-col> -->
            </v-row>
            <!-- ////////////////////// -->
            <!-- <div>
              <span class="mt-6">Direct Manger</span>
              <v-row
                v-for="(manger, index) of data.directmanagers"
                :key="index"
              >
                <v-col cols="12" md="4" mt="4">
                  <v-select
                    v-model="manger.manager_id"
                    :items="usersList"
                    item-text="FullName"
                    item-value="id"
                    :label="$t('Direct manager')"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="manger.level"
                    :items="levels"
                    item-text="text"
                    item-value="value"
                    :label="$t('level')"
                    outlined
                    required
                  />
                </v-col>
                <v-btn class="mx-1" fab dark color="indigo" @click="makeRows()">
                  <v-icon dark> mdi-plus </v-icon>
                </v-btn>
              </v-row>
            </div> -->
            <!--//////////////////////////////////////  -->

            <!-- <v-col
      cols="11"
      sm="3"
    >
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
          <v-btn
            text
            color="primary"
            @click="from = false"
          >
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

      </v-col>


<v-col
      cols="11"
      sm="3"
    >
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
          <v-btn
            text
            color="primary"
            @click="to = false"
          >
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
          <v-card
                max-width="344"
                 outlined>
               <v-row  class=" mx-auto py-2 pa-0" cols="12" md="6">
            <v-checkbox v-for="(day, index) in days" class="pa-2"
            :key="day + index"
            v-model="data.days"
            :label="day.name"
             :value="day.name"
                color="orange"
            ></v-checkbox>
            </v-row>
               </v-card>
         </v-col> -->
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
const CompanyService = ServiceFactory.get("companies");
const categoriesService = ServiceFactory.get("categories");
const departmentServices = ServiceFactory.get("department");
const jobTitleServices = ServiceFactory.get("jobTitle");
const cityServices = ServiceFactory.get("city");
const Services = ServiceFactory.get("users");
const rolesServices = ServiceFactory.get("roles");
const areaServices = ServiceFactory.get("area");

export default {
  name: "usersForm",
  data: (vm) => ({
    dataLoading: false,
    valid: false,
    data: {
      days: [],
      from: null,
      to: null,
      id: null,
      code: "",

      serial_mobile: "",
      email: "",
      first_name: "",
      last_name: "",
      full_name: "",
      start_date: null,
      password: "",
      c_password: "",
      city_id: "",
      areas: [],
      JobTitle: "",
      nationalId: "",
      buisness_mobile: "",
      Company: "",
      category_id: 0,
      jobtitle_id: 0,
      department_id: 0,
      company_id: "",
      private_mobile: "",
      arr: [],
      opj: {},
      image: null,
      id: null,
      title: "",
      description: "",
      directmanagers: [{ manager_id: 0, level: 0 }],
      // company_categories: [
      //   {company_id: 0, category_id:0}
      // ],
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
    levels: [
      { text: "Level 1", value: 1 },
      { text: "Level 2", value: 2 },
      { text: "Level 3", value: 3 },
      { text: "Level 4", value: 4 },
      { text: "Level 5", value: 5 },
      { text: "Level 6", value: 6 },
      { text: "Level 7", value: 7 },
      { text: "Level 8", value: 8 },
      { text: "Level 9", value: 9 },
      { text: "Level 10", value: 10 },
    ],
    show1: false,
    show2: false,
    Password: "Password",
    CompaniesList: [],
    categoriesList: [],
    DepartmentsList: [],
    jobTitlsList: [],
    usersList: [],
    cityList: [],
    rolesList: [],
    areaList: [],
    password: "",
    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
    from: false,
    to: false,
    activePicker: null,
    date: null,
    menu: false,
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
    this.getDepartments();
    this.getjobTitl();
    this.getusers();
    this.getcity();
    this.getarea();
    this.getroles();
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    confirm() {
      this.editDailog = true;
    },

    async submitForm() {
      const form = {
        image: this.image,
        full_name: this.data.full_name,
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        password: this.data.password,
        c_password: this.data.c_password,
        buisness_mobile: this.data.buisness_mobile,
        private_mobile: this.data.private_mobile,
        nationalId: +this.data.nationalId,
        company_id: +this.data.company_id,
        category_id: +this.data.category_id,
        department_id: +this.data.department_id,
        jobtitle_id: +this.data.jobtitle_id,
        start_date: this.data.start_date,
        code: this.data.code,
        serial_mobile: this.data.serial_mobile,
        email: this.data.email,
        city_id: +this.data.city_id,
        areas: this.data.areas,
        roles: this.data.roles,
        from: this.data.from,
        to: this.data.to,
        days: this.data.days,
        directmanagers: [
          {
            manager_id: +this.data.directmanagers[0].manager_id,
            level: +this.data.directmanagers[0].level,
          },
        ],
        // JobTitle: this.data.JobTitle,
        // Department: this.data.Department,

        // company_categories: [
        //   {company_id: this.data.company_categories[0].company_id, categories: this.data.company_categories[0].category_id}
        // ],
      };
      console.log(form);
      const formData = new FormData();
      /**
       * ? converting the json object to a form-data format
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
          this.$router.push("/users");
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
        image: this.image,
        full_name: this.data.full_name,
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        password: this.data.password,
        c_password: this.data.c_password,
        buisness_mobile: this.data.buisness_mobile,
        private_mobile: this.data.private_mobile,
        nationalId: +this.data.nationalId,
        company_id: +this.data.company_id,
        category_id: +this.data.category_id,
        department_id: +this.data.department_id,
        jobtitle_id: +this.data.jobtitle_id,
        start_date: this.data.start_date,
        code: this.data.code,
        serial_mobile: this.data.serial_mobile,
        email: this.data.email,
        city_id: +this.data.city_id,
        areas: this.data.areas,
        roles: this.data.roles,
        from: this.data.from,
        to: this.data.to,

        directmanagers: [
          {
            manager_id: +this.data.directmanagers[0].manager_id,
            level: this.data.directmanagers[0].level,
          },
        ],
        password: this.password,
        _method: "put",
      };
      const formData = new FormData();
      /**
       * ? converting the json object to a form-data format
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
          this.$router.push("/users");
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
    async getDepartments(id) {
      const data = await departmentServices.getDepartmentByCompanyId(id);
      this.DepartmentsList = data.data;
    },
    async getjobTitl(id) {
      const data = await jobTitleServices.getjobtitlByDepartmentId(id);
      this.jobTitlsList = data.data;
    },

    async getusers() {
      const data = await Services.getAllItems();
      this.usersList = data.data;
      console.log(this.usersList);
    },
    async getcity() {
      const data = await cityServices.getAllItems();
      this.cityList = data.data;
    },
    async getroles() {
      const data = await rolesServices.getAllItems();
      this.rolesList = data.data;
    },

    async getarea(cityId) {
      const data = await areaServices.getAreaByCity(cityId);
      this.areaList = data.data;
    },
    onNewLogoSelected(event) {
      this.image = event;
    },
    //  makeRows(){
    //  let row = [];
    //  let i,l, chunkSize = this.rowSize;

    //  for (i=0,l=this.images.length; i<l; i+=chunkSize) {
    //    row.push(this.images.slice(i,i+chunkSize));

    //  }
    //  return row;
    //  }
    // makeRows() {
    //   this.directmanagers.push({ manager_id: 0, level: 0 });

    //   // arr2= this.data.directmanagers;
    //   for (index = 0; index < this.data.directmanagers.length; index++) {
    //     opj = this.data.directmanagers[index];

    //     arr.push(opj);
    //   }
    //   return arr;
    // },
  },
};
</script>
<style>
.v-text-field__details {
  display: none;
}
a {
  text-decoration: none;
}
.v-messages {
  display: none;
}
</style>
