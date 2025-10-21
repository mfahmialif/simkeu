import { useLogout } from "@/composables/logout";

const userData = useCookie("userData");
export const $api = async (url, options = {}) => {
  const { logout } = useLogout();

  const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
  const accessToken = useCookie("accessToken").value;

  const method = (options.method || "GET").toUpperCase();
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  let finalUrl = `${baseURL}${url}`;
  const fetchOptions = {
    method,
    headers,
  };

  // --- BLOK LOGIKA BARU YANG MENGGABUNGKAN SEMUANYA ---

  // if (method === "GET" && options.body && typeof options.body === "object") {
  //   // 1. LOGIKA ASLI ANDA UNTUK GET REQUEST (TETAP DIPERTAHANKAN)
  //   const query = new URLSearchParams(options.body).toString();
  //   finalUrl += `?${query}`;
  //   // Body tidak ditambahkan ke fetchOptions untuk GET
  // } else if (options.body) {
  //   // 2. LOGIKA UNTUK METHOD LAIN (POST, PUT, PATCH, DLL)
  //   if (options.body instanceof FormData) {
  //     // Jika body adalah FormData, langsung teruskan tanpa mengubah header
  //     fetchOptions.body = options.body;
  //   } else if (typeof options.body === "object") {
  //     // Jika body adalah objek JSON biasa, stringify dan set header
  //     headers["Content-Type"] = "application/json";
  //     fetchOptions.body = JSON.stringify(options.body);
  //   } else {
  //     // Untuk tipe body lain (misalnya string)
  //     fetchOptions.body = options.body;
  //   }
  // }
  // --- AKHIR BLOK LOGIKA BARU ---

  // kode saya
  // --- Tambahkan dukungan params untuk GET ---
  if (method === "GET") {
    // Bisa menggunakan options.params atau options.body
    const queryObject = options.params || options.body;

    if (queryObject && typeof queryObject === "object") {
      const query = new URLSearchParams(queryObject).toString();
      finalUrl += `?${query}`;
    }
  } else if (options.body) {
    // Untuk POST, PUT, PATCH, DELETE, dll
    if (options.body instanceof FormData) {
      fetchOptions.body = options.body;
    } else if (typeof options.body === "object") {
      headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(options.body);
    } else {
      fetchOptions.body = options.body;
    }
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(finalUrl, fetchOptions);

    // Perbaikan kecil untuk menangani response kosong (misal: status 204)
    if (response.status === 204) {
      return null;
    }

    const acceptHeader = headers["Accept"]?.toLowerCase() || "";

    const isBlobResponse =
      acceptHeader.includes("application/vnd.openxmlformats-officedocument") ||
      acceptHeader.includes("application/pdf");

    if (isBlobResponse) {
      const blob = await response.blob();
      if (!response.ok) {
        const errorText = await blob.text();
        const error = new Error(errorText || "Gagal mengunduh file.");
        error.status = response.status;
        throw error;
      }
      return blob;
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        if (userData.value) {
          logout();
        }
      }
      const error = new Error(data.message || "Request failed");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Menangani error jika response bukan JSON valid
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON response.");
      throw new Error("Respons dari server tidak valid.");
    }
    // Melempar kembali error asli untuk ditangani di `onSubmit`
    throw error;
  }
};
