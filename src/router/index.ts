import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

// route items
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/index.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/auth/loginPage.vue"),
    meta: {
      title: "Login",
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/pages/auth/signupPage.vue"),
    meta: {
      title: "Sign up",
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/pages/auth/resetPassword.vue"),
    meta: {
      title: "Reset password",
    },
  },
  {
    path: "/reset-form/:token",
    name: "reset-form",
    component: () => import("@/pages/auth/resetForm.vue"),
    meta: {
      title: "Reset form",
    },
  },
  {
    path: "/verify-email",
    name: "verify-email",
    component: () => import("@/pages/auth/verifyEmail.vue"),
    meta: {
      title: "Verify email",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/error.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  document.title = `Invoicerz | ${String(to.meta.title)}`;
});

export default router;
