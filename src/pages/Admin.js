
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import TourService from '../services/TourService';
import './Admin.css';



// Componente Admin principale
const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_USERNAME = 'ADMIN';
  const ADMIN_PASSWORD = 'admin123!';

  // Chiavi per localStorage
  const SESSION_KEY = 'admin_session';

  // Funzioni per gestire la persistenza della sessione
  const saveSession = () => {
    const sessionData = {
      isAuthenticated: true,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 ore
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  };

  const loadSession = () => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        // Controlla se la sessione è ancora valida (non scaduta)
        if (parsed.expiresAt > Date.now()) {
          return parsed.isAuthenticated;
        } else {
          // Sessione scaduta, rimuovi
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento della sessione:', error);
    }
    return false;
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
  };

  // Controlla la sessione al caricamento del componente
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      setIsAuthenticated(true);
      fetchTours();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      saveSession(); // Salva la sessione
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
    clearSession(); // Pulisce la sessione
  };

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await TourService.getAllTours();
      setTours(data);
      setFilteredTours(data);
    } catch (err) {
      setError('Errore nel caricamento dei tour: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per filtrare i tour
  const filterTours = (searchValue) => {
    if (!searchValue.trim()) {
      setFilteredTours(tours);
      return;
    }

    const filtered = tours.filter(tour => {
      const searchLower = searchValue.toLowerCase();
      return (
        tour.title?.toLowerCase().includes(searchLower) ||
        tour.destination?.toLowerCase().includes(searchLower) ||
        tour.type?.toLowerCase().includes(searchLower) ||
        tour.code?.toLowerCase().includes(searchLower) ||
        tour.minPrice?.toString().includes(searchLower)
      );
    });
    setFilteredTours(filtered);
  };

  // Gestisce il cambio del termine di ricerca
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterTours(value);
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


  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Accesso Admin</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group-access">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group-access">
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
        <button onClick={() => navigate('/')} className="indietro-sito" style={{ width: '100%', maxWidth: '420px', borderRadius: '50px', margin:0 }}>Torna al sito</button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <PageTitle title="Admin" />
      <div className="admin-header">
        <h1>Pannello di Amministrazione</h1>
        <div className="admin-header-buttons">
        <a href="/" className="indietro-sito">Torna al sito</a>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        <div className="search-bar">
          <div className="search-input-container">
            <i className="fa-solid fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Cerca per nome, destinazione, tipo, codice o prezzo..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredTours(tours);
                }}
                className="clear-search-btn"
                title="Cancella ricerca"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </div>
          <button
            onClick={() => navigate('/admin/tour-editor')}
            className="new-tour-btn"
          >
            <i className="fa-solid fa-plus"></i>
            Nuovo Tour
          </button>
        </div>

        {loading ? (
          <div className="loading">Caricamento...</div>
        ) : (
          <div className="tours-grid">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="tour-card">
                <div className="tour-image">
                  {tour.heroImage ? (
                    <img
                      src={TourService.getTourImageUrl(tour.id, 'hero')}
                      alt={tour.title}
                    />
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
                    onClick={() => navigate('/admin/tour-editor', { state: { tour } })}
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

      </div>
    </div>
  );
};

export default Admin;