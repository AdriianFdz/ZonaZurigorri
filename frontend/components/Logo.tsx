'use client';

import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'

export default function Logo() {
    const t = useTranslations();
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md pt-0.5">
                <Image
                    src="/logo.webp"
                    alt="Zona Zurigorri Logo"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                />
            </div>
            <div className="hidden sm:block">
                <p className="text-xl sm:text-2xl font-bold">Zona Zurigorri</p>
                <p className="text-xs text-red-200">{t('logo.tagline')}</p>
            </div>
        </div>
    )
}