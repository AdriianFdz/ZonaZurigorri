"use client";

interface Noticia {
    author: string;
    handle: string;
    time: string;
    content: string;
}

export default function Page() {
    const mockNoticias: Noticia[] = [
        {
            author: "Athletic Club Info",
            handle: "@AthleticInfo",
            time: "2h",
            content:
                "Iñaki Williams renueva su compromiso con el Athletic hasta 2027. ¡Increíble noticia para la afición!",
        },
        {
            author: "Lezama Noticias",
            handle: "@LezamaNews",
            time: "4h",
            content:
                "El Bilbao Athletic consigue una importante victoria por 3-1 ante el Unionistas. Destacan las actuaciones de los jóvenes canteranos.",
        },
        {
            author: "Athletic Análisis",
            handle: "@AthleticData",
            time: "6h",
            content:
                "Análisis táctico: Cómo el Athletic ha mejorado su presión alta esta temporada con un 78% de recuperaciones en campo rival.",
        },
        {
            author: "Zona Zurigorri",
            handle: "@ZonaZurigorri",
            time: "8h",
            content:
                "Nico Williams brilla en San Mamés con dos asistencias que fueron clave para la victoria ante el rival. La cantera sigue dando frutos.",
        },
        {
            author: "Athletic Club Info",
            handle: "@AthleticInfo",
            time: "10h",
            content:
                "El Athletic mantiene su filosofía: todos los fichajes del último mercado provienen de la cantera vasca. Único en el mundo.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-burdeos-dark mb-2">
                            Noticias Athletic
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Las últimas novedades del club
                        </p>

                        <div className="space-y-4">
                            {mockNoticias.map((noticia, index) => (
                                <div
                                    key={index}
                                    className="p-6 border-2 border-gray-100 rounded-lg hover:bg-gray-50 transition-all hover:border-burdeos-light"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-linear-120 from-burdeos-dark via-burdeos-light to-burdeos-dark"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="font-bold text-gray-900">
                                                    {noticia.author}
                                                </span>
                                                <span className="text-gray-500">{noticia.handle}</span>
                                                <span className="text-gray-400">·</span>
                                                <span className="text-gray-500">{noticia.time}</span>
                                            </div>
                                            <p className="text-gray-800">{noticia.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-3 border-2 border-burdeos-light rounded-lg font-semibold text-burdeos-dark hover:bg-burdeos-light hover:text-white transition-all">
                            Cargar más noticias
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}