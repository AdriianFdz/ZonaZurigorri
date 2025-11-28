"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, Trash2, Search } from "lucide-react";
import { getFavorites, removeFavorite } from "@/lib/favoritesService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Player {
    id: string;
    name: string;
    image_url?: string;
}

export default function FavoritosPage() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/');
            return;
        }

        const loadFavorites = async () => {
            const favIds = await getFavorites();
            setFavorites(favIds);

            const playerPromises = favIds.map(async (id): Promise<Player | null> => {
                try {
                    const response = await fetch(`http://localhost:8000/api/v1/philosophy/validate/${id}`);
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

        loadFavorites();
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
