import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/destination/:slug',
    name: 'DestinationDetails',
    props: true,
    component: () =>
      import(/* webpackChunkName: "DestinationDetails" */ '../views/DestinationDetails.vue'),
    children: [
      {
        path: ':experienceSlug',
        name: 'experienceDetails',
        props: true,
        component: () =>
          import(/* webpackChunkName: "ExperienceDetails" */ '../views/ExperienceDetails.vue')
      }
    ],
    beforeEnter: (to, from, next) => {
      const exists = store.destinations.find(
        destination => destination.slug === to.params.slug
      )
      if (exists) {
        next()
      } else {
        next({ name: 'notFound' })
      }
    }
  },
  {
    path: '/UserView',
    name: 'UserView',
    component: () =>
      import(/* webpackChunkName: "User" */ '../views/UserView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/LoginView',
    name: 'LoginView',
    component: () =>
      import(/* webpackChunkName: "Login" */ '../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkExactActiveClass: 'travel-active-class',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      const position = {}
      if (to.hash) {
        position.selector = to.hash
        if (to.hash === '#experience') {
          position.offset = { y: 140 }
        }
        if (document.querySelector(to.hash)) {
          return position
        }

        return false
      }
    }
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.user) {
      next({
        name: 'LoginView',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
