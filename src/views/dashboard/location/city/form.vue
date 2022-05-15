<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card class="py-5">
      <v-card-title>
        {{ this.$route.params.id ? $t('city.edit') : $t('city.add') }}
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
                  :label="$t('city.name')"
                  color="green"
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
  const Services = ServiceFactory.get('city')
  export default {
    name: 'CompanyForm',
    data: (vm) => ({
      dataLoading: false,
      valid: false,
      data: {
        id: null,
        name: '',
      },
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
    },
    methods: {
      confirm () {
        this.editDailog = true
      },
      onNewLogoSelected (event) {
        this.logo = event
      },
      async  submitForm () {
        const formData = new FormData()
        this.data.name && formData.append('name', this.data.name)

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
            this.$router.push('/Cities')
          }, 1500)
        } else {
          this.errorMessage = item
          this.errorSnackbar = true
        }
        this.loading = false
        this.disabled = false
      },
      async updateContent () {
        const formData = new FormData()
        this.data.name && formData.append('name', this.data.name)
        this.password && formData.append('password', this.password)
        formData.append('_method', 'put')
        const item = await Services.updateItem(this.$route.params.id, formData)
        if (item.status === 200) {
          this.editDailog = false
          this.successMessage = 'Successful'
          this.successSnackbar = true
          setTimeout(() => {
            this.$router.push('/Cities')
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
        this.data = item.data
        this.dataLoading = false
      },
    },
  }
</script>
<style>
a{
  text-decoration: none;
}
</style>
