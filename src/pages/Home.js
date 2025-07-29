import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const destinations = [
    { name: 'North America', image: '/images/north-america.jpg', country: 'north-america' },
    { name: 'Japan', image: '/images/japan.jpg', country: 'japan' },
    { name: 'Kenya', image: '/images/kenya.jpg', country: 'kenya' },
    { name: 'Australia', image: '/images/australia.jpg', country: 'australia' },
    { name: 'Mexico', image: '/images/mexico.jpg', country: 'mexico' },
    { name: 'United States', image: '/images/usa.jpg', country: 'united-states' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover your Dream Destination</h1>
          <p>Esplora il mondo con le nostre proposte di viaggio personalizzate</p>
          <Link to="/destination/united-states" className="cta-button">
            Explore Destinations
          </Link>
        </div>
        <div className="hero-image">
          <img src="/images/hero-beach.jpg" alt="Beautiful beach destination" />
        </div>
      </section>

      {/* Le nostre proposte */}
      <section className="our-proposals">
        <div className="container">
          <div className="section-header">
            <h2>Le nostre proposte</h2>
          </div>
          
          <div className="proposal-card">
            <div className="proposal-content">
              <h3>Kenya Safari Expedition</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              <Link to="/tour/kenya-safari" className="learn-more">Learn More</Link>
            </div>
            <div className="proposal-images">
              <img src="/images/kenya-safari.jpg" alt="Kenya Safari" />
              <img src="/images/kenya-wildlife.jpg" alt="Kenya Wildlife" />
            </div>
          </div>
        </div>
      </section>

      {/* Destinazioni */}
      <section className="destinations">
        <div className="container">
          <div className="section-header">
            <h2>Destinazioni</h2>
          </div>
          
          <div className="destinations-grid">
            {destinations.map((destination, index) => (
              <Link 
                key={index} 
                to={`/destination/${destination.country}`} 
                className="destination-card"
              >
                <img src={destination.image} alt={destination.name} />
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p>Scopri le meraviglie di {destination.name} con i nostri tour guidati e le esperienze uniche che ti offriamo.</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="pagination">
            <span>Pagina 1 di 3</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 