<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        {{ $t('sidebar.areas') }}
        <v-spacer />
        <v-spacer />
        <v-btn
          class="mx-1 my-auto"
          color="indigo"
          :loading="loading"
          :disabled="disabled"
          @click="exportExel()"
        >
          {{ $t('actions.export') }}
        </v-btn>
        <router-link
          :to="{ path: '/AreasForm' }"
          color="primary"
        >
          <v-btn
            outlined
            class="mx-2"
            color="green"
          >
            {{ $t('actions.Add') }}
          </v-btn>
        </router-link>
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
        :server-items-length="total"
        :page-count="numberOfPages"
        :options.sync="options"
        @fetchAllItems="fetchAllItems"
      >
        <template
          v-if="selected.length >= 1"
          v-slot:top
        >
          <v-toolbar
            flat
          >
            <v-spacer />
            <v-tooltip
              bottom
            >
              <template
                v-slot:activator="{ on, attrs }"
              >
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
              {{ $t('actions.delete') }}
            </v-tooltip>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip
            bottom
          >
            <template
              v-slot:activator="{ on, attrs }"
            >
              <router-link
                :to="'/AreasForm/' + item.id"
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
        </template>

        <template
          v-slot:no-data
          loading
        >
          <p>{{ $t('actions.noData') }}</p>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="deleteDailog"
      width="500"
    >
      <v-card
        class="text-center"
      >
        <base-material-card
          :title="$t('actions.DeleteConfirmation')"
          color="error"
          class="pt-12"
        >
          <v-card-text class="mt-2">
            {{ $t('actions.areYouSureToDelete') }}
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
              color="red"
              text
              :loading="loading"
              :disabled="disabled || password.length <= 7"
              @click="deleteItem()"
            >
              {{ $t('actions.delete') }}
            </v-btn>
            <v-btn
              color="green"
              text
              @click="deleteDailog = false"
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
  import { ServiceFactory } from '../../../../services/serviceFactory'
  const Services = ServiceFactory.get('area')
  export default {
    name: 'Areas',
    data: (vm) => ({
      search: '',
      selected: [],
      dataLoading: false,
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      List: [],
      itemDetails: {},
      deleteDailog: false,
      loading: false,
      editedIndex: -1,
      successSnackbar: false,
      errorSnackbar: false,
      timeout: 3000,
      successMessage: '',
      errorMessage: '',
      disabled: false,
      password: '',
      show1: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Min 8 characters',
      },
      headers: [
        {
          text: vm.$t('city.id'),
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: vm.$t('area.name'), sortable: false, value: 'name' },
        { text: vm.$t('area.city'), sortable: false, value: 'city' },
        { text: vm.$t('area.latitude'), sortable: false, value: 'latitude' },
        { text: vm.$t('area.longitude'), sortable: false, value: 'longitude' },
        { text: vm.$t('actions.actions'), value: 'actions', sortable: false },
      ],
      filename: 'Areas',
      bookType: 'xlsx',
      autoWidth: true,
    }),

    watch: {
      options: {
        handler () {
          this.fetchAllItems()
        },
      },
    },
    methods: {
      confirmDeleteItem () {
        this.deleteDailog = true
      },
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const List = await Services.getAllItems(itemsPerPage, page, pageNumber)
        this.List = List.data
        this.total = List.meta.total
        this.numberOfPages = List.meta.current_page
        this.dataLoading = false
      },
      async deleteItem () {
        this.loading = true
        this.disabled = true
        const ids = []
        this.selected.forEach((item) => {
          ids.push(item.id)
        })
        const deleteItem = await Services.deleteItems(ids, this.password)
        if (deleteItem.status === 200) {
          this.deleteDailog = false
          this.successMessage = 'Delete Success'
          this.successSnackbar = true
          setTimeout(() => {
            this.selected.map(item => {
              this.editedIndex = this.List.indexOf(item)
              this.List.splice(this.editedIndex, 1)
            })
            this.selected = []
          }, 500)
        } else {
          this.errorMessage = deleteItem
          this.errorSnackbar = true
        }
        this.disabled = false
        this.loading = false
      },
      async exportExel () {
        this.loading = true
        const List = await Services.getAllItems()
        import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Area Name', 'City Name']
        const list = List.data.map(item => {
          return { name: item.name, city: item.city }
        })
        const data = this.formatJson(list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        })
        this.loading = false
      })
      },
      formatJson (jsonData) {
        return jsonData.map(v => {
          return Object.values(v)
        })
      },
    },
  }
</script>
<style>
a{
  text-decoration: none;
}
</style>
