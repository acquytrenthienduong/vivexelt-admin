import DashboardLayout from "@/views/Layout/DashboardLayout.vue";
import AuthLayout from "@/views/Pages/AuthLayout.vue";

import NotFound from "@/views/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    redirect: "dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "/jobs",
        name: "jobs",
        meta: { hideFooter: true },
        component: () => import("../views/Jobs/List.vue")
      },
      {
        path: "/jobs/create",
        name: "jobCreate",
        meta: { hideFooter: true },
        component: () => import("../views/Jobs/CreateNew.vue")
      },
      {
        path: "/jobs/:id",
        name: "jobUpdate",
        meta: { hideFooter: true },
        component: () => import("../views/Jobs/UpdateJob.vue")
      },
      {
        path: "/departments",
        name: "departments",
        meta: { hideFooter: true },
        component: () => import("../views/DepartFos/List.vue")
      },
      {
        path: "/dashboard",
        name: "dashboard",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/Dashboard.vue")
      },
      {
        path: "/icons",
        name: "icons",
        component: () => import("../views/Icons.vue")
      },
      {
        path: "/profile",
        name: "profile",
        component: () => import("../views/Pages/UserProfile.vue")
      },
      {
        path: "/maps",
        name: "maps",
        component: () => import("../views/GoogleMaps.vue")
      },
      {
        path: "/tables",
        name: "tables",
        component: () => import("../views/RegularTables.vue")
      }
    ]
  },
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        meta: { noAuthRequired: true, hideFooter: true },
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Auth/Login.vue")
      },
      {
        path: "/logout",
        name: "logout",
        meta: { noAuthRequired: true, hideFooter: true },
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Auth/logout.vue")
      },
      { path: "*", component: NotFound }
    ]
  }
];

export default routes;
