// Utilise l'URL de l'API depuis les variables d'environnement, ou localhost par défaut
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Récupérer toutes les agences
  async getAgencies() {
    const response = await fetch(`${API_URL}/agencies`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des agences');
    }
    return response.json();
  },

  // Récupérer une agence par ID
  async getAgency(id) {
    const response = await fetch(`${API_URL}/agencies/${id}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'agence');
    }
    return response.json();
  },

  // Créer une nouvelle agence
  async createAgency(agency) {
    const response = await fetch(`${API_URL}/agencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agency),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'agence');
    }
    return response.json();
  },

  // Mettre à jour une agence
  async updateAgency(id, agency) {
    const response = await fetch(`${API_URL}/agencies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agency),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'agence');
    }
    return response.json();
  },

  // Supprimer une agence
  async deleteAgency(id) {
    const response = await fetch(`${API_URL}/agencies/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'agence');
    }
    return response.json();
  },

  // Récupérer les statistiques
  async getStats() {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
    return response.json();
  },

  // Ajouter une note à une agence
  async addNote(agencyId, content) {
    try {
      const response = await fetch(`${API_URL}/agencies/${agencyId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Impossible de se connecter au serveur. Assurez-vous que le serveur backend est démarré (npm run dev:server)');
      }
      throw error;
    }
  },

  // Supprimer une note
  async deleteNote(agencyId, noteId) {
    try {
      const response = await fetch(`${API_URL}/agencies/${agencyId}/notes/${noteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Impossible de se connecter au serveur. Assurez-vous que le serveur backend est démarré (npm run dev:server)');
      }
      throw error;
    }
  },
};

