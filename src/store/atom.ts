import { atom } from "recoil";
export const atomState = atom<any[]>({
    key: "aatom",
    default: [],
});
