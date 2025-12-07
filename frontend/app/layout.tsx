import './globals.css'
import ClientLayout from '@/components/ClientLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
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
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}