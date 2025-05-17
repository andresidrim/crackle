import { useEffect } from "react";
import { localStorageKey } from "@/constants/constants";

export function useClearLocalStorage() {
  useEffect(() => {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(localStorageKey)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }

    console.log(`Cleared ${localStorageKey} localStorage keys:`, keysToRemove);
  }, []);
}
