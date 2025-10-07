import React, { useState, useEffect } from 'react';
import TourService from '../services/TourService';
import { destinationImages } from '../config/destinations';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTour, setEditingTour] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Credenziali hardcoded come richiesto
  const ADMIN_USERNAME = 'ADMIN';
  const ADMIN_PASSWORD = 'admin123!';

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchTours();
    } else {
      setError('Credenziali non valide');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setTours([]);
    setEditingTour(null);
    setShowForm(false);
  };

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await TourService.getAllTours();
      setTours(data);
    } catch (err) {
      setError('Errore nel caricamento dei tour: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo tour?')) {
      try {
        await TourService.deleteTour(tourId);
        fetchTours();
      } catch (err) {
        setError('Errore nell\'eliminazione del tour: ' + err.message);
      }
    }
  };

  const handleSaveTour = async (tourData) => {
    try {
      if (editingTour?.id) {
        await TourService.updateTour(editingTour.id, tourData);
      } else {
        await TourService.createTour(tourData);
      }
      fetchTours();
      setShowForm(false);
      setEditingTour(null);
    } catch (err) {
      setError('Errore nel salvataggio del tour: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Accesso Admin</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit">Accedi</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Pannello di Amministrazione</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        <div className="actions-bar">
          <button 
            onClick={() => {
              setEditingTour(null);
              setShowForm(true);
            }}
            className="add-btn"
          >
            Nuovo Tour
          </button>
        </div>

        {loading ? (
          <div className="loading">Caricamento...</div>
        ) : (
          <div className="tours-grid">
            {tours.map((tour) => (
              <div key={tour.id} className="tour-card">
                <div className="tour-image">
                  {tour.heroImage ? (
                    <img src={TourService.getTourImageUrl(tour.id, 'hero')} alt={tour.title} />
                  ) : (
                    <div className="no-image">Nessuna immagine</div>
                  )}
                </div>
                <div className="tour-info">
                  <h3>{tour.title}</h3>
                  <p><strong>Destinazione:</strong> {tour.destination}</p>
                  <p><strong>Tipo:</strong> {tour.type}</p>
                  <p><strong>Code:</strong> {tour.code}</p>
                  <p><strong>Prezzo Min:</strong> €{tour.minPrice || 0}</p>
                </div>
                <div className="tour-actions">
                  <button 
                    onClick={() => {
                      setEditingTour(tour);
                      setShowForm(true);
                    }}
                    className="edit-btn"
                  >
                    Modifica
                  </button>
                  <button 
                    onClick={() => handleDeleteTour(tour.id)}
                    className="delete-btn"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <TourEditor 
            tour={editingTour}
            onSave={handleSaveTour}
            onCancel={() => {
              setShowForm(false);
              setEditingTour(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Componente per l'editor tour con preview in tempo reale
const TourEditor = ({ tour, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: tour?.title || 'Titolo del Tour',
    destination: tour?.destination || 'USA',
    type: tour?.type || 'city breaks',
    code: tour?.code || '',
    description: tour?.description || 'Descrizione del tour...',
    duration: tour?.duration || 7,
    minPrice: tour?.minPrice || 1000,
    notes: tour?.notes || '',
    program: tour?.program || {
      days: [
        { day: 1, title: 'GIORNO 1 - Arrivo', description: 'Descrizione del primo giorno...' },
        { day: 2, title: 'GIORNO 2 - Esplorazione', description: 'Descrizione del secondo giorno...' },
        { day: 3, title: 'GIORNO 3 - Attività', description: 'Descrizione del terzo giorno...' },
        { day: 4, title: 'GIORNO 4 - Partenza', description: 'Descrizione del quarto giorno...' }
      ]
    },
    prices: tour?.prices || {
      prices: [
        { category: 'Quota di partecipazione adulto', single: 2000, double: 1500, triple: 1300, quad: 1200 },
        { category: 'Supplemento camera singola', single: 0, double: 300, triple: 300, quad: 300 }
      ]
    },
    included: tour?.included || ['Volo internazionale', 'Hotel 4 stelle', 'Colazioni', 'Trasferimenti'],
    notIncluded: tour?.notIncluded || ['Pranzi e cene', 'Mance', 'Spese personali'],
    dates: tour?.dates || {
      '2025': [
        { startDate: 'Gen 7', endDate: 'Gen 14' },
        { startDate: 'Feb 1', endDate: 'Feb 8' }
      ]
    }
  });

  const [expandedDays, setExpandedDays] = useState(new Set());
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Genera automaticamente il code dal title
  useEffect(() => {
    if (!tour?.id && formData.title) {
      const code = formData.title.toLowerCase()
        .replace(/[àèéìòù]/g, (match) => {
          const map = { 'à': 'a', 'è': 'e', 'é': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u' };
          return map[match];
        })
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, code }));
    }
  }, [formData.title, tour?.id]);

  const handleChange = (e) => {
    const { name, value } => e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addDay = () => {
    const newDayNumber = formData.program.days.length + 1;
    setFormData(prev => ({
      ...prev,
      program: {
        ...prev.program,
        days: [...prev.program.days, {
          day: newDayNumber,
          title: `GIORNO ${newDayNumber} - Nuovo giorno`,
          description: 'Descrizione del nuovo giorno...'
        }]
      }
    }));
  };

  const removeDay = (index) => {
    setFormData(prev => ({
      ...prev,
      program: {
        ...prev.program,
        days: prev.program.days.filter((_, i) => i !== index)
      }
    }));
  };

  const updateDay = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      program: {
        ...prev.program,
        days: prev.program.days.map((day, i) => 
          i === index ? { ...day, [field]: value } : day
        )
      }
    }));
  };

  const addPriceRow = () => {
    setFormData(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        prices: [...prev.prices.prices, {
          category: 'Nuova categoria',
          single: 0,
          double: 0,
          triple: 0,
          quad: 0
        }]
      }
    }));
  };

  const updatePriceRow = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        prices: prev.prices.prices.map((row, i) => 
          i === index ? { ...row, [field]: value } : row
        )
      }
    }));
  };

  const removePriceRow = (index) => {
    setFormData(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        prices: prev.prices.prices.filter((_, i) => i !== index)
      }
    }));
  };

  const addDate = (year) => {
    setFormData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [year]: [...(prev.dates[year] || []), { startDate: 'Gen 1', endDate: 'Gen 7' }]
      }
    }));
  };

  const updateDate = (year, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [year]: prev.dates[year].map((date, i) => 
          i === index ? { ...date, [field]: value } : date
        )
      }
    }));
  };

  const removeDate = (year, index) => {
    setFormData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [year]: prev.dates[year].filter((_, i) => i !== index)
      }
    }));
  };

  const toggleDayExpansion = (dayNumber) => {
    setExpandedDays(prev => {
      const newSet = new Set();
      if (!prev.has(dayNumber)) {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  const getTourImages = () => {
    const images = [];
    
    // Usa le immagini di fallback della destinazione
    const destinationKey = formData.destination?.toLowerCase().replace(/\s+/g, '-');
    if (destinationKey && destinationImages[destinationKey]) {
      destinationImages[destinationKey].forEach((imageName, index) => {
        images.push({
          src: `/images/${imageName}`,
          alt: `${formData.title} - Immagine ${index + 1}`,
          isMain: index === 0
        });
      });
    }
    
    return images;
  };

  const getHighlightImages = () => {
    return formData.included.map((service, index) => ({
      id: index,
      title: service,
      image: `/images/placeholder.jpg`,
      alt: `${service} - ${formData.title}`
    }));
  };

  const getTourDates = () => {
    const formattedDates = {};
    Object.keys(formData.dates).forEach(year => {
      if (Array.isArray(formData.dates[year])) {
        formattedDates[year] = formData.dates[year].map(dateInfo => ({
          dateRange: `${dateInfo.startDate} - ${dateInfo.endDate}`,
          price: formData.minPrice || 0
        }));
      }
    });
    return formattedDates;
  };

  const tourImages = getTourImages();
  const tourDates = getTourDates();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="tour-editor-overlay">
      <div className="tour-editor">
        <div className="editor-header">
          <h2>{tour ? 'Modifica Tour' : 'Nuovo Tour'}</h2>
          <div className="editor-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Annulla
            </button>
            <button type="submit" form="tour-form" className="save-btn">
              {tour ? 'Aggiorna' : 'Crea'} Tour
            </button>
          </div>
        </div>

        <div className="editor-content">
          {/* Form di editing */}
          <div className="editor-form">
            <form id="tour-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Informazioni Base</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titolo *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Destinazione *</label>
                    <select name="destination" value={formData.destination} onChange={handleChange} required>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="Messico">Messico</option>
                      <option value="America Centrale">America Centrale</option>
                      <option value="Sud America">Sud America</option>
                      <option value="Caraibi">Caraibi</option>
                      <option value="Polinesia Francese">Polinesia Francese</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo *</label>
                    <select name="type" value={formData.type} onChange={handleChange} required>
                      <option value="city breaks">City Breaks</option>
                      <option value="fly and drive">Fly and Drive</option>
                      <option value="ride in harley">Ride in Harley</option>
                      <option value="tour guidato">Tour Guidato</option>
                      <option value="luxury travel">Luxury Travel</option>
                      <option value="camper adventure">Camper Adventure</option>
                      <option value="extra">Extra</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Durata (giorni)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Prezzo Minimo (€)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={formData.minPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Code (auto-generato)</label>
                    <input
                      type="text"
                      value={formData.code}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrizione</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Note</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Programma</h3>
                {formData.program.days.map((day, index) => (
                  <div key={index} className="day-editor">
                    <div className="day-header">
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateDay(index, 'title', e.target.value)}
                        className="day-title-input"
                      />
                      <button type="button" onClick={() => removeDay(index)} className="remove-btn">
                        Rimuovi
                      </button>
                    </div>
                    <textarea
                      value={day.description}
                      onChange={(e) => updateDay(index, 'description', e.target.value)}
                      rows="2"
                      className="day-description-input"
                    />
                  </div>
                ))}
                <button type="button" onClick={addDay} className="add-btn">
                  + Aggiungi Giorno
                </button>
              </div>

              <div className="form-section">
                <h3>Prezzi</h3>
                {formData.prices.prices.map((priceRow, index) => (
                  <div key={index} className="price-editor">
                    <div className="price-header">
                      <input
                        type="text"
                        value={priceRow.category}
                        onChange={(e) => updatePriceRow(index, 'category', e.target.value)}
                        className="price-category-input"
                      />
                      <button type="button" onClick={() => removePriceRow(index)} className="remove-btn">
                        Rimuovi
                      </button>
                    </div>
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Singola"
                        value={priceRow.single}
                        onChange={(e) => updatePriceRow(index, 'single', parseInt(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        placeholder="Doppia"
                        value={priceRow.double}
                        onChange={(e) => updatePriceRow(index, 'double', parseInt(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        placeholder="Tripla"
                        value={priceRow.triple}
                        onChange={(e) => updatePriceRow(index, 'triple', parseInt(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        placeholder="Quadrupla"
                        value={priceRow.quad}
                        onChange={(e) => updatePriceRow(index, 'quad', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addPriceRow} className="add-btn">
                  + Aggiungi Prezzo
                </button>
              </div>

              <div className="form-section">
                <h3>Servizi Inclusi</h3>
                {formData.included.map((item, index) => (
                  <div key={index} className="array-item">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('included', index, e.target.value)}
                    />
                    <button type="button" onClick={() => removeArrayItem('included', index)} className="remove-btn">
                      Rimuovi
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('included')} className="add-btn">
                  + Aggiungi Servizio
                </button>
              </div>

              <div className="form-section">
                <h3>Servizi Non Inclusi</h3>
                {formData.notIncluded.map((item, index) => (
                  <div key={index} className="array-item">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('notIncluded', index, e.target.value)}
                    />
                    <button type="button" onClick={() => removeArrayItem('notIncluded', index)} className="remove-btn">
                      Rimuovi
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('notIncluded')} className="add-btn">
                  + Aggiungi Servizio
                </button>
              </div>

              <div className="form-section">
                <h3>Date</h3>
                {Object.keys(formData.dates).map(year => (
                  <div key={year} className="year-dates">
                    <h4>{year}</h4>
                    {formData.dates[year].map((date, index) => (
                      <div key={index} className="date-editor">
                        <input
                          type="text"
                          placeholder="Data inizio"
                          value={date.startDate}
                          onChange={(e) => updateDate(year, index, 'startDate', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Data fine"
                          value={date.endDate}
                          onChange={(e) => updateDate(year, index, 'endDate', e.target.value)}
                        />
                        <button type="button" onClick={() => removeDate(year, index)} className="remove-btn">
                          Rimuovi
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addDate(year)} className="add-btn">
                      + Aggiungi Data
                    </button>
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Preview della pagina tour */}
          <div className="tour-preview">
            <h3>Anteprima Tour</h3>
            <div className="preview-container">
              {/* Hero Section */}
              <section className="tour-hero-masonry">
                <div className="masonry-container">
                  {tourImages.map((image, index) => (
                    <div
                      key={index}
                      className={`masonry-item ${image.isMain ? 'main-image' : ''}`}
                    >
                      <img src={image.src} alt={image.alt} />
                    </div>
                  ))}
                </div>
              </section>

              <div className="container-details">
                <div className="tour-content">
                  <div className="tour-main">
                    {/* Itinerary */}
                    {formData.program && formData.program.days && formData.program.days.length > 0 && (
                      <section className="tour-section">
                        <h2 className="section-title">Itinerario</h2>
                        <div className="itinerary-list">
                          {formData.program.days.map((day, index) => {
                            const dayNumber = day.day;
                            const isExpanded = expandedDays.has(dayNumber);
                            return (
                              <div key={index} className="itinerary-item">
                                <div 
                                  className="itinerary-item-header"
                                  onClick={() => toggleDayExpansion(dayNumber)}
                                >
                                  <div className="day-badge">Giorno {dayNumber}</div>
                                  <div className="day-content">
                                    <h3 className="day-title">{day.title}</h3>
                                  </div>
                                  <div className="expand-icon">
                                    <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
                                      <i className="fa-solid fa-angle-right"></i>
                                    </span>
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div className="itinerary-details">
                                    <p className="day-description">
                                      {day.description || "Descrizione dettagliata non disponibile per questo giorno."}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {/* Pricing Section */}
                    {formData.prices && formData.prices.prices && formData.prices.prices.length > 0 && (
                      <section className="tour-section">
                        <h2 className="section-title">Prezzi</h2>
                        <div className="pricing-table-container">
                          <table className="pricing-table">
                            <thead>
                              <tr>
                                <th className="pricing-header-cell">Tipologia di camera</th>
                                <th className="pricing-header-cell">Singola</th>
                                <th className="pricing-header-cell">Doppia</th>
                                <th className="pricing-header-cell">Tripla</th>
                                <th className="pricing-header-cell">Quadrupla</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.prices.prices.map((priceRow, index) => (
                                <tr key={index} className="pricing-row">
                                  <td className="pricing-label-cell">{priceRow.category}</td>
                                  <td className="pricing-value-cell">
                                    {priceRow.single ? `€ ${priceRow.single.toLocaleString()}` : 'n.d.'}
                                  </td>
                                  <td className="pricing-value-cell">
                                    {priceRow.double ? `€ ${priceRow.double.toLocaleString()}` : 'n.d.'}
                                  </td>
                                  <td className="pricing-value-cell">
                                    {priceRow.triple ? `€ ${priceRow.triple.toLocaleString()}` : 'n.d.'}
                                  </td>
                                  <td className="pricing-value-cell">
                                    {priceRow.quad ? `€ ${priceRow.quad.toLocaleString()}` : 'n.d.'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    {/* Inclusions */}
                    {formData.included && formData.included.length > 0 && (
                      <section className="tour-section">
                        <h2 className="section-title">Servizi Inclusi</h2>
                        <div className="inclusions-list">
                          {formData.included.map((inclusion, index) => (
                            <div key={index} className="inclusion-item">
                              <span className="inclusion-icon">✓</span>
                              <span className="inclusion-text">{inclusion}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Exclusions */}
                    {formData.notIncluded && formData.notIncluded.length > 0 && (
                      <section className="tour-section">
                        <h2 className="section-title">Servizi Non Inclusi</h2>
                        <div className="exclusions-list">
                          {formData.notIncluded.map((exclusion, index) => (
                            <div key={index} className="exclusion-item">
                              <span className="exclusion-icon">✗</span>
                              <span className="exclusion-text">{exclusion}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="tour-sidebar">
                    <div className="dates-prices-section">
                      <div className="year-selection">
                        {Object.keys(tourDates).map(year => (
                          <button 
                            key={year}
                            className={`year-button ${selectedYear === parseInt(year) ? 'active' : ''}`}
                            onClick={() => setSelectedYear(parseInt(year))}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                      
                      <div className="dates-list">
                        {tourDates[selectedYear] && tourDates[selectedYear].map((dateInfo, index) => (
                          <div key={index} className="date-item">
                            <div className="date-info">
                              <span className="date-range">{dateInfo.dateRange}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tour Information */}
                    <section className="tour-section">
                      <h2 className="section-title">Informazioni Tour</h2>
                      <div className="tour-info-grid">
                        <div className="info-item">
                          <span className="info-label">Destinazione:</span>
                          <span className="info-value">{formData.destination}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Tipo:</span>
                          <span className="info-value">{formData.type}</span>
                        </div>
                        {formData.duration && (
                          <div className="info-item">
                            <span className="info-label">Durata:</span>
                            <span className="info-value">{formData.duration} giorni</span>
                          </div>
                        )}
                        <div className="info-item">
                          <span className="info-label">Codice:</span>
                          <span className="info-value">{formData.code}</span>
                        </div>
                      </div>
                    </section>

                    {formData.notes && (
                      <section className="tour-section">
                        <h2 className="section-title">Note</h2>
                        <div className="notes-content">
                          <p>{formData.notes}</p>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;