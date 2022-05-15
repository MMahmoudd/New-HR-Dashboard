<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card class="py-5">
      <v-card-title>
        {{ this.$route.params.id ? $t('jobTitles.editJob') : $t('jobTitles.addJob') }}
      </v-card-title>
      <template>
        <v-form
          v-model="valid"
          @submit.prevent="submitForm()"
        >
          <v-container fluid>
            <v-row class="mx-md-16 px-md-16">
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="data.name"
                  :label="$t('departments.Name')"
                  color="green"
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="data.companies"
                  :items="CompaniesList"
                  item-text="name"
                  item-value="id"
                  :label="$t('departments.company')"
                  multiple
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="data.department_id"
                  :items="DepartmentList"
                  item-text="name"
                  item-value="id"
                  :label="$t('departments.department')"
                  outlined
                  required
                />
              </v-col>
            </v-row>
            <v-btn
              type="submit"
              class="mx-auto my-auto d-flex"
              color="green"
              :loading="loading"
              :disabled="disabled"
            >
              {{ this.$route.params.id ? $t('actions.save') : $t('actions.add') }}
            </v-btn>
          </v-container>
        </v-form>
      </template>
    </v-card>
    <v-dialog
      v-model="editDailog"
      width="500"
    >
      <v-card
        class="text-center"
      >
        <base-material-card
          :title="$t('actions.UpdateConfirmation')"
          color="green"
          class="pt-12"
        >
          <v-card-text class="mt-2">
            {{ $t('actions.areYouSureToUpdate') }}
            <v-text-field
              v-model="password"
              :type="show1 ? 'text' : 'password'"
              :append-icon="
                show1 ? 'mdi-lock-outline' : 'mdi-lock-outline'
              "
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
              {{ $t('actions.save') }}
            </v-btn>
            <v-btn
              color="error"
              text
              @click="editDailog = false"
            >
              {{ $t('actions.close') }}
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
  import { ServiceFactory } from '../../../../services/serviceFactory'
  const CompanyService = ServiceFactory.get('companies')
  const DepartmentServices = ServiceFactory.get('department')
  const Services = ServiceFactory.get('jobTitle')
  export default {
    name: 'CompanyForm',
    data: (vm) => ({
      dataLoading: false,
      valid: false,
      data: {
        id: null,
        name: '',
        companies: [],
        department_id: '',
      },
      CompaniesList: [],
      DepartmentList: [],
      password: '',
      show1: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Min 8 characters',
      },
      logo: null,
      editDailog: false,
      successSnackbar: false,
      errorSnackbar: false,
      timeout: 3000,
      successMessage: '',
      errorMessage: '',
      loading: false,
      disabled: false,
      confirmLoading: false,
      confirmDisabled: false,
    }),
    created () {
      if (this.$route.params.id) {
        this.fetchOneItem(this.$route.params.id)
      }
      this.getCompanies()
      this.getDepartment()
    },
    methods: {
      confirm () {
        this.editDailog = true
      },
      async  submitForm () {
        const ids = this.data.companies.map(item => {
          if (item.id) {
            return item.id
          } else {
            return item
          }
        })
        const form = {
          name: this.data.name,
          companies: ids,
          department_id: this.data.department_id,
        }
        const formData = new FormData()
        /**
         * ? converting the json object to a form-data format
         */
        function buildFormData (formData, data, parentKey) {
          if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
              buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
            })
          } else {
            const value = data == null ? '' : data

            formData.append(parentKey, value)
          }
        }

        buildFormData(formData, form)
        if (this.$route.params.id) {
          this.confirm()
        } else {
          this.loading = true
          this.disabled = true
          this.newItem(formData)
        }
      },
      async newItem (data) {
        const item = await Services.addItem(data)
        console.log('new Item item', item)
        if (item.status === 200) {
          this.successMessage = 'Successful'
          this.successSnackbar = true
          setTimeout(() => {
            this.$router.push('/JobTitle')
          }, 1500)
        } else {
          this.errorMessage = item
          this.errorSnackbar = true
        }
        this.loading = false
        this.disabled = false
      },
      async updateContent () {
        const ids = this.data.companies.map(item => {
          if (item.id) {
            return item.id
          } else {
            return item
          }
        })
        const form = {
          name: this.data.name,
          companies: ids,
          department_id: this.data.department_id,
          password: this.password,
          _method: 'put',
        }
        const formData = new FormData()
        /**
         * ? converting the json object to a form-data format
         */
        function buildFormData (formData, data, parentKey) {
          if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
              buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
            })
          } else {
            const value = data == null ? '' : data

            formData.append(parentKey, value)
          }
        }

        buildFormData(formData, form)
        const item = await Services.updateItem(this.$route.params.id, formData)
        if (item.status === 200) {
          this.editDailog = false
          this.successMessage = 'Successful'
          this.successSnackbar = true
          setTimeout(() => {
            this.$router.push('/JobTitle')
          }, 1500)
        } else {
          this.editDailog = false
          this.errorMessage = item
          this.errorSnackbar = true
        }
        this.loading = false
        this.disabled = false
      },
      async fetchOneItem (id) {
        this.dataLoading = true
        const item = await Services.fetchOneItem(id)
        console.log('item.data :>> ', item.data)
        this.data = item.data
        this.dataLoading = false
      },
      async getCompanies () {
        const data = await CompanyService.getAllItems()
        this.CompaniesList = data.data
      },
      async getDepartment () {
        const data = await DepartmentServices.getAllItems()
        this.DepartmentList = data.data
      },
    },
  }
</script>
<style>
a{
  text-decoration: none;
}
</style>
