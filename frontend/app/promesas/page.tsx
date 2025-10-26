"use client";

import { useState } from "react";
import { Search, MapPin, Shield } from "lucide-react";

interface Promesa {
    name: string;
    fullName: string;
    position: string;
    age: number;
    birthPlace: string;
    club: string;
    stats: {
        goals: number;
        assists: number;
        matches: number;
        minutes: number;
    };
}

export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");

    const mockPromesas: Promesa[] = [
        {
            name: "Ander Martínez",
            fullName: "Ander Martínez Aldalur",
            position: "MC",
            age: 19,
            birthPlace: "Donostia, Gipuzkoa",
            club: "Bilbao Athletic",
            stats: { goals: 8, assists: 12, matches: 25, minutes: 1890 },
        },
        {
            name: "Jon Etxeberria",
            fullName: "Jon Etxeberria Gómez",
            position: "EI",
            age: 18,
            birthPlace: "Bilbao, Bizkaia",
            club: "Basconia",
            stats: { goals: 15, assists: 7, matches: 22, minutes: 1650 },
        },
        {
            name: "Mikel Zabaleta",
            fullName: "Mikel Zabaleta Iriarte",
            position: "DC",
            age: 20,
            birthPlace: "Iruña, Nafarroa",
            club: "Bilbao Athletic",
            stats: { goals: 2, assists: 1, matches: 28, minutes: 2520 },
        },
    ];

    const filteredPromesas = mockPromesas.filter((promesa) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            promesa.fullName.toLowerCase().includes(searchLower) ||
            promesa.position.toLowerCase().includes(searchLower) ||
            promesa.club.toLowerCase().includes(searchLower)
        );
    });

    const getGradient = (index: number) => {
        const gradients = [
            "from-burdeos-dark via-burdeos-dark to-burdeos-light",
            "from-burdeos-dark via-burdeos-light to-burdeos-light",
            "from-burdeos-light via-burdeos-dark to-burdeos-dark",
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-burdeos-dark mb-4">
                            Promesas del Futuro
                        </h2>
                        <p className="text-xl text-gray-600">
                            Jóvenes talentos que cumplen la filosofía y destacan por su
                            rendimiento
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, posición o club..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-burdeos-light rounded-lg focus:outline-none shadow-sm focus:border-burdeos-dark transition-colors placeholder:text-gray-400 text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPromesas.map((promesa, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-t-4 border-burdeos-light"
                            >
                                <div
                                    className={`h-64 flex items-center justify-center text-white text-6xl font-bold bg-linear-120 ${getGradient(
                                        index
                                    )}`}
                                >
                                    {promesa.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)}
                                </div>

                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                            {promesa.fullName}
                                        </h3>
                                        <p className="text-gray-600">
                                            {promesa.position} • {promesa.age} años
                                        </p>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <MapPin className="w-4 h-4 text-burdeos-light" />
                                            <span>{promesa.birthPlace}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Shield className="w-4 h-4 text-burdeos-light" />
                                            <span>{promesa.club}</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                            Estadísticas 2024/25
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                <div className="text-2xl font-bold text-burdeos-dark">
                                                    {promesa.stats.goals}
                                                </div>
                                                <div className="text-xs text-gray-600">Goles</div>
                                            </div>
                                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                <div className="text-2xl font-bold text-burdeos-light">
                                                    {promesa.stats.assists}
                                                </div>
                                                <div className="text-xs text-gray-600">Asistencias</div>
                                            </div>
                                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                <div className="text-2xl font-bold text-gray-700">
                                                    {promesa.stats.matches}
                                                </div>
                                                <div className="text-xs text-gray-600">Partidos</div>
                                            </div>
                                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                <div className="text-2xl font-bold text-gray-700">
                                                    {promesa.stats.minutes}
                                                </div>
                                                <div className="text-xs text-gray-600">Minutos</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPromesas.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No se encontraron promesas con ese criterio de búsqueda
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}