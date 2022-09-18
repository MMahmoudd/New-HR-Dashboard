import Vue from 'vue'
import Router from 'vue-router'
// import axios from 'axios'

Vue.use(Router)

function isIModuleHasPermissions (userPermissions, role) {
  for (var key in userPermissions) {
      if (userPermissions[key] === role) {
          return true
      }
  }
  return false
}

function routerGuard (to, from, next) {
  const userData = localStorage.getItem('userDataPermission')
  const permations = userData
  if (permations) {
    if (permations.length < 1) {
      return next('/Login')
    }
    if (to.meta.role) {
      if (isIModuleHasPermissions(permations, to.meta.role)) {
        return next()
      }
      return next('/notAuthorized')
    } else {
      return next()
    }
  }
  return next()
}
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // Login
    {
      name: 'Login',
      path: '/Login',
      component: () => import('@/pages/Login'),
    },
    {
      path: '/',
      beforeEnter: routerGuard,
      meta: { requiresAuth: true },
      redirect: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [

        {
          name: 'Statistics',
          path: '/',
          component: () => import('@/views/dashboard/Dashboar/List.vue'),
          meta: { requiresAuth: true },
        },
        // Company
        {
          name: 'Company',
          path: '/Companies',
          component: () => import('@/views/dashboard/company-structure/companies/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },

        {
          name: 'Company Form',
          path: '/CompanyForm/:id?',
          component: () => import('@/views/dashboard/company-structure/companies/form.vue'),
          meta: { requiresAuth: true },
        },
        // Department
        {
          name: 'Department',
          path: '/Department',
          component: () => import('@/views/dashboard/company-structure/department/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'Department Form',
          path: '/DepartmentForm/:id?',
          component: () => import('@/views/dashboard/company-structure/department/form.vue'),
          meta: { requiresAuth: true },
        },
        // Job Title
        {
          name: 'Job Title',
          path: '/JobTitle',
          component: () => import('@/views/dashboard/company-structure/jobTitle/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'job Title Form',
          path: '/JobTitleForm/:id?',
          component: () => import('@/views/dashboard/company-structure/jobTitle/form.vue'),
          meta: { requiresAuth: true },
        },
        // Categories
        {
          name: 'Categories',
          path: '/Categories',
          component: () => import('@/views/dashboard/company-structure/Categories/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'Categories Form',
          path: '/CategoriesForm/:id?',
          component: () => import('@/views/dashboard/company-structure/Categories/form.vue'),
          meta: { requiresAuth: true },
        },
        // Employees
        {
          name: 'users',
          path: '/users',
          component: () => import('@/views/dashboard/company-structure/users/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'users Form',
          path: '/usersForm/:id?',
          component: () => import('@/views/dashboard/company-structure/users/form.vue'),
          meta: { requiresAuth: true },
        },
        // Administrator
        {
          name: 'roles',
          path: '/roles',
          component: () => import('@/views/dashboard/Administrator/roles/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'roles Form',
          path: '/rolesForm/:id?',
          component: () => import('@/views/dashboard/Administrator/roles/form.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Time',
          path: '/Time',
          component: () => import('@/views/dashboard/Administrator/Time/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        //Time
        {
          name: 'Time Form',
          path: '/TimeForm/:id?',
          component: () => import('@/views/dashboard/Administrator/Time/form.vue'),
          meta: { requiresAuth: true },
        },
        // dash
        {
          name: 'Dashboar',
          path: '/Dashboar',
          component: () => import('@/views/dashboard/Dashboar/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        // Cities
        {
          name: 'Cities',
          path: '/Cities',
          component: () => import('@/views/dashboard/location/city/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'Cities Form',
          path: '/CitiesForm/:id?',
          component: () => import('@/views/dashboard/location/city/form.vue'),
          meta: { requiresAuth: true },
        },
        // Areas
        {
          name: 'Areas',
          path: '/Areas',
          component: () => import('@/views/dashboard/location/area/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'Areas Form',
          path: '/AreasForm/:id?',
          component: () => import('@/views/dashboard/location/area/form.vue'),
          meta: { requiresAuth: true },
        },
        // hr-space
        // HRRequests
        {
          name: 'news',
          path: '/news',
          component: () => import('@/views/dashboard/hr-space/news/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'news Form',
          path: '/newsForm/:id?',
          component: () => import('@/views/dashboard/hr-space/news/form.vue'),
          meta: { requiresAuth: true },
        },
        // Policies
        {
          name: 'policies',
          path: '/policies',
          component: () => import('@/views/dashboard/hr-space/policies/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },

        {
          name: 'policies Form',
          path: '/policiesForm/:id?',
          component: () => import('@/views/dashboard/hr-space/policies/form.vue'),
          meta: { requiresAuth: true },
        },
        // report
        {
          name: 'ReportingTo',
          path: '/ReportingTo',
          component: () => import('@/views/dashboard/Reports/ReportingTo/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },

        {
          name: 'ReportingTo',
          path: '/ReportingToForm/:id?',
          component: () => import('@/views/dashboard/Reports/ReportingTo/form.vue'),
          meta: { requiresAuth: true },
        },
        // erprebport
        {
          name: 'ERPReport',
          path: '/ERPReport',
          component: () => import('@/views/dashboard/Reports/ERPReport/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },

        {
          name: 'ERPReport',
          path: '/ERPReport/:id?',
          component: () => import('@/views/dashboard/Reports/ERPReport/form.vue'),
          meta: { requiresAuth: true },
        },
        // main rebort
        {
          name: 'Main Report',
          path: '/MainReport',
          component: () => import('@/views/dashboard/Reports/MainReport/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },

        {
          name: 'Main Report',
          path: '/MainReportForm/:id?',
          component: () => import('@/views/dashboard/Reports/MainReport/form.vue'),
          meta: { requiresAuth: true },
        },
        // execuses
        {
          name: 'execuses',
          path: '/execuses',
          component: () => import('@/views/dashboard/Reports/execuses/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },

        {
          name: 'execuses',
          path: '/execusesForm/:id?',
          component: () => import('@/views/dashboard/Reports/execuses/form.vue'),
          meta: { requiresAuth: true },
        },
        // Vacation
        {
          name: 'Vacation',
          path: '/Vacation',
          component: () => import('@/views/dashboard/Reports/Vacation/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },

        {
          name: 'Vacation',
          path: '/VacationForm/:id?',
          component: () => import('@/views/dashboard/Reports/Vacation/form.vue'),
          meta: { requiresAuth: true },
        },
        // Mission
        {
          name: 'Mission',
          path: '/Mission',
          component: () => import('@/views/dashboard/Reports/Mission/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'Mission',
          path: '/MissionForm/:id?',
          component: () => import('@/views/dashboard/Reports/Mission/form.vue'),
          meta: { requiresAuth: true },
        },
        // Signin-out
        {
          name: 'Signin-out',
          path: '/Signin-out',
          component: () => import('@/views/dashboard/Reports/Signin-out/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'Signin-out',
          path: '/Signin-outForm/:id?',
          component: () => import('@/views/dashboard/Reports/Signin-out/form.vue'),
          meta: { requiresAuth: true },
        },
        // panle rebort
      {
          name: 'penaltyReport',
          path: '/penaltyReport',
          component: () => import('@/views/dashboard/Reports/penaltyReport/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },


  // allReport
         {
          name: 'allReport',
          path: '/allReport',
          component: () => import('@/views/dashboard/Reports/allReport/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
         // allReport
         {
          name: 'Summary',
          path: '/Summary',
          component: () => import('@/views/dashboard/Reports/Summary/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
          // absenceRebort
         {
          name: 'absenceRebort',
          path: '/absenceRebort',
          component: () => import('@/views/dashboard/Reports/absenceRebort/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        // top_management_users

        {
          name: 'topmanagement',
          path: '/topmanagement',
          component: () => import('@/views/dashboard/Reports/topmanagement/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'topmanagement',
          path: '/topmanagementForm/:id?',
          component: () => import('@/views/dashboard/Reports/topmanagement/form.vue'),
          meta: { requiresAuth: true },
        },

         // faqs
        {
          name: 'faqs',
          path: '/faqs',
          component: () => import('@/views/dashboard/hr-space/faqs/List.vue'),
          meta: { requiresAuth: true },
          beforeEnter: routerGuard,
        },
        {
          name: 'faqs Form',
          path: '/faqsForm/:id?',
          component: () => import('@/views/dashboard/hr-space/faqs/form.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/notAuthorized',
          name: 'notAuthorized',
          component: () => import('../pages/NotAuthorized.vue'),
        },



        { path: '*', redirect: '/Login' },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth) {
    if (!token) {
      next({
        name: 'Login',
      })
    } else {
      return next()
    }
  } else {
    next()
  }
})
export default router
