import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Stati per i caroselli delle immagini
  const [currentImageIndex, setCurrentImageIndex] = useState({
    kenya: 0,
    japan: 0,
    northAmerica: 0,
    australia: 0,
    mexico: 0,
    usa: 0
  });

  // Stato per il carousel delle destinazioni
  const [destinationCarouselIndex, setDestinationCarouselIndex] = useState(0);

  // Riferimento e stato visibilità form contatti
  const contactRef = useRef(null);
  const [isContactVisible, setIsContactVisible] = useState(false);

  // Video hero iniziale
  const heroVideos = [
    '/images/video1.mp4',
    '/images/video2.mp4',
    '/images/video3.mp4',
    '/images/video4.mp4',
    '/images/video5.mp4'
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroVideos.length);
    }, 7000);
    return () => clearInterval(intervalId);
  }, [heroVideos.length]);

  const destinations = [
    { 
      name: 'Kenya', 
      images: ['/images/kenya.jpg', '/images/kenya-safari.jpg', '/images/kenya-wildlife.jpg'], 
      country: 'kenya',
      description: 'Immergiti nella natura selvaggia del Kenya con safari mozzafiato tra i Big Five.',
      shortDesc: 'Safari autentici nel cuore dell\'Africa',
      experiences: ['Safari Masai Mara', 'Big Five', 'Cultura Masai', 'Savana Infinita']
    },
    { 
      name: 'Japan', 
      images: ['/images/japan.jpg', '/images/japan-temple.jpg', '/images/japan-fuji.jpg'], 
      country: 'japan',
      description: 'Perfetta armonia tra tradizione millenaria e innovazione futuristica.',
      shortDesc: 'Tradizione e modernità in perfetto equilibrio',
      experiences: ['Templi di Kyoto', 'Monte Fuji', 'Tokyo Moderna', 'Cerimonia del Tè']
    },
    { 
      name: 'North America', 
      images: ['/images/north-america.jpg', '/images/usa-parks.jpg', '/images/canada-nature.jpg'], 
      country: 'north-america',
      description: 'Dai grattacieli alle Montagne Rocciose, natura selvaggia e metropoli iconiche.',
      shortDesc: 'Natura maestosa e città che non dormono mai',
      experiences: ['Parchi Nazionali', 'Grandi Città', 'Route 66', 'Niagara Falls']
    },
    { 
      name: 'Australia', 
      images: ['/images/australia.jpg', '/images/australia-reef.jpg', '/images/australia-outback.jpg'], 
      country: 'australia',
      description: 'Terra di contrasti incredibili, dall\'Outback alla Grande Barriera Corallina.',
      shortDesc: 'Avventure uniche agli antipodi del mondo',
      experiences: ['Grande Barriera', 'Outback Rosso', 'Sydney Opera', 'Fauna Unica']
    },
    { 
      name: 'Mexico', 
      images: ['/images/mexico.jpg', '/images/mexico-beach.jpg', '/images/mexico-ruins.jpg'], 
      country: 'mexico',
      description: 'Scopri l\'anima vibrante tra spiagge paradisiache e antiche civiltà Maya.',
      shortDesc: 'Cultura millenaria e spiagge da sogno',
      experiences: ['Riviera Maya', 'Piramidi Azteche', 'Cenotes', 'Cucina Tradizionale']
    },
    { 
      name: 'United States', 
      images: ['/images/usa.jpg', '/images/usa-cities.jpg', '/images/usa-nature.jpg'], 
      country: 'united-states',
      description: 'L\'America che ispira: diversità sorprendente da costa a costa.',
      shortDesc: 'Il sogno americano in tutte le sue forme',
      experiences: ['National Parks', 'Las Vegas', 'New York', 'California Dreams']
    }
  ];

  // Auto-scroll per i caroselli delle immagini
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => ({
        kenya: (prev.kenya + 1) % destinations[0].images.length,
        japan: (prev.japan + 1) % destinations[1].images.length,
        northAmerica: (prev.northAmerica + 1) % destinations[2].images.length,
        australia: (prev.australia + 1) % destinations[3].images.length,
        mexico: (prev.mexico + 1) % destinations[4].images.length,
        usa: (prev.usa + 1) % destinations[5].images.length
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [destinations]);

  // IntersectionObserver per mostrare/nascondere la CTA flottante
  useEffect(() => {
    const element = contactRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsContactVisible(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    const element = contactRef.current;
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToDestinations = () => {
    const el = document.getElementById('all-destinations');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Funzione per cambiare immagine manualmente
  const changeImage = (destination, direction) => {
    const destData = destinations.find(d => d.country === destination);
    const maxIndex = destData.images.length - 1;
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [destination]: direction === 'next' 
        ? (prev[destination] + 1) > maxIndex ? 0 : prev[destination] + 1
        : (prev[destination] - 1) < 0 ? maxIndex : prev[destination] - 1
    }));
  };

  // Funzioni per il carousel delle destinazioni
  const nextDestinations = () => {
    setDestinationCarouselIndex(prev => 
      (prev + 1) % destinations.length
    );
  };

  const prevDestinations = () => {
    setDestinationCarouselIndex(prev => 
      prev === 0 ? destinations.length - 1 : prev - 1
    );
  };

  // Ottenere le 3 destinazioni correnti per il carousel
  const getCurrentDestinations = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (destinationCarouselIndex + i) % destinations.length;
      result.push(destinations[index]);
    }
    return result;
  };

  // Componente Carousel personalizzato per le immagini
  const ImageCarousel = ({ images, destination, className = "", showControls = true }) => {
    const currentIndex = currentImageIndex[destination] || 0;
    
    return (
      <div className={`image-carousel ${className}`}>
        <div 
          className="carousel-container"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`${destination} ${index + 1}`}
              className="carousel-image"
            />
          ))}
        </div>
        
        {showControls && (
          <>
            <button 
              className="carousel-btn prev-btn"
              onClick={() => changeImage(destination, 'prev')}
            >
              ‹
            </button>
            <button 
              className="carousel-btn next-btn"
              onClick={() => changeImage(destination, 'next')}
            >
              ›
            </button>
            
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(prev => ({ ...prev, [destination]: index }))}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="home">
      {/* Sezione Hero Video */}
      <section id="hero-videos" className="hero-videos" aria-label="Video introduttivi">
        <video
          key={currentHeroIndex}
          className="hero-video"
          src={heroVideos[currentHeroIndex]}
          autoPlay
          muted
          playsInline
          onEnded={() => setCurrentHeroIndex((prev) => (prev + 1) % heroVideos.length)}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Viaggi su misura, emozioni autentiche</h1>
            <p className="hero-subtitle">Scopri le nostre destinazioni d'eccellenza in tutto il mondo</p>
          </div>
          <div className="hero-actions">
            <button className="hero-cta" onClick={scrollToDestinations}>
              Scopri Destinazioni
            </button>
            <button className="hero-cta ghost" onClick={scrollToContact}>
              Richiedi Info
            </button>
          </div>
        </div>
      </section>

      {/* Layout Mosaico Creativo */}
      <section className="mosaic-destinations">
        
        {/* Prima Row - Kenya + Japan */}
        <div className="destination-row row-1">
          <div className="destination-large-card kenya">
            <div className="card-content">
              <div className="text-section">
                <h2>{destinations[0].name}</h2>
                <p className="main-desc">{destinations[0].description}</p>
                <p className="short-desc">{destinations[0].shortDesc}</p>
                <div className="experiences">
                  {destinations[0].experiences.map((exp, idx) => (
                    <span key={idx} className="experience-tag">{exp}</span>
                  ))}
                </div>
                <Link to={`/destination/${destinations[0].country}`} className="explore-btn">
                  Esplora {destinations[0].name}
                </Link>
              </div>
              <div className="images-section">
                <ImageCarousel 
                  images={destinations[0].images} 
                  destination="kenya"
                  className="kenya-carousel"
                />
              </div>
            </div>
          </div>

          <div className="destination-medium-card japan">
            <ImageCarousel 
              images={destinations[1].images} 
              destination="japan"
              className="japan-carousel"
              showControls={false}
            />
            <div className="card-overlay">
              <h3>{destinations[1].name}</h3>
              <p>{destinations[1].shortDesc}</p>
              <div className="mini-experiences">
                {destinations[1].experiences.slice(0, 2).map((exp, idx) => (
                  <span key={idx}>{exp}</span>
                ))}
              </div>
              <Link to={`/destination/${destinations[1].country}`} className="explore-link">
                Scopri il Giappone →
              </Link>
            </div>
          </div>
        </div>

        {/* Seconda Row - North America Wide */}
        <div className="destination-row row-2">
          <div className="destination-wide-card north-america">
            <div className="wide-content">
              <div className="wide-images">
                <ImageCarousel 
                  images={destinations[2].images} 
                  destination="northAmerica"
                  className="wide-carousel"
                />
              </div>
              <div className="wide-text">
                <h2>{destinations[2].name}</h2>
                <p>{destinations[2].description}</p>
                <div className="experiences-grid">
                  {destinations[2].experiences.map((exp, idx) => (
                    <span key={idx} className="exp-item">{exp}</span>
                  ))}
                </div>
                <Link to={`/destination/${destinations[2].country}`} className="explore-btn">
                  Pianifica il Viaggio
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Sezione Tutte le Destinazioni - Carousel Intelligente */}
      <section id="all-destinations" className="all-destinations-section">
        <div className="section-header">
          <h2>Tutte le Destinazioni</h2>
          <p>Esplora la nostra collezione completa di destinazioni esclusive</p>
        </div>

        <div className="destinations-carousel-container">
          <button 
            className="destination-nav-btn prev-destinations"
            onClick={prevDestinations}
          >
            ‹
          </button>

          <div className="destinations-carousel-content">
            {getCurrentDestinations().map((destination, position) => {
              // Posizione 0: Stile Australia (card larga con dettagli)
              if (position === 0) {
                return (
                  <div key={`${destination.country}-${destinationCarouselIndex}-${position}`} className="destination-card australia-style">
                    <div className="card-image">
                      <ImageCarousel 
                        images={[destination.images[0]]} 
                        destination={destination.country}
                        className="australia-main-carousel"
                        showControls={false}
                      />
                      <div className="floating-info">
                        <h3>{destination.name}</h3>
                        <p>{destination.shortDesc}</p>
                      </div>
                    </div>
                    <div className="card-details">
                      <div className="detail-images">
                        <ImageCarousel 
                          images={destination.images.slice(1)} 
                          destination={`${destination.country}-detail`}
                          className="australia-detail-carousel"
                          showControls={false}
                        />
                      </div>
                      <div className="card-text">
                        <p>{destination.description}</p>
                        <Link to={`/destination/${destination.country}`} className="explore-link">
                          Inizia l'Avventura →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Posizione 1: Stile Mexico (overlay scuro)
              if (position === 1) {
                return (
                  <div key={`${destination.country}-${destinationCarouselIndex}-${position}`} className="destination-card mexico-style">
                    <ImageCarousel 
                      images={destination.images} 
                      destination={`${destination.country}-mexico`}
                      className="mexico-carousel"
                      showControls={false}
                    />
                    <div className="card-overlay-content">
                      <h3>{destination.name}</h3>
                      <p>{destination.shortDesc}</p>
                      <div className="experience-mini">
                        {destination.experiences.slice(0, 3).map((exp, idx) => (
                          <span key={idx}>{exp}</span>
                        ))}
                      </div>
                      <Link to={`/destination/${destination.country}`} className="explore-btn">
                        Scopri {destination.name}
                      </Link>
                    </div>
                  </div>
                );
              }
              
              // Posizione 2: Stile USA (carousel con testo sotto)
              return (
                <div key={`${destination.country}-${destinationCarouselIndex}-${position}`} className="destination-card usa-style">
                  <div className="usa-carousel-grid">
                    <ImageCarousel 
                      images={destination.images} 
                      destination={`${destination.country}-usa`}
                      className="usa-carousel"
                      showControls={false}
                    />
                    <div className="usa-text">
                      <h3>{destination.name}</h3>
                      <p>{destination.shortDesc}</p>
                      <Link to={`/destination/${destination.country}`} className="explore-link">
                        Scopri {destination.name} →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            className="destination-nav-btn next-destinations"
            onClick={nextDestinations}
          >
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {destinations.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === destinationCarouselIndex ? 'active' : ''}`}
              onClick={() => setDestinationCarouselIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Sezione Contatti */}
      <section className="contact-section" id="contact" ref={contactRef}>
        <div className="contact-container">
          <div className="contact-header">
            <h2>Richiedi Informazioni</h2>
            <p>Compila il form per essere ricontattato dal nostro team</p>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome e Cognome</label>
                <input type="text" placeholder="Mario Rossi" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="mario@example.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Telefono</label>
                <input type="tel" placeholder="+39 333 1234567" />
              </div>
              <div className="form-group">
                <label>Destinazione d'interesse</label>
                <select defaultValue="">
                  <option value="" disabled>Seleziona una destinazione</option>
                  {destinations.map((d) => (
                    <option key={d.country} value={d.country}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Messaggio</label>
              <textarea rows="5" placeholder="Raccontaci cosa stai cercando..." />
            </div>
            <button type="submit" className="submit-btn">Invia Richiesta</button>
          </form>
        </div>
      </section>

      {/* CTA flottante */}
      <button 
        className={`floating-cta ${isContactVisible ? 'hide' : 'show'}`}
        onClick={scrollToContact}
        aria-label="Vai al form contatti"
      >
        Richiedi Info
      </button>

      {/* Sezione Statistiche e Info */}
      {/*
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>150+</h3>
            <p>Destinazioni Esclusive</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Clienti Soddisfatti</p>
          </div>
          <div className="stat-item">
            <h3>25</h3>
            <p>Anni di Esperienza</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Supporto Dedicato</p>
          </div>
        </div>
      </section>
      */}
      {/* Sezione CTA Finale */}
      {/*
      <section className="final-cta">
        <div className="cta-content">
          <h2>Pronti per la prossima avventura?</h2>
          <p>I nostri esperti sono qui per creare l'esperienza di viaggio perfetta per i vostri clienti</p>
          <div className="cta-buttons">
            <Link to="/destination/united-states" className="primary-cta">
              Richiedi Consulenza
            </Link>
            <Link to="/destination/kenya" className="secondary-cta">
              Sfoglia Catalogo
            </Link>
          </div>
        </div>
      </section>
      */}
    </div>
  );
};

export default Home; 