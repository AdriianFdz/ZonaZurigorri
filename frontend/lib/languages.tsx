import { ComponentType } from 'react';

// Componentes de banderas usando flag-icons
const SpainFlag = () => <span className="fi fi-es"></span>;
const UKFlag = () => <span className="fi fi-gb"></span>;
const EuskadiFlag = () => <span className="fi fi-es-pv"></span>;

// Configuración de idiomas disponibles
export interface LanguageConfig {
    code: string;
    name: string;
    flag: ComponentType;
    nativeName: string;
    flagCode: string;
}

export const LANGUAGES: LanguageConfig[] = [
    {
        code: 'es',
        name: 'Spanish',
        flag: SpainFlag,
        nativeName: 'Español',
        flagCode: 'es'
    },
    {
        code: 'en',
        name: 'English',
        flag: UKFlag,
        nativeName: 'English',
        flagCode: 'gb'
    },
    {
        code: 'eus',
        name: 'Basque',
        flag: EuskadiFlag,
        nativeName: 'Euskara',
        flagCode: 'es-pv'
    }
];

// Función para obtener todos los códigos de idioma disponibles
export function getAvailableLocales(): string[] {
    return LANGUAGES.map(lang => lang.code);
}

// Función para obtener configuración de idioma por código
export function getLanguageByCode(code: string): LanguageConfig | undefined {
    return LANGUAGES.find(lang => lang.code === code);
}

// Idioma por defecto
export const DEFAULT_LOCALE = 'es';
