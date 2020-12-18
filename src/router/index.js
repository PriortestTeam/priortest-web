import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/feature',
    component: Layout,
    redirect: '/feature',
    children: [{
      path: 'feature',
      name: 'Feature',
      component: () => import('@/views/feature/index'),
      meta: { title: 'Feature', icon: 'Feature' }
    }]
  },
  {
    path: '/sprint',
    component: Layout,
    redirect: '/sprint',
    children: [{
      path: 'sprint',
      name: 'Sprint',
      component: () => import('@/views/sprint/index'),
      meta: { title: 'Sprint', icon: 'Sprint' }
    }]
  },
  {
    path: '/testcase',
    component: Layout,
    redirect: '/testcase',
    children: [{
      path: 'testcase',
      name: 'TestCase',
      component: () => import('@/views/testcase/index'),
      meta: { title: 'TestCase', icon: 'TestCase' }
    }]
  },
  {
    path: '/testcycle',
    component: Layout,
    redirect: '/testcycle',
    children: [{
      path: 'testcycle',
      name: 'TestCycle',
      component: () => import('@/views/testcycle/index'),
      meta: { title: 'TestCycle', icon: 'TestCycle' }
    }]
  },
  {
    path: '/issue',
    component: Layout,
    redirect: '/issue',
    children: [{
      path: 'issue',
      name: 'Issue',
      component: () => import('@/views/issue/index'),
      meta: { title: 'Issue', icon: 'Issue' }
    }]
  },
  {
    path: '/signoff',
    component: Layout,
    redirect: '/signoff',
    children: [{
      path: 'signoff',
      name: 'SignOff',
      component: () => import('@/views/signoff/index'),
      meta: { title: 'SignOff', icon: 'SignOff' }
    }]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project',
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/index'),
        meta: { title: 'Project', icon: 'Project' }
      },
      {
        path: 'manageproject',
        name: 'Manageproject',
        component: () => import('@/views/project/manageProject'),
        meta: {
          title: 'Project', icon: 'Project',
        }
      },
      {
        path: 'manageview',
        name: 'Manageview',
        component: () => import('@/views/project/manageView'),
        meta: {
          title: 'Project', icon: 'Project',
        }
      },
      {
        path: 'addproject',
        name: 'Addproject',
        component: () => import('@/views/project/addProject'),
        meta: {
          title: 'Project', icon: 'Project',
          noCache: true //会被缓存
        },
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  {
    path: '/publicview',
    component: Layout,
    redirect: '/publicview',
    children: [{
      path: 'customfiled',
      name: 'Customfiled',
      component: () => import('@/views/publicView/customFiled'),
      meta: { title: 'customfiled', icon: 'SignOff' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
