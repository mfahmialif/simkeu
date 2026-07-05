import { canNavigate } from "@layouts/plugins/casl"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

// Konfigurasi NProgress seperti YouTube
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 })

const normalizeRole = roleName => String(roleName || "").toLowerCase()

const routeRoles = to => to.matched.flatMap(route => {
  const roles = route.meta?.roles

  return Array.isArray(roles) ? roles : []
})

const canAccessByRole = (to, userData) => {
  const roles = routeRoles(to)

  if (!roles.length) return true

  const userRole = normalizeRole(userData?.role?.name)

  return roles.some(role => normalizeRole(role) === userRole)
}

const unauthorizedRedirect = (to, isLoggedIn) => {
  if (isLoggedIn) return { name: "not-authorized" }

  return {
    name: "login",
    query: {
      ...to.query,
      to: to.fullPath !== "/" ? to.path : undefined,
    },
  }
}

export const setupGuards = router => {
  // 👉 router.beforeEach
  // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
  router.beforeEach(to => {
    // Mulai progress bar
    NProgress.start()

    /*
     * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
     * Examples of public routes are, 404, under maintenance, etc.
     */
    if (to.meta.public) return

    /**
     * Check if user is logged in by checking if token & user data exists in local storage
     * Feel free to update this logic to suit your needs
     */
    const userData = useCookie("userData").value
    const accessToken = useCookie("accessToken").value
    const isLoggedIn = !!(userData && accessToken)

    /*
          If user is logged in and is trying to access login like page, redirect to home
          else allow visiting the page
          (WARN: Don't allow executing further by return statement because next code will check for permissions)
         */
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn) return "/home"
      else return undefined
    }
    if (!canAccessByRole(to, userData) && to.matched.length)
      return unauthorizedRedirect(to, isLoggedIn)

    if (!canNavigate(to) && to.matched.length) {
      return unauthorizedRedirect(to, isLoggedIn)
    }
  })

  // 👉 router.afterEach
  router.afterEach(() => {
    // Selesai progress bar
    NProgress.done()
  })
}
