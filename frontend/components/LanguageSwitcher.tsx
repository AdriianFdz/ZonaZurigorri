"use client";

import { Globe } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/languages';

export default function LanguageSwitcher() {
    const locale = useLocale();

    const switchLanguage = (newLocale: string) => {
        // Guardar la preferencia en localStorage
        localStorage.setItem('preferred-locale', newLocale);

        // Recargar la página para aplicar el nuevo idioma
        window.location.reload();
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <Globe className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold uppercase text-white">{locale}</span>
            </button>

            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {LANGUAGES.map((lang) => {
                    const FlagComponent = lang.flag;
                    return (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer flex items-center gap-3 ${locale === lang.code
                                ? 'bg-burdeos-light text-white hover:bg-burdeos-dark'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="w-6 h-4 rounded-sm overflow-hidden shrink-0 border border-gray-300">
                                <FlagComponent />
                            </div>
                            <span>{lang.nativeName}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
