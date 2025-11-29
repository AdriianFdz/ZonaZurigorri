"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar, CheckCircle, XCircle, Loader2, Trophy, HelpCircle, Star, MessageCircle, Trash2 } from "lucide-react";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favoritesService";
import Image from "next/image";

interface PlayerSuggestion {
    id: string;
    full_name: string;
    current_club?: string;
    age?: number;
    image_url?: string;
}

interface ValidationResult {
    jugador: {
        name: string;
        born_place: string;
        birth_date: string;
        image_url?: string;
        clubs: Array<{
            club: { name: string };
            seasons: number;
        }>;
    };
    status: "valid" | "invalid" | "doubt";
    reason: string;
}

interface Comment {
    id: string;
    userId: string;
    playerId: string;
    comment: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        picture?: string;
    };
}

function ValidadorContent() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<PlayerSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [validating, setValidating] = useState(false);
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [addingFavorite, setAddingFavorite] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const isSelectingPlayer = useRef(false);

    // Validar jugador desde URL al cargar
    useEffect(() => {
        const playerId = searchParams.get('player');
        if (playerId) {
            validatePlayerById(playerId);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isSelectingPlayer.current) {
            isSelectingPlayer.current = false;
            return;
        }

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (searchQuery.trim().length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoadingSuggestions(true);

        debounceTimer.current = setTimeout(() => {
            const fetchPlayers = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/philosophy/players/search?q=${encodeURIComponent(searchQuery)}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        setSuggestions(data.results || []);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Error buscando jugadores:", error);
                    setSuggestions([]);
                } finally {
                    setLoadingSuggestions(false);
                }
            };
            void fetchPlayers();
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery]);

    const validatePlayerById = async (playerId: string, playerName?: string) => {
        setValidating(true);
        setResult(null);
        setSelectedPlayerId(playerId);
        if (playerName) {
            setSearchQuery(playerName);
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/philosophy/validate/${playerId}`
            );

            if (response.ok) {
                const data = await response.json();
                setResult(data);
                if (!playerName) {
                    setSearchQuery(data.jugador.name);
                }

                const inFavorites = await isFavorite(playerId);
                setIsInFavorites(inFavorites);

                loadComments(playerId);
            } else {
                console.error("Error validando jugador");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setValidating(false);
        }
    };

    const loadComments = async (playerId: string) => {
        setLoadingComments(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments/player/${playerId}`
            );
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Error cargando comentarios:", error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !selectedPlayerId) return;

        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('Debes iniciar sesión para comentar');
            return;
        }

        setSubmittingComment(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    playerId: selectedPlayerId,
                    comment: newComment,
                }),
            });

            if (response.ok) {
                setNewComment('');
                loadComments(selectedPlayerId);
            }
        } catch (error) {
            console.error("Error enviando comentario:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok && selectedPlayerId) {
                loadComments(selectedPlayerId);
            }
        } catch (error) {
            console.error("Error eliminando comentario:", error);
        }
    };

    const handleSelectPlayer = async (player: PlayerSuggestion) => {
        isSelectingPlayer.current = true;
        setSuggestions([]);
        setShowSuggestions(false);
        await validatePlayerById(player.id, player.full_name);
    };

    const handleToggleFavorite = async () => {
        if (!selectedPlayerId) return;

        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('Debes iniciar sesión para gestionar favoritos');
            return;
        }

        setAddingFavorite(true);

        let result;
        if (isInFavorites) {
            result = await removeFavorite(selectedPlayerId);
        } else {
            result = await addFavorite(selectedPlayerId);
        }

        setAddingFavorite(false);

        if (result.success) {
            setIsInFavorites(!isInFavorites);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "valid":
                return "bg-green-50 border-burdeos-dark";
            case "invalid":
                return "bg-red-50 border-burdeos-dark";
            case "doubt":
                return "bg-yellow-50 border-burdeos-dark";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "valid":
                return <CheckCircle className="w-6 h-6 text-white" />;
            case "invalid":
                return <XCircle className="w-6 h-6 text-white" />;
            case "doubt":
                return <HelpCircle className="w-6 h-6 text-white" />;
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "valid":
                return "Cumple la filosofía del Athletic Club";
            case "invalid":
                return "No cumple la filosofía del Athletic Club";
            case "doubt":
                return "Duda sobre si cumple la filosofía";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-burdeos-dark mb-2">
                            Validador de Filosofía
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Introduce el nombre del jugador para validar si cumple con la
                            filosofía del Athletic Club
                        </p>

                        <div className="space-y-6">
                            <div ref={searchRef} className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre del jugador
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ej: Iker Muniain, Iñaki Williams..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-burdeos-light transition-colors placeholder:text-gray-400 text-gray-900"
                                    />
                                    {loadingSuggestions && (
                                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-burdeos-light animate-spin" />
                                    )}
                                </div>

                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                                        {suggestions.map((player) => (
                                            <button
                                                key={player.id}
                                                onClick={() => handleSelectPlayer(player)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer flex items-center gap-3"
                                            >
                                                {player.image_url ? (
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-md">
                                                        <Image
                                                            src={player.image_url}
                                                            alt={player.full_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-burdeos-dark to-burdeos-light flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                                                        {player.full_name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">
                                                        {player.full_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {player.current_club && player.age ? (
                                                            <span>{player.current_club} • {player.age} años</span>
                                                        ) : player.current_club ? (
                                                            <span>{player.current_club}</span>
                                                        ) : player.age ? (
                                                            <span>{player.age} años</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {showSuggestions && suggestions.length === 0 && !loadingSuggestions && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                                        No se encontraron jugadores
                                    </div>
                                )}
                            </div>

                            {validating && (
                                <div className="flex items-center justify-center gap-2 text-burdeos-light">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="font-semibold">Validando jugador...</span>
                                </div>
                            )}
                        </div>

                        {result && !validating && (
                            <div className={`mt-8 rounded-xl border-2 overflow-hidden ${getStatusColor(result.status)}`}>
                                {/* Header con foto y estado */}
                                <div className="bg-linear-to-r from-burdeos-dark to-burdeos-light p-6">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="shrink-0">
                                            {result.jugador.image_url ? (
                                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                                    <Image
                                                        src={result.jugador.image_url}
                                                        alt={result.jugador.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white text-4xl font-bold bg-linear-to-br from-burdeos-light to-burdeos-dark">
                                                    {result.jugador.name
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 text-white text-center md:text-left">
                                            <h3 className="font-bold text-3xl mb-3">
                                                {result.jugador.name}
                                            </h3>
                                            <div className="flex flex-col md:flex-row items-center gap-3">
                                                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                                                    {getStatusIcon(result.status)}
                                                    <p className="font-semibold text-lg">
                                                        {getStatusText(result.status)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleToggleFavorite}
                                                    disabled={addingFavorite}
                                                    className={`flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${isInFavorites
                                                        ? 'bg-white text-burdeos-dark hover:bg-white/90 shadow-lg'
                                                        : 'bg-white/30 text-white hover:bg-white/40'
                                                        }`}
                                                >
                                                    {addingFavorite ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Star className={`w-5 h-5 ${isInFavorites ? 'fill-burdeos-dark text-burdeos-dark' : 'text-white'}`} />
                                                    )}
                                                    {addingFavorite ? 'Guardando...' : (isInFavorites ? 'En favoritos' : 'Agregar a favoritos')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-6 space-y-6">
                                    {/* Información personal */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                                            <MapPin className="w-5 h-5 text-burdeos-light mt-1 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Lugar de nacimiento</p>
                                                <p className="text-gray-700">{result.jugador.born_place}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                                            <Calendar className="w-5 h-5 text-burdeos-light mt-1 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Fecha de nacimiento</p>
                                                <p className="text-gray-700">{result.jugador.birth_date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Razón */}
                                    <div className="p-5 bg-white rounded-lg shadow-sm border-l-4 border-burdeos-light">
                                        <p className="font-bold text-gray-900 mb-2">
                                            {result.status === "valid" ? "¿Por qué cumple?" : result.status === "invalid" ? "¿Por qué no cumple?" : "Motivo de la duda"}
                                        </p>
                                        <p className="text-gray-700 leading-relaxed">{result.reason}</p>
                                    </div>

                                    {/* Clubes */}
                                    {result.jugador.clubs && result.jugador.clubs.length > 0 && (
                                        <div>
                                            <p className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                                <Trophy className="w-5 h-5 text-burdeos-light" />
                                                Trayectoria en clubes
                                            </p>
                                            <div className="relative">
                                                {/* Línea vertical del timeline */}
                                                <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-burdeos-light/30"></div>

                                                <div className="space-y-4">
                                                    {result.jugador.clubs.map((club, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="relative flex items-start gap-4 group"
                                                        >
                                                            {/* Punto en el timeline */}
                                                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-burdeos-light shadow-sm group-hover:scale-110 transition-transform">
                                                                <span className="text-burdeos-dark font-bold text-sm">{club.seasons}</span>
                                                            </div>

                                                            {/* Contenido */}
                                                            <div className="flex-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 group-hover:border-burdeos-light">
                                                                <p className="font-semibold text-gray-900 text-lg">
                                                                    {club.club.name}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {club.seasons} {club.seasons === 1 ? 'temporada' : 'temporadas'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sección de Comentarios */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                            <MessageCircle className="w-5 h-5 text-burdeos-light" />
                                            Comentarios ({comments.length})
                                        </h3>

                                        {/* Formulario para nuevo comentario */}
                                        <div className="mb-6">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Escribe tu opinión sobre este jugador..."
                                                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burdeos-light resize-none"
                                                rows={3}
                                            />
                                            <button
                                                onClick={handleSubmitComment}
                                                disabled={submittingComment || !newComment.trim()}
                                                className="mt-2 px-4 py-2 bg-burdeos-dark text-white rounded-lg hover:bg-burdeos-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {submittingComment ? 'Enviando...' : 'Comentar'}
                                            </button>
                                        </div>

                                        {/* Lista de comentarios */}
                                        <div className="space-y-4">
                                            {loadingComments ? (
                                                <div className="flex justify-center py-8">
                                                    <Loader2 className="w-6 h-6 animate-spin text-burdeos-light" />
                                                </div>
                                            ) : comments.length === 0 ? (
                                                <p className="text-gray-600 text-center py-8">
                                                    No hay comentarios aún. ¡Sé el primero en comentar!
                                                </p>
                                            ) : (
                                                comments.map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {comment.user.picture ? (
                                                                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                                                    <Image
                                                                        src={comment.user.picture}
                                                                        alt={comment.user.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-burdeos-light text-white flex items-center justify-center shrink-0">
                                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="font-semibold text-gray-900">
                                                                        {comment.user.name}
                                                                    </p>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                            })}
                                                                        </span>
                                                                        {(() => {
                                                                            const token = localStorage.getItem('auth_token');
                                                                            if (!token) return null;

                                                                            try {
                                                                                const payload = JSON.parse(atob(token.split('.')[1]));
                                                                                if (payload.sub === comment.userId) {
                                                                                    return (
                                                                                        <button
                                                                                            onClick={() => handleDeleteComment(comment.id)}
                                                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                                                            title="Eliminar comentario"
                                                                                        >
                                                                                            <Trash2 className="w-4 h-4" />
                                                                                        </button>
                                                                                    );
                                                                                }
                                                                            } catch {
                                                                                return null;
                                                                            }
                                                                            return null;
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-700 mt-1">
                                                                    {comment.comment}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-burdeos-dark"></div>
            </div>
        }>
            <ValidadorContent />
        </Suspense>
    );
}