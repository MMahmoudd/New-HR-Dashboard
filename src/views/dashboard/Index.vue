<template>
  <v-app>
    <dashboard-app-bar />

    <dashboard-drawer />

    <dashboard-view />
    <!-- <dashboard-core-settings /> -->
  </v-app>
</template>

<script>
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardAppBar: () => import('../../layout/AppBar.vue'),
      DashboardDrawer: () => import('../../layout/Drawer.vue'),
      DashboardView: () => import('../../layout/View.vue'),
    },

    data: () => ({
      expandOnHover: false,
    }),
  }
</script>
