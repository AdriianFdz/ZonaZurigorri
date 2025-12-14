import { LucideIcon } from "lucide-react";

interface TarjetaNormaProps {
    icono: LucideIcon;
    titulo: string;
    subtitulo: string;
}

export default function TarjetaNorma({ icono: Icono, titulo, subtitulo }: TarjetaNormaProps) {
    return (
        <div className="bg-gray-100 border-2 border-gray-200 rounded-lg p-5 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
                <div className="bg-burdeos-light/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                    <Icono className="w-7 h-7 sm:w-8 sm:h-8 text-burdeos-light" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-burdeos-dark mb-2">
                    {titulo}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {subtitulo}
                </p>
            </div>
        </div>
    );
}
