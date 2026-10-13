import { useLogout } from "@/composables/logout"

const userData = useCookie("userData")

// Kumpulan AbortController untuk request aktif yang dapat dibatalkan saat navigasi
const activeControllers = new Set()

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

  // --- AbortController & Timeout Management ---
  // Default: GET request otomatis bisa dibatalkan saat ganti halaman.
  // Method mutasi (POST, PUT, DELETE, PATCH) tidak dibatalkan otomatis saat ganti halaman kecuali ditentukan di options.
  const cancelOnNavigate = options.cancelOnNavigate ?? (method === 'GET')
  const controller = new AbortController()

  if (cancelOnNavigate) {
    activeControllers.add(controller)
  }

  // Timeout bawaan 30 detik (bisa diatur via options.timeout, atau 0 untuk tanpa timeout)
  const timeoutMs = options.timeout ?? 30000
  let timeoutId = null
  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
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

    return data
  } catch (error) {
    // Jika request dibatalkan karena navigasi atau timeout
    if (error.name === 'AbortError') {
      const abortError = new Error('Permintaan dibatalkan.')
      abortError.name = 'AbortError'
      abortError.isAborted = true
      throw abortError
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
