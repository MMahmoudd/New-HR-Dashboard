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
        // Home
        {
          name: 'Statistics',
          path: '/',
          component: () => import('@/views/dashboard/Statistics'),
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
