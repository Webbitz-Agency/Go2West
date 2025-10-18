# Setup File Tour - Guida Completa

Questa guida ti aiuta a creare i file .txt per tutti i tour esistenti e inserire i record necessari nella tabella `tour_files`.

## 📋 Prerequisiti

1. **Python 3.x** installato
2. **Accesso al database MySQL** Go2West
3. **Chiave API OpenAI** (per caricare i file nel vector store)
4. **Librerie Python necessarie**:
   ```bash
   pip install pymysql python-dotenv
   ```

## 🚀 Procedura Completa

### Passo 1: Esegui lo Script Python

```bash
python generate_tour_files.py
```

**Cosa fa lo script:**
- Si connette al database MySQL
- Recupera tutti i tour esistenti
- Genera un file .txt per ogni tour con il formato standard: `tour_{id}_{code}.txt`
- Salva i file nella cartella `tour_files/`
- Genera automaticamente il file `insert_tour_files.sql` con i comandi SQL

**Output atteso:**
```
🚀 Avvio script di generazione file tour...
==================================================
✅ Connessione al database riuscita!
✅ Trovati 15 tour nel database
📁 Creata directory: tour_files

📝 Creazione file .txt...
✅ Creato file: tour_1_usa-coast-to-coast.txt
✅ Creato file: tour_2_canada-rockies.txt
...

🗃️ Generazione comandi SQL...
✅ Generato file SQL: insert_tour_files.sql
📝 Contiene 15 comandi INSERT

==================================================
✅ Script completato con successo!
📁 File creati in: ./tour_files/
🗃️ Comandi SQL in: ./insert_tour_files.sql
📊 Totale tour processati: 15
```

### Passo 2: Carica i File nel Vector Store OpenAI

**IMPORTANTE**: I file devono essere caricati nel vector store OpenAI per ottenere gli ID necessari.

Puoi farlo in due modi:

#### Opzione A: Usa l'API di sincronizzazione esistente
```bash
curl -X POST https://your-app-url.com/api/sync-vector-store
```

#### Opzione B: Carica manualmente via OpenAI API
```python
# Esempio di codice per caricare un file
import openai

client = openai.OpenAI(api_key="your-api-key")

# Per ogni file .txt
with open("tour_files/tour_1_usa-coast-to-coast.txt", "rb") as f:
    file = client.files.create(file=f, purpose="assistants")
    
# Aggiungi al vector store
client.beta.vector_stores.files.create(
    vector_store_id="vs_68f350c542d88191a4026139f8bae406",
    file_id=file.id
)

print(f"File ID: {file.id}")  # Salva questo ID!
```

### Passo 3: Aggiorna i Comandi SQL

1. **Apri il file** `insert_tour_files.sql` generato dallo script
2. **Sostituisci** i valori `NULL` nel campo `vector_store_file_id` con gli ID reali ottenuti dal vector store
3. **Esempio**:
   ```sql
   -- Prima (generato dallo script):
   INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
   VALUES (1, 'tour_1_usa-coast-to-coast.txt', NULL, NOW(), NOW());
   
   -- Dopo (con ID reale):
   INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
   VALUES (1, 'tour_1_usa-coast-to-coast.txt', 'file-abc123def456', NOW(), NOW());
   ```

### Passo 4: Esegui i Comandi SQL

```sql
-- Connettiti al database MySQL e esegui:
SOURCE insert_tour_files.sql;

-- Oppure copia-incolla i comandi INSERT nel tuo client MySQL
```

### Passo 5: Verifica il Risultato

```sql
-- Verifica che tutti i tour abbiano un file
SELECT 
    t.id,
    t.code,
    t.title,
    tf.filename,
    tf.vector_store_file_id,
    CASE 
        WHEN tf.id IS NULL THEN 'MANCANTE'
        WHEN tf.vector_store_file_id IS NULL THEN 'SENZA VECTOR_ID'
        ELSE 'OK'
    END as status
FROM tours t
LEFT JOIN tour_files tf ON t.id = tf.tour_id
ORDER BY t.id;
```

## 📁 Struttura File Generati

```
./
├── generate_tour_files.py          # Script principale
├── tour_files_sql_template.sql     # Template SQL con istruzioni
├── README_TOUR_FILES_SETUP.md      # Questa guida
├── tour_files/                     # Directory con i file .txt
│   ├── tour_1_usa-coast-to-coast.txt
│   ├── tour_2_canada-rockies.txt
│   └── ...
└── insert_tour_files.sql           # Comandi SQL generati (dopo aver eseguito lo script)
```

## 🔧 Formato File .txt

Ogni file .txt contiene:
- **Informazioni base**: titolo, codice, destinazione, tipo, durata, prezzo
- **Descrizione** completa del tour
- **Programma** giorno per giorno (se disponibile)
- **Itinerario** dettagliato
- **Prezzi** per categoria
- **Incluso/Non incluso** nel prezzo
- **Pasti** e altre informazioni
- **Date** disponibili
- **Note** aggiuntive
- **Stato promozione**
- **Date** di creazione e aggiornamento

## ⚠️ Note Importanti

1. **Esegui lo script UNA SOLA VOLTA** per evitare duplicati
2. **Backup del database** prima di eseguire i comandi SQL
3. **Verifica sempre** che gli ID del vector store siano corretti
4. **Non modificare** manualmente i file .txt generati (vengono sovrascritti ad ogni aggiornamento del tour)

## 🐛 Risoluzione Problemi

### Errore di connessione al database
```
❌ Errore nella connessione al database: (2003, "Can't connect to MySQL server")
```
**Soluzione**: Verifica le credenziali del database nel file `generate_tour_files.py`

### File .txt vuoti o malformati
**Soluzione**: Controlla che i dati dei tour nel database siano completi

### Errori SQL durante l'inserimento
```
ERROR 1062 (23000): Duplicate entry '1' for key 'unique_tour_file'
```
**Soluzione**: Il tour ha già un file associato. Usa UPDATE invece di INSERT:
```sql
UPDATE tour_files 
SET vector_store_file_id = 'nuovo-file-id', updated_at = NOW() 
WHERE tour_id = 1;
```

## 📞 Supporto

Per problemi o domande, controlla:
1. I log dello script Python
2. I log del database MySQL
3. La documentazione OpenAI per il vector store
4. Il file `tour_files_sql_template.sql` per esempi aggiuntivi
