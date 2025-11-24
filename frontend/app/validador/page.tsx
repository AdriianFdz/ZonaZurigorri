"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, CheckCircle, XCircle, Loader2, Trophy, HelpCircle } from "lucide-react";

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

export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<PlayerSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [validating, setValidating] = useState(false);
    const [result, setResult] = useState<ValidationResult | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const isSelectingPlayer = useRef(false);

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Buscar jugadores con debounce
    useEffect(() => {
        // Si se está seleccionando un jugador, no hacer búsqueda
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

        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/v1/philosophy/players/search?q=${encodeURIComponent(searchQuery)}`
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
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery]);

    const handleSelectPlayer = async (player: PlayerSuggestion) => {
        isSelectingPlayer.current = true;
        setSuggestions([]);
        setShowSuggestions(false);
        setValidating(true);
        setResult(null);
        setSearchQuery(player.full_name);

        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/philosophy/validate/${player.id}`
            );

            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                console.error("Error validando jugador");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setValidating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "valid":
                return "bg-green-50 border-green-200";
            case "invalid":
                return "bg-red-50 border-red-200";
            case "doubt":
                return "bg-yellow-50 border-yellow-200";
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

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case "valid":
                return "text-green-700";
            case "invalid":
                return "text-red-700";
            case "doubt":
                return "text-yellow-700";
            default:
                return "text-gray-700";
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

                                {/* Sugerencias */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                                        {suggestions.map((player) => (
                                            <button
                                                key={player.id}
                                                onClick={() => handleSelectPlayer(player)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer flex items-center gap-3"
                                            >
                                                {player.image_url ? (
                                                    <img
                                                        src={player.image_url}
                                                        alt={player.full_name}
                                                        className="w-12 h-12 rounded-full object-cover shrink-0 shadow-md"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling!.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-burdeos-dark to-burdeos-light flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md ${player.image_url ? 'hidden' : ''}`}>
                                                    {player.full_name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>
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
                                <div className="bg-gradient-to-r from-burdeos-dark to-burdeos-light p-6">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="shrink-0">
                                            {result.jugador.image_url ? (
                                                <img
                                                    src={result.jugador.image_url}
                                                    alt={result.jugador.name}
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling!.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-32 h-32 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br from-burdeos-light to-burdeos-dark ${result.jugador.image_url ? 'hidden' : ''}`}>
                                                {result.jugador.name
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>
                                        </div>

                                        <div className="flex-1 text-white text-center md:text-left">
                                            <h3 className="font-bold text-3xl mb-3">
                                                {result.jugador.name}
                                            </h3>
                                            <div className="flex items-center justify-center md:justify-start gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm inline-flex">
                                                {getStatusIcon(result.status)}
                                                <p className="font-semibold text-lg">
                                                    {getStatusText(result.status)}
                                                </p>
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {result.jugador.clubs.map((club, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900 mb-1">
                                                                    {club.club.name}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {club.seasons} {club.seasons === 1 ? 'temporada' : 'temporadas'}
                                                                </p>
                                                            </div>
                                                            <div className="bg-burdeos-light/10 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                                                <span className="text-burdeos-dark font-bold">{club.seasons}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}