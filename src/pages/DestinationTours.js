import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DestinationTours.css';

const DestinationTours = () => {
  const { country } = useParams();
  
  // Refs per gestione sticky/fade della hero
  const heroSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const [isHeroFaded, setIsHeroFaded] = useState(false);
  const [isHeroFixed, setIsHeroFixed] = useState(false);

  // Array delle destinazioni con immagini
  const destinations = [
    {
      name: 'USA',
      country: 'usa',
      image: '/images/usa.jpg',
      description: 'Dai grattacieli di New York ai canyon dell\'Ovest, passando per strade leggendarie come la Route 66: gli Stati Uniti sono un viaggio tra natura estrema, cultura pop e città che non dormono mai.'
    },
    {
      name: 'Canada',
      country: 'canada',
      image: '/images/north-america.jpg',
      description: 'Paesaggi infiniti, laghi cristallini e le maestose Montagne Rocciose: il Canada è la meta perfetta per chi cerca avventura, natura incontaminata e città moderne immerse in scenari mozzafiato.'
    },
    {
      name: 'Messico',
      country: 'messico',
      image: '/images/mexico.jpg',
      description: 'Spiagge caraibiche, rovine Maya e tradizioni coloratissime: il Messico è un mix di storia millenaria, paesaggi da cartolina e cucina indimenticabile che conquista tutti i sensi.'
    },
    {
      name: 'America Centrale',
      country: 'america-centrale',
      image: '/images/north-america3.jpg',
      description: 'Un mosaico di paesi pieni di energia: vulcani, foreste tropicali, spiagge spettacolari e città coloniali. L\'America Centrale è il cuore vibrante dell\'avventura latina, dove natura e cultura si fondono.'
    },
    {
      name: 'Sud America',
      country: 'sud-america',
      image: '/images/usa-parks.jpg',
      description: 'Dal ritmo del samba brasiliano alle cime andine, il Sud America è pura emozione: una terra di contrasti, colori intensi, paesaggi straordinari e popoli accoglienti che regalano esperienze indimenticabili.'
    },
    {
      name: 'Caraibi',
      country: 'caraibi',
      image: '/images/mexico.jpg',
      description: 'Mare turchese, spiagge di sabbia bianca e atmosfere rilassate: i Caraibi sono il sogno tropicale per eccellenza. Tra isole da esplorare, natura rigogliosa e cultura vivace, il relax è assicurato.'
    },
    {
      name: 'Polinesia Francese',
      country: 'polinesia-francese',
      image: '/images/polinesia.jpg',
      description: 'Lagune turchesi, bungalow sull\'acqua e paesaggi da sogno: la Polinesia Francese è il paradiso terrestre, perfetto per chi cerca romanticismo, natura incontaminata e un\'esperienza indimenticabile in mezzo all\'Oceano Pacifico.'
    }
  ];

  // Trova la destinazione corrente
  const currentDestination = destinations.find(d => d.country === country) || destinations[0];

  // Effetto: blocco fixed centrato e fade quando il bottom della sezione supera il testo
  useEffect(() => {
    const handleScroll = () => {
      const section = heroSectionRef.current;
      const text = heroTextRef.current;
      if (!section || !text) return;
      const sectionRect = section.getBoundingClientRect();
      const textRect = text.getBoundingClientRect();
      
      // Fissa il blocco al centro quando la sezione è in viewport (parte superiore passata) ma non ancora uscita dal basso
      const shouldFix = sectionRect.top <= 0 && sectionRect.bottom > 100;
      if (shouldFix !== isHeroFixed) setIsHeroFixed(shouldFix);

      // Attiva il fade quando il bottom della sezione immagine raggiunge il testo
      // Aggiungiamo un offset più generoso per evitare riapparizioni
      const OFFSET = 50; // px di anticipo per il fade
      const shouldFade = sectionRect.bottom <= (textRect.bottom + OFFSET);
      
      // Aggiungiamo una condizione extra: se la sezione è completamente fuori dal viewport, forza il fade
      const isSectionCompletelyHidden = sectionRect.bottom <= 0;
      const finalShouldFade = shouldFade || isSectionCompletelyHidden;
      
      if (finalShouldFade !== isHeroFaded) setIsHeroFaded(finalShouldFade);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHeroFaded, isHeroFixed]);

  // Nuove categorie di viaggio
  const categories = [
    { name: 'City Breaks', slug: 'city-breaks' },
    { name: 'Fly & Drive', slug: 'fly-drive' },
    { name: 'Ride in Harley', slug: 'ride-harley' },
    { name: 'Tour Guidati', slug: 'tour-guidati' },
    { name: 'Luxury Travel', slug: 'luxury-travel' },
    { name: 'Camper Adventures', slug: 'camper-adventures' }
  ];

  // Stato per la categoria selezionata
  const [selectedCategory, setSelectedCategory] = useState('city-breaks');

  // Tour per ogni categoria
  const toursByCategory = {
    'city-breaks': [
      {
        id: 'new-york-city-break',
        name: 'New York City Break',
        image: '/images/city.jpg',
        description: 'Weekend nella Grande Mela: grattacieli iconici, Broadway e Central Park in un viaggio urbano indimenticabile.',
        duration: '4 giorni',
        price: '€ 890'
      },
      {
        id: 'london-city-break',
        name: 'London City Break',
        image: '/images/usa-parks.jpg',
        description: 'Esplora la capitale britannica: Buckingham Palace, Big Ben e i pub storici di Soho.',
        duration: '5 giorni',
        price: '€ 1.150'
      },
      {
        id: 'paris-city-break',
        name: 'Paris City Break',
        image: '/images/mexico.jpg',
        description: 'La Ville Lumière: Torre Eiffel, Louvre e crociera sulla Senna.',
        duration: '4 giorni',
        price: '€ 980'
      }
    ],
    'fly-drive': [
      {
        id: 'grand-canyon-adventure',
        name: 'Grand Canyon Adventure',
        image: '/images/usa-parks.jpg',
        description: 'Esplora il maestoso Grand Canyon con tour guidati e avventure uniche nel cuore dell\'America.',
        duration: '8 giorni',
        price: '€ 1.490'
      },
      {
        id: 'california-coast-drive',
        name: 'California Coast Drive',
        image: '/images/north-america.jpg',
        description: 'Da San Francisco a Los Angeles lungo la Pacific Coast Highway.',
        duration: '10 giorni',
        price: '€ 1.890'
      },
      {
        id: 'florida-keys-journey',
        name: 'Florida Keys Journey',
        image: '/images/polinesia.jpg',
        description: 'Viaggio attraverso le isole tropicali della Florida con snorkeling e pesca.',
        duration: '7 giorni',
        price: '€ 1.290'
      }
    ],
    'ride-harley': [
      {
        id: 'route-66-harley',
        name: 'Route 66 in Harley',
        image: '/images/ride_in_harley.jpg',
        description: 'Percorri la strada più famosa d\'America su una Harley Davidson, da Chicago a Los Angeles.',
        duration: '12 giorni',
        price: '€ 2.890'
      },
      {
        id: 'rocky-mountains-harley',
        name: 'Rocky Mountains Harley',
        image: '/images/north-america.jpg',
        description: 'Attraversa le Montagne Rocciose in moto con panorami mozzafiato.',
        duration: '9 giorni',
        price: '€ 2.190'
      },
      {
        id: 'pacific-northwest-harley',
        name: 'Pacific Northwest Harley',
        image: '/images/usa-parks.jpg',
        description: 'Esplora Oregon e Washington in moto tra foreste e costa oceanica.',
        duration: '8 giorni',
        price: '€ 1.990'
      }
    ],
    'tour-guidati': [
      {
        id: 'mexico-maya-tour',
        name: 'Tesori Maya del Messico',
        image: '/images/mexico.jpg',
        description: 'Dalle piramidi Maya alle spiagge di Tulum, scopri la cultura millenaria messicana.',
        duration: '10 giorni',
        price: '€ 1.650'
      },
      {
        id: 'peru-inca-tour',
        name: 'Perù e Machu Picchu',
        image: '/images/usa-parks.jpg',
        description: 'La città perduta degli Inca e la Valle Sacra con guida esperta.',
        duration: '12 giorni',
        price: '€ 2.150'
      },
      {
        id: 'argentina-tango-tour',
        name: 'Argentina e Tango',
        image: '/images/north-america.jpg',
        description: 'Buenos Aires, tango e Patagonia in un tour guidato completo.',
        duration: '14 giorni',
        price: '€ 2.450'
      }
    ],
    'luxury-travel': [
      {
        id: 'polynesia-luxury',
        name: 'Polinesia Esclusiva',
        image: '/images/polinesia.jpg',
        description: 'Overwater bungalow e lagune turchesi in un paradiso tropicale riservato a pochi.',
        duration: '8 giorni',
        price: '€ 4.500'
      },
      {
        id: 'maldives-luxury',
        name: 'Maldive di Lusso',
        image: '/images/mexico.jpg',
        description: 'Villa privata sull\'acqua con servizio butler e spa esclusiva.',
        duration: '7 giorni',
        price: '€ 5.200'
      },
      {
        id: 'swiss-alps-luxury',
        name: 'Alpi Svizzere Luxury',
        image: '/images/north-america.jpg',
        description: 'Chalet di lusso nelle Alpi con spa privata e chef personale.',
        duration: '6 giorni',
        price: '€ 3.800'
      }
    ],
    'camper-adventures': [
      {
        id: 'canada-camper',
        name: 'Canada Camper Experience',
        image: '/images/north-america.jpg',
        description: 'Viaggia in camper attraverso le Montagne Rocciose canadesi e i laghi cristallini.',
        duration: '15 giorni',
        price: '€ 2.200'
      },
      {
        id: 'australia-camper',
        name: 'Australia Camper Outback',
        image: '/images/usa-parks.jpg',
        description: 'Esplora l\'Outback australiano in camper con canguri e Uluru.',
        duration: '18 giorni',
        price: '€ 2.890'
      },
      {
        id: 'iceland-camper',
        name: 'Islanda Camper Aurora',
        image: '/images/polinesia.jpg',
        description: 'Camper tra geyser, cascate e aurora boreale islandese.',
        duration: '12 giorni',
        price: '€ 2.650'
      }
    ]
  };

  // Tour correnti basati sulla categoria selezionata
  const currentTours = toursByCategory[selectedCategory] || [];

  // Stato per la ricerca
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // Filtra i tour in base alla ricerca
  const filteredTours = currentTours.filter(tour =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Funzione per tornare in cima
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="destination-tours">
      {/* Hero Section */}
      <section ref={heroSectionRef} id="destination-hero" className="hero-top" aria-label={`${currentDestination.name} - Hero`}>
        <div className="hero-background-image">
          <img src={currentDestination.image} alt={`${currentDestination.name} - Paesaggio`} />
        </div>
        <div className="hero-overlay" />
        <div className={`hero-content ${isHeroFixed ? 'is-fixed' : ''} ${isHeroFaded ? 'fade-out' : ''}`}>
          <div ref={heroTextRef} className="hero-text">
            <h1 className="hero-title">{currentDestination.name}</h1>
            <p className="hero-subtitle">{currentDestination.description}</p>
          </div>
        </div>
      </section>

      <div className="container">
        
        {/* Categories */}
        <section className="tour-categories">
          <div className="categories-grid">
            {categories.map((category, index) => (
              <button 
                key={index} 
                className={`category-card ${selectedCategory === category.slug ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.slug)}
                disabled={isSearching} // Disabilita le categorie durante la ricerca
              >
                <div className="category-name">{category.name}</div>
              </button>
            ))}
          </div>
        </section>

{/* Search Bar */}
<section className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <i className="fa-solid fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Cerca viaggi, destinazioni, esperienze..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="search-clear">
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
            {/*
            {isSearching && (
              <div className="search-results-info">
                {filteredTours.length > 0 
                  ? `Trovati ${filteredTours.length} viaggi per "${searchQuery}"`
                  : `Nessun viaggio trovato per "${searchQuery}"`
                }
              </div>
            )}
              */}
          </div>
        </section>
        
        {/* Tours Section */}
        <section className="tours-section">
          {/* Contatore risultati */}
          <div className="search-results-info">
            {isSearching 
              ? `Trovati ${filteredTours.length} risultati per "${searchQuery}"`
              : `${currentTours.length} tour disponibili in ${categories.find(c => c.slug === selectedCategory)?.name}`
            }
          </div>
          
          <div className="tours-list">
            {filteredTours.map((tour, index) => (
              <div key={tour.id} className={`tour-item ${index % 2 === 0 ? 'white' : 'light-cyan'}`}>
                <div className="tour-content">
                  <h3>{tour.name}</h3>
                  <p>{tour.description}</p>
                  <div className="tour-details">
                    <span className="tour-duration">{tour.duration}</span>
                    <span className="tour-price">{tour.price}</span>
                  </div>
                  <Link to={`/tour/${tour.id}`} className="tour-button">
                    Dettagli
                  </Link>
                </div>
                <div className="tour-image">
                  <img src={tour.image} alt={tour.name} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Pulsante torna su */}
          {filteredTours.length > 0 && (
            <div className="scroll-to-top">
              <button onClick={scrollToTop} className="scroll-top-button">
                <i className="fa-solid fa-arrow-up"></i>
                Torna Su
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DestinationTours; 