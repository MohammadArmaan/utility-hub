// useScrollRestore.js
import { useEffect } from "react";

export function useScrollRestore(key = "home-scroll") {
    useEffect(() => {
        const saved = sessionStorage.getItem(key);

        if (saved) {
            window.scrollTo(0, parseInt(saved));
        }

        const handler = () =>
            sessionStorage.setItem(key, window.scrollY.toString());

        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, [key]);
}
