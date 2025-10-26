"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getHeaderClasses = () => {
        if (!isHomePage) {
            return "bg-linear-120 from-burdeos-dark via-burdeos-dark to-burdeos-dark shadow-lg";
        }
        return isScrolled
            ? "bg-linear-120 from-burdeos-dark via-burdeos-dark to-burdeos-dark shadow-lg backdrop-blur-sm bg-opacity-95"
            : "bg-transparent";
    };

    return (
        <header
            className={`text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderClasses()}`}
        >
            <div className="flex items-center justify-between p-4 mx-5">
                <Logo />
                <ul className="flex space-x-4">
                    <ul className="flex gap-3">
                        <NavLink href="/">Inicio</NavLink>
                        <NavLink href="/validador">Validador</NavLink>
                        <NavLink href="/promesas">Promesas</NavLink>
                        <NavLink href="/noticias">Noticias</NavLink>
                    </ul>
                </ul>
            </div>
        </header>
    );
}
