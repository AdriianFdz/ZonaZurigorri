'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li>
            <Link
                href={href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 block hover:scale-110 ${isActive
                    ? 'bg-white scale-110'
                    : ''
                    }`}
                style={isActive ? { color: '#8B2332' } : {}}
            >
                {children}
            </Link>
        </li>
    );
}