from app.schemas.philosophy import PhilosophyValidationRequest, PhilosophyValidationResponse
from app.core.config import settings
import httpx
from app.schemas.player import Player, ClubSeasons
from app.schemas.club_dto import ClubDTO
from typing import Dict, Any, Optional, List
import asyncio
from functools import partial
from wikidata.client import Client


class PhilosophyService:
    """
    Servicio para validar la filosofía de jugadores
    """
    
    def __init__(self):
        """Inicializa el servicio con el cliente de Wikidata"""
        self.wikidata_client = Client()
    
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    
    # Territorios válidos según la filosofía del Athletic (solo en español)
    VALID_TERRITORIES = {
        'Vizcaya': ['vizcaya', 'bizkaia'],
        'Guipúzcoa': ['guipuzcoa', 'guipúzcoa', 'gipuzkoa'],
        'Álava': ['alava', 'álava', 'araba'],
        'Navarra': ['navarra', 'nafarroa', 'comunidad foral de navarra'],
        'Labort': ['labort', 'lapurdi', 'pirineos atlanticos', 'pyrénées-atlantiques', 'pyrenees-atlantiques'],
        'Sola': ['sola', 'zuberoa'],
        'Baja Navarra': ['baja navarra', 'nafarroa behera']
    }
    
    def _validate_territory(self, state: str) -> tuple[bool, Optional[str]]:
        """
        Valida si un territorio (estado/provincia) cumple la filosofía del Athletic
        
        Args:
            state: Nombre del estado/provincia desde OSM
            
        Returns:
            Tupla (es_válido, nombre_del_territorio)
        """
        if not state:
            return (False, None)
        
        # Normalizar: quitar mayúsculas, tildes y espacios extra
        state_normalized = state.lower().strip()
        
        for territory, variants in self.VALID_TERRITORIES.items():
            for variant in variants:
                if variant in state_normalized:
                    return (True, territory)
        
        return (False, None)
    
    async def _get_wikidata_entity(self, entity_id: str):
        """
        Obtiene una entidad de Wikidata por su ID usando el cliente wikidata
        
        Args:
            entity_id: ID de la entidad en Wikidata (ej: Q12345)
            
        Returns:
            Objeto Entity de wikidata
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.wikidata_client.get, entity_id, True)
    
    async def _get_entity_label(self, entity, lang: str = 'es') -> str:
        """
        Obtiene la etiqueta de una entidad en un idioma específico
        
        Args:
            entity: Entidad de Wikidata
            lang: Código del idioma (por defecto 'es')
            
        Returns:
            Etiqueta de la entidad
        """
        loop = asyncio.get_event_loop()
        try:
            label = await loop.run_in_executor(None, lambda: entity.label.get(lang, 'Desconocido'))
            return label if label else 'Desconocido'
        except:
            return 'Desconocido'
    
    async def _extract_birth_date(self, entity) -> str:
        """
        Extrae la fecha de nacimiento del jugador (P569)
        
        Args:
            entity: Entidad de Wikidata
            
        Returns:
            Fecha de nacimiento en formato YYYY-MM-DD
        """
        loop = asyncio.get_event_loop()
        try:
            # P569 = date of birth
            birth_date_prop = await loop.run_in_executor(None, lambda: entity.get(self.wikidata_client.get('P569')))
            if birth_date_prop:
                # Extraer el valor de tiempo
                birth_date_str = str(birth_date_prop)
                # Formato: +1995-08-14T00:00:00Z
                if 'T' in birth_date_str:
                    return birth_date_str.split('T')[0].replace('+', '')
                return birth_date_str.replace('+', '')
            return "Desconocido"
        except:
            return "Desconocido"
    
    async def _extract_birth_place(self, entity):
        """
        Extrae el lugar de nacimiento (P19)
        
        Args:
            entity: Entidad de Wikidata
            
        Returns:
            Entidad del lugar de nacimiento o None
        """
        loop = asyncio.get_event_loop()
        try:
            # P19 = place of birth
            birth_place = await loop.run_in_executor(None, lambda: entity.get(self.wikidata_client.get('P19')))
            return birth_place
        except:
            return None
    
    async def _extract_coordinates(self, entity) -> Optional[tuple[float, float]]:
        """
        Extrae las coordenadas geográficas de una entidad (P625)
        
        Args:
            entity: Entidad de Wikidata
            
        Returns:
            Tupla (latitud, longitud) en grados decimales o None
        """
        loop = asyncio.get_event_loop()
        try:
            # P625 = coordinate location
            coords = await loop.run_in_executor(None, lambda: entity.get(self.wikidata_client.get('P625')))
            if coords:
                # coords es un objeto con latitude y longitude
                latitude = coords.latitude
                longitude = coords.longitude
                print(f"DEBUG - Coordenadas extraídas: lat={latitude}, lon={longitude}")
                return (latitude, longitude)
            return None
        except Exception as e:
            print(f"DEBUG - Error extrayendo coordenadas: {str(e)}")
            return None
    
    async def _extract_teams(self, entity) -> list[Dict[str, Any]]:
        """
        Extrae los clubes en los que ha jugado el jugador (P54)
        
        Args:
            entity: Entidad de Wikidata del jugador
            
        Returns:
            Lista de diccionarios con información de cada club
        """
        loop = asyncio.get_event_loop()
        teams = []
        
        try:
            # P54 = member of sports team
            # Necesitamos acceder a los claims directamente para obtener los qualifiers
            entity_dict = await loop.run_in_executor(None, lambda: entity.data)
            claims = entity_dict.get('claims', {})
            team_claims = claims.get('P54', [])
            
            for claim in team_claims:
                try:
                    team_info = {}
                    
                    # ID del club
                    team_info['id'] = claim['mainsnak']['datavalue']['value']['id']
                    team_info['entity'] = None  # Se cargará después si es necesario
                    
                    # Fecha de inicio (P580)
                    qualifiers = claim.get('qualifiers', {})
                    start_date_claims = qualifiers.get('P580', [])
                    if start_date_claims:
                        start_time = start_date_claims[0]['datavalue']['value']['time']
                        team_info['start_date'] = start_time.split('T')[0].replace('+', '')
                    else:
                        team_info['start_date'] = None
                    
                    # Fecha de fin (P582)
                    end_date_claims = qualifiers.get('P582', [])
                    if end_date_claims:
                        end_time = end_date_claims[0]['datavalue']['value']['time']
                        team_info['end_date'] = end_time.split('T')[0].replace('+', '')
                    else:
                        team_info['end_date'] = None
                    
                    teams.append(team_info)
                except Exception as e:
                    print(f"DEBUG - Error extrayendo club: {str(e)}")
                    continue
        except Exception as e:
            print(f"DEBUG - Error en _extract_teams: {str(e)}")
        
        return teams
    
    def _calculate_seasons(self, start_date: Optional[str], end_date: Optional[str]) -> int:
        """
        Calcula el número de temporadas basándose en las fechas
        
        Args:
            start_date: Fecha de inicio (YYYY-MM-DD o YYYY-00-00)
            end_date: Fecha de fin (YYYY-MM-DD o YYYY-00-00), None si aún está en el club
            
        Returns:
            Número de temporadas (mínimo 1)
        """
        if not start_date:
            return 1
        
        try:
            start_year = int(start_date.split('-')[0])
            
            if end_date:
                end_year = int(end_date.split('-')[0])
            else:
                # Si no hay fecha de fin, usar el año actual
                from datetime import datetime
                end_year = datetime.now().year
            
            # Calcular temporadas (mínimo 1)
            seasons = max(1, end_year - start_year + 1)
            return seasons
        except:
            return 1
    
    async def _calculate_clubs_seasons(self, teams: list[Dict[str, Any]]) -> List[ClubSeasons]:
        """
        Calcula las temporadas totales por club, sumando periodos si jugó varias veces
        
        Args:
            teams: Lista de diccionarios con información de clubes
            
        Returns:
            Lista de ClubSeasons con clubs y temporadas
        """
        # Diccionario temporal para acumular: {club_id: {'name': ..., 'seasons': ...}}
        clubs_temp: Dict[str, Dict[str, Any]] = {}
        
        for team_info in teams:
            try:
                club_id = team_info['id']
                club_entity = await self._get_wikidata_entity(club_id)
                club_name = await self._get_entity_label(club_entity)
                
                # Calcular temporadas de este periodo
                seasons = self._calculate_seasons(
                    team_info.get('start_date'),
                    team_info.get('end_date')
                )
                
                # Sumar al total del club (si ya existe, sumar temporadas)
                if club_id in clubs_temp:
                    clubs_temp[club_id]['seasons'] += seasons
                else:
                    clubs_temp[club_id] = {
                        'id': club_id,
                        'name': club_name,
                        'seasons': seasons
                    }
                    
                print(f"DEBUG - Club: {club_name} (ID: {club_id}), temporadas este periodo: {seasons}")
                
            except Exception as e:
                print(f"DEBUG - Error procesando club {team_info.get('id')}: {str(e)}")
                continue
        
        # Convertir a lista de ClubSeasons
        result = []
        for club_data in clubs_temp.values():
            club = ClubDTO(
                id=club_data['id'],
                name=club_data['name']
            )
            result.append(ClubSeasons(club=club, seasons=club_data['seasons']))
        
        return result
    
    async def _check_club_location(
        self, 
        http_client: httpx.AsyncClient, 
        club_id: str
    ) -> tuple[bool, Optional[str], Optional[str]]:
        """
        Verifica si un club está ubicado en un territorio válido
        
        Args:
            http_client: Cliente HTTP para OSM
            club_id: ID del club en Wikidata
            
        Returns:
            Tupla (es_válido, nombre_del_territorio, nombre_del_club)
        """
        try:
            # Obtener entidad del club usando wikidata
            club_entity = await self._get_wikidata_entity(club_id)
            
            # Obtener nombre del club
            club_name = await self._get_entity_label(club_entity)
            
            # Obtener coordenadas del club (P625)
            coordinates = await self._extract_coordinates(club_entity)
            
            if not coordinates:
                print(f"DEBUG - Club {club_id} ({club_name}) no tiene coordenadas")
                return (False, None, club_name)
            
            lat, lon = coordinates
            print(f"DEBUG - Coordenadas del club {club_id} ({club_name}): lat={lat}, lon={lon}")
            
            # Consultar OpenStreetMap
            osm_data = await self._get_location_details_from_osm(http_client, lat, lon)
            
            if not osm_data:
                print(f"DEBUG - OSM no devolvió datos para {club_id}")
                return (False, None, club_name)
            
            address = osm_data.get('address', {})
            
            # Buscar el campo más específico disponible
            subdivision = address.get('subdivision', '')
            province = address.get('province', '')
            county = address.get('county', '')
            state = address.get('state', '')
            
            location_to_check = subdivision or province or county or state
            print(f"DEBUG - OSM Address para club {club_id}: {address}")
            print(f"DEBUG - Location to check: '{location_to_check}'")
            
            # Validar si el territorio cumple la filosofía
            is_valid, territory = self._validate_territory(location_to_check)
            print(f"DEBUG - Validación club {club_id} ({club_name}): is_valid={is_valid}, territory={territory}")
            
            return (is_valid, territory, club_name)
            
        except httpx.HTTPStatusError as e:
            print(f"Error HTTP al verificar club {club_id}: {e.response.status_code} - {e.response.text}")
            return (False, None, None)
        except Exception as e:
            import traceback
            print(f"Error al verificar ubicación del club {club_id}: {type(e).__name__}: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            return (False, None, None)
    
    def _calculate_age_at_date(self, birth_date_str: str, target_date_str: str) -> Optional[int]:
        """
        Calcula la edad de una persona en una fecha específica
        Maneja fechas completas (YYYY-MM-DD) y fechas parciales (YYYY-00-00)
        
        Args:
            birth_date_str: Fecha de nacimiento en formato YYYY-MM-DD
            target_date_str: Fecha objetivo en formato YYYY-MM-DD o YYYY-00-00
            
        Returns:
            Edad en años o None si no se puede calcular
        """
        try:
            from datetime import datetime
            
            # Extraer años
            birth_year = int(birth_date_str.split('-')[0])
            target_year = int(target_date_str.split('-')[0])
            
            # Si la fecha objetivo es parcial (solo año: YYYY-00-00)
            if target_date_str.endswith('-00-00') or target_date_str.endswith('-00'):
                # Calcular edad aproximada al final del año
                # Usamos el año completo para ser conservadores
                age = target_year - birth_year
                
                print(f"DEBUG - Fecha parcial detectada: {target_date_str}, edad aproximada: {age} años")
                return age
            
            # Si tenemos fechas completas, calcular con precisión
            birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d')
            target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
            
            age = target_date.year - birth_date.year
            
            # Ajustar si aún no ha cumplido años en esa fecha
            if (target_date.month, target_date.day) < (birth_date.month, birth_date.day):
                age -= 1
            
            return age
        except Exception as e:
            print(f"DEBUG - Error al calcular edad: birth='{birth_date_str}', target='{target_date_str}', error={str(e)}")
            return None
    
    async def _get_location_details_from_osm(
        self, 
        client: httpx.AsyncClient, 
        lat: float, 
        lon: float,
        max_retries: int = 3
    ) -> Dict[str, Any]:
        """
        Obtiene detalles de ubicación desde OpenStreetMap Nominatim
        
        Args:
            client: Cliente HTTP
            lat: Latitud en grados decimales
            lon: Longitud en grados decimales
            max_retries: Número máximo de reintentos en caso de timeout
            
        Returns:
            Diccionario con información de la ubicación
        """
        import asyncio
        
        for attempt in range(max_retries):
            try:
                response = await client.get(
                    settings.baseurl_openstreetmap,
                    headers=self.HEADERS,
                    params={
                        "lat": lat,
                        "lon": lon,
                        "format": "json"
                    },
                    timeout=30.0  # Timeout de 30 segundos
                )
                response.raise_for_status()
                return response.json()
            except httpx.ReadTimeout:
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 2  # Espera incremental: 2s, 4s, 6s
                    print(f"DEBUG - Timeout en OSM, reintentando en {wait_time}s... (intento {attempt + 1}/{max_retries})")
                    await asyncio.sleep(wait_time)
                else:
                    print(f"DEBUG - Timeout final en OSM después de {max_retries} intentos")
                    raise
            except Exception as e:
                print(f"DEBUG - Error en OSM: {type(e).__name__}: {str(e)}")
                raise
    
    async def validate_philosophy(
        self, 
        request: PhilosophyValidationRequest
    ) -> PhilosophyValidationResponse:
        """
        Valida si un jugador cumple con la filosofía del club
        """
        # Configurar cliente HTTP con timeout más largo (solo para OSM)
        timeout = httpx.Timeout(30.0, connect=10.0)
        async with httpx.AsyncClient(timeout=timeout) as http_client:
            # Obtener información del jugador desde Wikidata usando el cliente wikidata
            entity = await self._get_wikidata_entity(request.player_wikidata_id)
            
            # Extraer datos del jugador
            player_name = await self._get_entity_label(entity)
            birth_date = await self._extract_birth_date(entity)
            birth_place_entity = await self._extract_birth_place(entity)
            
            # Obtener nombre del lugar de nacimiento
            place_name = "Desconocido"
            if birth_place_entity:
                place_name = await self._get_entity_label(birth_place_entity)
            
            # Extraer coordenadas del lugar de nacimiento
            coordinates = None
            if birth_place_entity:
                coordinates = await self._extract_coordinates(birth_place_entity)
            
            status = "invalid"  # Por defecto: no cumple
            validation_reason = "No se pudo validar"
            territory = None
            
            if coordinates:
                lat, lon = coordinates
                # Obtener información detallada desde OpenStreetMap
                try:
                    osm_data = await self._get_location_details_from_osm(http_client, lat, lon)
                    
                    # Obtener el estado/provincia de la respuesta
                    address = osm_data.get('address', {})
                    
                    # Buscar el campo más específico disponible (en orden de prioridad)
                    # subdivision: usado en Francia (Lapurdi, etc.)
                    # province: usado en España (Bizkaia, Gipuzkoa, etc.)
                    # county: condado, puede ser Pyrénées-Atlantiques
                    # state: estado/región (muy general, último recurso)
                    subdivision = address.get('subdivision', '')
                    province = address.get('province', '')
                    county = address.get('county', '')
                    state = address.get('state', '')
                    
                    # Usar el primer campo disponible (más específico primero)
                    location_to_check = subdivision or province or county or state
                    
                    # Debug: imprimir lo que devuelve OSM
                    print(f"DEBUG - OSM Address: {address}")
                    print(f"DEBUG - Subdivision: '{subdivision}', Province: '{province}', County: '{county}', State: '{state}'")
                    print(f"DEBUG - Usando para validación: '{location_to_check}'")
                    
                    # Validar si el territorio cumple la filosofía
                    is_birth_valid, territory = self._validate_territory(location_to_check)
                    
                    print(f"DEBUG - Validación: is_birth_valid={is_birth_valid}, territory={territory}")
                    
                    if is_birth_valid:
                        status = "valid"
                        validation_reason = f"Nacido en {territory} ({location_to_check})"
                    else:
                        validation_reason = f"Nacido en '{location_to_check}', fuera de los territorios válidos del Athletic"
                        
                except Exception as e:
                    validation_reason = f"Error al consultar OpenStreetMap: {str(e)}"
            else:
                validation_reason = "No se encontraron coordenadas para validar el lugar de nacimiento"
            
            # Extraer clubes del jugador (siempre, para incluirlos en la respuesta)
            print(f"DEBUG - Extrayendo clubes del jugador...")
            teams = await self._extract_teams(entity)
            print(f"DEBUG - Clubes encontrados: {len(teams)}")
            
            # Si no cumple por nacimiento, verificar formación en club vasco
            if status != "valid":
                print(f"DEBUG - Jugador no nació en territorio válido, verificando clubes...")
                
                # Verificar si hay clubes antes de los 18 años
                has_youth_clubs = False
                doubt_clubs = []  # Clubes con edad 17 (dudosos)
                
                # Verificar cada club
                for team_info in teams:
                    club_id = team_info['id']
                    start_date = team_info['start_date']
                    
                    print(f"DEBUG - Verificando club {club_id}, inicio: {start_date}")
                    
                    # Si no hay fecha de inicio, no podemos validar la edad
                    if not start_date or birth_date == "Desconocido":
                        continue
                    
                    # Calcular edad cuando entró al club
                    age_at_start = self._calculate_age_at_date(birth_date, start_date)
                    
                    print(f"DEBUG - Edad al entrar al club: {age_at_start}")
                    
                    if age_at_start is None:
                        continue
                    
                    # Registrar que hay clubes antes de los 18
                    if age_at_start < 18:
                        has_youth_clubs = True
                    
                    # Si llegó con 16 años o menos, es válido
                    if age_at_start <= 16:
                        # Verificar si el club está en territorio válido
                        club_is_valid, club_territory, club_name = await self._check_club_location(http_client, club_id)
                        
                        print(f"DEBUG - Club en territorio válido: {club_is_valid}, territorio: {club_territory}")
                        
                        if club_is_valid:
                            status = "valid"
                            territory = club_territory
                            validation_reason = f"Formación en club vasco: llegó a {club_name} ({club_territory}) con {age_at_start} años"
                            break
                    
                    # Si llegó con 17 años (edad aproximada por fecha parcial), es duda
                    elif age_at_start == 17:
                        # Verificar si es fecha parcial
                        if start_date.endswith('-00-00') or start_date.endswith('-00'):
                            club_is_valid, club_territory, club_name = await self._check_club_location(http_client, club_id)
                            if club_is_valid:
                                doubt_clubs.append({
                                    'name': club_name,
                                    'territory': club_territory,
                                    'age': age_at_start
                                })
                
                # Si no cumple definitivamente, revisar si hay dudas
                if status != "valid":
                    # Caso 1: Clubes con 17 años en territorio vasco (pudo entrar con 16)
                    if doubt_clubs:
                        status = "doubt"
                        club_info = doubt_clubs[0]
                        validation_reason = f"Duda: llegó a {club_info['name']} ({club_info['territory']}) con aproximadamente {club_info['age']} años. Pudo haber entrado con 16 años pero falta información precisa (solo año disponible)"
                    
                    # Caso 2: No hay clubes registrados antes de los 18 años
                    elif not has_youth_clubs:
                        status = "doubt"
                        validation_reason = "Duda: no hay clubes registrados antes de los 18 años. Falta información sobre clubes de formación (cadete, juvenil, etc.)"
                    
                    # Caso 3: No cumple definitivamente
                    else:
                        status = "invalid"
                        if not validation_reason or validation_reason == "No se pudo validar":
                            validation_reason = "No cumple la filosofía: no nació en territorio válido ni se formó en club vasco antes de los 16 años"

            # Calcular clubes y temporadas
            print(f"DEBUG - Calculando clubes y temporadas...")
            clubs_seasons = await self._calculate_clubs_seasons(teams)
            print(f"DEBUG - Clubes procesados: {len(clubs_seasons)} clubes únicos")
            
            # Crear objeto Player
            player = Player(
                name=player_name,
                clubs=clubs_seasons,
                born_place=place_name,
                birth_date=birth_date,
                position="Desconocido"
            )
            
            return PhilosophyValidationResponse(
                jugador=player,
                status=status,
                reason=validation_reason
            )