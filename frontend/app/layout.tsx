import './globals.css'
import Logo from '@/components/Logo'
import Header from '@/components/Header';
export const metadata = {
  title: 'Zona Zurigorri',
  description: 'Plataforma para los aficionados del Athletic Club de Bilbao',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
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
      </body>
    </html>
  )
}