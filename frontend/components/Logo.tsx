import Image from 'next/image'

export default function Logo() {
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md pt-0.5">
                <Image
                    src="/logo.svg"
                    alt="Zona Zurigorri Logo"
                    width={32}
                    height={32}
                />
            </div>
            <div>
                <p className="text-2xl font-bold">Zona Zurigorri</p>
                <p className="text-xs text-red-200">Desde el pueblo, para la afición</p>
            </div>
        </div>
    )
}