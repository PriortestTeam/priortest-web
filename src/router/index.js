import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

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
  // {
  //   path: "/reRunCase",
  //   name: "reRunCase",
  //   component: () => import("@/views/testcycle/caseRun/reRunCase"),
  //   props: true,
  //   meta: {
  //     title: "Project",
  //     icon: "Project",
  //   },
  // },

  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  // 注册
  {
    path: "/activate",
    component: () => import("@/views/register/activate"),
    hidden: true,
  },
  // 忘记密码
  {
    path: "/findpwd",
    component: () => import("@/views/login/findpwd"),
    hidden: true,
  },
  // 忘记密码
  {
    path: "/deferred",
    component: () => import("@/views/login/deferred"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Welcome",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Welcome", icon: "dashboard" },
      },
      //  新增报表
      {
        path: "/addChart",
        name: "AddChart",
        component: () => import("@/views/dashboard/chartOperation/AddChart"),
        meta: { title: "AddChart" },
      },
    ],
  },
  {
    path: "/VersionManagement",
    component: Layout,
    redirect: "/VersionManagement",
    children: [
      {
        path: "VersionManagement",
        name: "VersionManagement",
        component: () => import("@/views/versionManagement/index"),
        meta: { title: "VersionManagement", icon: "Feature" },
      },
    ],
  },
  {
    path: "/feature",
    component: Layout,
    redirect: "/feature",
    children: [
      {
        path: "feature",
        name: "Feature",
        component: () => import("@/views/feature/index"),
        meta: { title: "Feature", icon: "Feature" },
      },
      {
        path: "addfeature",
        name: "Addfeature",
        component: () => import("@/views/feature/addFeature"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },
    ],
  },

  {
    path: "/projectManage",
    component: Layout,
    redirect: "/projectManage",
    children: [
      {
        path: "projectManage",
        name: "ProjectManage",
        component: () => import("@/views/projectManage/index"),
        meta: { title: "ProjectManage", icon: "ProjectManage" },
      },
      {
        path: "addproject",
        name: "Addproject",
        component: () => import("@/views/projectManage/addProject"),
        meta: {
          title: "ProjectManage",
          icon: "ProjectManage",
        },
      },
    ],
  },
  {
    path: "/sprint",
    component: Layout,
    redirect: "/sprint",
    children: [
      {
        path: "sprint",
        name: "Sprint",
        component: () => import("@/views/sprint/index"),
        meta: { title: "Sprint", icon: "Sprint" },
      },
      {
        path: "addsprint",
        name: "Addsprint",
        component: () => import("@/views/sprint/addSprint"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },
    ],
  },

  // 注册
  {
    path: "/register",
    component: Layout,
    redirect: "/register",
    children: [
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/register/index"),
        meta: { title: "Register", icon: "Register" },
      },
      {
        path: "extendedLife",
        name: "ExtendedLife",
        component: () => import("@/views/register/extendedLife"),
        meta: { title: "ExtendedLife", icon: "ExtendedLife" },
      },
      {
        path: "activaUser",
        name: "ActivaUser",
        component: () => import("@/views/register/activaUser"),
        meta: { title: "ActivaUser", icon: "ActivaUser" },
      },
      {
        path: "passwrodSet",
        name: "PasswrodSet",
        component: () => import("@/views/register/passwrodSet"),
        meta: { title: "PasswrodSet", icon: "PasswrodSet" },
      },
    ],
  },

  {
    path: "/testcase",
    component: Layout,
    redirect: "/testcase",
    children: [
      {
        path: "testcase",
        name: "Testcase",
        component: () => import("@/views/testcase/index"),
        meta: { title: "TestCase", icon: "TestCase" },
      },
      {
        path: "addtestcase",
        name: "Addtestcase",
        component: () => import("@/views/testcase/addTestCase"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },
      {
        path: "importTestCases",
        name: "ImportTestCases",
        component: () => import("@/views/testcase/importTestCases"),
        meta: {
          title: "ImportTestCases",
          icon: "ImportTestCases",
        },
      },
    ],
  },
  {
    path: "/testcycle",
    component: Layout,
    redirect: "/testcycle",
    children: [
      {
        path: "testcycle",
        name: "Testcycle",
        component: () => import("@/views/testcycle/index"),
        meta: { title: "TestCycle", icon: "TestCycle" },
      },
      {
        path: "addtestcycle",
        name: "Addtestcycle",
        component: () => import("@/views/testcycle/addTestCycle"),
        meta: {
          title: "Project",
          icon: "Project",
        },
        children: [
          {
            path: "testCycleInstance",
            name: "testCycleInstance",
            component: () =>
              import("@/views/testcycle/components/testCycleInstance.vue"),
          },
        ],
      },
      {
        path: "execute",
        name: "Execute",
        component: () => import("@/views/testcycle/execute"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },
      {
        path: "/runCase",
        name: "runCase",
        component: () => import("@/views/testcycle/caseRun/runCase"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },
      {
        path: "/reRunCase",
        name: "reRunCase",
        props: true,
        component: () => import("@/views/testcycle/caseRun/reRunCase"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },

      {
        path: '/storyUseCase',
        name: 'storyUseCase',
        component: () => import("@/views/feature/components/storyUseCase"),
      }

    ],
  },
  {
    path: "/issue",
    component: Layout,
    redirect: "/issue",
    children: [
      {
        path: "issue",
        name: "Issue",
        component: () => import("@/views/issue/index"),
        meta: { title: "Issue", icon: "Issue" },
      },
      {
        path: "addissue",
        name: "Addissue",
        component: () => import("@/views/issue/addIssue"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },
    ],
  },
  {
    path: "/signoff",
    component: Layout,
    redirect: "/signoff",
    children: [
      {
        path: "signoff",
        name: "Signoff",
        component: () => import("@/views/signoff/index"),
        meta: { title: "SignOff", icon: "SignOff" },
      },
    ],
  },

  
  {
    path: "/viewManage",
    component: Layout,
    redirect: "/viewManage",
    children: [    
      {
        path: "viewManage",
        name: "viewManage",
        component: () => import("@/views/viewManage/viewManage"),
        meta: {
          title: "viewManage",
          icon: "viewManage",
        },
      },
    ]
  },

  {
    path: "/project",
    component: Layout,
    redirect: "/project",
    children: [
      {
        path: "project",
        name: "Project",
        component: () => import("@/views/project/index"),
        meta: { title: "Project", icon: "Project" },
      },     
      {
        path: "addproject",
        name: "Addproject",
        component: () => import("@/views/project/addProject"),
        meta: {
          title: "Project",
          icon: "Project",
        },
      },
      {
        path: "generateToken",
        name: "GenerateToken",
        component: () => import("@/views/project/generateToken"),
        meta: {
          title: "GenerateToken",
          icon: "GenerateToken",
        },
      },
      {
        path: "paymentDetails",
        name: "PaymentDetails",
        component: () => import("@/views/project/paymentDetails"),
        meta: {
          title: "PaymentDetails",
          icon: "PaymentDetails",
        },
      },
    ],
  },
  {
    path: "/admincenter",
    component: Layout,
    redirect: "/admincenter",
    children: [
      {
        path: "admincenter",
        name: "Admincenter",
        component: () => import("@/views/adminCenter/index"),
        meta: { title: "admincenter", icon: "admincenter" },
      },
    ],
  },
  {
    path: "/settingCenter",
    component: Layout,
    redirect: "/settingCenter",
    children: [
      {
        path: "settingCenter",
        name: "SettingCenter",
        component: () => import("@/views/settingCenter/index"),
        meta: { title: "settingCenter", icon: "settingCenter" },
      },
    ],
  },
  {
    path: "external-link",
    component: Layout,
    children: [
      {
        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
        meta: { title: "External Link", icon: "link" },
      },
    ],
  },
  {
    path: "/manageUser",
    component: () => import("@/views/manageUser/index"),
    redirect: "/manageUser/registerUser",
    children: [
      {
        path: "registerUser",
        component: () => import("@/views/manageUser/registerUser"),
        meta: { title: "Register User", icon: "registerUser" },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
