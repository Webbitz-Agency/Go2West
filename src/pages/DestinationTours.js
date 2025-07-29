import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './DestinationTours.css';

const DestinationTours = () => {
  const { country } = useParams();
  
  const tours = [
    {
      id: 'grand-canyon-adventure',
      name: 'Grand Canyon Adventure',
      image: '/images/grand-canyon.jpg',
      description: 'Esplora il maestoso Grand Canyon con tour guidati e avventure uniche nel cuore dell\'America.',
      category: 'Fly & Drive'
    },
    {
      id: 'new-york-explorer',
      name: 'New York City Explorer',
      image: '/images/nyc.jpg',
      description: 'Scopri la Grande Mela con i nostri tour esclusivi che ti porteranno nei luoghi più iconici di New York.',
      category: 'Tours'
    },
    {
      id: 'california-coastline',
      name: 'California Coastline Drive',
      image: '/images/california-coast.jpg',
      description: 'Percorri la spettacolare costa californiana, dalle spiagge di Malibu fino alle scogliere di Big Sur.',
      category: 'Fly & Drive'
    },
    {
      id: 'florida-everglades',
      name: 'Florida Everglades Wildlife Safari',
      image: '/images/everglades.jpg',
      description: 'Immergiti nella natura selvaggia delle Everglades e scopri la fauna unica di questa regione.',
      category: 'Wildlife Safari'
    }
  ];

  const categories = [
    { name: 'Fly & Drive', icon: '🚗' },
    { name: 'Tours', icon: '🏛️' },
    { name: 'Città in Libertà', icon: '🏙️' },
    { name: 'Circuit Adventures', icon: '🗺️' },
    { name: 'Luxury Travel', icon: '✨' }
  ];

  return (
    <div className="destination-tours">
      {/* Hero Section */}
      <section className="destination-hero">
        <div className="hero-content">
          <h1>United States - Tours</h1>
          <p>Scopri le meraviglie degli Stati Uniti con i nostri tour selezionati e le esperienze uniche che ti offriamo.</p>
        </div>
      </section>

      <div className="container">
        {/* Categories */}
        <section className="tour-categories">
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Tours Section */}
        <section className="tours-section">
          <h2>Tours</h2>
          
          <div className="tours-list">
            {tours.map((tour) => (
              <div key={tour.id} className="tour-item">
                <div className="tour-content">
                  <h3>{tour.name}</h3>
                  <p>{tour.description}</p>
                  <Link to={`/tour/${tour.id}`} className="tour-button">
                    Book Now
                  </Link>
                </div>
                <div className="tour-image">
                  <img src={tour.image} alt={tour.name} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination">
            <span>Pagina 1 di 2</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DestinationTours; 