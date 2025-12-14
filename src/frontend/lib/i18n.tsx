import { createContext, useContext, ReactNode } from 'react';

type Translations = {
    [key: string]: any;
};

const LocaleContext = createContext<{
    locale: string;
    t: (key: string) => string;
}>({
    locale: 'es',
    t: (key: string) => key,
});

export function LocaleProvider({
    children,
    locale,
    translations,
}: {
    children: ReactNode;
    locale: string;
    translations: Translations;
}) {
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            value = value?.[k];
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <LocaleContext.Provider value={{ locale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useTranslations() {
    const { t } = useContext(LocaleContext);
    return t;
}

export function useLocale() {
    const { locale } = useContext(LocaleContext);
    return locale;
}
