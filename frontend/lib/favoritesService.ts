const API_BASE_URL = 'http://localhost:8000/api/v1/favorites';

function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function addFavorite(playerId: string): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ playerId })
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al agregar favorito' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error agregando favorito:', error);
        return { success: false, message: 'Error de conexión' };
    }
}

export async function getFavorites(): Promise<string[]> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Error obteniendo favoritos');
        }

        const data = await response.json();
        return data.favorites || [];
    } catch (error) {
        console.error('Error obteniendo favoritos:', error);
        return [];
    }
}

export async function isFavorite(playerId: string): Promise<boolean> {
    const favorites = await getFavorites();
    return favorites.includes(playerId);
}

export async function removeFavorite(playerId: string): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/${playerId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al eliminar favorito' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error eliminando favorito:', error);
        return { success: false, message: 'Error de conexión' };
    }
}
