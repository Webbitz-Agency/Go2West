// Configurazione API per Go2West
const API_CONFIG = {
  // URL del backend ospitato su Render
  BASE_URL: 'https://go2west-backend.onrender.com',
  
  // Endpoints
  ENDPOINTS: {
    TOURS: '/api/tours',
    TOUR_BY_ID: (id) => `/api/tours/${id}`,
    TOUR_BY_CODE: (code) => `/api/tours/code/${code}`,
    TOURS_BY_DESTINATION: (destination) => `/api/tours/destination/${destination}`,
    TOURS_BY_TYPE: (type) => `/api/tours/type/${type}`,
    TOURS_BY_DESTINATION_AND_TYPE: (destination, type) => `/api/tours/destination/${destination}/type/${type}`,
    TOUR_IMAGE: (id, imageType) => `/api/tours/${id}/image/${imageType}`,
    UPLOAD_IMAGE: '/api/upload-image',
    HEALTH: '/health'
  },
  
  // Configurazione delle richieste
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    },
  }
};

// Funzione helper per costruire l'URL completo
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Funzione helper per le richieste GET
export const apiGet = async (endpoint) => {
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'GET',
      ...API_CONFIG.REQUEST_CONFIG
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
};

// Funzione helper per le richieste POST
export const apiPost = async (endpoint, data) => {
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'POST',
      ...API_CONFIG.REQUEST_CONFIG,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
};

// Funzione helper per le richieste PUT
export const apiPut = async (endpoint, data) => {
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'PUT',
      ...API_CONFIG.REQUEST_CONFIG,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
};

// Funzione helper per le richieste DELETE
export const apiDelete = async (endpoint) => {
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'DELETE',
      ...API_CONFIG.REQUEST_CONFIG
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
};

export default API_CONFIG;
