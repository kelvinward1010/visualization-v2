import { atom } from "recoil";

export const edgeState = atom<string>({
    key: "edgeStat",
    default: "",
});
