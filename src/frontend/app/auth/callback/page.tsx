'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('auth_token', token);
            window.location.href = '/';
        } else {
            router.push('/');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-burdeos-dark to-burdeos-light">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">{t('login.authenticating')}</p>
            </div>
        </div>
    );
}

function LoadingFallback() {
    const t = useTranslations();
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-burdeos-dark to-burdeos-light">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">{t('common.loading')}</p>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
