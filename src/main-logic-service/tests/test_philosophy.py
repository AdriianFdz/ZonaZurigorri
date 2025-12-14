import pytest
from app.services.philosophy_service import PhilosophyService


@pytest.fixture
def philosophy_service():
    return PhilosophyService()


class TestValidateTerritory:
    def test_vizcaya_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Vizcaya") == (True, "Vizcaya")
        assert philosophy_service._validate_territory("Bizkaia") == (True, "Vizcaya")
        assert philosophy_service._validate_territory("vizcaya") == (True, "Vizcaya")
        assert philosophy_service._validate_territory("BIZKAIA") == (True, "Vizcaya")
    
    def test_guipuzcoa_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Guipúzcoa") == (True, "Guipúzcoa")
        assert philosophy_service._validate_territory("Gipuzkoa") == (True, "Guipúzcoa")
        assert philosophy_service._validate_territory("guipuzcoa") == (True, "Guipúzcoa")
    
    def test_alava_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Álava") == (True, "Álava")
        assert philosophy_service._validate_territory("Alava") == (True, "Álava")
        assert philosophy_service._validate_territory("Araba") == (True, "Álava")
    
    def test_navarra_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Navarra") == (True, "Navarra")
        assert philosophy_service._validate_territory("Nafarroa") == (True, "Navarra")
        assert philosophy_service._validate_territory("Comunidad Foral de Navarra") == (True, "Navarra")
    
    def test_labort_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Labort") == (True, "Labort")
        assert philosophy_service._validate_territory("Lapurdi") == (True, "Labort")
        assert philosophy_service._validate_territory("Pirineos Atlanticos") == (True, "Labort")
    
    def test_sola_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Sola") == (True, "Sola")
        assert philosophy_service._validate_territory("Zuberoa") == (True, "Sola")
    
    def test_navarra_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Navarra") == (True, "Navarra")
        assert philosophy_service._validate_territory("Nafarroa") == (True, "Navarra")
        assert philosophy_service._validate_territory("Comunidad Foral de Navarra") == (True, "Navarra")
    
    def test_baja_navarra_variants(self, philosophy_service):
        assert philosophy_service._validate_territory("Baja Navarra") == (True, "Baja Navarra")
        assert philosophy_service._validate_territory("Nafarroa Behera") == (True, "Baja Navarra")
    
    def test_invalid_territories(self, philosophy_service):
        assert philosophy_service._validate_territory("Madrid") == (False, None)
        assert philosophy_service._validate_territory("Barcelona") == (False, None)
        assert philosophy_service._validate_territory("Sevilla") == (False, None)
    
    def test_empty_territory(self, philosophy_service):
        assert philosophy_service._validate_territory("") == (False, None)
        assert philosophy_service._validate_territory(None) == (False, None)
