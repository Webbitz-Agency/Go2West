// Configurazione condivisa per le tipologie di viaggio
export const travelTypes = [
  { name: 'City Breaks', slug: 'city-breaks' },
  { name: 'Fly & Drive', slug: 'fly-drive' },
  { name: 'Tour Guidato', slug: 'tour-guidato' },
  { name: 'Camper Adventure', slug: 'camper-adventure' },
  { name: 'Glamping', slug: 'glamping' },
  { name: 'Ranch', slug: 'ranch' },
  { name: 'Scoperta in treno', slug: 'scoperta-in-treno' },
  { name: 'Hotel/Resort', slug: 'hotel-resort' },
  { name: 'Combinati', slug: 'combinati' },
  { name: 'Luxury Travel', slug: 'luxury-travel' },
  { name: 'Extra', slug: 'extra' }
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

