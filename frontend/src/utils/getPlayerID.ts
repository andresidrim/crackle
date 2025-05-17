import { localStorageKey } from "@/constants/constants";

export function getPlayerID() {
  return localStorage.getItem(`${localStorageKey}:playerID`);
}
