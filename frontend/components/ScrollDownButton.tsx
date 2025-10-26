"use client";

import { ChevronsDown } from "lucide-react";

export default function ScrollDownButton() {
    const scrollToNextSection = () => {
        const heroSection = document.getElementById('hero-section');
        const header = document.querySelector('header');
        if (heroSection && header) {
            const heroHeight = heroSection.getBoundingClientRect().height;
            const headerHeight = header.getBoundingClientRect().height;
            window.scrollTo({
                top: heroHeight - headerHeight,
                behavior: "smooth"
            });
        }
    };

    return (
        <button
            onClick={scrollToNextSection}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-white transition-colors"
            aria-label="Scroll to next section"
        >
            <ChevronsDown className="w-8 h-8 text-white/70 hover:text-white" />
        </button>
    );
}
