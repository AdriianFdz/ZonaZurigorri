'use client';

import { useState, useEffect, ReactNode } from 'react';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import { LocaleProvider } from '@/lib/i18n';

// Importar traducciones
import esTranslations from '@/messages/es.json';
import enTranslations from '@/messages/en.json';

const translations = {
    es: esTranslations,
    en: enTranslations,
};

export default function ClientLayout({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState('es');

    useEffect(() => {
        // Obtener idioma guardado o del navegador
        const savedLocale = localStorage.getItem('preferred-locale');
        const browserLocale = navigator.language.split('-')[0];
        const initialLocale = savedLocale || (browserLocale === 'en' ? 'en' : 'es');
        setLocale(initialLocale);
    }, []);

    return (
        <LocaleProvider locale={locale} translations={translations[locale as keyof typeof translations]}>
            <Header />
            {children}
            <footer className="text-white w-full bottom-0 bg-linear-to-r from-burdeos-dark via-burdeos-light to-burdeos-dark">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col items-center gap-4">
                        <Logo />
                        <p className="text-sm text-red-200">
                            &copy; {new Date().getFullYear()} Zona Zurigorri. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </LocaleProvider>
    );
}
