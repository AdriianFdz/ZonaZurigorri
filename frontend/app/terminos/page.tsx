'use client';

import { useTranslations } from '@/lib/i18n';

export default function TerminosPage() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-burdeos-dark mb-6">
                        Términos de Servicio
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Última actualización: 7 de diciembre de 2025
                    </p>

                    <div className="space-y-8 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                1. Aceptación de los Términos
                            </h2>
                            <p>
                                Al acceder y utilizar Zona Zurigorri, aceptas estar sujeto a estos Términos de Servicio
                                y a todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos
                                términos, no debes utilizar este servicio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                2. Descripción del Servicio
                            </h2>
                            <p>
                                Zona Zurigorri es una aplicación web educativa que permite validar jugadores de fútbol
                                según la filosofía del Athletic Club de Bilbao. El servicio utiliza datos públicos de
                                Wikidata y OpenStreetMap para proporcionar información sobre jugadores y sus lugares de
                                nacimiento o formación.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                3. Registro y Autenticación
                            </h2>
                            <p className="mb-3">
                                Para acceder a funciones como favoritos y comentarios, debes autenticarte mediante
                                proveedores OAuth (Google, Discord). Al registrarte, te comprometes a que:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Toda la información proporcionada es precisa y verdadera</li>
                                <li>Mantendrás la seguridad de tu cuenta</li>
                                <li>Notificarás inmediatamente cualquier uso no autorizado</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                4. Uso Aceptable
                            </h2>
                            <p className="mb-3">Te comprometes a NO:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Utilizar el servicio para fines ilegales o no autorizados</li>
                                <li>Publicar contenido ofensivo, difamatorio o que incite al odio</li>
                                <li>Intentar acceder sin autorización a sistemas o datos</li>
                                <li>Interferir con el funcionamiento normal del servicio</li>
                                <li>Realizar scraping o extracción automatizada de datos</li>
                                <li>Suplantar la identidad de otra persona o entidad</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                5. Contenido de Usuario
                            </h2>
                            <p className="mb-3">
                                Al publicar comentarios o contenido en la plataforma:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Mantienes la propiedad de tu contenido</li>
                                <li>Nos otorgas una licencia no exclusiva para mostrar y distribuir ese contenido</li>
                                <li>Eres responsable del contenido que publicas</li>
                                <li>Podemos eliminar contenido que viole estos términos</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                6. Propiedad Intelectual
                            </h2>
                            <p>
                                El contenido original de Zona Zurigorri (diseño, código) está protegido por
                                derechos de autor. El logo fue generado mediante Bing AI y no reclamamos derechos
                                exclusivos sobre él. Los datos de jugadores provienen de fuentes públicas (Wikidata)
                                bajo licencias abiertas. No reclamamos propiedad sobre la filosofía del Athletic Club
                                ni sobre nombres o imágenes de jugadores.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                7. Limitación de Responsabilidad
                            </h2>
                            <p className="mb-3">
                                Zona Zurigorri se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>La precisión, actualidad o completitud de los datos mostrados</li>
                                <li>Que el servicio estará disponible sin interrupciones</li>
                                <li>Que el servicio esté libre de errores o vulnerabilidades</li>
                            </ul>
                            <p className="mt-3">
                                No seremos responsables de daños directos, indirectos, incidentales o consecuentes
                                derivados del uso o imposibilidad de uso del servicio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                8. Modificaciones del Servicio
                            </h2>
                            <p>
                                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte del
                                servicio en cualquier momento, con o sin previo aviso. No seremos responsables ante ti
                                ni ante terceros por cualquier modificación, suspensión o discontinuación.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                9. Terminación
                            </h2>
                            <p>
                                Podemos suspender o terminar tu acceso al servicio inmediatamente, sin previo aviso,
                                por cualquier motivo, incluyendo pero no limitado a violaciones de estos Términos de Servicio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                10. Ley Aplicable
                            </h2>
                            <p>
                                Estos términos se regirán e interpretarán de acuerdo con las leyes de España,
                                sin tener en cuenta sus disposiciones sobre conflictos de leyes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                11. Cambios en los Términos
                            </h2>
                            <p>
                                Nos reservamos el derecho de actualizar estos términos en cualquier momento.
                                Las modificaciones entrarán en vigor inmediatamente después de su publicación.
                                Tu uso continuado del servicio después de los cambios constituye tu aceptación de los nuevos términos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                12. Contacto
                            </h2>
                            <p>
                                Si tienes preguntas sobre estos Términos de Servicio, puedes contactarnos a través
                                de hello@adrianfer.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
