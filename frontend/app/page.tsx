"use client";

import { ChevronRight, Star, Heart, Users, Trophy, Award, Medal } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import TarjetaNorma from "@/components/TarjetaNorma";
import TarjetaPalmares from "@/components/TarjetaPalmares";
import ActionButton from "@/components/ActionButton";
import ScrollDownButton from "@/components/ScrollDownButton";

export default function Page({ }) {
  const t = useTranslations();
  return (
    <div className="w-full">
      <div id="hero-section" className="min-h-screen w-full bg-linear-120 from-burdeos-dark via-burdeos-light to-burdeos-dark flex items-center justify-center text-center pt-20 px-4 relative">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t('home.hero.title')}
            <br />
            <span className="text-red-200"> Unique In The World</span>
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto px-4">
            {t('home.hero.description')}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <ActionButton href="/validador" variant="primary" icon={ChevronRight}>
              {t('home.hero.validatorButton')}
            </ActionButton>
            <ActionButton href="/noticias" variant="secondary" icon={Star}>
              {t('home.hero.newsButton')}
            </ActionButton>
          </div>
        </div>
        <ScrollDownButton />
      </div>

      <div id="filosofia-section" className="w-full bg-white text-black text-center py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-burdeos-dark px-4">{t('home.philosophy.title')}</h2>
        <p className="mb-8 text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-4">{t('home.philosophy.cantera.description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pb-10">
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
      <div className="w-full bg-linear-to-b from-gray-50 to-white py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-burdeos-dark">
            {t('home.palmares.title')}
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Más de un siglo de historia con títulos conseguidos manteniendo nuestra filosofía única.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <TarjetaPalmares
              icono={Trophy}
              cantidad="8"
              titulo={t('home.palmares.leagues')}
              descripcion="Campeonatos nacionales"
            />
            <TarjetaPalmares
              icono={Award}
              cantidad="25"
              titulo={t('home.palmares.cups')}
              descripcion="Segundo club con más títulos"
            />
            <TarjetaPalmares
              icono={Medal}
              cantidad="3"
              titulo={t('home.palmares.superCups')}
              descripcion="Supercopa de España"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
