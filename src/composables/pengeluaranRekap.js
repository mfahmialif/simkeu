const REKAP_UPDATED_EVENT = "pengeluaran-rekap-updated";

export const notifyPengeluaranRekapUpdated = (endpoint) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(REKAP_UPDATED_EVENT, {
    detail: { endpoint },
  }));
};

export const listenPengeluaranRekapUpdated = (endpoint, callback) => {
  if (typeof window === "undefined") return () => {};

  const listener = (event) => {
    if (event.detail?.endpoint === endpoint) {
      callback();
    }
  };

  window.addEventListener(REKAP_UPDATED_EVENT, listener);

  return () => window.removeEventListener(REKAP_UPDATED_EVENT, listener);
};
