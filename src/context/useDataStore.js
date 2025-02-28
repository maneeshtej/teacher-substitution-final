import { create } from "zustand";
import { persist } from "zustand/middleware";
import useTeachStore from "./useTeachStore";

const useDataStore = create(
  persist(
    (set) => ({
      sortOption: {
        teacherID: null,
        type: null,
        sortBy: "dateofPeriod",
        sort: "Asc",
      },

      setSortOption: ({ type, sortBy, sort }) => {
        console.log(sort);
        set((state) => ({
          sortOption: {
            ...state.sortOption,
            type: type ?? state.sortOption.type,
            sortBy: sortBy ?? state.sortOption.sortBy,
            sort: sort ?? state.sortOption.sort,
          },
        }));
      },
    }),
    {
      name: "data-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useDataStore;
