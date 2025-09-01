import { apiGet, apiPost, apiPut, apiDelete } from '../config/api';
import API_CONFIG from '../config/api';

// Servizio per la gestione dei tour
export class TourService {
  // Ottieni tutti i tour
  static async getAllTours() {
    return await apiGet(API_CONFIG.ENDPOINTS.TOURS);
  }

  // Ottieni un tour per ID
  static async getTourById(id) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOUR_BY_ID(id));
  }

  // Ottieni un tour per slug
  static async getTourBySlug(slug) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOUR_BY_SLUG(slug));
  }

  // Ottieni tour per paese
  static async getToursByCountry(country) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOURS_BY_COUNTRY(country));
  }

  // Ottieni tour per tipo
  static async getToursByType(type) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOURS_BY_TYPE(type));
  }

  // Crea un nuovo tour
  static async createTour(tourData) {
    return await apiPost(API_CONFIG.ENDPOINTS.TOURS, tourData);
  }

  // Aggiorna un tour esistente
  static async updateTour(id, tourData) {
    return await apiPut(API_CONFIG.ENDPOINTS.TOUR_BY_ID(id), tourData);
  }

  // Elimina un tour
  static async deleteTour(id) {
    return await apiDelete(API_CONFIG.ENDPOINTS.TOUR_BY_ID(id));
  }

  // Duplica un tour (crea una copia)
  static async duplicateTour(tour) {
    const duplicatedData = {
      ...tour,
      title: `${tour.title} (Copia)`,
      slug: `${tour.slug}-copia-${Date.now()}`
    };
    delete duplicatedData.id; // Rimuovi l'ID per creare un nuovo record
    return await this.createTour(duplicatedData);
  }

  // Health check del backend
  static async healthCheck() {
    return await apiGet(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

export default TourService;
