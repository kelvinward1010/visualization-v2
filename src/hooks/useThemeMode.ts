import { create } from "zustand";

type ThemeModeState = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const useThemeMode = create<ThemeModeState>((set) => ({
    isDarkMode: localStorage.getItem("visualization-app") === "dark",
    toggleTheme: () => {
        set((state) => {
            const newMode = !state.isDarkMode;
            localStorage.setItem(
                "visualization-app",
                newMode ? "dark" : "light",
            );
            return { isDarkMode: newMode };
        });
    },
}));

export default useThemeMode;
