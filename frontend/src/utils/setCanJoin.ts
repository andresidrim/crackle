import { localStorageKey } from "@/constants/constants";

export function setCanJoin(roomID: string) {
  localStorage.setItem(`${localStorageKey}:canJoin`, roomID);
}
