import { LucideIcon } from "lucide-react";

interface TarjetaPalmaresProps {
    icono: LucideIcon;
    cantidad: string;
    titulo: string;
    descripcion?: string;
}

export default function TarjetaPalmares({
    icono: Icono,
    cantidad,
    titulo,
    descripcion,
}: TarjetaPalmaresProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 sm:p-8 flex flex-col items-center justify-center text-center border-t-4 border-burdeos-light aspect-square">
            <div className="bg-burdeos-light/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <Icono className="w-8 h-8 sm:w-10 sm:h-10 text-burdeos-light" />
            </div>
            <div className="text-4xl sm:text-5xl font-bold text-burdeos-light mb-2">
                {cantidad}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">{titulo}</h3>
            {descripcion && (
                <p className="text-xs sm:text-sm text-gray-600">{descripcion}</p>
            )}
        </div>
    );
}
