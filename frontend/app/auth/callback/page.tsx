'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Guardar token en localStorage
            localStorage.setItem('auth_token', token);

            // Redirigir a la página principal y recargar
            window.location.href = '/';
        } else {
            // Si no hay token, redirigir al inicio
            router.push('/');
        }
    }, [searchParams, router]); return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-burdeos-dark to-burdeos-light">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">Autenticando...</p>
            </div>
        </div>
    );
}
