"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";
import { LogIn, LogOut, X, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from '@/config';

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
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    // Verificar si hay sesión al cargar
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Obtener perfil del usuario
            fetch(`${API_BASE_URL}/api/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(() => {
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

    useEffect(() => {
        if (showLoginModal || showMobileMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showLoginModal, showMobileMenu]);

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
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <Logo />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-6">
                    <ul className="flex gap-3">
                        <NavLink href="/">Inicio</NavLink>
                        <NavLink href="/validador">Validador</NavLink>
                        <NavLink href="/favoritos">Favoritos</NavLink>
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

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="lg:hidden text-white p-1"
                >
                    {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="lg:hidden fixed inset-0 top-[68px] bg-burdeos-dark z-40 overflow-y-auto">
                    <div className="flex flex-col p-6 space-y-4">
                        <ul className="flex flex-col gap-2">
                            <li onClick={() => setShowMobileMenu(false)}><NavLink href="/">Inicio</NavLink></li>
                            <li onClick={() => setShowMobileMenu(false)}><NavLink href="/validador">Validador</NavLink></li>
                            <li onClick={() => setShowMobileMenu(false)}><NavLink href="/favoritos">Favoritos</NavLink></li>
                            <li onClick={() => setShowMobileMenu(false)}><NavLink href="/noticias">Noticias</NavLink></li>
                        </ul>

                        <div className="pt-4 border-t border-white/20">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg">
                                        {user.picture ? (
                                            <Image src={user.picture} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-burdeos-light flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-white font-medium">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('auth_token');
                                            setUser(null);
                                            setShowMobileMenu(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold"
                                    >
                                        <LogOut size={18} />
                                        Cerrar sesión
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowMobileMenu(false);
                                        setShowLoginModal(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-burdeos-light font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <LogIn size={18} />
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Login */}
            {showLoginModal && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-100 p-4" onClick={() => setShowLoginModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative" onClick={(e) => e.stopPropagation()}>
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
                                onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/google` }}
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

                            {/* Discord Login */}
                            <button
                                onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/discord` }}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-all font-semibold cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                                Continuar con Discord
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
