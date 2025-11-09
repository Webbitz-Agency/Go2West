# Chatbot AI Go2West - Documentazione

## Panoramica
Il chatbot AI di Go2West è un assistente virtuale intelligente che utilizza OpenAI GPT-4 e un vector store personalizzato per rispondere alle domande sui tour disponibili. Il sistema è completamente integrato con il database dei tour e si aggiorna automaticamente.

## Funzionalità Implementate

### 1. Generazione Automatica File .txt
- **Quando**: Per ogni tour creato o aggiornato
- **Cosa**: Genera un file .txt ben formattato con tutte le informazioni del tour
- **Contenuto**: Titolo, codice, destinazione, tipo, durata, prezzo, descrizione, programma, itinerario, prezzi, incluso/escluso, pasti, date, note, stato promozione

### 2. Integrazione Vector Store OpenAI
- **Vector Store ID**: `vs_68f350c542d88191a4026139f8bae406`
- **Chiave API**: Utilizza `OPENAI_API_KEY` dalle variabili d'ambiente di Render.
- **Aggiornamento automatico**: I file vengono aggiunti/aggiornati/eliminati automaticamente

### 3. Database Tour Files.
```sql
CREATE TABLE tour_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    vector_store_file_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tour_file (tour_id),
    INDEX idx_tour_id (tour_id),
    INDEX idx_filename (filename)
);
```

### 4. Chat Bubble UI
- **Posizione**: Basso a destra in tutte le pagine (escluso admin)
- **Stile**: Coerente con la palette del sito (oro #D4AF37 e marrone #8B4513)
- **Responsive**: Ottimizzato per desktop e mobile
- **Animazioni**: Smooth e professionali

## API Endpoints

### Chat con l'AI
```
POST /api/chat
Content-Type: application/json

{
  "message": "Quali tour avete per gli USA?"
}

Response:
{
  "response": "Risposta dell'AI...",
  "status": "success"
}
```

### Sincronizzazione Vector Store
```
POST /api/sync-vector-store

Response:
{
  "message": "Sincronizzazione completata",
  "success_count": 15,
  "error_count": 0,
  "total_tours": 15
}
```

## Flusso Operativo

### Creazione Tour
1. Utente crea nuovo tour nell'admin
2. Sistema salva tour nel database
3. Sistema genera file .txt con informazioni tour
4. Sistema carica file nel vector store OpenAI
5. Sistema salva riferimento in `tour_files`

### Aggiornamento Tour
1. Utente modifica tour nell'admin
2. Sistema aggiorna tour nel database
3. Sistema rigenera file .txt aggiornato
4. Sistema sostituisce file nel vector store
5. Sistema aggiorna riferimento in `tour_files`

### Eliminazione Tour
1. Utente elimina tour dall'admin
2. Sistema elimina file dal vector store OpenAI
3. Sistema elimina riferimento da `tour_files`
4. Sistema elimina tour dal database (CASCADE)

### Conversazione Chat
1. Utente scrive messaggio nella chat
2. Sistema utilizza assistant esistente (`asst_cxykjx2GVPkdYqmHXhRrD6D5`)
3. Crea nuovo thread per la conversazione
4. Assistant utilizza vector store per cercare informazioni
5. Sistema restituisce risposta personalizzata

## Configurazione Richiesta

### Variabili d'Ambiente Render
```
OPENAI_API_KEY=sk-your-openai-api-key
```

**IMPORTANTE**: Il server funziona anche senza questa variabile, ma il chatbot sarà disabilitato.

### Dipendenze Backend
```
openai==1.55.3
httpx==0.27.2
```

### Gestione Errori
- **Senza OPENAI_API_KEY**: Il server si avvia normalmente, chatbot disabilitato
- **Errori OpenAI**: Fallback graceful, funzionalità base mantenute
- **Conflitti versioni**: Versioni OpenAI + httpx testate e compatibili

### Fix Errore "proxies" 
Il problema `Client.__init__() got an unexpected keyword argument 'proxies'` è causato da incompatibilità tra `openai` e `httpx`. La soluzione è usare versioni specifiche compatibili:
- `openai==1.55.3`
- `httpx==0.27.2`

### OpenAI Resources
- **Vector Store ID**: `vs_68f350c542d88191a4026139f8bae406`
- **Assistant ID**: `asst_cxykjx2GVPkdYqmHXhRrD6D5`
- **Tipo**: File Search
- **Contenuto**: File .txt dei tour

## Caratteristiche dell'AI Assistant

### Personalità
- Professionale ma amichevole
- Specializzato nei viaggi Go2West
- Risponde sempre in italiano
- Conosce tutte le destinazioni e tipologie di viaggio

### Capacità
- Informazioni dettagliate sui tour
- Consigli su destinazioni
- Prezzi e date disponibili
- Itinerari e programmi
- Cosa è incluso/escluso
- Suggerimenti personalizzati

### Limitazioni
- Non può effettuare prenotazioni
- Non può accedere a dati in tempo reale (prezzi dinamici)
- Suggerisce di contattare l'agenzia per dettagli specifici

## Utilizzo per l'Utente

### Desktop
1. Clicca sulla chat bubble dorata in basso a destra
2. Scrivi la tua domanda
3. Premi Invio o clicca il pulsante di invio
4. Ricevi risposta personalizzata dall'AI

### Mobile
1. Tocca la chat bubble
2. La finestra si adatta al dispositivo
3. Interfaccia ottimizzata per touch
4. Scroll automatico dei messaggi

## Manutenzione

### Sincronizzazione Manuale
Se necessario, è possibile sincronizzare manualmente tutti i tour:
```bash
curl -X POST https://your-backend-url/api/sync-vector-store
```

### Monitoraggio
- Controlla i log del backend per errori OpenAI
- Verifica che `OPENAI_API_KEY` sia configurata
- Monitora l'utilizzo del vector store

### Troubleshooting
1. **Server non si avvia**: 
   - Errore `OpenAIError`: Configura `OPENAI_API_KEY` su Render
   - Errore `TypeError: Client.__init__()`: Conflitto versioni OpenAI/httpx (usa openai==1.55.3 + httpx==0.27.2)
2. **Chat non risponde**: 
   - Verifica chiave API OpenAI nelle variabili d'ambiente
   - Controlla i log per errori di inizializzazione
3. **Risposte incomplete**: Controlla sincronizzazione vector store
4. **Errori di rete**: Verifica connessione a OpenAI API
5. **Chatbot disabilitato**: Normale se OPENAI_API_KEY non è configurata

## Sicurezza

### Protezione Dati
- Nessun dato sensibile nei file .txt
- Solo informazioni pubbliche dei tour
- Nessuna informazione utente nelle conversazioni

### Rate Limiting
- OpenAI API ha limiti naturali
- Assistant temporanei prevengono accumulo risorse
- Cleanup automatico dopo ogni conversazione

## Performance

### Ottimizzazioni
- Assistant persistente (no creazione/eliminazione)
- Thread temporanei per conversazioni
- File .txt leggeri e ben formattati
- Cache locale messaggi chat

### Tempi di Risposta
- Creazione thread: ~0.5 secondi
- Elaborazione messaggio: ~2-5 secondi
- Totale conversazione: ~2.5-5.5 secondi (migliorato!)

## Estensioni Future

### Possibili Miglioramenti
1. **Memoria conversazione**: Mantenere contesto tra messaggi
2. **Integrazione calendario**: Date disponibili in tempo reale
3. **Prezzi dinamici**: Connessione a sistema di pricing
4. **Multilingua**: Supporto inglese e altre lingue
5. **Analytics**: Tracking domande frequenti
6. **Feedback**: Sistema di valutazione risposte

### Integrazioni Avanzate
1. **CRM**: Collegamento a sistema clienti
2. **Booking**: Integrazione prenotazioni
3. **Email**: Invio automatico informazioni
4. **WhatsApp**: Estensione su altri canali
