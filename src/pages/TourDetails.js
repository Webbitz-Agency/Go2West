import React from 'react';
import { useParams } from 'react-router-dom';
import './TourDetails.css';

const TourDetails = () => {
  const { tourId } = useParams();

  const tourData = {
    title: 'Enchanting European Escapade',
    subtitle: 'Embark on a fairy-tale journey through iconic European destinations.',
    images: [
      '/images/eiffel-tower.jpg',
      '/images/colosseum.jpg',
      '/images/venice-canal.jpg'
    ],
    highlights: [
      'Day 2: Arrival in Paris',
      'Day 3: Eiffel Tower visit and City exploration',
      'Day 5: Seine Experience',
      'Day 8: Departure from Rome'
    ],
    itinerary: [
      { day: 'Day 2', activity: 'Arrival in Paris', description: 'Arrivo all\'aeroporto di Parigi e trasferimento in hotel' },
      { day: 'Day 3', activity: 'Eiffel Tower visit and City exploration', description: 'Visita della Torre Eiffel e esplorazione della città' },
      { day: 'Day 5', activity: 'Seine Experience', description: 'Crociera sulla Senna e visita dei monumenti' },
      { day: 'Day 8', activity: 'Departure from Rome', description: 'Partenza da Roma e rientro' }
    ],
    inclusions: [
      'Round-trip airfare',
      'Accommodation in 4-star hotels',
      'Daily breakfast',
      'Guided tours at each location',
      'Transportation between cities'
    ],
    exclusions: [
      'Personal expenses',
      'Meals not mentioned',
      'Travel insurance',
      'Optional excursions'
    ],
    pricing: {
      starting: '€ 2.490',
      note: 'Starting from € 2,490 per person based on double occupancy. Single supplement available. Contact us for group pricing and customization options.'
    }
  };

  return (
    <div className="tour-details">
      {/* Hero Section */}
      <section className="tour-hero">
        <div className="container">
          <h1>{tourData.title}</h1>
          <p>{tourData.subtitle}</p>
        </div>
      </section>

      {/* Tour Images */}
      <section className="tour-gallery">
        <div className="container">
          <div className="gallery-grid">
            {tourData.images.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image} alt={`Tour highlight ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="tour-content">
          {/* Left Column */}
          <div className="tour-main">
            {/* Tour Highlights */}
            <section className="tour-highlights">
              <h2>Tour Highlights</h2>
              <ul>
                {tourData.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </section>

            {/* Itinerary */}
            <section className="itinerary">
              <h2>Itinerary</h2>
              <div className="itinerary-list">
                {tourData.itinerary.map((item, index) => (
                  <div key={index} className="itinerary-item">
                    <div className="day-number">{item.day}</div>
                    <div className="activity-content">
                      <h3>{item.activity}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions */}
            <section className="inclusions">
              <h2>Inclusions</h2>
              <ul>
                {tourData.inclusions.map((inclusion, index) => (
                  <li key={index}><i className="fas fa-check"></i> {inclusion}</li>
                ))}
              </ul>
            </section>

            {/* Exclusions */}
            <section className="exclusions">
              <h2>Exclusions</h2>
              <ul>
                {tourData.exclusions.map((exclusion, index) => (
                  <li key={index}><i className="fas fa-times"></i> {exclusion}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column - Pricing */}
          <div className="tour-sidebar">
            <div className="pricing-card">
              <h2>Pricing</h2>
              <div className="price">
                <span className="price-amount">{tourData.pricing.starting}</span>
                <span className="price-per">per person</span>
              </div>
              <p className="price-note">{tourData.pricing.note}</p>
              <button className="book-now-btn">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails; 