// Elenco paesi usato dai filtri per Sud America, America Centrale e Caraibi.

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
    'Bahamas',
    'Barbados',
    'Isole Vergini Americane',
    'Isole Vergini Britanniche',
    'Jamaica',
    'Repubblica Dominicana',
    'Turks & Caicos',
    'Puerto Rico'
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

