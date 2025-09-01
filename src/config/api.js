// Configurazione API per Go2West
const API_CONFIG = {
  // URL del backend su Render
  BASE_URL: 'https://go2west-backend.onrender.com',
  
  // Mapping dei parametri URL ai nomi dei paesi nel database
  COUNTRY_MAPPING: {
    'usa': 'Stati Uniti',
    'messico': 'Messico',
    'polinesia-francese': 'Polinesia Francese',
    'kenya': 'Kenya',
    'australia': 'Australia',
    'argentina': 'Argentina',
    'giappone': 'Giappone'
  },
  
  // Endpoints
  ENDPOINTS: {
    TOURS: '/api/tours',
    TOUR_BY_ID: (id) => `/api/tours/${id}`,
    TOUR_BY_SLUG: (slug) => `/api/tours/slug/${slug}`,
    TOURS_BY_COUNTRY: (country) => `/api/tours/country/${country}`,
    TOURS_BY_TYPE: (type) => `/api/tours/type/${type}`,
    TOURS_BY_COUNTRY_AND_TYPE: (country, type) => `/api/tours/country/${country}/type/${type}`,
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
