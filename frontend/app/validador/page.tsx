"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";

interface ValidationResult {
    name: string;
    fullName: string;
    isValid: boolean;
    birthPlace: string;
    birthDate: string;
    club: string;
    reason: string;
}

export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");
    const [validating, setValidating] = useState(false);
    const [result, setResult] = useState<ValidationResult | null>(null);

    const handleValidate = async () => {
        if (!searchQuery.trim()) return;

        setValidating(true);
        setTimeout(() => {
            setResult({
                name: searchQuery,
                fullName: searchQuery,
                isValid: Math.random() > 0.3,
                birthPlace: "Bilbao, Bizkaia",
                birthDate: "15/03/2001",
                club: "Athletic Club",
                reason:
                    "Nacido en Bizkaia y formado íntegramente en Lezama desde categoría infantil",
            });
            setValidating(false);
        }, 1500);
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
                            <div>
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
                                        onKeyPress={(e) => e.key === "Enter" && handleValidate()}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-burdeos-light transition-colors placeholder:text-gray-400 text-gray-900"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleValidate}
                                disabled={validating || !searchQuery.trim()}
                                className="w-full bg-linear-120 from-burdeos-dark via-burdeos-light to-burdeos-dark text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {validating ? "Validando..." : "Validar Jugador"}
                            </button>
                        </div>

                        {result && (
                            <div
                                className={`mt-8 p-8 rounded-xl border-2 ${result.isValid
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="shrink-0">
                                        <div className="w-32 h-32 rounded-lg border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold bg-linear-120 from-burdeos-dark via-burdeos-light to-burdeos-dark">
                                            {result.fullName
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-2xl text-gray-900 mb-2">
                                                {result.fullName}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {result.isValid ? (
                                                    <>
                                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                                        <p className="font-semibold text-lg text-green-700">
                                                            Cumple la filosofía del Athletic Club
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-6 h-6 text-red-600" />
                                                        <p className="font-semibold text-lg text-red-700">
                                                            No cumple la filosofía del Athletic Club
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <MapPin className="w-5 h-5 text-burdeos-light" />
                                                <span className="font-semibold">
                                                    Lugar de nacimiento:
                                                </span>
                                                <span>{result.birthPlace}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Calendar className="w-5 h-5 text-burdeos-light" />
                                                <span className="font-semibold">
                                                    Fecha de nacimiento:
                                                </span>
                                                <span>{result.birthDate}</span>
                                            </div>

                                            {result.isValid && (
                                                <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-burdeos-light">
                                                    <p className="font-semibold text-gray-900 mb-2">
                                                        ¿Por qué cumple la filosofía?
                                                    </p>
                                                    <p className="text-gray-700">{result.reason}</p>
                                                </div>
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