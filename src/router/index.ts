import { authClient } from "@/lib/auth-client";
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
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/pages/protected/dashboard.vue"),
    meta: {
      title: "Dashboard",
      isRequiresAuth: true,
    },
  },
  {
    path: "/invoices",
    name: "invoices",
    component: () => import("@/pages/protected/invoices.vue"),
    meta: {
      title: "Invoices",
      isRequiresAuth: true,
    },
  },
  {
    path: "/clients",
    name: "clients",
    component: () => import("@/pages/protected/clients.vue"),
    meta: {
      title: "Clients",
      isRequiresAuth: true,
    },
  },
  {
    path: "/product-service",
    name: "product-service",
    component: () => import("@/pages/protected/product-service.vue"),
    meta: {
      title: "Product/Service",
      isRequiresAuth: true,
    },
  },
  {
    path: "/items",
    name: "items",
    component: () => import("@/pages/protected/items.vue"),
    meta: {
      title: "Items",
      isRequiresAuth: true,
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

router.beforeEach(async (to, from) => {
  const session = await authClient.getSession();

  if (!to.meta.isRequiresAuth && session.data?.session) {
    return { name: "dashboard", query: { redirect: to.fullPath } };
  }

  if (to.meta.isRequiresAuth && !session.data?.session) {
    return { name: "login" };
  }
});

export default router;
