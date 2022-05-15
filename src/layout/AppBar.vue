<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    height="70"
    flat
    clipped-left
    fixed
  >
    <v-container
      fluid
      class="justify-content-center"
    >
      <v-row class="d-flex justify-space-between align-center">
        <v-col
          cols="3"
          lg="2"
        >
          <v-btn
            class="btn-drawer"
            @click="setDrawer(!drawer)"
          >
            <v-avatar>
              <v-img
                width="100"
                src="../assets/Logos/hr-white@2x.png"
              />
            </v-avatar>
          </v-btn>
        </v-col>
        <v-col
          lg="3"
          cols="3"
          class="align-content-center"
        >
          <v-text-field
            :label="$t('actions.search')"
            type="search"
            append-icon="mdi-magnify"
            filled
            rounded
            dense
            hide-details
          />
        </v-col>
        <v-menu
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <h5
              class="px-2"
              outlined
              color="#fff"
              v-bind="attrs"
              v-on="on"
            >
              {{ selected }}
              <v-icon
                class="px-2"
                color="#fff"
              >
                fa-globe
              </v-icon>
            </h5>
          </template>
          <v-list>
            <v-list-item>
              <v-btn
                v-model="selected"
                class="m-auto"
                text
                plain
                @click="changeLang('ar')"
              >
                {{ $t('lang.ar') }}
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                v-model="selected"
                class="m-auto"
                text
                plain
                @click="changeLang('en')"
              >
                {{ $t('lang.en') }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-col
          cols="1"
          lg="1"
          class="text-center"
        />
        <v-col
          cols="1"
          lg="1"
          class="text-center"
        >
          <v-badge
            bottom
            dot
            color="green"
            overlap
          >
            <v-menu
              bottom
              offset-y
              min-width="200"
              nudge-bottom="15"
              eager
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-avatar>
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="John"
                      height="100"
                    >
                  </v-avatar>
                </v-btn>
              </template>
              <v-list>
                <v-list-item link>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      John Leider
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      john@vuetifyjs.com
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider />
              <v-list dense>
                <v-list-item link>
                  <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item>
                <v-list-item
                  link
                  @click="logout()"
                >
                  <v-list-item-icon>
                    <v-icon>fa-sign-out-alt</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title>{{ $t('navbar.logout') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-badge>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'DashboardAppBar',

    components: {},

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      items: [{ title: 'profile' }, { title: 'logout' }],
      selected: '',
      Languages: [
        { text: 'AR' },
        { text: 'EN' },
      ],
    }),

    computed: {
      ...mapState(['drawer']),
    },
    created () {
      if (localStorage.getItem('userLang')) {
        const userLang = localStorage.getItem('userLang')
        console.log('userLang :>> ', userLang)
        this.selected = userLang
        userLang === 'ar' ? (this.$vuetify.rtl = true) : (this.$vuetify.rtl = false)
      } else {
        localStorage.setItem('userLang', 'en')
      }
    },

    methods: {
      selectedLang () {
        if (this.selected.text === 'EN') {
          this.changeLang('en')
        } else if (this.selected.text === 'AR') {
          this.changeLang('ar')
        }
      },
      changeLang (value) {
        localStorage.setItem('userLang', value)
        window.location.reload()
      },
      changeLTR () {
        this.$vuetify.rtl = false
      },
      changeRTL () {
        this.$vuetify.rtl = true
      },
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      logout () {
        this.$store.commit('logout')
      },
    },
  }
</script>

<style lang="scss">
@import "../sass/variables.scss";
.v-app-bar {
  background: $bg-appBar;
  position: fixed !important;
  .col {
    align-self: center;
  }
    .btn-drawer{
    background-color: transparent !important;
    border:none;
    width: 80px !important;
    height: 80px !important;
    border-radius: 50%;
    box-shadow: none;
    text-align: center;
    padding: unset !important;
    img{
      text-align: center;
      margin: auto;
      height: 100%;
      width: 100%;
    }
  }
  .v-image {
    margin-left: 40px;
  }
  .v-select {
    background-color: transparent !important;
    width: 40% !important;
  }
  .v-input {
    border-radius: 20px;
    width: 400px;
    background-color: #ffffff50;
    .v-label {
      font-size: 20px;
      opacity: 0.6;
      color: #ffffff;
    }
    .v-icon {
      opacity: 0.6;
      color: #ffffff;
    }
  }
}
  .v-toolbar{
    right: 0 !important;
  }
</style>
