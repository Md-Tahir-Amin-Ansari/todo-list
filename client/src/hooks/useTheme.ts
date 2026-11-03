import { useState } from "react";

export function useTheme() {
    // 1. Move the isDarkMode useState logic here
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialDark = saved ? saved === 'dark' : prefersDark;
        if (initialDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
        return initialDark;
    });
    // 2. Move the handleToggleDarkMode function here
    const handleToggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const next = !prev;
            const theme = next ? 'dark' : 'light';

            localStorage.setItem('theme', theme);
            if (next) {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
            }
            return next;
        });
    };
    // 3. Return what App needs:
    return { isDarkMode, toggleDarkMode: handleToggleDarkMode };
}