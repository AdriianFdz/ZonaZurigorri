"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";
import { LogIn, LogOut, X, ChevronDown } from "lucide-react";
import Image from "next/image";

interface UserProfile {
    userId: string;
    email: string;
    name: string;
    picture?: string;
}

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    // Verificar si hay sesión al cargar
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Obtener perfil del usuario
            fetch('http://localhost:8000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(() => {
                    // Si el token es inválido, eliminarlo
                    localStorage.removeItem('auth_token');
                });
        }
    }, []);

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

    // Bloquear scroll cuando el modal está abierto
    useEffect(() => {
        if (showLoginModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Limpiar al desmontar el componente
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showLoginModal]);

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
                <div className="flex items-center gap-6">
                    <ul className="flex gap-3">
                        <NavLink href="/">Inicio</NavLink>
                        <NavLink href="/validador">Validador</NavLink>
                        <NavLink href="/promesas">Promesas</NavLink>
                        <NavLink href="/noticias">Noticias</NavLink>
                    </ul>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                {user.picture ? (
                                    <Image
                                        src={user.picture}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-burdeos-light flex items-center justify-center text-white font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-white font-medium">{user.name}</span>
                                <ChevronDown size={16} className="text-white" />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('auth_token');
                                            setUser(null);
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                                    >
                                        <LogOut size={18} />
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-burdeos-light font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <LogIn size={18} />
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Modal de Login */}
            {showLoginModal && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-100" onClick={() => setShowLoginModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-bold text-burdeos-dark mb-2">Bienvenido</h2>
                        <p className="text-gray-600 mb-8">Inicia sesión en Zona Zurigorri</p>

                        <div className="space-y-3">
                            {/* Google Login */}
                            <button
                                onClick={() => { window.location.href = 'http://localhost:8000/api/auth/google' }}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold text-gray-700 cursor-pointer"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continuar con Google
                            </button>

                            {/* X (Twitter) Login */}
                            <button
                                onClick={() => { window.location.href = 'http://localhost:8000/api/auth/twitter' }}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                Continuar con X
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500">
                                Al continuar, aceptas nuestros{' '}
                                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                                    Términos de Servicio
                                </a>{' '}
                                y{' '}
                                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                                    Política de Privacidad
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
