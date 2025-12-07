'use client';

import { useTranslations } from '@/lib/i18n';

export default function PrivacidadPage() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-burdeos-dark mb-6">
                        Política de Privacidad
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Última actualización: 7 de diciembre de 2025
                    </p>

                    <div className="space-y-8 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                1. Introducción
                            </h2>
                            <p>
                                En Zona Zurigorri, nos tomamos muy en serio tu privacidad. Esta Política de Privacidad
                                explica qué datos personales recopilamos, cómo los usamos, y tus derechos respecto a ellos.
                                Al utilizar nuestro servicio, aceptas las prácticas descritas en esta política.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                2. Información que Recopilamos
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                                2.1 Información de Autenticación OAuth
                            </h3>
                            <p className="mb-3">
                                Cuando te autenticas mediante Google o Discord, recopilamos:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Identificador único</strong> del proveedor OAuth</li>
                                <li><strong>Correo electrónico</strong></li>
                                <li><strong>Nombre</strong> de usuario o nombre completo</li>
                                <li><strong>Foto de perfil</strong> (si está disponible)</li>
                                <li><strong>Proveedor</strong> utilizado (Google, Discord)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                                2.2 Información de Uso
                            </h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Comentarios</strong> que publicas en perfiles de jugadores</li>
                                <li><strong>Jugadores favoritos</strong> que guardas</li>
                                <li><strong>Búsquedas</strong> de jugadores que realizas</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                                2.3 Información Técnica
                            </h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Idioma del navegador</strong> para detectar preferencias</li>
                                <li><strong>Tokens JWT</strong> para mantener tu sesión activa</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                3. Cómo Utilizamos tu Información
                            </h2>
                            <p className="mb-3">Utilizamos la información recopilada para:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Autenticación:</strong> Identificarte y gestionar tu sesión</li>
                                <li><strong>Funcionalidades:</strong> Permitirte guardar favoritos y publicar comentarios</li>
                                <li><strong>Personalización:</strong> Mostrar tu nombre y foto en comentarios</li>
                                <li><strong>Idioma:</strong> Detectar tu idioma preferido automáticamente</li>
                                <li><strong>Seguridad:</strong> Proteger tu cuenta y prevenir abusos</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                4. Base Legal para el Tratamiento (RGPD)
                            </h2>
                            <p className="mb-3">
                                Procesamos tus datos personales bajo las siguientes bases legales:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Consentimiento:</strong> Al registrarte mediante OAuth, consientes el procesamiento de tus datos</li>
                                <li><strong>Ejecución de contrato:</strong> Para proporcionar los servicios que solicitas</li>
                                <li><strong>Interés legítimo:</strong> Para mejorar el servicio y prevenir fraudes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                5. Compartición de Datos
                            </h2>
                            <p className="mb-3">
                                <strong>No vendemos ni alquilamos</strong> tu información personal a terceros.
                                Compartimos datos solo en las siguientes circunstancias:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Proveedores OAuth:</strong> Google y Discord procesan tu autenticación</li>
                                <li><strong>APIs públicas:</strong> Consultamos Wikidata y OpenStreetMap para datos de jugadores (no enviamos tus datos)</li>
                                <li><strong>Comentarios públicos:</strong> Tu nombre y foto aparecen junto a comentarios que publicas</li>
                                <li><strong>Requisitos legales:</strong> Si la ley nos obliga a divulgar información</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                6. Almacenamiento y Seguridad
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                                6.1 Dónde Almacenamos tus Datos
                            </h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Base de datos PostgreSQL:</strong> Información de usuario y comentarios</li>
                                <li><strong>Redis:</strong> Lista de favoritos (sin expiración)</li>
                                <li><strong>LocalStorage del navegador:</strong> Token JWT (máximo 7 días)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                                6.2 Medidas de Seguridad
                            </h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Comunicación mediante <strong>HTTPS</strong> (conexión cifrada)</li>
                                <li><strong>Tokens JWT</strong> firmados para autenticación segura</li>
                                <li><strong>OAuth 2.0</strong> para autenticación sin almacenar contraseñas</li>
                                <li><strong>Validación de autorización</strong> en cada petición</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                7. Retención de Datos
                            </h2>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Datos de usuario:</strong> Mientras mantengas tu cuenta activa</li>
                                <li><strong>Comentarios:</strong> Permanecen hasta que los elimines</li>
                                <li><strong>Favoritos:</strong> Almacenados sin fecha de expiración</li>
                                <li><strong>JWT Tokens:</strong> Expiran a los 7 días automáticamente</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                8. Tus Derechos (RGPD)
                            </h2>
                            <p className="mb-3">
                                Si resides en el Espacio Económico Europeo (EEE), tienes los siguientes derechos:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                                <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos ("derecho al olvido")</li>
                                <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                                <li><strong>Limitación:</strong> Solicitar la restricción del procesamiento</li>
                                <li><strong>Retirar consentimiento:</strong> En cualquier momento</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                9. Cookies y Tecnologías Similares
                            </h2>
                            <p className="mb-3">
                                Utilizamos las siguientes tecnologías de almacenamiento:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>LocalStorage:</strong> Para almacenar tu token JWT y preferencia de idioma</li>
                                <li><strong>No utilizamos cookies de terceros</strong> para rastreo o publicidad</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                10. Privacidad de Menores
                            </h2>
                            <p>
                                Nuestro servicio no está dirigido a menores de 16 años. No recopilamos intencionalmente
                                información personal de menores. Si descubres que un menor ha proporcionado datos personales,
                                contáctanos para eliminarlos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                11. Transferencias Internacionales
                            </h2>
                            <p>
                                Tus datos pueden ser procesados en servidores ubicados en diferentes países.
                                Nos aseguramos de que se implementen medidas de protección adecuadas para cumplir
                                con el RGPD cuando los datos se transfieren fuera del EEE.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                12. Cambios en esta Política
                            </h2>
                            <p>
                                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios
                                significativos mediante un aviso en la aplicación o por correo electrónico. Te recomendamos
                                revisar esta página periódicamente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-burdeos-dark mb-4">
                                13. Contacto y Reclamaciones
                            </h2>
                            <p className="mb-3">
                                Para ejercer tus derechos o hacer preguntas sobre esta política, contáctanos a través de
                                los canales proporcionados en la aplicación.
                            </p>
                            <p>
                                Si no estás satisfecho con nuestra respuesta, tienes derecho a presentar una reclamación
                                ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
