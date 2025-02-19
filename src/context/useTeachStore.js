import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTeachStore = create(
  persist(
    (set) => ({
      teacherid: null,
      teachername: null,
      teacherdetails: null,
      teachersubstitutions: null,
      teacheremail: null,

      setteacherid: (data) => set(() => ({ teacherid: data })),
      setteachername: (data) => set(() => ({ teachername: data })),
      setteacherdetails: (data) => set(() => ({ teacherdetails: data })),
      setteachersubstitutions: (data) => set(() => ({ teachersubstitutions: data })),
      setteacheremail: (data) => set(() => ({ teacheremail: data })),
    }),
    {
      name: "teacher-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useTeachStore;
