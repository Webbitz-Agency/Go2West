# Go2West - Frontend Dinamico

## Descrizione
Il frontend di Go2West è stato aggiornato per comunicare dinamicamente con il backend su Render (https://go2west-backend.onrender.com) per gestire tour, fly-drive e altre tipologie di viaggio.

## Funzionalità Implementate

### 1. Configurazione API Centralizzata
- **File**: `src/config/api.js`
- Gestisce tutte le chiamate API al backend
- Configurazione centralizzata dell'URL del backend
- Funzioni helper per GET, POST, PUT, DELETE

### 2. Servizio Tour
- **File**: `src/services/TourService.js`
- Classe per gestire tutte le operazioni sui tour
- Metodi per CRUD completo (Create, Read, Update, Delete)
- Funzionalità di duplicazione tour
- Health check del backend

### 3. Componente Tour Dinamici
- **File**: `src/components/DynamicTours.js`
- **CSS**: `src/components/DynamicTours.css`
- Carica tour dal backend in tempo reale
- Filtri per tipo di viaggio
- Gestione stati di loading e error
- Layout responsive

### 4. Pagine Aggiornate

#### Home (`src/pages/Home.js`)
- Tour dinamici nella sezione "Viaggi su misura"
- Rimozione dati statici hardcoded
- Integrazione con componente DynamicTours

#### Admin (`src/pages/Admin.js`)
- Gestione completa tour (CRUD)
- Funzionalità di duplicazione
- Form per creazione/modifica tour
- Autenticazione admin

#### DestinationTours (`src/pages/DestinationTours.js`)
- Tour filtrati per destinazione
- Filtri per tipo di viaggio
- Integrazione con componente DynamicTours

#### TourDetails (`src/pages/TourDetails.js`)
- Dettagli tour caricati dal backend
- Visualizzazione completa informazioni tour

## Struttura API Backend

### Endpoints Disponibili
- `GET /api/tours` - Tutti i tour
- `GET /api/tours/{id}` - Tour per ID
- `GET /api/tours/slug/{slug}` - Tour per slug
- `GET /api/tours/country/{country}` - Tour per paese
- `GET /api/tours/type/{type}` - Tour per tipo
- `POST /api/tours` - Crea nuovo tour
- `PUT /api/tours/{id}` - Aggiorna tour
- `DELETE /api/tours/{id}` - Elimina tour
- `GET /health` - Health check

### Struttura Dati Tour
```json
{
  "id": 1,
  "title": "Nome Tour",
  "country": "paese",
  "type": "tour|fly-drive|safari|cruise|adventure",
  "slug": "nome-tour",
  "price": 1000.00,
  "duration": 7,
  "description": "Descrizione tour",
  "mainImage": "url_immagine",
  "images": ["url1", "url2"],
  "highlights": ["highlight1", "highlight2"],
  "itinerary": ["giorno1", "giorno2"],
  "included": ["servizio1", "servizio2"],
  "notIncluded": ["servizio1", "servizio2"],
  "notes": "Note aggiuntive"
}
```

## Credenziali Admin
- **Username**: ADMIN
- **Password**: admin123!

## Installazione e Avvio

1. Installare le dipendenze:
```bash
npm install
```

2. Avviare l'applicazione:
```bash
npm start
```

3. L'applicazione sarà disponibile su `http://localhost:3000`

## Funzionalità Admin

### Gestione Tour
- **Aggiungere**: Cliccare "Nuovo Tour" e compilare il form
- **Modificare**: Cliccare "Modifica" su un tour esistente
- **Eliminare**: Cliccare "Elimina" (con conferma)
- **Duplicare**: Cliccare "Duplica" per creare una copia

### Campi Obbligatori
- Titolo
- Paese
- Tipo
- Slug (deve essere unico)
- Prezzo

## Note Tecniche

- Il frontend utilizza React con React Router
- Tutte le chiamate API sono gestite tramite il servizio centralizzato
- Gestione errori e stati di loading implementata
- Design responsive e moderno
- Compatibilità con il backend su Render

## Troubleshooting

### Problemi di Connessione
- Verificare che il backend sia online su Render
- Controllare la console del browser per errori CORS
- Verificare la configurazione API in `src/config/api.js`

### Problemi Admin
- Verificare le credenziali di accesso
- Controllare che i campi obbligatori siano compilati
- Verificare che lo slug sia unico per ogni tour
