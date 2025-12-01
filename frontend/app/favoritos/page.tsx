"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, Trash2, Search, AlertCircle } from "lucide-react";
import { getFavorites, removeFavorite } from "@/lib/favoritesService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

interface Player {
    id: string;
    name: string;
    image_url?: string;
}

export default function FavoritosPage() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }
        setIsAuthenticated(true);

        const loadFavorites = async () => {
            const favIds = await getFavorites();
            setFavorites(favIds);

            const playerPromises = favIds.map(async (id): Promise<Player | null> => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/v1/philosophy/validate/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        return {
                            id,
                            name: data.jugador.name,
                            image_url: data.jugador.image_url
                        };
                    }
                } catch {
                    return null;
                }
                return null;
            });

            const playerData = (await Promise.all(playerPromises)).filter((p): p is Player => p !== null);
            setPlayers(playerData);
        };

        void loadFavorites();
    }, [router]);

    const handleRemove = async (playerId: string) => {
        setRemovingId(playerId);
        const result = await removeFavorite(playerId);

        if (result.success) {
            setFavorites(favorites.filter(id => id !== playerId));
            setPlayers(players.filter(p => p.id !== playerId));
        }

        setRemovingId(null);
    };

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-burdeos-dark" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 pt-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <div className="mb-6">
                                <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                    Autenticación Requerida
                                </h2>
                                <p className="text-gray-600 text-lg mb-6">
                                    Debes iniciar sesión para acceder a tu lista de favoritos
                                </p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-500 mb-6">
                                    Inicia sesión con Google o Discord para guardar y gestionar tus jugadores favoritos
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href={`${API_BASE_URL}/api/auth/google`}
                                        className="inline-flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continuar con Google
                                    </a>

                                    <a
                                        href={`${API_BASE_URL}/api/auth/discord`}
                                        className="flex items-center justify-center gap-3 bg-[#5865F2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4752C4] transition-all shadow-md"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
                                        Continuar con Discord
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-burdeos-dark mb-2">
                            Mis Favoritos
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Gestiona tu lista de jugadores favoritos
                        </p>

                        {favorites.length > 0 && players.length === 0 ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-12 h-12 animate-spin text-burdeos-dark mx-auto mb-4" />
                                <p className="text-gray-600">Cargando favoritos...</p>
                            </div>
                        ) : players.length === 0 ? (
                            <div className="text-center py-12">
                                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes favoritos aún</h2>
                                <p className="text-gray-600 mb-6">
                                    Busca jugadores en el validador y agrégalos a favoritos para guardarlos aquí
                                </p>
                                <button
                                    onClick={() => router.push('/validador')}
                                    className="inline-flex items-center gap-2 bg-burdeos-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-burdeos-light transition-colors cursor-pointer"
                                >
                                    <Search className="w-5 h-5" />
                                    Ir al Validador
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <div className="aspect-square bg-linear-to-br from-burdeos-dark to-burdeos-light flex items-center justify-center relative">
                                            {player.image_url ? (
                                                <Image
                                                    src={player.image_url}
                                                    alt={player.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="text-white text-6xl font-bold">
                                                    {player.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{player.name}</h3>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/validador?player=${player.id}`}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-burdeos-dark text-white px-4 py-2 rounded-lg font-semibold hover:bg-burdeos-light transition-colors cursor-pointer"
                                                >
                                                    <Search className="w-4 h-4" />
                                                    Ver detalles
                                                </Link>
                                                <button
                                                    onClick={() => handleRemove(player.id)}
                                                    disabled={removingId === player.id}
                                                    className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    {removingId === player.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
