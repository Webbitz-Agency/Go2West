# Go2West - Sito per Ingrossista di Viaggi

Sito React per un ingrossista di proposte di viaggi con tre pagine principali: Home, Destinazioni e Dettagli Tour.

## Struttura del Progetto

- **Home Page**: Pagina principale con hero section, sezione proposte e griglia destinazioni
- **Destination Tours**: Elenco dei tour disponibili per una specifica destinazione
- **Tour Details**: Pagina dettagliata di un tour con itinerario, inclusioni, esclusioni e pricing

## Installazione

1. Clona il repository
2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il server di sviluppo:
```bash
npm start
```

4. Apri [http://localhost:3000](http://localhost:3000) nel browser

## Tecnologie Utilizzate

- React 18
- React Router DOM 6
- CSS3 con Flexbox e Grid
- Font Awesome per le icone
- Google Fonts (Inter)

## Struttura delle Pagine

### Home (`/`)
- Hero section con call-to-action
- Sezione "Le nostre proposte" 
- Griglia delle destinazioni

### Destination Tours (`/destination/:country`)
- Hero per la destinazione specifica
- Categorie di tour
- Lista dei tour disponibili

### Tour Details (`/tour/:tourId`)
- Informazioni dettagliate del tour
- Gallery fotografica
- Itinerario giornaliero
- Inclusioni e esclusioni
- Pricing sidebar

## Personalizzazione

### Aggiungere Immagini
Inserisci le immagini nella cartella `public/images/` seguendo i nomi indicati nel file `placeholder.txt`.

### Modificare Contenuti
- Tour e destinazioni: modifica i dati negli array dei rispettivi componenti
- Stili: modifica i file CSS nella cartella `src/`

### Aggiungere Nuove Destinazioni
1. Aggiungi la destinazione nell'array `destinations` in `Home.js`
2. Crea i tour corrispondenti in `DestinationTours.js`
3. Aggiungi il link nella navigazione in `Header.js`

## Build per Produzione

```bash
npm run build
```

Il progetto verrà compilato nella cartella `build/`. 