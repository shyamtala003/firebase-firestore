import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setAuth: (user, isLoggedIn = false) =>
        set({ user: user, isLoggedIn: isLoggedIn }),
    }),
    {
      name: "userAuth", // name of the item in the storage (must be unique)
    }
  )
);
