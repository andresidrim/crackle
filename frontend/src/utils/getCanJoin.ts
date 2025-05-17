import { localStorageKey } from "@/constants/constants";

export function getCanJoin() {
  return localStorage.getItem(`${localStorageKey}:canJoin`);
}
