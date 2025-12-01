"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n";
import { API_BASE_URL } from "@/config";

interface Article {
    id: string;
    title: string;
    link: string;
    description: string;
    published: string;
    author: string | null;
    image_url: string | null;
    image_title: string | null;
}

interface NewsResponse {
    total: number;
    articles: Article[];
    source: string;
}

export default function Page() {
    const t = useTranslations();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLimit, setCurrentLimit] = useState(10);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [hasMore, setHasMore] = useState(true);

    const fetchNews = useCallback(async (limit: number, append: boolean = false) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
            });

            if (startDate) params.append("start_date", startDate);
            if (endDate) params.append("end_date", endDate);

            const response = await fetch(
                `${API_BASE_URL}/api/v1/news/?${params}`
            );

            if (!response.ok) {
                throw new Error("Error al cargar las noticias");
            }

            const data: NewsResponse = await response.json();

            if (append) {
                setArticles((prev) => [...prev, ...data.articles]);
            } else {
                setArticles(data.articles);
            }

            setHasMore(data.articles.length === limit);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error desconocido"
            );
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchNews(currentLimit);
    }, [startDate, endDate, currentLimit, fetchNews]);

    const loadMore = () => {
        const newLimit = currentLimit + 10;
        setCurrentLimit(newLimit);
        fetchNews(newLimit, false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setCurrentLimit(10);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-burdeos-dark mb-2">
                            {t('news.title')}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {t('news.subtitle')}
                        </p>

                        {/* Filtros */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('news.startDate')}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-burdeos-light transition-colors placeholder:text-gray-400 text-gray-300"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('news.endDate')}
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-burdeos-light transition-colors placeholder:text-gray-400 text-gray-300" />
                            </div>
                            {(startDate || endDate) && (
                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="h-[42px] px-4 text-sm font-medium text-burdeos-dark border border-burdeos-light rounded-lg hover:bg-burdeos-light hover:text-white transition-all whitespace-nowrap"
                                    >
                                        {t('news.clearFilters')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Loading inicial */}
                        {loading && articles.length === 0 && (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-burdeos-light border-t-burdeos-dark"></div>
                                <p className="mt-4 text-gray-600">{t('news.loading')}</p>
                            </div>
                        )}

                        {/* Noticias */}
                        {!loading && articles.length === 0 && !error && (
                            <div className="text-center py-12 text-gray-500">
                                {t('news.noNews')}
                            </div>
                        )}

                        <div className="space-y-6">
                            {articles.map((article) => (
                                <article
                                    key={article.id}
                                    className="border-2 border-gray-100 rounded-lg hover:border-burdeos-light transition-all overflow-hidden"
                                >
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block hover:bg-gray-50"
                                    >
                                        <div className="flex gap-4 p-6">
                                            {/* Imagen */}
                                            {article.image_url && (
                                                <div className="w-48 h-32 shrink-0 relative rounded-lg overflow-hidden">
                                                    <Image
                                                        src={article.image_url}
                                                        alt={article.image_title || article.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Contenido */}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-burdeos-dark transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-600 mb-3 line-clamp-2">
                                                    {article.description}
                                                </p>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    {article.author && (
                                                        <>
                                                            <span className="font-medium">
                                                                {article.author}
                                                            </span>
                                                            <span>·</span>
                                                        </>
                                                    )}
                                                    <time>{formatDate(article.published)}</time>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </article>
                            ))}
                        </div>

                        {/* Botón cargar más */}
                        {articles.length > 0 && hasMore && (
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="w-full mt-6 py-3 border-2 border-burdeos-light rounded-lg font-semibold text-burdeos-dark hover:bg-burdeos-light hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('common.loading') : t('news.loadMore')}
                            </button>
                        )}

                        {/* Fin de noticias */}
                        {!hasMore && articles.length > 0 && (
                            <p className="text-center text-gray-500 mt-6">
                                {t('news.noMoreNews')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}