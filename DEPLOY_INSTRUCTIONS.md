# ISTRUZIONI PER IL DEPLOY SU RENDER.COM CON MYSQL DIGITALOCEAN

## 1. Preparazione del Backend

### 1.1 Crea il repository GitHub per il backend
```bash
# Crea una nuova cartella per il backend
mkdir go2west-backend
cd go2west-backend

# Inizializza git
git init

# Aggiungi tutti i file del backend
git add .

# Commit iniziale
git commit -m "Initial commit: Go2West Backend API"

# Crea repository su GitHub e pusha
git remote add origin https://github.com/TUO_USERNAME/go2west-backend.git
git push -u origin main
```

### 1.2 File necessari nel repository backend
Assicurati che la cartella `backend/` contenga:
- `app.py` - Server Flask principale
- `requirements.txt` - Dipendenze Python (con PyMySQL)
- `README.md` - Documentazione
- `.gitignore` - File da ignorare
- `populate_db.py` - Script per popolare il database

## 2. Deploy su Render.com

### 2.1 Crea un nuovo Web Service
1. Vai su [Render.com](https://render.com)
2. Clicca "New +" → "Web Service"
3. Connetti il repository GitHub `go2west-backend`

### 2.2 Configura il Web Service
- **Name**: `go2west-backend` (o nome a tua scelta)
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### 2.3 Configura le variabili d'ambiente
Nella sezione "Environment Variables" aggiungi:
- `DB_USERNAME`: `doadmin`
- `DB_PASSWORD`: ``
- `DB_HOST`: `db-mysql-fra1-09501-do-user-24280960-0.l.db.ondigitalocean.com`
- `DB_PORT`: `25060`
- `DB_NAME`: `defaultdb`
- `DB_CERTIFICATE`: Contenuto completo del certificato SSL (copia tutto il contenuto del file .crt, inclusi BEGIN e END)
- `PORT`: `10000` (porta standard di Render)

**IMPORTANTE**: Per `DB_CERTIFICATE` devi copiare tutto il contenuto del file .crt, inclusi le righe `-----BEGIN CERTIFICATE-----` e `-----END CERTIFICATE-----`. Non il percorso del file!

### 2.4 Verifica il database MySQL
Il tuo database MySQL su DigitalOcean è già configurato e pronto per l'uso.

## 3. Test del Backend

### 3.1 Testa l'API
Una volta deployato, testa l'endpoint principale:
```bash
curl https://tuo-backend.onrender.com/
```

Dovresti vedere:
```json
{
  "message": "Go2West API",
  "version": "1.0.0",
  "endpoints": {
    "tours": "/api/tours",
    "tour_by_id": "/api/tours/<id>",
    "tours_by_country": "/api/tours/country/<country>",
    "tours_by_type": "/api/tours/type/<type>",
    "tour_by_slug": "/api/tours/slug/<slug>",
    "health": "/health"
  }
}
```

### 3.2 Popola il database
Usa lo script `populate_db.py` modificando l'URL:
```python
BASE_URL = "https://tuo-backend.onrender.com"
```

Poi esegui:
```bash
python populate_db.py
```

## 4. Configurazione del Frontend

### 4.1 Aggiorna le variabili d'ambiente
Nel frontend React, crea un file `.env`:
```env
REACT_APP_API_URL=https://tuo-backend.onrender.com
```

### 4.2 Testa il frontend
Avvia il frontend:
```bash
npm start
```

Vai su `http://localhost:3000/admin` e testa:
- Login con `ADMIN` / `admin123!`
- Crea un nuovo tour
- Visualizza i tour esistenti

## 5. Deploy del Frontend (Opzionale)

### 5.1 Su Netlify/Vercel
1. Connetti il repository del frontend
2. Configura le variabili d'ambiente:
   - `REACT_APP_API_URL`: URL del backend su Render
3. Deploy automatico

### 5.2 Su GitHub Pages
1. Aggiungi `homepage` nel `package.json`:
```json
{
  "homepage": "https://tuo-username.github.io/go2west-frontend"
}
```

2. Installa `gh-pages`:
```bash
npm install --save-dev gh-pages
```

3. Aggiungi script nel `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

## 6. Test Finale

### 6.1 Testa tutte le funzionalità
1. **Admin Panel**: `/admin` - Login e gestione tour
2. **Destinazioni**: `/destination/usa` - Visualizza tour per paese
3. **Dettagli Tour**: `/tour/new-york-city-break` - Pagina dettagli tour

### 6.2 Verifica l'integrazione
- I tour creati nell'admin appaiono nelle pagine pubbliche
- Le modifiche sono salvate nel database MySQL
- Le immagini sono caricate correttamente

## 7. Troubleshooting

### 7.1 Errori comuni
- **CORS Error**: Verifica che il backend sia configurato per accettare richieste dal frontend
- **MySQL Connection Error**: Controlla che le credenziali del database siano corrette
- **SSL Error**: MySQL su DigitalOcean richiede SSL, verificato automaticamente
- **Build Errors**: Verifica che tutte le dipendenze siano in `requirements.txt`

### 7.2 Log di Render
- Vai su Render Dashboard → Il tuo servizio → Logs
- Controlla i log per errori di build o runtime

## 8. Manutenzione

### 8.1 Backup Database
- DigitalOcean fa backup automatici del database MySQL
- Puoi scaricare i backup dalla dashboard DigitalOcean

### 8.2 Aggiornamenti
- Pusha modifiche al repository GitHub
- Render farà deploy automatico
- Il database persiste tra i deploy

### 8.3 Monitoraggio
- Usa l'endpoint `/health` per monitorare lo stato del server
- Configura alerting se necessario

---

## NOTE IMPORTANTI

1. **Sicurezza**: Le credenziali admin sono hardcoded nel frontend. In produzione, considera un sistema di autenticazione più sicuro.

2. **Database**: Il database SQLite locale viene sostituito con MySQL su DigitalOcean in produzione.

3. **Immagini**: Le immagini sono salvate come URL. Considera un servizio di storage come AWS S3 per le immagini caricate dagli utenti.

4. **SSL**: MySQL su DigitalOcean richiede SSL per le connessioni esterne.

5. **Limiti**: Il piano gratuito di Render ha limiti di utilizzo. Considera upgrade per produzione.

6. **MySQL**: Il backend è configurato per gestire automaticamente le connessioni persistenti e il pool di connessioni.
