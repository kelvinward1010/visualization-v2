import { create } from "zustand";

interface DisclosureState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
}

const useDisclosure = create<DisclosureState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useDisclosure;
