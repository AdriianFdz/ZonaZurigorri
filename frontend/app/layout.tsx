'use client';

import './globals.css'
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo'
import Header from '@/components/Header';
import { LocaleProvider } from '@/lib/i18n';

// Importar traducciones
import esTranslations from '@/messages/es.json';
import enTranslations from '@/messages/en.json';

const translations = {
  es: esTranslations,
  en: enTranslations,
};

export const metadata = {
  title: 'Zona Zurigorri - Validador de Filosofía Athletic Club',
  description: 'Aplicación web para validar jugadores según la filosofía del Athletic Club de Bilbao. Descubre si un futbolista cumple con los criterios de nacimiento y formación en territorio vasco.',
  keywords: 'Athletic Club, Bilbao, filosofía Athletic, jugadores vascos, validador, País Vasco, Euskadi',
  authors: [{ name: 'Zona Zurigorri' }],
  openGraph: {
    title: 'Zona Zurigorri - Validador de Filosofía Athletic Club',
    description: 'Valida jugadores según la filosofía única del Athletic Club',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zona Zurigorri',
    description: 'Validador de filosofía del Athletic Club de Bilbao',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    // Obtener idioma guardado o del navegador
    const savedLocale = localStorage.getItem('preferred-locale');
    const browserLocale = navigator.language.split('-')[0];
    const initialLocale = savedLocale || (browserLocale === 'en' ? 'en' : 'es');
    setLocale(initialLocale);
  }, []);

  return (
    <html lang={locale}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
      </head>
      <body>
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
      </body>
    </html>
  )
}