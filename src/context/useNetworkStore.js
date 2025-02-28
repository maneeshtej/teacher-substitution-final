import { create } from "zustand";

const useNetworkStore = create((set) => ({
  isOnline: navigator.onLine,
  setOnline: (status) => set({ isOnline: status }),
}));

window.addEventListener("online", () =>
  useNetworkStore.getState().setOnline(true)
);
window.addEventListener("offline", () =>
  useNetworkStore.getState().setOnline(false)
);

export default useNetworkStore;
