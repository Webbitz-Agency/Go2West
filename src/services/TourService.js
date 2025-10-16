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

  // Ottieni un tour per code
  static async getTourByCode(code) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOUR_BY_CODE(code));
  }

  // Ottieni tour per destinazione
  static async getToursByDestination(destination) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOURS_BY_DESTINATION(destination));
  }

  // Ottieni tour per tipo
  static async getToursByType(type) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOURS_BY_TYPE(type));
  }

  // Ottieni tour per destinazione e tipo
  static async getToursByDestinationAndType(destination, type) {
    return await apiGet(API_CONFIG.ENDPOINTS.TOURS_BY_DESTINATION_AND_TYPE(destination, type));
  }

  // Ottieni un'immagine del tour
  static getTourImageUrl(id, imageType) {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOUR_IMAGE(id, imageType)}`;
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
      code: `${tour.code} (Copia)`,
      slug: `${tour.slug}-copia-${Date.now()}`
    };
    delete duplicatedData.id; // Rimuovi l'ID per creare un nuovo record
    return await this.createTour(duplicatedData);
  }

  // Carica un'immagine per un tour
  static async uploadTourImage(tourId, imageType, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOUR_IMAGE(tourId, imageType)}`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Image Upload Error:', error);
      throw error;
    }
  }

  // Attiva/disattiva promozione per un tour
  static async toggleTourPromotion(tourId, isPromotion) {
    // Prima otteniamo i dati completi del tour
    const tour = await this.getTourById(tourId);
    // Poi aggiorniamo solo il campo isPromotion mantenendo tutti gli altri dati
    return await apiPut(API_CONFIG.ENDPOINTS.TOUR_BY_ID(tourId), { 
      ...tour, 
      isPromotion 
    });
  }

  // Ottieni solo i tour in promozione
  static async getPromotionTours() {
    return await apiGet(`${API_CONFIG.ENDPOINTS.TOURS}?promotion=true`);
  }

  // Health check del backend
  static async healthCheck() {
    return await apiGet(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

export default TourService;
