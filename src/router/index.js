import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    redirect: '/'
  },
  {
    path: '/products/:id',
    name: 'Products',
    component: () => import(/* webpackChunkName: "about" */ '../views/Product.vue')
  },
  {
    path: '/products/add',
    name: 'Add',
    component: () => import(/* webpackChunkName: "about" */ '../views/Add.vue')
  },
  {
    path: '/products/:id/edit',
    name: 'Edit',
    component: () => import(/* webpackChunkName: "about" */ '../views/Modify.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
