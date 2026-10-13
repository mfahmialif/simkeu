import { prefetchApi } from '@/utils/api'

// Cache untuk melacak rute mana saja yang chunk JS-nya sudah di-prefetch agar tidak dipanggil berulang
const preloadedRouteChunks = new Set()

// Registrasi Data Prefetcher berdasarkan route name atau route path
const routeDataPrefetchers = {
  // Pemasukan - VA BSI
  'admin-pemasukan-mahasiswa-pembayaran-bsi': () => {
    prefetchApi('/admin/pemasukan/mahasiswa/pembayaran-bsi', {
      params: { page: 1, limit: 10 },
    })
    prefetchApi('/admin/pemasukan/mahasiswa/pembayaran-bsi/reconciliation-stats')
  },

  // Pemasukan - Pengembalian Dana
  'admin-pemasukan-mahasiswa-pengembalian': () => {
    prefetchApi('/admin/pemasukan/mahasiswa/pengembalian', {
      params: { page: 1, limit: 10, sort_key: 'id', sort_order: 'desc' },
    })
    prefetchApi('/admin/pemasukan/mahasiswa/pengembalian/stats')
  },

  // Pemasukan - Pembayaran Mahasiswa
  'admin-pemasukan-mahasiswa-pembayaran-mahasiswa': () => {
    prefetchApi('/admin/pemasukan/mahasiswa/pembayaran-mahasiswa', {
      params: { page: 1, limit: 10 },
    })
  },

  // Pemasukan - Data Mahasiswa
  'admin-pemasukan-mahasiswa-master-data-mahasiswa': () => {
    prefetchApi('/admin/pemasukan/mahasiswa/data-mahasiswa', {
      params: { page: 1, limit: 10 },
    })
  },

  // Pemasukan - Tagihan
  'admin-pemasukan-mahasiswa-master-tagihan': () => {
    prefetchApi('/admin/pemasukan/mahasiswa/tagihan', {
      params: { page: 1, limit: 10 },
    })
  },
}

let hoverTimer = null

/**
 * Panggil prefetch untuk route target saat mouse hover menu
 * @param {string|object} to Target route name atau object
 * @param {object} router Vue router instance
 */
export const prefetchNavRoute = (to, router) => {
  if (!to || !router) return

  // Debounce 75ms: mencegah prefetch berlebihan jika kursor hanya melintas cepat
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    try {
      const resolved = router.resolve(to)
      const routeName = resolved?.name || (typeof to === 'string' ? to : to?.name)
      const routePath = resolved?.path

      // 1. Preload Component Chunk (Vite Dynamic Import)
      if (resolved?.matched && !preloadedRouteChunks.has(routeName || routePath)) {
        preloadedRouteChunks.add(routeName || routePath)
        for (const record of resolved.matched) {
          if (record.components) {
            for (const key of Object.keys(record.components)) {
              const comp = record.components[key]
              if (typeof comp === 'function') {
                // Memicu browser mengunduh chunk JS halaman sebelum diklik
                comp()
              }
            }
          }
        }
      }

      // 2. Preload Data API jika terdaftar
      const prefetcher = routeDataPrefetchers[routeName] || routeDataPrefetchers[routePath]
      if (typeof prefetcher === 'function') {
        prefetcher()
      }
    } catch {
      // Abaikan error saat resolve route
    }
  }, 75)
}

/**
 * Batalkan timer hover jika mouse keluar sebelum 75ms
 */
export const cancelNavPrefetch = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

/**
 * Ekspor fungsi untuk mendaftarkan prefetcher baru secara dinamis
 */
export const registerRouteDataPrefetcher = (routeNameOrPath, fetcherFn) => {
  routeDataPrefetchers[routeNameOrPath] = fetcherFn
}
