import { ChevronRight, Star, Heart, Users, Trophy, Award, Medal } from "lucide-react";
import TarjetaNorma from "@/components/TarjetaNorma";
import TarjetaPalmares from "@/components/TarjetaPalmares";
import ActionButton from "@/components/ActionButton";
import ScrollDownButton from "@/components/ScrollDownButton";

export default function Page({ }) {
  return (
    <div className="w-full">
      <div id="hero-section" className="min-h-screen w-full bg-linear-120 from-burdeos-dark via-burdeos-light to-burdeos-dark flex items-center justify-center text-center pt-20 relative">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            La filosofía del Athletic Club,
            <br />
            <span className="text-red-200"> Unique In The World</span>
          </h1>
          <p className="text-white/90 text-center max-w-2xl mx-auto">
            Verifica jugadores, descubre promesas y mantente al día con el Athletic Club.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <ActionButton href="/validador" variant="primary" icon={ChevronRight}>
              Validar Jugador
            </ActionButton>
            <ActionButton href="/favoritos" variant="secondary" icon={Star}>
              Ver Favoritos
            </ActionButton>
          </div>
        </div>
        <ScrollDownButton />
      </div>

      <div id="filosofia-section" className="w-full bg-white text-black text-center py-16">
        <h2 className="text-3xl font-bold mb-3 text-burdeos-dark">La Filosofía del Athletic Club</h2>
        <p className="mb-8 text-gray-600">Una manera única de entender el fútbol, basada en la formación de jugadores locales y el compromiso con la cantera.</p>

        <div className="flex justify-center gap-6 px-8 pb-10">
          <TarjetaNorma
            icono={Heart}
            titulo="Euskal Herria"
            subtitulo="Solo jugadores nacidos o formados en las siete provincias de Euskal Herria: Bizkaia, Gipuzkoa, Araba, Nafarroa, Lapurdi, Zuberoa y Nafarroa Behera."
          />
          <TarjetaNorma
            icono={Users}
            titulo="Cantera Propia"
            subtitulo="Apostamos por la formación en nuestra cantera y en los clubes de Euskal Herria, desarrollando el talento local desde la base."
          />
          <TarjetaNorma
            icono={Trophy}
            titulo="Filosofía Única"
            subtitulo="El único club de élite europeo que mantiene una política deportiva basada exclusivamente en su territorio y cantera. Unique in the World."
          />
        </div>
      </div>

      {/* Sección de Palmarés */}
      <div className="w-full bg-linear-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-burdeos-dark">
            Palmarés del Athletic Club
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Más de un siglo de historia con títulos conseguidos manteniendo nuestra filosofía única.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <TarjetaPalmares
              icono={Trophy}
              cantidad="8"
              titulo="Ligas"
              descripcion="Campeonatos nacionales"
            />
            <TarjetaPalmares
              icono={Award}
              cantidad="25"
              titulo="Copas del Rey"
              descripcion="Segundo club con más títulos"
            />
            <TarjetaPalmares
              icono={Medal}
              cantidad="3"
              titulo="Supercopas"
              descripcion="Supercopa de España"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
