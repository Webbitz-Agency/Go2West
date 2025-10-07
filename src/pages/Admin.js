import React, { useState, useEffect, useRef } from 'react';
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

// Componente per l'upload delle immagini
const ImageUploader = ({ imageType, currentImage, label, onImageUpload }) => {
  const fileInputRef = useRef(null);
  
  return (
    <div className="image-uploader">
      <label className="image-upload-label">{label}</label>
      <div className="image-upload-container">
        {currentImage ? (
          <div className="current-image">
            <img src={currentImage} alt="Current" />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="change-image-btn"
            >
              Cambia Immagine
            </button>
          </div>
        ) : (
          <div className="no-image">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="upload-image-btn"
            >
              + Carica Immagine
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files[0]) {
              onImageUpload(imageType, e.target.files[0]);
            }
          }}
        />
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
    heroImage: tour?.heroImage || '',
    carouselImage1: tour?.carouselImage1 || '',
    carouselImage2: tour?.carouselImage2 || '',
    carouselImage3: tour?.carouselImage3 || '',
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
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [hoveredImage, setHoveredImage] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
    const { name, value } = e.target;
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

  const addYear = () => {
    const newYear = Math.max(...Object.keys(formData.dates).map(Number)) + 1;
    setFormData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [newYear]: [{ startDate: 'Gen 1', endDate: 'Gen 7' }]
      }
    }));
  };

  const removeYear = (year) => {
    if (Object.keys(formData.dates).length > 1) {
      setFormData(prev => {
        const newDates = { ...prev.dates };
        delete newDates[year];
        return { ...prev, dates: newDates };
      });
    }
  };

  const handleImageUpload = (imageType, file) => {
    // Per ora simuliamo l'upload, in futuro si può implementare il vero upload
    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      [imageType]: imageUrl
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
    
    // Aggiungi l'immagine hero se esiste
    if (formData.heroImage) {
      images.push({
        src: formData.heroImage,
        alt: formData.title,
        isMain: true
      });
    }
    
    // Aggiungi le immagini carousel se esistono
    if (formData.carouselImage1) {
      images.push({
        src: formData.carouselImage1,
        alt: `${formData.title} - Carousel 1`,
        isMain: false
      });
    }
    if (formData.carouselImage2) {
      images.push({
        src: formData.carouselImage2,
        alt: `${formData.title} - Carousel 2`,
        isMain: false
      });
    }
    if (formData.carouselImage3) {
      images.push({
        src: formData.carouselImage3,
        alt: `${formData.title} - Carousel 3`,
        isMain: false
      });
    }
    
    // Se non ci sono immagini dal formData, usa le immagini di fallback della destinazione
    if (images.length === 0) {
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
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const startEditing = (field, value = '') => {
    setEditingField(field);
    setEditingValue(value);
  };

  const saveEdit = () => {
    if (editingField) {
      const [type, ...path] = editingField.split('.');
      
      if (type === 'basic') {
        const field = path[0];
        const value = (field === 'duration' || field === 'minPrice') ? parseInt(editingValue) || 0 : editingValue;
        setFormData(prev => ({ ...prev, [field]: value }));
      } else if (type === 'day') {
        const [index, field] = path;
        updateDay(parseInt(index), field, editingValue);
      } else if (type === 'price') {
        const [index, field] = path;
        const numericValue = field === 'category' ? editingValue : parseInt(editingValue) || 0;
        updatePriceRow(parseInt(index), field, numericValue);
      } else if (type === 'included') {
        const index = parseInt(path[0]);
        handleArrayChange('included', index, editingValue);
      } else if (type === 'notIncluded') {
        const index = parseInt(path[0]);
        handleArrayChange('notIncluded', index, editingValue);
      } else if (type === 'date') {
        const [year, index, field] = path;
        updateDate(year, parseInt(index), field, editingValue);
      }
    }
    setEditingField(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Componente per editing inline
  const EditableText = ({ field, value, className = '', placeholder = 'Clicca per modificare' }) => {
    const isEditing = editingField === field;
    
    if (isEditing) {
      return (
        <input
          type="text"
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyPress}
          className={`editable-input ${className}`}
          autoFocus
        />
      );
    }
    
    return (
      <span 
        className={`editable-text ${className}`}
        onClick={() => startEditing(field, value)}
        title="Clicca per modificare"
      >
        {value || placeholder}
      </span>
    );
  };

  const EditableTextarea = ({ field, value, className = '', placeholder = 'Clicca per modificare' }) => {
    const isEditing = editingField === field;
    
    if (isEditing) {
      return (
        <textarea
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyPress}
          className={`editable-textarea ${className}`}
          autoFocus
          rows="3"
        />
      );
    }
    
    return (
      <div 
        className={`editable-textarea-display ${className}`}
        onClick={() => startEditing(field, value)}
        title="Clicca per modificare"
      >
        {value || placeholder}
      </div>
    );
  };

  const EditableNumber = ({ field, value, className = '', placeholder = '0' }) => {
    const isEditing = editingField === field;
    
    if (isEditing) {
      return (
        <input
          type="number"
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyPress}
          className={`editable-input ${className}`}
          autoFocus
        />
      );
    }
    
    return (
      <span 
        className={`editable-text ${className}`}
        onClick={() => startEditing(field, value)}
        title="Clicca per modificare"
      >
        {value || placeholder}
      </span>
    );
  };

  return (
    <div className="tour-editor-overlay">
      <div className="tour-editor">
        <div className="editor-header">
          <h2>{tour ? 'Modifica Tour' : 'Nuovo Tour'}</h2>
        </div>
        <div className="editor-content">
          <div className="editable-tour-page">
            {/* Hero Section - Clean Image Gallery */}
            <section className="tour-hero-masonry">
              <div className="masonry-container">
                {tourImages.map((image, index) => (
                  <div
                    key={index}
                    className={`masonry-item ${image.isMain ? 'main-image' : ''} ${hoveredImage === index ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredImage(index)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>
            </section>

            {/* Tour Overview Section */}
            <section className="tour-overview-section">
              <div className="container-overview">
                <div className="overview-content">
                  {/* Left Column - Overview Text */}
                  <div className="overview-text">
                    <div className="overview-header">
                      <span className="overview-label">OVERVIEW</span>
                      <h1 className="overview-title">
                        <EditableText 
                          field="basic.title" 
                          value={formData.title}
                          className="overview-title-text"
                          placeholder="Titolo del Tour"
                        />
                      </h1>
                    </div>
                    <div className="overview-description">
                      <EditableTextarea 
                        field="basic.description" 
                        value={formData.description}
                        className="overview-description-text"
                        placeholder="Descrizione del tour..."
                      />
                      <p>Un'esperienza di viaggio unica che ti porterà alla scoperta di destinazioni straordinarie, combinando comfort, avventura e autenticità. I nostri tour sono progettati per offrirti momenti indimenticabili e connessioni profonde con le culture locali.</p>
                    </div>
                  </div>
                  
                  {/* Right Column - Image Carousel */}
                  <div className="overview-carousel">
                    <div className="overview-carousel-container">
                      {tourImages.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className={`overview-slide ${index === currentHighlightIndex % 4 ? 'active' : ''}`}
                        >
                          <img src={image.src} alt={image.alt} />
                        </div>
                      ))}
                    </div>
                    <div className="overview-indicators">
                      {tourImages.slice(0, 4).map((_, index) => (
                        <button
                          key={index}
                          className={`overview-indicator ${index === currentHighlightIndex % 4 ? 'active' : ''}`}
                          onClick={() => setCurrentHighlightIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="container-details">
              <div className="tour-content">
                {/* Left Column - Main Content */}
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
                                    <h3 className="day-title">
                                      <EditableText 
                                        field={`day.${index}.title`} 
                                        value={day.title}
                                        className="day-title-text"
                                        placeholder="Titolo del giorno"
                                      />
                                    </h3>
                                  </div>
                                  <div className="expand-icon">
                                    <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
                                      <i className="fa-solid fa-angle-right"></i>
                                    </span>
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div className="itinerary-details">
                                    <div className="day-description">
                                      <EditableTextarea 
                                        field={`day.${index}.description`} 
                                        value={day.description}
                                        className="day-description-text"
                                        placeholder="Descrizione dettagliata del giorno..."
                                      />
                                    </div>
                                    <div className="day-actions">
                                      <button 
                                        type="button" 
                                        onClick={() => removeDay(index)} 
                                        className="remove-day-btn"
                                      >
                                        Rimuovi Giorno
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="add-day-section">
                          <button type="button" onClick={addDay} className="add-day-btn">
                            + Aggiungi Giorno
                          </button>
                        </div>
                      </section>
                    )}

                    {/* Tour Highlights Carousel */}
                    {formData.included && formData.included.length > 0 && (
                      <section className="tour-section">
                        <h2 className="section-title">Servizi Inclusi</h2>
                        <div className="highlights-carousel">
                          <div className="carousel-container">
                            {getHighlightImages().map((highlight, index) => (
                              <div
                                key={highlight.id}
                                className={`carousel-slide ${index === currentHighlightIndex ? 'active' : ''}`}
                              >
                                <img src={highlight.image} alt={highlight.alt} />
                                <div className="highlight-overlay">
                                  <h3 className="highlight-title">{highlight.title}</h3>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Indicatori */}
                          {formData.included && formData.included.length > 1 && (
                            <div className="carousel-indicators">
                              {formData.included.map((_, index) => (
                                <button
                                  key={index}
                                  className={`indicator ${index === currentHighlightIndex ? 'active' : ''}`}
                                  onClick={() => setCurrentHighlightIndex(index)}
                                />
                              ))}
                            </div>
                          )}
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
                                  <td className="pricing-label-cell">
                                    <EditableText 
                                      field={`price.${index}.category`} 
                                      value={priceRow.category}
                                      className="price-category-text"
                                      placeholder="Categoria prezzo"
                                    />
                                  </td>
                                  <td className="pricing-value-cell">
                                    <EditableNumber 
                                      field={`price.${index}.single`} 
                                      value={priceRow.single}
                                      className="price-value-text"
                                      placeholder="0"
                                    />
                                  </td>
                                  <td className="pricing-value-cell">
                                    <EditableNumber 
                                      field={`price.${index}.double`} 
                                      value={priceRow.double}
                                      className="price-value-text"
                                      placeholder="0"
                                    />
                                  </td>
                                  <td className="pricing-value-cell">
                                    <EditableNumber 
                                      field={`price.${index}.triple`} 
                                      value={priceRow.triple}
                                      className="price-value-text"
                                      placeholder="0"
                                    />
                                  </td>
                                  <td className="pricing-value-cell">
                                    <EditableNumber 
                                      field={`price.${index}.quad`} 
                                      value={priceRow.quad}
                                      className="price-value-text"
                                      placeholder="0"
                                    />
                                  </td>
                                  <td className="pricing-actions-cell">
                                    <button 
                                      type="button" 
                                      onClick={() => removePriceRow(index)} 
                                      className="remove-price-btn"
                                    >
                                      ×
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="add-price-section">
                            <button type="button" onClick={addPriceRow} className="add-price-btn">
                              + Aggiungi Prezzo
                            </button>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Quote Request CTA */}
                    <section className="tour-section quote-request-section">
                      <div className="quote-request-content">
                        <h2 className="quote-request-title">Interessato a questo viaggio?</h2>
                        <p className="quote-request-description">
                          Richiedi un preventivo personalizzato e scopri tutte le opzioni disponibili per il tuo viaggio ideale.
                        </p>
                        <button className="quote-request-btn">
                          <i className="fa-solid fa-calculator"></i>
                          Richiedi un Preventivo
                        </button>
                      </div>
                    </section>

                    {/* Inclusions */}
                    {formData.included && formData.included.length > 0 && (
                      <section className="tour-section">
                        <h2 className="section-title">Servizi Inclusi</h2>
                        <div className="inclusions-list">
                          {formData.included.map((inclusion, index) => (
                            <div key={index} className="inclusion-item">
                              <span className="inclusion-icon">✓</span>
                              <EditableText 
                                field={`included.${index}`} 
                                value={inclusion}
                                className="inclusion-text"
                                placeholder="Servizio incluso"
                              />
                              <button 
                                type="button" 
                                onClick={() => removeArrayItem('included', index)} 
                                className="remove-inclusion-btn"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <div className="add-inclusion-section">
                            <button type="button" onClick={() => addArrayItem('included')} className="add-inclusion-btn">
                              + Aggiungi Servizio
                            </button>
                          </div>
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
                              <EditableText 
                                field={`notIncluded.${index}`} 
                                value={exclusion}
                                className="exclusion-text"
                                placeholder="Servizio non incluso"
                              />
                              <button 
                                type="button" 
                                onClick={() => removeArrayItem('notIncluded', index)} 
                                className="remove-exclusion-btn"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <div className="add-exclusion-section">
                            <button type="button" onClick={() => addArrayItem('notIncluded')} className="add-exclusion-btn">
                              + Aggiungi Servizio
                            </button>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Right Column - Dates & Prices */}
                  <div className="tour-sidebar">
                    <div className="dates-prices-section">
                      {/* Year Selection */}
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
                        <button 
                          type="button" 
                          onClick={addYear} 
                          className="add-year-btn"
                          title="Aggiungi Anno"
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="pricing-disclaimer">
                        A partire da €<EditableNumber 
                          field="basic.minPrice" 
                          value={formData.minPrice}
                          className="min-price-text"
                          placeholder="0"
                        /> per persona.
                      </p>
                      
                      {/* Tour Dates List */}
                      <div className="tour-dates-list">
                        {tourDates[selectedYear]?.map((dateInfo, index) => (
                          <div key={index} className="date-row">
                            <div className="date-info">
                              <span className="date-range">
                                <EditableText 
                                  field={`date.${selectedYear}.${index}.startDate`} 
                                  value={formData.dates[selectedYear]?.[index]?.startDate}
                                  className="date-start-text"
                                  placeholder="Gen 1"
                                /> - <EditableText 
                                  field={`date.${selectedYear}.${index}.endDate`} 
                                  value={formData.dates[selectedYear]?.[index]?.endDate}
                                  className="date-end-text"
                                  placeholder="Gen 7"
                                />
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeDate(selectedYear, index)}
                              className="remove-date-btn"
                              title="Rimuovi Data"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="add-date-section">
                          <button 
                            type="button" 
                            onClick={() => addDate(selectedYear)} 
                            className="add-date-btn"
                          >
                            + Aggiungi Data
                          </button>
                        </div>
                        {Object.keys(tourDates).length > 1 && (
                          <div className="remove-year-section">
                            <button 
                              type="button" 
                              onClick={() => removeYear(selectedYear)} 
                              className="remove-year-btn"
                            >
                              - Rimuovi Anno {selectedYear}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tour Information */}
                    <section className="tour-section">
                      <h2 className="section-title">Informazioni Tour</h2>
                      <div className="tour-info-grid">
                        <div className="info-item">
                          <span className="info-label">Destinazione:</span>
                          <span className="info-value">
                            <EditableText 
                              field="basic.destination" 
                              value={formData.destination}
                              className="info-value-text"
                              placeholder="Destinazione"
                            />
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Tipo:</span>
                          <span className="info-value">
                            <EditableText 
                              field="basic.type" 
                              value={formData.type}
                              className="info-value-text"
                              placeholder="Tipo tour"
                            />
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Durata:</span>
                          <span className="info-value">
                            <EditableNumber 
                              field="basic.duration" 
                              value={formData.duration}
                              className="info-value-text"
                              placeholder="0"
                            /> giorni
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Prezzo Min:</span>
                          <span className="info-value">
                            €<EditableNumber 
                              field="basic.minPrice" 
                              value={formData.minPrice}
                              className="info-value-text"
                              placeholder="0"
                            />
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Codice:</span>
                          <span className="info-value readonly">{formData.code}</span>
                        </div>
                      </div>
                    </section>

                    <section className="tour-section">
                      <h2 className="section-title">Note</h2>
                      <div className="notes-content">
                        <EditableTextarea 
                          field="basic.notes" 
                          value={formData.notes}
                          className="notes-text"
                          placeholder="Note aggiuntive..."
                        />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Management Section */}
            <section className="image-management-section">
              <h2 className="section-title">Gestione Immagini</h2>
              <div className="image-management-grid">
                <ImageUploader 
                  imageType="heroImage" 
                  currentImage={formData.heroImage} 
                  label="Hero Image"
                  onImageUpload={handleImageUpload}
                />
                <ImageUploader 
                  imageType="carouselImage1" 
                  currentImage={formData.carouselImage1} 
                  label="Carousel Image 1"
                  onImageUpload={handleImageUpload}
                />
                <ImageUploader 
                  imageType="carouselImage2" 
                  currentImage={formData.carouselImage2} 
                  label="Carousel Image 2"
                  onImageUpload={handleImageUpload}
                />
                <ImageUploader 
                  imageType="carouselImage3" 
                  currentImage={formData.carouselImage3} 
                  label="Carousel Image 3"
                  onImageUpload={handleImageUpload}
                />
              </div>
            </section>

            {/* Save Button */}
            <div className="save-section">
              <button type="button" onClick={onCancel} className="cancel-btn">
                Annulla
              </button>
              <button type="button" onClick={handleSubmit} className="save-btn">
                {tour ? 'Aggiorna' : 'Crea'} Tour
              </button>
            </div>

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="success-toast">
                <i className="fa-solid fa-check-circle"></i>
                Tour aggiornato correttamente!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;