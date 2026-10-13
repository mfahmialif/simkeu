import { useLogout } from "@/composables/logout"

const userData = useCookie("userData")

// Kumpulan AbortController untuk request aktif yang dapat dibatalkan saat navigasi
const activeControllers = new Set()

// Cache in-memory untuk GET requests (terutama hasil hover prefetch)
// Format: cacheKey -> { data, expiresAt }
const apiGetCache = new Map()

/**
 * Hapus cache data API
 * @param {string} urlPattern Opsional: substring URL yang akan dihapus dari cache
 */
export const invalidateApiCache = (urlPattern = '') => {
  if (!urlPattern) {
    apiGetCache.clear()
    return
  }
  for (const key of apiGetCache.keys()) {
    if (key.includes(urlPattern)) {
      apiGetCache.delete(key)
    }
  }
}

/**
 * Panggil prefetch data API di background tanpa memblokir UI
 */
export const prefetchApi = (url, options = {}) => {
  return $api(url, {
    method: 'GET',
    cache: true,
    cacheTtl: options.cacheTtl || 25000,
    cancelOnNavigate: false, // Jangan batalkan prefetch saat transisi navigasi
    ...options,
  }).catch(() => {
    // Abaikan kegagalan prefetch di latar belakang
  })
}

/**
 * Batalkan seluruh pending request yang terdaftar saat berpindah halaman
 */
export const cancelAllPendingRequests = () => {
  for (const controller of activeControllers) {
    try {
      controller.abort()
    } catch {
      // Abaikan error abort
    }
  }
  activeControllers.clear()
}

export const $api = async (url, options = {}) => {
  const { logout } = useLogout()

  const baseURL = import.meta.env.VITE_API_BASE_URL || "/api"
  const accessToken = useCookie("accessToken").value
  const jkScope = useCookie("simkeuJkScope").value

  const method = (options.method || "GET").toUpperCase()

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  }

  let finalUrl = `${baseURL}${url}`

  const fetchOptions = {
    method,
    headers,
  }

  // --- Tambahkan dukungan params untuk GET ---
  if (method === "GET") {
    const queryObject = options.params || options.body

    if (queryObject && typeof queryObject === "object") {
      const cleanParams = Object.entries(queryObject).reduce((acc, [key, val]) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined" && val !== "null") {
          acc[key] = val
        }
        return acc
      }, {})
      const query = new URLSearchParams(cleanParams).toString()

      if (query) {
        finalUrl += `?${query}`
      }
    }
  } else if (options.body) {
    if (options.body instanceof FormData) {
      fetchOptions.body = options.body
    } else if (typeof options.body === "object") {
      headers["Content-Type"] = "application/json"
      fetchOptions.body = JSON.stringify(options.body)
    } else {
      fetchOptions.body = options.body
    }
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }
  if (jkScope) {
    headers["X-Simkeu-Jk-Scope"] = jkScope
  }

  // Kunci cache unik berdasarkan method, URL, dan scope
  const cacheKey = `${method}:${finalUrl}:${jkScope || ''}`

  // Jika method mutasi (POST, PUT, DELETE, PATCH), otomatis invalidate cache agar data tidak basi
  if (method !== 'GET') {
    invalidateApiCache()
  }

  // Jika GET dan opsi cache aktif (default: aktif untuk GET kecuali options.cache === false),
  // cek apakah ada data segar di cache (misalnya dari hasil hover prefetch)
  if (method === 'GET' && options.cache !== false) {
    const cached = apiGetCache.get(cacheKey)
    if (cached && Date.now() < cached.expiresAt) {
      // Kembalikan data dari cache instan dalam 0ms
      return JSON.parse(JSON.stringify(cached.data))
    }
  }

  // --- AbortController & Timeout Management ---
  // Default: GET request otomatis bisa dibatalkan saat ganti halaman.
  // Method mutasi (POST, PUT, DELETE, PATCH) tidak dibatalkan otomatis saat ganti halaman kecuali ditentukan di options.
  const cancelOnNavigate = options.cancelOnNavigate ?? (method === 'GET')
  const controller = new AbortController()

  if (cancelOnNavigate) {
    activeControllers.add(controller)
  }

  // Timeout bawaan 30 detik (bisa diatur via options.timeout, atau 0 untuk tanpa timeout)
  let isTimedOut = false
  const timeoutMs = options.timeout ?? 30000
  let timeoutId = null
  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      isTimedOut = true
      controller.abort()
    }, timeoutMs)
  }

  // Jika pemanggil menyertakan signal custom sendiri
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort())
  }

  fetchOptions.signal = controller.signal

  try {
    const response = await fetch(finalUrl, fetchOptions)

    // Perbaikan kecil untuk menangani response kosong (misal: status 204)
    if (response.status === 204) {
      return null
    }

    const acceptHeader = headers["Accept"]?.toLowerCase() || ""

    const isBlobResponse =
      acceptHeader.includes("application/vnd.openxmlformats-officedocument") ||
      acceptHeader.includes("application/pdf") ||
      acceptHeader.includes("text/plain")

    if (isBlobResponse) {
      const blob = await response.blob()
      if (!response.ok) {
        const errorText = await blob.text()
        const error = new Error(errorText || "Gagal mengunduh file.")

        error.status = response.status
        throw error
      }
      
      const disposition = response.headers.get("Content-Disposition")
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/)
        if (match && match[1]) {
          blob.name = match[1]
        }
      }
      
      return blob
    }

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        if (userData.value) {
          logout()
        }
      }
      const error = new Error(data.message || "Request failed")

      error.status = response.status
      error.data = data
      throw error
    }

    // Simpan ke cache jika GET (default TTL 20 detik atau sesuai options.cacheTtl)
    if (method === 'GET' && options.cache !== false && data) {
      const ttl = options.cacheTtl ?? 20000
      if (ttl > 0) {
        apiGetCache.set(cacheKey, {
          data: JSON.parse(JSON.stringify(data)),
          expiresAt: Date.now() + ttl,
        })
      }
    }

    return data
  } catch (error) {
    // Jika request dibatalkan karena timeout
    if (isTimedOut) {
      const timeoutError = new Error('Waktu permintaan habis. Silakan coba lagi.')
      timeoutError.name = 'TimeoutError'
      throw timeoutError
    }

    // Jika request dibatalkan karena navigasi ke halaman lain
    if (error.name === 'AbortError' || controller.signal.aborted) {
      if (options.throwOnAbort) {
        const abortError = new Error('Permintaan dibatalkan.')
        abortError.name = 'AbortError'
        abortError.isAborted = true
        throw abortError
      }
      // Silent abort: kembalikan Promise gantung agar komponen yang sedang unmount
      // tidak memicu blok catch() dan tidak memunculkan notifikasi error palsu.
      return new Promise(() => {})
    }

    // Menangani error jika response bukan JSON valid
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON response.")
      throw new Error("Respons dari server tidak valid.")
    }

    // Melempar kembali error asli untuk ditangani di caller
    throw error
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if (cancelOnNavigate) {
      activeControllers.delete(controller)
    }
  }
}
