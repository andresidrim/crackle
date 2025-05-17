import { localStorageKey } from "@/constants/constants";

export function savePlayerID(playerID: string) {
  localStorage.setItem(`${localStorageKey}:playerID`, playerID);
}
