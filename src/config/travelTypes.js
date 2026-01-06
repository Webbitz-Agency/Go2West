// Configurazione condivisa per le tipologie di viaggio
export const travelTypes = [
  { name: 'Tour Guidati', slug: 'tour-guidati' },
  { name: 'Fly & Drive', slug: 'fly-drive' },
  { name: 'City Breaks', slug: 'city-breaks' },
  { name: 'Glamping', slug: 'glamping' },
  { name: 'Ranch', slug: 'ranch' },
  { name: 'Camper Adventures', slug: 'camper-adventures' },
  { name: 'Scoperta in treno', slug: 'scoperta-in-treno' }
];

// Helper per ottenere una tipologia per slug
export const getTravelTypeBySlug = (slug) => {
  return travelTypes.find(type => type.slug === slug);
};

// Helper per ottenere il nome di una tipologia per slug
export const getTravelTypeName = (slug) => {
  const type = getTravelTypeBySlug(slug);
  return type ? type.name : slug;
};

