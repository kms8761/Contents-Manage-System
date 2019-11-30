import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/media',
      name: 'media',
      component: () => import( './views/Media.vue')
    },
    {
      path: '/trashbin',
      name: 'trashbin',
      component: () => import( './views/TrashBin.vue')
    },
    {
      path: '/mydevice',
      name: 'mydevice',
      component: () => import( './views/mydevice.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/board',
      name: 'board',
      component: () => import( './views/Board.vue')
    },
    {
      path: '/company',
      name: 'company',
      component: () => import( './views/company.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import( './views/Profile.vue')
    },
    {
      path: '/campaign',
      name: 'Campaign',
      component: () => import( './views/Campaign.vue')
    },
    {
      path: '/userManagement',
      name: 'userManagement',
      props:true,
      component: () => import( '@/components/userComponents/userManagement.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      props:true,
      component: () => import( '@/components/mydevice/statistics.vue')
    },
   
    {
      path: '*',
      name: 'e404',
      component: () => import( './views/e404.vue')
    },
  ]
})
