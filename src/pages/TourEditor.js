import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import TourService from '../services/TourService';
import './TourEditor.css';

// Componente per l'upload delle immagini
const ImageUploader = ({ imageType, currentImage, label, onImageUpload, tour }) => {
  const fileInputRef = useRef(null);
  
  // Mappa i tipi di immagine ai tipi del backend
  const imageTypeMap = {
    'heroImage': 'hero',
    'carouselImage1': 'carousel1',
    'carouselImage2': 'carousel2',
    'carouselImage3': 'carousel3',
    'image1': 'image1',
    'image2': 'image2',
    'image3': 'image3',
    'image4': 'image4',
    'image5': 'image5',
    'mapImage': 'map'
  };
  
  // Se l'immagine è 'exists' e c'è un tour, costruisci l'URL dell'immagine
  let imageUrl = currentImage;
  if (currentImage === 'exists' && tour?.id) {
    const backendImageType = imageTypeMap[imageType];
    if (backendImageType) {
      imageUrl = TourService.getTourImageUrl(tour.id, backendImageType);
    }
  }
  
  // Determina se mostrare l'immagine corrente
  const showCurrentImage = imageUrl && imageUrl !== 'exists' && !imageUrl.startsWith('blob:');
  const hasExistingImage = currentImage === 'exists' && !showCurrentImage;
  
  return (
    <div className="image-uploader">
      <label className="image-upload-label">{label}</label>
      <div className="image-upload-container">
        {showCurrentImage ? (
          <div className="current-image">
            <img src={imageUrl} alt="Current" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="change-image-btn"
            >
              Cambia Immagine
            </button>
          </div>
        ) : hasExistingImage ? (
          <div className="existing-image">
            <div className="image-placeholder">
              <i className="fa-solid fa-image"></i>
              <span>Immagine esistente</span>
            </div>
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

// Componente TourEditor principale
const TourEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tour = location.state?.tour || null;
  
  const FORM_DATA_KEY = 'admin_form_data';
  const FORM_STATE_KEY = 'admin_form_state';
  
  const [formData, setFormData] = useState({
    title: tour?.title || 'Titolo del Tour',
    destination: tour?.destination || 'USA',
    type: tour?.type || 'city breaks',
    geographicArea: tour?.geographicArea || '',
    code: tour?.code || '',
    description: tour?.description || 'Descrizione del tour...',
    duration: tour?.duration || '7 giorni',
    minPrice: tour?.minPrice || 1000,
    notes: tour?.notes || '',
    pdfUrl: tour?.pdfUrl ? 'exists' : '',
    pdfFile: null, // File PDF da caricare per i nuovi tour
    pasti: tour?.pasti || '',
    itinerario: tour?.itinerario || '',
    itinerarioMode: tour?.itinerarioMode || 'days',
    dates: tour?.dates || {
      '2025': [
        { startDate: 'Gen 7', endDate: 'Gen 14' },
        { startDate: 'Feb 1', endDate: 'Feb 8' }
      ]
    },
    datesText: tour?.datesText || '',
    datesMode: tour?.datesMode || 'structured',
    isPromotion: tour?.isPromotion || false,
    heroImage: tour?.heroImage ? 'exists' : '',
    carouselImage1: tour?.carouselImage1 ? 'exists' : '',
    carouselImage2: tour?.carouselImage2 ? 'exists' : '',
    carouselImage3: tour?.carouselImage3 ? 'exists' : '',
    image1: tour?.image1 ? 'exists' : '',
    image2: tour?.image2 ? 'exists' : '',
    image3: tour?.image3 ? 'exists' : '',
    image4: tour?.image4 ? 'exists' : '',
    image5: tour?.image5 ? 'exists' : '',
    mapImage: tour?.mapImage ? 'exists' : '',
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
    includedText: tour?.includedText || '',
    includedMode: tour?.includedMode || 'list',
    notIncluded: tour?.notIncluded || ['Pranzi e cene', 'Mance', 'Spese personali'],
    notIncludedText: tour?.notIncludedText || '',
    notIncludedMode: tour?.notIncludedMode || 'list'
  });

  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [hoveredImage, setHoveredImage] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Controlla se l'utente è autenticato
  useEffect(() => {
    const checkAuth = () => {
      try {
        const sessionData = localStorage.getItem('admin_session');
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.expiresAt > Date.now()) {
            return true;
          } else {
            localStorage.removeItem('admin_session');
          }
        }
      } catch (error) {
        console.error('Errore nel controllo autenticazione:', error);
      }
      return false;
    };

    if (!checkAuth()) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  // Funzioni per gestire il salvataggio automatico del form
  const saveFormData = (data) => {
    try {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
      localStorage.setItem(FORM_STATE_KEY, JSON.stringify({
        isEditing: !!tour?.id,
        tourId: tour?.id || null,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Errore nel salvataggio del form:', error);
    }
  };

  const loadFormData = () => {
    try {
      const savedData = localStorage.getItem(FORM_DATA_KEY);
      const savedState = localStorage.getItem(FORM_STATE_KEY);
      
      if (savedData && savedState) {
        const parsedData = JSON.parse(savedData);
        const parsedState = JSON.parse(savedState);
        
        // Controlla se i dati salvati sono per lo stesso tour o per un nuovo tour
        const isSameTour = (!tour?.id && !parsedState.tourId) || (tour?.id === parsedState.tourId);
        
        if (isSameTour) {
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento del form:', error);
    }
    return null;
  };

  const clearFormData = () => {
    localStorage.removeItem(FORM_DATA_KEY);
    localStorage.removeItem(FORM_STATE_KEY);
  };

  // Carica i dati salvati all'inizializzazione
  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  // Salva automaticamente i dati del form ogni volta che cambiano
  useEffect(() => {
    setIsAutoSaving(true);
    const timeoutId = setTimeout(() => {
      saveFormData(formData);
      setIsAutoSaving(false);
    }, 1000); // Salva dopo 1 secondo di inattività

    return () => {
      clearTimeout(timeoutId);
      setIsAutoSaving(false);
    };
  }, [formData]);


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

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addDay = () => {
    setFormData(prev => {
      const newDayNumber = prev.program.days.length + 1;
      return {
        ...prev,
        program: {
          ...prev.program,
          days: [...prev.program.days, {
            day: newDayNumber,
            title: `GIORNO ${newDayNumber} - Nuovo giorno`,
            description: 'Descrizione del nuovo giorno...'
          }]
        }
      };
    });
  };

  const removeDay = (index) => {
    setFormData(prev => {
      const newDays = prev.program.days.filter((_, i) => i !== index);
      
      // Rinumera i giorni rimanenti
      const renumberedDays = newDays.map((day, i) => ({
        ...day,
        day: i + 1
      }));
      
      return {
        ...prev,
        program: { ...prev.program, days: renumberedDays }
      };
    });
  };

  const updateDay = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      program: {
        ...prev.program,
        days: prev.program.days.map((day, i) => {
          if (i === index) {
            const updatedDay = { ...day, [field]: value };
            
            // Se si sta modificando il titolo, aggiorna anche il numero del giorno nel titolo
            if (field === 'title' && value.includes('GIORNO')) {
              const dayNumber = day.day;
              updatedDay.title = value.replace(/GIORNO \d+/, `GIORNO ${dayNumber}`);
            }
            
            return updatedDay;
          }
          return day;
        })
      }
    }));
  };

  const addPriceRow = () => {
    setFormData(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        prices: [...prev.prices.prices, { category: 'Nuova categoria', single: 0, double: 0, triple: 0, quad: 0 }]
      }
    }));
  };

  const updatePriceRow = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        prices: prev.prices.prices.map((row, i) => i === index ? { ...row, [field]: value } : row)
      }
    }));
  };

  const removePriceRow = (index) => {
    setFormData(prev => ({
      ...prev,
      prices: { ...prev.prices, prices: prev.prices.prices.filter((_, i) => i !== index) }
    }));
  };

  const addDate = (year) => {
    setFormData(prev => ({
      ...prev,
      dates: { ...prev.dates, [year]: [...(prev.dates[year] || []), { startDate: 'Gen 1', endDate: 'Gen 7' }] }
    }));
  };

  const updateDate = (year, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [year]: prev.dates[year].map((date, i) => i === index ? { ...date, [field]: value } : date)
      }
    }));
  };

  const removeDate = (year, index) => {
    setFormData(prev => ({
      ...prev,
      dates: { ...prev.dates, [year]: prev.dates[year].filter((_, i) => i !== index) }
    }));
  };

  const addYear = () => {
    const newYear = Math.max(...Object.keys(formData.dates).map(Number)) + 1;
    setFormData(prev => ({
      ...prev,
      dates: { ...prev.dates, [newYear]: [{ startDate: 'Gen 1', endDate: 'Gen 7' }] }
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

  const handleImageUpload = async (imageType, file) => {
    // Se è un tour esistente, carica l'immagine sul server
    if (tour?.id) {
      try {
        // Mappa i tipi di immagine ai tipi del backend
        const imageTypeMap = {
          'heroImage': 'hero',
          'carouselImage1': 'carousel1',
          'carouselImage2': 'carousel2',
          'carouselImage3': 'carousel3',
          'image1': 'image1',
          'image2': 'image2',
          'image3': 'image3',
          'image4': 'image4',
          'image5': 'image5',
          'mapImage': 'map'
        };
        
        const backendImageType = imageTypeMap[imageType];
        console.log('DEBUG handleImageUpload:', { imageType, backendImageType, tourId: tour.id });
        
        if (!backendImageType) {
          console.error(`Tipo di immagine non mappato: ${imageType}`);
          throw new Error(`Tipo di immagine non supportato: ${imageType}`);
        }
        
        await TourService.uploadTourImage(tour.id, backendImageType, file);
        // Aggiorna l'URL per puntare al server
        const serverImageUrl = TourService.getTourImageUrl(tour.id, backendImageType);
        setFormData(prev => ({ ...prev, [imageType]: serverImageUrl }));
      } catch (error) {
        console.error('Errore nel caricamento dell\'immagine:', error);
        // Fallback: usa l'URL locale per la preview
        const imageUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, [imageType]: imageUrl }));
      }
    } else {
      // Per i nuovi tour, usa l'URL locale per la preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [imageType]: imageUrl }));
    }
  };


  const getTourImages = () => {
    const images = [];
    
    // Funzione helper per aggiungere un'immagine se esiste
    const addImageIfExists = (imageField, altText, isMain = false) => {
      if (formData[imageField]) {
        let imageSrc = formData[imageField];
        
        // Se è un tour esistente e l'immagine non è un blob URL, usa l'URL del server
        if (tour?.id && !imageSrc.startsWith('blob:')) {
          const imageTypeMap = {
            'heroImage': 'hero',
            'carouselImage1': 'carousel1',
            'carouselImage2': 'carousel2',
            'carouselImage3': 'carousel3',
            'image1': 'image1',
            'image2': 'image2',
            'image3': 'image3',
            'image4': 'image4',
            'image5': 'image5'
          };
          
          const backendImageType = imageTypeMap[imageField];
          if (backendImageType) {
            imageSrc = TourService.getTourImageUrl(tour.id, backendImageType);
          }
        }
        
        // Solo aggiungi l'immagine se non è il valore 'exists' (che indica che esiste ma non è caricata)
        if (imageSrc !== 'exists') {
          images.push({ src: imageSrc, alt: altText, isMain });
        }
      }
    };
    
    // Per i caroselli: heroimage + image1,2,3
    addImageIfExists('heroImage', formData.title, true);
    addImageIfExists('image1', `${formData.title} - Immagine 1`);
    addImageIfExists('image2', `${formData.title} - Immagine 2`);
    addImageIfExists('image3', `${formData.title} - Immagine 3`);
    
    return images;
  };

  const getHighlightImages = () => {
    return formData.included.slice(0, 5).map((service, index) => {
      const imageField = `image${index + 1}`;
      let imageSrc = formData[imageField];
      
      // Se è un tour esistente e l'immagine non è un blob URL, usa l'URL del server
      if (tour?.id && imageSrc && imageSrc !== 'exists' && !imageSrc.startsWith('blob:')) {
        imageSrc = TourService.getTourImageUrl(tour.id, imageField);
      }
      
      return {
        id: index,
        title: service,
        image: (imageSrc && imageSrc !== 'exists') ? imageSrc : null,
        alt: `${service} - ${formData.title}`
      };
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Se è un nuovo tour, devo gestire le immagini diversamente
      if (!tour?.id) {
        // Salva le immagini locali temporaneamente
        const localImages = {};
        const imageFields = ['heroImage', 'carouselImage1', 'carouselImage2', 'carouselImage3', 'image1', 'image2', 'image3', 'image4', 'image5', 'mapImage'];
        
        imageFields.forEach(field => {
          if (formData[field] && formData[field].startsWith('blob:')) {
            localImages[field] = formData[field];
          }
        });
        
        // Rimuovi le immagini e il PDF dal formData per la creazione del tour
        const tourDataWithoutImages = { ...formData };
        imageFields.forEach(field => {
          delete tourDataWithoutImages[field];
        });
        // Rimuovi il pdfFile ma mantieni pdfUrl se non è un blob URL
        if (tourDataWithoutImages.pdfUrl && tourDataWithoutImages.pdfUrl.startsWith('blob:')) {
          delete tourDataWithoutImages.pdfUrl;
        }
        delete tourDataWithoutImages.pdfFile;
        
        // Crea il tour senza immagini
        const newTour = await TourService.createTour(tourDataWithoutImages);
        
        // Se ci sono immagini locali, caricale sul server
        if (localImages && newTour.id) {
          const imageTypeMap = {
            'heroImage': 'hero',
            'carouselImage1': 'carousel1',
            'carouselImage2': 'carousel2',
            'carouselImage3': 'carousel3',
            'image1': 'image1',
            'image2': 'image2',
            'image3': 'image3',
            'image4': 'image4',
            'image5': 'image5',
            'mapImage': 'map'
          };
          
          // Carica ogni immagine
          for (const [field, imageUrl] of Object.entries(localImages)) {
            if (imageUrl && imageUrl.startsWith('blob:')) {
              try {
                // Converti l'URL blob in file
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], `${field}.jpg`, { type: blob.type });
                
                const backendImageType = imageTypeMap[field];
                if (backendImageType) {
                  await TourService.uploadTourImage(newTour.id, backendImageType, file);
                }
              } catch (imageError) {
                console.error(`Errore nel caricamento dell'immagine ${field}:`, imageError);
              }
            }
          }
        }
        
        // Se c'è un PDF locale, caricalo sul server
        if (formData.pdfFile && newTour.id) {
          try {
            await TourService.uploadTourPdf(newTour.id, formData.pdfFile);
          } catch (pdfError) {
            console.error('Errore nel caricamento del PDF:', pdfError);
          }
        }
      } else {
        // Per i tour esistenti, salva normalmente
        // Rimuovi pdfUrl se è 'exists' (solo marker locale) o un blob URL già caricato
        const updateData = { ...formData };
        if (updateData.pdfUrl === 'exists' || (updateData.pdfUrl && updateData.pdfUrl.startsWith('blob:'))) {
          delete updateData.pdfUrl;
        }
        delete updateData.pdfFile; // Non inviare il file nel body JSON
        
        console.log('DEBUG: Invio dati update tour:', {
          itinerarioMode: updateData.itinerarioMode,
          hasItinerario: !!updateData.itinerario,
          hasProgram: !!updateData.program,
          programDays: updateData.program?.days?.length || 0,
          hasPdfUrl: !!updateData.pdfUrl
        });
        await TourService.updateTour(tour.id, updateData);
      }
      
      // Pulisci i dati salvati dopo il salvataggio riuscito
      clearFormData();
      
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/admin');
      }, 2000);
      
    } catch (err) {
      setError('Errore nel salvataggio del tour: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Sei sicuro di voler annullare? Tutte le modifiche non salvate andranno perse.')) {
      clearFormData();
      navigate('/admin');
    }
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
        const value = (field === 'minPrice') ? parseInt(editingValue) || 0 : editingValue;
        setFormData(prev => {
          const newData = { ...prev, [field]: value };
          
          // Se il campo modificato è 'title', aggiorna automaticamente anche il 'code'
          if (field === 'title') {
            // Genera un codice basato sul titolo: rimuovi spazi, caratteri speciali e converti in maiuscolo
            const generatedCode = value
              .toUpperCase()
              .replace(/[^A-Z0-9\s]/g, '') // Rimuovi caratteri speciali
              .replace(/\s+/g, '') // Rimuovi spazi
              .substring(0, 20); // Limita a 20 caratteri
            newData.code = generatedCode;
          }
          
          return newData;
        });
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
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
        />
      );
    }
    return (
      <span className={`editable-text ${className}`} onClick={() => startEditing(field, value)} title="Clicca per modificare">
        {value || placeholder}
      </span>
    );
  };

  const EditableTextarea = ({ field, value, className = '', placeholder = 'Clicca per modificare' }) => {
    const [localValue, setLocalValue] = useState(value || '');
    
    // Aggiorna il valore locale quando il valore prop cambia
    useEffect(() => {
      setLocalValue(value || '');
    }, [value]);

    const handleBlur = () => {
      const [type, ...path] = field.split('.');
      if (type === 'basic') {
        const fieldName = path[0];
        setFormData(prev => ({ ...prev, [fieldName]: localValue }));
      } else if (type === 'day') {
        const [index, fieldName] = path;
        updateDay(parseInt(index), fieldName, localValue);
      } else if (type === 'included') {
        const index = parseInt(path[0]);
        handleArrayChange('included', index, localValue);
      } else if (type === 'notIncluded') {
        const index = parseInt(path[0]);
        handleArrayChange('notIncluded', index, localValue);
      } else if (type === 'date') {
        const [year, index, fieldName] = path;
        updateDate(year, parseInt(index), fieldName, localValue);
      }
    };

    return (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        className={`editable-textarea ${className}`}
        rows="3"
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left' }}
        placeholder={placeholder}
      />
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
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
        />
      );
    }
    return (
      <span className={`editable-text ${className}`} onClick={() => startEditing(field, value)} title="Clicca per modificare">
        {value || placeholder}
      </span>
    );
  };

  const EditableSelect = ({ field, value, className = '', options = [] }) => {
    const isEditing = editingField === field;
    if (isEditing) {
      return (
        <select
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={saveEdit}
          className={`editable-input ${className}`}
          autoFocus
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    return (
      <span className={`editable-text ${className}`} onClick={() => startEditing(field, value)} title="Clicca per modificare">
        {value || 'Seleziona...'}
      </span>
    );
  };

  return (
    <div className="tour-editor-page">
      <PageTitle title="Editor Tour" />
      <div className="editor-header">
        <div className="editor-header-left">
          <h2>{tour ? 'Modifica Tour' : 'Nuovo Tour'}</h2>
          {isAutoSaving && (
            <div className="auto-save-indicator">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Salvataggio automatico...</span>
            </div>
          )}
        </div>
        <div className="editor-header-right">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Sei sicuro di voler cancellare tutti i dati salvati?')) {
                clearFormData();
                window.location.reload();
              }
            }}
            className="clear-saved-data-btn"
            title="Cancella dati salvati"
          >
            <i className="fa-solid fa-trash"></i>
            Cancella Dati Salvati
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Torna all'Admin
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="editor-content">
        <div className="editable-tour-page">
          {/*{tourImages.length > 0 && (
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
          )}*/}

          <section className="tour-overview-section-editor">
            <div className="container-overview">
              <div className="overview-content">
                <div className="overview-text">
                  <div className="overview-header">
                    <h1 className="overview-title">
                      <EditableText field="basic.title" value={formData.title} className="overview-title-text" placeholder="Titolo del Tour" />
                    </h1>
                  </div>
                  <div className="overview-description">
                    <EditableTextarea field="basic.description" value={formData.description} className="overview-description-text" placeholder="Descrizione del tour..." />
                  </div>
                </div>

              </div>
            </div>
          </section>

          <div className="container-details">
            <div className="tour-content">
              <div className="tour-main">
              <section className="tour-section">
                  <h2 className="section-title">Informazioni Tour</h2>
                  <div className="tour-info-container-editor">
                    <div className="tour-info-grid-editor">
                      <div className="info-item">
                        <span className="info-label">Destinazione:</span>
                        <span className="info-value">
                          <EditableSelect 
                            field="basic.destination" 
                            value={formData.destination} 
                            className="info-value-text" 
                            options={[
                              'USA', 'Canada', 'Messico', 'America Centrale', 
                              'Sud America', 'Caraibi', 'Polinesia Francese'
                            ]}
                          />
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Area Geografica:</span>
                        <span className="info-value">
                        <EditableSelect 
                            field="basic.geographicArea" 
                            value={formData.geographicArea} 
                            className="info-value-text" 
                            options={['EST', 'OVEST', 'EST E OVEST']}
                          />
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Tipo:</span>
                        <span className="info-value">
                          <EditableSelect 
                            field="basic.type" 
                            value={formData.type} 
                            className="info-value-text" 
                            options={[
                              'city breaks', 'fly and drive', 'ride in harley', 
                              'tour guidato', 'luxury travel', 'camper adventure', 'extra',
                              'tour guidati (di gruppo)', 'fly & drive (individuali)', 
                              'under canvas usa', 'ranch usa e canada', 'camper adventures', 'scoperta in treno'
                            ]}
                          />
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Durata:</span>
                        <span className="info-value">
                          <EditableText field="basic.duration" value={formData.duration} className="info-value-text" placeholder="es. 7 giorni, 10 notti, 2 settimane" />
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Prezzo Min:</span>
                        <span className="info-value">
                          €<input 
                            type="number" 
                            value={formData.minPrice || ''} 
                            onChange={(e) => setFormData(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
                            className="min-price-input"
                            placeholder="0"
                            dir="ltr"
                            style={{ direction: 'ltr', textAlign: 'left' }}
                          />
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Codice:</span>
                        <span className="info-value readonly">{formData.code}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Pasti:</span>
                        <span className="info-value">
                          <EditableText field="basic.pasti" value={formData.pasti} className="info-value-text" placeholder="es. 9 cene incluse" />
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Modalità Itinerario:</span>
                        <span className="info-value">
                          <EditableSelect 
                            field="basic.itinerarioMode" 
                            value={formData.itinerarioMode} 
                            className="info-value-text" 
                            options={['days', 'unique']}
                          />
                          <span className="info-hint">
                            {formData.itinerarioMode === 'days' ? '(suddiviso per giorni)' : '(testo unico)'}
                          </span>
                        </span>
                      </div>
                      <div className="info-item promotion-toggle-item">
                        <span className="info-label">In Promozione:</span>
                        <div className="promotion-toggle-container">
                          <label className="promotion-toggle">
                            <input
                              type="checkbox"
                              checked={formData.isPromotion}
                              onChange={(e) => setFormData(prev => ({ ...prev, isPromotion: e.target.checked }))}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                          <span className="promotion-status">
                            {formData.isPromotion ? (
                              <><i className="fa-solid fa-star"></i> Sì</>
                            ) : (
                              <><i className="fa-regular fa-star"></i> No</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="tour-pdf-section">
                      <div className="pdf-upload-container">
                        <label className="pdf-upload-label">PDF del Tour</label>
                        <div className="pdf-upload-area">
                          {formData.pdfUrl && formData.pdfUrl !== 'exists' ? (
                            <div className="current-pdf">
                              <i className="fa-solid fa-file-pdf"></i>
                              <span>PDF caricato</span>
                              <button
                                type="button"
                                onClick={() => document.getElementById('pdf-upload').click()}
                                className="change-pdf-btn"
                              >
                                Cambia PDF
                              </button>
                            </div>
                          ) : formData.pdfUrl === 'exists' ? (
                            <div className="current-pdf">
                              <i className="fa-solid fa-file-pdf"></i>
                              <span>PDF esistente</span>
                              <button
                                type="button"
                                onClick={() => document.getElementById('pdf-upload').click()}
                                className="change-pdf-btn"
                              >
                                Cambia PDF
                              </button>
                            </div>
                          ) : (
                            <div className="no-pdf">
                              <button
                                type="button"
                                onClick={() => document.getElementById('pdf-upload').click()}
                                className="upload-pdf-btn"
                              >
                                <i className="fa-solid fa-upload"></i>
                                Carica PDF
                              </button>
                            </div>
                          )}
                          <input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              if (e.target.files[0]) {
                                const file = e.target.files[0];
                                
                                // Se è un tour esistente, carica il PDF sul server
                                if (tour?.id) {
                                  try {
                                    await TourService.uploadTourPdf(tour.id, file);
                                    // Aggiorna l'URL per puntare al server
                                    const serverPdfUrl = TourService.getTourPdfUrl(tour.id);
                                    setFormData(prev => ({ ...prev, pdfUrl: serverPdfUrl }));
                                  } catch (error) {
                                    console.error('Errore nel caricamento del PDF:', error);
                                    // Fallback: usa l'URL locale per la preview
                                    const fileUrl = URL.createObjectURL(file);
                                    setFormData(prev => ({ ...prev, pdfUrl: fileUrl }));
                                  }
                                } else {
                                  // Per i nuovi tour, salva il file per caricarlo dopo la creazione
                                  const fileUrl = URL.createObjectURL(file);
                                  setFormData(prev => ({ ...prev, pdfUrl: fileUrl, pdfFile: file }));
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="tour-section">
                  <h2 className="section-title">Itinerario</h2>
                  {formData.itinerarioMode === 'days' && formData.program && formData.program.days && formData.program.days.length > 0 ? (
                    <>
                    <div className="itinerary-list">
                      {formData.program.days.map((day, index) => {
                        const dayNumber = day.day;
                        return (
                          <div key={index} className="itinerary-item">
                            <div className="itinerary-item-header">
                              <div className="day-badge">Giorno {dayNumber}</div>
                              <div className="day-content">
                                <h3 className="day-title">
                                  <EditableText field={`day.${index}.title`} value={day.title} className="day-title-text" placeholder="Titolo del giorno" />
                                </h3>
                              </div>
                              <div className="day-actions">
                                <button type="button" onClick={() => removeDay(index)} className="remove-day-btn">
                                  ×
                                </button>
                              </div>
                            </div>
                            <div className="itinerary-details">
                              <div className="day-description">
                                <EditableTextarea field={`day.${index}.description`} value={day.description} className="day-description-text" placeholder="Descrizione dettagliata del giorno..." />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="add-day-section">
                      <button type="button" onClick={addDay} className="add-day-btn">
                        + Aggiungi Giorno
                      </button>
                    </div>
                    </>
                  ) : formData.itinerarioMode === 'unique' ? (
                    <div className="itinerary-unique-container">
                      <EditableTextarea 
                        field="basic.itinerario" 
                        value={formData.itinerario} 
                        className="itinerary-unique-text" 
                        placeholder="Scrivi qui l'itinerario completo come testo unico..."
                      />
                    </div>
                  ) : (
                    <div className="itinerary-empty-state">
                      <p>Seleziona una modalità itinerario nelle informazioni del tour per iniziare.</p>
                    </div>
                  )}
                </section>

                {/*{formData.included && formData.included.length > 0 && (
                  <section className="tour-section">
                    <h2 className="section-title">Servizi Inclusi</h2>
                    <div className="highlights-carousel">
                      <div className="carousel-container">
                        {getHighlightImages().map((highlight, index) => (
                          <div key={highlight.id} className={`carousel-slide ${index === currentHighlightIndex ? 'active' : ''}`}>
                            {highlight.image && <img src={highlight.image} alt={highlight.alt} />}
                            <div className="highlight-overlay">
                              <h3 className="highlight-title">{highlight.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                      {formData.included && formData.included.length > 1 && (
                        <div className="carousel-indicators">
                          {formData.included.map((_, index) => (
                            <button key={index} className={`indicator ${index === currentHighlightIndex ? 'active' : ''}`} onClick={() => setCurrentHighlightIndex(index)} />
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}*/}

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
                                <EditableText field={`price.${index}.category`} value={priceRow.category} className="price-category-text" placeholder="Categoria prezzo" />
                              </td>
                              <td className="pricing-value-cell">
                                <EditableNumber field={`price.${index}.single`} value={priceRow.single} className="price-value-text" placeholder="0" />
                              </td>
                              <td className="pricing-value-cell">
                                <EditableNumber field={`price.${index}.double`} value={priceRow.double} className="price-value-text" placeholder="0" />
                              </td>
                              <td className="pricing-value-cell">
                                <EditableNumber field={`price.${index}.triple`} value={priceRow.triple} className="price-value-text" placeholder="0" />
                              </td>
                              <td className="pricing-value-cell">
                                <EditableNumber field={`price.${index}.quad`} value={priceRow.quad} className="price-value-text" placeholder="0" />
                              </td>
                              <td className="pricing-actions-cell">
                                <button type="button" onClick={() => removePriceRow(index)} className="remove-price-btn">
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

                {/*<section className="tour-section quote-request-section">
                  <div className="quote-request-content">
                    <h2 className="quote-request-title">Interessato a questo viaggio?</h2>
                    <p className="quote-request-description">
                      Richiedi un preventivo personalizzato e scopri tutte le opzioni disponibili per il tuo viaggio ideale.
                    </p>
                    <button className="quote-request-btn">
                      <i className="fa-solid fa-calculator"></i> Richiedi un Preventivo
                    </button>
                  </div>
                </section>*/}

                <section className="tour-section">
                  <h2 className="section-title">Servizi Inclusi</h2>
                  <div className="info-item" style={{ marginBottom: '15px' }}>
                    <span className="info-label">Modalità:</span>
                    <span className="info-value">
                      <EditableSelect 
                        field="basic.includedMode" 
                        value={formData.includedMode} 
                        className="info-value-text" 
                        options={['list', 'unique']}
                      />
                      <span className="info-hint">
                        {formData.includedMode === 'list' ? '(lista)' : '(testo unico)'}
                      </span>
                    </span>
                  </div>
                  {formData.includedMode === 'list' && formData.included && formData.included.length > 0 ? (
                    <div className="inclusions-list">
                      {formData.included.map((inclusion, index) => (
                        <div key={index} className="inclusion-item">
                          <span className="inclusion-icon">✓</span>
                          <EditableText field={`included.${index}`} value={inclusion} className="inclusion-text" placeholder="Servizio incluso" />
                          <button type="button" onClick={() => removeArrayItem('included', index)} className="remove-inclusion-btn">
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
                  ) : formData.includedMode === 'unique' ? (
                    <div className="info-content">
                      <EditableTextarea 
                        field="basic.includedText" 
                        value={formData.includedText} 
                        className="unique-text" 
                        placeholder="Scrivi qui tutti i servizi inclusi come testo unico..."
                      />
                    </div>
                  ) : null}
                </section>

                <section className="tour-section">
                  <h2 className="section-title">Servizi Non Inclusi</h2>
                  <div className="info-item" style={{ marginBottom: '15px' }}>
                    <span className="info-label">Modalità:</span>
                    <span className="info-value">
                      <EditableSelect 
                        field="basic.notIncludedMode" 
                        value={formData.notIncludedMode} 
                        className="info-value-text" 
                        options={['list', 'unique']}
                      />
                      <span className="info-hint">
                        {formData.notIncludedMode === 'list' ? '(lista)' : '(testo unico)'}
                      </span>
                    </span>
                  </div>
                  {formData.notIncludedMode === 'list' && formData.notIncluded && formData.notIncluded.length > 0 ? (
                    <div className="exclusions-list">
                      {formData.notIncluded.map((exclusion, index) => (
                        <div key={index} className="exclusion-item">
                          <span className="exclusion-icon">✗</span>
                          <EditableText field={`notIncluded.${index}`} value={exclusion} className="exclusion-text" placeholder="Servizio non incluso" />
                          <button type="button" onClick={() => removeArrayItem('notIncluded', index)} className="remove-exclusion-btn">
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
                  ) : formData.notIncludedMode === 'unique' ? (
                    <div className="info-content">
                      <EditableTextarea 
                        field="basic.notIncludedText" 
                        value={formData.notIncludedText} 
                        className="unique-text" 
                        placeholder="Scrivi qui tutti i servizi non inclusi come testo unico..."
                      />
                    </div>
                  ) : null}
                </section>
                
                <section className="tour-section">
                  <h2 className="section-title">Note</h2>
                  <div className="info-content">
                    <EditableTextarea field="basic.notes" value={formData.notes} className="unique-text" placeholder="Note aggiuntive..." />
                  </div>
                </section>
              </div>

              <div className="tour-editor-sidebar">
                <div className="tour-editor-dates-prices-section">
                  <div className="info-item" style={{ marginBottom: '15px' }}>
                    <span className="info-label">Modalità Date:</span>
                    <span className="info-value">
                      <EditableSelect 
                        field="basic.datesMode" 
                        value={formData.datesMode} 
                        className="info-value-text" 
                        options={['structured', 'unique']}
                      />
                      <span className="info-hint">
                        {formData.datesMode === 'structured' ? '(strutturate)' : '(testo unico)'}
                      </span>
                    </span>
                  </div>
                  
                  {formData.datesMode === 'structured' ? (
                    <>
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
                        <button type="button" onClick={addYear} className="tour-editor-add-year-btn" title="Aggiungi Anno">
                          +
                        </button>
                      </div>
                      <p className="pricing-disclaimer">
                        A partire da €<input 
                          type="number" 
                          value={formData.minPrice || ''} 
                          onChange={(e) => setFormData(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
                          className="min-price-input"
                          placeholder="0"
                          dir="ltr"
                          style={{ direction: 'ltr', textAlign: 'left' }}
                        /> per persona.
                      </p>

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
                                />
                                {' - '}
                                <EditableText
                                  field={`date.${selectedYear}.${index}.endDate`}
                                  value={formData.dates[selectedYear]?.[index]?.endDate}
                                  className="date-end-text"
                                  placeholder="Gen 7"
                                />
                              </span>
                            </div>
                            <button type="button" onClick={() => removeDate(selectedYear, index)} className="tour-editor-remove-date-btn" title="Rimuovi Data">
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="tour-editor-add-date-section">
                          <button type="button" onClick={() => addDate(selectedYear)} className="tour-editor-add-date-btn">
                            + Aggiungi Data
                          </button>
                          {Object.keys(tourDates).length > 1 && (                     
                          <button type="button" onClick={() => removeYear(selectedYear)} className="tour-editor-remove-year-btn">
                              - Rimuovi Anno {selectedYear}
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="info-content">
                      <EditableTextarea 
                        field="basic.datesText" 
                        value={formData.datesText} 
                        className="unique-text" 
                        placeholder="Scrivi qui le date disponibili come testo unico..."
                      />
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        <section className="image-management-section">
          <h2 className="section-title">Gestione Immagini</h2>
          <div className="image-management-grid">
            <ImageUploader
              imageType="heroImage"
              currentImage={formData.heroImage}
              label="Copertina"
              onImageUpload={handleImageUpload}
              tour={tour}
            />
            <ImageUploader
              imageType="carouselImage1"
              currentImage={formData.carouselImage1}
              label="Foto Carosello 1"
              onImageUpload={handleImageUpload}
              tour={tour}
            />
            <ImageUploader
              imageType="carouselImage2"
              currentImage={formData.carouselImage2}
              label="Foto Carosello 2"
              onImageUpload={handleImageUpload}
              tour={tour}
            />
            <ImageUploader
              imageType="carouselImage3"
              currentImage={formData.carouselImage3}
              label="Foto Carosello 3"
              onImageUpload={handleImageUpload}
              tour={tour}
            />
            {formData.included && formData.included.slice(0, 5).map((service, index) => (
              <ImageUploader
                key={`image${index + 1}`}
                imageType={`image${index + 1}`}
                currentImage={formData[`image${index + 1}`]}
                label={`Immagine ${index + 1}`}
                onImageUpload={handleImageUpload}
                tour={tour}
              />
            ))}
            <ImageUploader
              imageType="mapImage"
              currentImage={formData.mapImage}
              label="Cartina Itinerario"
              onImageUpload={handleImageUpload}
              tour={tour}
            />
          </div>
        </section>

        {/* Spacer per evitare che il contenuto vada sotto i pulsanti */}
        <div className="save-section-spacer"></div>
        
        <div className="save-section" id="save-section">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Annulla
          </button>
          <button type="button" onClick={handleSubmit} className="save-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                {tour ? 'Aggiornamento...' : 'Creazione...'}
              </>
            ) : (
              <>
                <i className="fa-solid fa-save"></i>
                {tour ? 'Aggiorna' : 'Crea'} Tour
              </>
            )}
          </button>
        </div>

        {showSuccessToast && (
          <div className="success-toast">
            <i className="fa-solid fa-check-circle"></i>
            Tour {tour ? 'aggiornato' : 'creato'} correttamente! Reindirizzamento...
          </div>
        )}
      </div>
    </div>
  );
};

export default TourEditor;
