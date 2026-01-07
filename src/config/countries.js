// Configurazione paesi per Sud America, Centro America e Caraibi

export const countriesByRegion = {
  'Sud America': [
    'Argentina',
    'Bolivia',
    'Brasile',
    'Cile',
    'Colombia',
    'Ecuador',
    'Perù'
  ],
  'America Centrale': [
    'Costa Rica',
    'Guatemala',
    'Panama',
    'Nicaragua'
  ],
  'Caraibi': [
    'Antigua & Barbuda',
    'Aruba, Bonaire, Curaçao ABC',
    'Repubblica Dominicana',
    'Barbados',
    'Turks & Caicos',
    'Isole Vergini Britanniche',
    'Isole Vergini Americane'
  ]
};

// Helper per ottenere i paesi di una regione
export const getCountriesByRegion = (region) => {
  return countriesByRegion[region] || [];
};

// Helper per verificare se una destinazione richiede la selezione di paesi
export const requiresCountrySelection = (destination) => {
  return ['Sud America', 'America Centrale', 'Caraibi'].includes(destination);
};

