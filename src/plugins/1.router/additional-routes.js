import { useLogout } from "@/composables/logout"

const emailRouteComponent = () => import("@/pages/apps/email/index.vue")
const lpjRouteComponent = () => import("@/components/admin/pengeluaran/PengeluaranLpjDetail.vue")

const { logout } = useLogout()

// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: "/",
    name: "index",
    component: () => import("@/pages/front-pages/landing-page/index.vue"),
    meta: {
      public: true, // Kalau route ini boleh diakses tanpa login
      layout: "default", // Atau "blank" jika ingin layout kosong
    },
  },
  {
    path: "/logout",
    name: "logout",
    redirect: to => {
      logout()
      
      return { name: "login", query: to.query }
    },
  },
  {
    path: "/home",
    name: "home",
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie("userData")
      const userRole = userData.value?.role.name
      
      if (!userRole) {
        return { name: "login", query: to.query }        
      }
      
      if (userRole === "user") {
        return { name: "access-control" }
      } else {
        return { name: "admin-dashboard" }
      }

      // if (userRole === "client") return { name: "access-control" };
      // if (userRole === "admin") return { name: "admin-dashboard" };

    },
  },
  {
    path: "/pages/user-profile",
    name: "pages-user-profile",
    redirect: () => ({
      name: "pages-user-profile-tab",
      params: { tab: "profile" },
    }),
  },
  {
    path: "/pages/account-settings",
    name: "pages-account-settings",
    redirect: () => ({
      name: "pages-account-settings-tab",
      params: { tab: "account" },
    }),
  },
]
export const routes = [
  {
    path: "/admin/pengeluaran/dosen-bulanan/:pathMatch(.*)*",
    redirect: to => to.fullPath.replace("/admin/pengeluaran/dosen-bulanan", "/admin/pengeluaran/bulanan"),
  },
  {
    path: "/admin/pengeluaran/dosen-tatapmuka/rekap/:id/lpj",
    name: "admin-pengeluaran-dosen-tatapmuka-rekap-id-lpj",
    component: lpjRouteComponent,
    props: {
      title: "Barokah Dosen Tatapmuka",
      endpoint: "/admin/pengeluaran/dosen",
      basePath: "/admin/pengeluaran/dosen-tatapmuka",
      moduleType: "tatapmuka",
    },
  },
  {
    path: "/admin/pengeluaran/dosen-kegiatan/rekap/:id/lpj",
    name: "admin-pengeluaran-dosen-kegiatan-rekap-id-lpj",
    component: lpjRouteComponent,
    props: {
      title: "Barokah Dosen Kegiatan",
      endpoint: "/admin/pengeluaran/dosen-kegiatan",
      basePath: "/admin/pengeluaran/dosen-kegiatan",
      moduleType: "kegiatan",
    },
  },
  {
    path: "/admin/pengeluaran/rumah-tangga/rekap/:id/lpj",
    name: "admin-pengeluaran-rumah-tangga-rekap-id-lpj",
    component: lpjRouteComponent,
    props: {
      title: "Rumah Tangga",
      endpoint: "/admin/pengeluaran/rumah-tangga",
      basePath: "/admin/pengeluaran/rumah-tangga",
      moduleType: "rumah-tangga",
    },
  },
  {
    path: "/admin/pengeluaran/sarana-prasarana/rekap/:id/lpj",
    name: "admin-pengeluaran-sarana-prasarana-rekap-id-lpj",
    component: lpjRouteComponent,
    props: {
      title: "Sarana Prasarana",
      endpoint: "/admin/pengeluaran/sarana-prasarana",
      basePath: "/admin/pengeluaran/sarana-prasarana",
      moduleType: "sarana-prasarana",
    },
  },
  {
    path: "/admin/pengeluaran/transportasi/rekap/:id/lpj",
    name: "admin-pengeluaran-transportasi-rekap-id-lpj",
    component: lpjRouteComponent,
    props: {
      title: "Transportasi",
      endpoint: "/admin/pengeluaran/transportasi",
      basePath: "/admin/pengeluaran/transportasi",
      moduleType: "transportasi",
    },
  },
  {
    path: "/admin/pengeluaran/umum/rekap/:id/lpj",
    name: "admin-pengeluaran-umum-rekap-id-lpj",
    component: lpjRouteComponent,
    props: {
      title: "Pengeluaran Umum",
      endpoint: "/admin/pengeluaran/umum",
      basePath: "/admin/pengeluaran/umum",
      moduleType: "umum",
    },
  },
  {
    path: "/admin/pengeluaran/bulanan/rekap/:id/lpj",
    name: "admin-pengeluaran-bulanan-rekap-id-lpj",
    component: lpjRouteComponent,
    props: {
      title: "Barokah Bulanan",
      endpoint: "/admin/pengeluaran/bulanan",
      basePath: "/admin/pengeluaran/bulanan",
      moduleType: "dosen-bulanan",
    },
  },

  // Email filter
  {
    path: "/apps/email/filter/:filter",
    name: "apps-email-filter",
    component: emailRouteComponent,
    meta: {
      navActiveLink: "apps-email",
      layoutWrapperClasses: "layout-content-height-fixed",
    },
  },

  // Email label
  {
    path: "/apps/email/label/:label",
    name: "apps-email-label",
    component: emailRouteComponent,
    meta: {
      // contentClass: 'email-application',
      navActiveLink: "apps-email",
      layoutWrapperClasses: "layout-content-height-fixed",
    },
  },
  {
    path: "/dashboards/logistics",
    name: "dashboards-logistics",
    component: () => import("@/pages/apps/logistics/dashboard.vue"),
  },
  {
    path: "/dashboards/academy",
    name: "dashboards-academy",
    component: () => import("@/pages/apps/academy/dashboard.vue"),
  },
  {
    path: "/apps/ecommerce/dashboard",
    name: "apps-ecommerce-dashboard",
    component: () => import("@/pages/dashboards/ecommerce.vue"),
  },
]
