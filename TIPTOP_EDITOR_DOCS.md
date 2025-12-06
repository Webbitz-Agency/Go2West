# Documentazione RichEditorTiptap

## Installazione

I pacchetti necessari sono già installati. Se necessario, esegui:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-image @tiptap/extension-link @tiptap/extension-underline dompurify
```

## Componente RichEditorTiptap

### Props

- `initialHtml` (string, opzionale): HTML iniziale da mostrare nell'editor
- `onChange` (function, opzionale): Callback chiamato quando il contenuto cambia. Riceve l'HTML sanitizzato come parametro
- `placeholder` (string, opzionale): Testo placeholder mostrato quando l'editor è vuoto

### Esempio d'uso base

```jsx
import RichEditorTiptap from './components/RichEditorTiptap';

function MyForm() {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // content contiene l'HTML sanitizzato
    console.log('Contenuto:', content);
    // Invia al backend
    fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: content })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <RichEditorTiptap
        initialHtml="<p>Contenuto iniziale</p>"
        onChange={setContent}
        placeholder="Scrivi qui..."
      />
      <button type="submit">Salva</button>
    </form>
  );
}
```

### Esempio con form completo

```jsx
import React, { useState } from 'react';
import RichEditorTiptap from './components/RichEditorTiptap';

function ArticleEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content, // HTML sanitizzato
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nel salvataggio');
      }

      const data = await response.json();
      console.log('Articolo salvato:', data);
      alert('Articolo salvato con successo!');
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore nel salvataggio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-editor">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titolo:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descrizione:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        <div>
          <label>Contenuto:</label>
          <RichEditorTiptap
            initialHtml={content}
            onChange={setContent}
            placeholder="Scrivi il contenuto dell'articolo..."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvataggio...' : 'Salva Articolo'}
        </button>
      </form>
    </div>
  );
}

export default ArticleEditor;
```

## Funzionalità Toolbar

L'editor include una toolbar completa con:

- **Formattazione testo**: Grassetto, Corsivo, Sottolineato
- **Titoli**: H1, H2, H3
- **Liste**: Elenco puntato, Elenco numerato
- **Colori**: 4 colori predefiniti (Nero, Rosso, Blu, Verde)
- **Link**: Inserisci/rimuovi link
- **Immagini**: Upload e inserimento immagini

## Upload Immagini

Il componente supporta l'upload di immagini tramite l'endpoint `/api/upload-image`.

### Configurazione Endpoint

L'endpoint è configurato in `src/config/api.js`:

```javascript
UPLOAD_IMAGE: '/api/upload-image'
```

### Fallback Base64

Se l'endpoint non è disponibile o fallisce, il componente usa automaticamente base64 come fallback per lo sviluppo locale.

### Validazione Client-Side

Il componente valida:
- **Formati supportati**: JPEG, JPG, PNG, GIF, WEBP
- **Dimensione massima**: 5MB

## Sanitizzazione HTML

Il componente usa **DOMPurify** per sanitizzare l'HTML prima di chiamare `onChange`. 

### Tag permessi:
- `p`, `br`, `strong`, `em`, `u`
- `h1`, `h2`, `h3`
- `ul`, `ol`, `li`
- `a`, `img`
- `blockquote`, `code`, `pre`

### Attributi permessi:
- `href`, `src`, `alt`, `title`, `style`, `target`, `rel`

### Stili permessi:
- Solo `color` con valori esadecimali

## Protezione Lato Server

⚠️ **IMPORTANTE**: La sanitizzazione client-side NON è sufficiente. Devi sempre sanitizzare anche lato server.

### 1. Sanitizzazione Server-Side

Usa una libreria di sanitizzazione server-side:

**Node.js/Express (esempio con `dompurify` + `jsdom`):**
```javascript
const DOMPurify = require('isomorphic-dompurify');

app.post('/api/articles', async (req, res) => {
  const { title, description, content } = req.body;
  
  // Sanitizza l'HTML
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 
                    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'target', 'rel'],
    ALLOWED_STYLES: {
      '*': {
        'color': [/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/],
      },
    },
  });
  
  // Salva nel database
  await db.articles.create({
    title,
    description,
    content: sanitizedContent,
  });
  
  res.json({ success: true });
});
```

**Python/Django (esempio con `bleach`):**
```python
import bleach

ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
                'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre']
ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title'],
    '*': ['style']
}
ALLOWED_STYLES = ['color']

def sanitize_html(html):
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        styles=ALLOWED_STYLES
    )
```

### 2. Limiti Dimensione File Immagini

**Node.js/Express:**
```javascript
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 
                          'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato file non supportato'), false);
    }
  },
});

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nessun file caricato' });
  }
  
  // Verifica MIME type (non fidarti solo dell'estensione)
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 
                          'image/gif', 'image/webp'];
  if (!validMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Formato file non valido' });
  }
  
  // Verifica dimensione
  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File troppo grande' });
  }
  
  // Salva il file in modo sicuro
  const filename = `${Date.now()}-${req.file.originalname}`;
  const filepath = path.join(__dirname, 'uploads', filename);
  await fs.writeFile(filepath, req.file.buffer);
  
  // Restituisci l'URL
  res.json({ 
    url: `/uploads/${filename}`,
    imageUrl: `/uploads/${filename}`
  });
});
```

### 3. Controlli MIME Type

**Verifica reale del tipo di file (non solo estensione):**

```javascript
const fileType = require('file-type');

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  // Verifica il tipo reale del file
  const type = await fileType.fromBuffer(req.file.buffer);
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!type || !allowedTypes.includes(type.mime)) {
    return res.status(400).json({ error: 'Tipo di file non valido' });
  }
  
  // Continua con l'upload...
});
```

### 4. Protezione XSS

- **Mai fidarsi del client**: Sempre sanitizzare lato server
- **CSP Headers**: Usa Content Security Policy per limitare l'esecuzione di script
- **Validazione input**: Valida tutti gli input prima di processarli
- **Escape output**: Quando mostri l'HTML nel frontend, assicurati che sia già sanitizzato

### 5. Rate Limiting per Upload

```javascript
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10, // 10 upload per finestra
  message: 'Troppi upload. Riprova più tardi.'
});

app.post('/api/upload-image', uploadLimiter, upload.single('image'), ...);
```

### 6. Storage Sicuro

- **Directory separata**: Salva le immagini in una directory separata, fuori dalla root web
- **Nomi file sicuri**: Genera nomi file univoci (UUID, hash) per evitare collisioni
- **Validazione path**: Previeni directory traversal attacks
- **Permessi file**: Imposta permessi appropriati (solo lettura per i file pubblici)

## Integrazione in TourEditor

Il componente è già integrato in `TourEditor.js` come wrapper `EditableRichTextarea` che mantiene la compatibilità con il sistema di field path esistente.

## Personalizzazione CSS

Il CSS è in `src/components/RichEditorTiptap.css`. Puoi personalizzare:
- Colori della toolbar
- Dimensioni dei pulsanti
- Stili del contenuto
- Layout responsive

## Troubleshooting

### L'editor non si carica
- Verifica che tutti i pacchetti siano installati
- Controlla la console per errori

### Le immagini non si caricano
- Verifica che l'endpoint `/api/upload-image` sia configurato
- Controlla i CORS se l'API è su un dominio diverso
- Il fallback base64 funziona solo in sviluppo

### L'HTML non viene salvato correttamente
- Verifica che `onChange` sia chiamato
- Controlla la sanitizzazione lato server
- Verifica i tag permessi in DOMPurify

