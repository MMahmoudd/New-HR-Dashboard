<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    clipped
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <v-list>
      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        />

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState } from "vuex";

export default {
  name: "DashboardDrawer",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },

  data: (vm) => ({
    expand: false,
    permissions: [],
    sidebarList: [
      {
        title: vm.$t("Dashboard"),
        to: "/Dashboar",
      },
      {
        title: vm.$t("sidebar.companyStructure"),
        icon: "fa-signal-3",
        role: true,
        children: [
          {
            title: vm.$t("CompanyStructure.Companies"),
            to: "/Companies",
          },
          {
            title: vm.$t("CompanyStructure.Departments"),
            to: "/Department",
          },
          {
            title: vm.$t("CompanyStructure.JobTitles"),
            to: "/JobTitle",
          },
          {
            title: vm.$t("CompanyStructure.Categories"),
            to: "/Categories",
          },
          {
            title: vm.$t("Employees"),
            to: "/users",
          },
        ],
      },
      //Administrator
      {
        title: vm.$t("sidebar.Administrator"),
        icon: "fa-map-marker-alt",
        role: true,
        children: [
          {
            title: vm.$t("sidebar.roles"),
            to: "/roles",
          },
          {
            title: vm.$t("sidebar.Time"),
            to: "/Time",
          },
        ],
      },

      {
        title: vm.$t("sidebar.location"),
        icon: "fa-map-marker-alt",
        role: true,
        children: [
          {
            title: vm.$t("sidebar.cities"),
            to: "/Cities",
          },
          {
            title: vm.$t("sidebar.areas"),
            to: "/Areas",
          },
        ],
      },
      {
        title: vm.$t("HRSpace"),
        icon: "fa-map-marker-alt",
        role: true,
        children: [
          {
            title: vm.$t("news.news"),
            to: "/news",
          },
          {
            title: vm.$t("Policies.Policies"),
            to: "/policies",
          },
          {
            title: vm.$t("faqs"),
            to: "/faqs",
          },
        ],
      },
      // report
      {
        title: vm.$t("sidebar.Reports"),
        icon: "fa-map-marker-alt",
        role: true,
        children: [
          {
            title: vm.$t("Main.MainReport"),
            to: "/MainReport",
          },
          {
            title: vm.$t("Vacation"),
            to: "/Vacation",
          },
          {
            title: vm.$t("Execuses.Execuses"),
            to: "/execuses",
          },
          {
            title: vm.$t("Mission.MissionReport"),
            to: "/Mission",
          },
          {
            title: vm.$t("sidebar.Signin-out"),
            to: "/Signin-out",
          },
          {
            title: vm.$t("ERP Report"),
            to: "/ERPReport",
          },

          {
            title: vm.$t("sidebar.ReportingTo"),
            to: "/ReportingTo",
          },
          {
            title: vm.$t("penaltyReport"),
            to: "/penaltyReport",
          },
          {
            title: vm.$t("All in one report"),
            to: "/allReport",
          },
          {
            title: vm.$t("Summary Report"),
            to: "/Summary",
          },
          {
            title: vm.$t("Absence Report "),
            to: "/absenceRebort",
          },
          {
            title: vm.$t("sidebar.TopManagement"),
            to: "/TopManagement",
          },
        ],
      },
    ],
  }),
  computed: {
    ...mapState(["barColor"], {}),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    computedItems() {
      return this.sidebarList.map(this.mapItem);
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("avatar"),
      };
    },
  },
  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      };
    },
  },
};
</script>

<style lang="scss">
@import "../sass/variables.scss";
@import "~vuetify/src/styles/tools/_rtl.sass";
.v-navigation-drawer {
  background-color: $bg-sideBar;
  .v-list-group--sub-group .v-list-group__header {
    color: #fff !important;
    padding-left: 0;
  }
  .v-list-group--no-action > .v-list-group__items > .v-list-item {
    color: white;
    padding-left: 50px !important;
  }
  .v-list-item {
    padding: 0 8px;
  }
  .v-icon.v-icon {
    color: white;
  }
  .v-list .v-list-item--active {
    color: #fff;
    background-color: unset !important;
    .v-list-item__content {
      color: #ff9846;
    }
  }
  .v-list-item__content {
    color: #fff;
    text-align: center;
  }
  .v-list-group__items .v-list-item .v-list-item__icon {
    display: none;
  }
  .v-list-group
    .v-list-group__header
    .v-list-item__icon.v-list-group__header__append-icon {
    min-width: unset !important;
  }
}
</style>
