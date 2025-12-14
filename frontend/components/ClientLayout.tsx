'use client';

import { useState, useEffect, ReactNode } from 'react';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import { LocaleProvider } from '@/lib/i18n';
import { DEFAULT_LOCALE, getAvailableLocales } from '@/lib/languages';

// Importación dinámica de traducciones
const translations: Record<string, any> = {
    es: require('@/messages/es.json'),
    en: require('@/messages/en.json'),
    eus: require('@/messages/eus.json'),
};

export default function ClientLayout({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState(DEFAULT_LOCALE);

    useEffect(() => {
        const savedLocale = localStorage.getItem('preferred-locale');
        const browserLocale = navigator.language.split('-')[0];
        const availableLocales = getAvailableLocales();

        let initialLocale = DEFAULT_LOCALE;

        if (savedLocale && availableLocales.includes(savedLocale)) {
            initialLocale = savedLocale;
        } else if (availableLocales.includes(browserLocale)) {
            initialLocale = browserLocale;
        }

        setLocale(initialLocale);
    }, []);

    return (
        <LocaleProvider locale={locale} translations={translations[locale] || translations[DEFAULT_LOCALE]}>
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
