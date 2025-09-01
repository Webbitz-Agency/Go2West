import React, { useState, useEffect } from 'react';
import TourService from '../services/TourService';
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

  const handleDuplicateTour = async (tour) => {
    try {
      await TourService.duplicateTour(tour);
      fetchTours();
    } catch (err) {
      setError('Errore nella duplicazione del tour: ' + err.message);
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
                  {tour.mainImage ? (
                    <img src={tour.mainImage} alt={tour.title} />
                  ) : (
                    <div className="no-image">Nessuna immagine</div>
                  )}
                </div>
                <div className="tour-info">
                  <h3>{tour.title}</h3>
                  <p><strong>Paese:</strong> {tour.country}</p>
                  <p><strong>Tipo:</strong> {tour.type}</p>
                  <p><strong>Slug:</strong> {tour.slug}</p>
                  <p><strong>Prezzo:</strong> €{tour.price}</p>
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
                    onClick={() => handleDuplicateTour(tour)}
                    className="duplicate-btn"
                  >
                    Duplica
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
          <TourForm 
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

// Componente per il form di creazione/modifica tour
const TourForm = ({ tour, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    country: tour?.country || '',
    type: tour?.type || 'tour',
    slug: tour?.slug || '',
    price: tour?.price || '',
    duration: tour?.duration || '',
    description: tour?.description || '',
    mainImage: tour?.mainImage || '',
    images: tour?.images || [],
    highlights: tour?.highlights || [],
    itinerary: tour?.itinerary || [],
    included: tour?.included || [],
    notIncluded: tour?.notIncluded || [],
    notes: tour?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

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

  return (
    <div className="tour-form-overlay">
      <div className="tour-form">
        <h2>{tour ? 'Modifica Tour' : 'Nuovo Tour'}</h2>
        <form onSubmit={handleSubmit}>
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
              <label>Paese *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="tour">Tour</option>
                <option value="fly-drive">Fly & Drive</option>
                <option value="safari">Safari</option>
                <option value="cruise">Crociera</option>
                <option value="adventure">Avventura</option>
              </select>
            </div>
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prezzo (€) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
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

          <div className="form-group">
            <label>Immagine Principale (URL)</label>
            <input
              type="url"
              name="mainImage"
              value={formData.mainImage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Descrizione</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {tour ? 'Aggiorna' : 'Crea'} Tour
            </button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
