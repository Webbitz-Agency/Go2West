import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import DOMPurify from 'dompurify';
import API_CONFIG from '../config/api';
import './RichEditorTiptap.css';

const RichEditorTiptap = ({ initialHtml = '', onChange, placeholder = 'Scrivi qui...' }) => {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
          'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'target', 'rel'],
        ALLOWED_STYLES: {
          '*': {
            'color': [/^#[0-9a-fA-F]{3,6}$/],
          },
        },
      });
      if (onChange) {
        onChange(sanitizedHtml);
      }
    },
  });

  // Aggiorna il contenuto quando initialHtml cambia esternamente
  useEffect(() => {
    if (editor && initialHtml !== editor.getHTML()) {
      editor.commands.setContent(initialHtml);
    }
  }, [initialHtml, editor]);

  if (!editor) {
    return null;
  }

  // Funzioni per la toolbar
  const setBold = () => editor.chain().focus().toggleBold().run();
  const setItalic = () => editor.chain().focus().toggleItalic().run();
  const setUnderline = () => editor.chain().focus().toggleUnderline().run();
  const setHeading = (level) => editor.chain().focus().toggleHeading({ level }).run();
  const setBulletList = () => editor.chain().focus().toggleBulletList().run();
  const setOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const setColor = (color) => editor.chain().focus().setColor(color).run();
  const setLink = () => {
    const url = window.prompt('Inserisci l\'URL del link:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };
  const removeLink = () => editor.chain().focus().unsetLink().run();

  // Funzione per upload immagine
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validazione file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Formato file non supportato. Usa JPG, PNG, GIF o WEBP.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Il file è troppo grande. Dimensione massima: 5MB.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Usa l'endpoint API configurato
      const uploadUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_IMAGE}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        // Non impostare Content-Type, il browser lo farà automaticamente con il boundary corretto
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'upload');
      }

      const data = await response.json();
      const imageUrl = data.url || data.imageUrl;

      // Inserisci l'immagine nell'editor
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error('Errore upload immagine:', error);
      // Fallback: usa base64 per sviluppo locale o se l'endpoint non è disponibile
      const reader = new FileReader();
      reader.onload = (e) => {
        editor.chain().focus().setImage({ src: e.target.result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input per permettere di selezionare lo stesso file di nuovo
    e.target.value = '';
  };

  // Colori predefiniti
  const colors = [
    { name: 'Nero', value: '#000000' },
    { name: 'Rosso', value: '#ff0000' },
    { name: 'Blu', value: '#0066cc' },
    { name: 'Verde', value: '#00aa00' },
  ];

  return (
    <div className="rich-editor-container">
      {/* Toolbar */}
      <div className="rich-editor-toolbar">
        {/* Formattazione testo */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={setBold}
            className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
            title="Grassetto (Ctrl+B)"
          >
            <i className="fa-solid fa-bold"></i>
          </button>
          <button
            type="button"
            onClick={setItalic}
            className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
            title="Corsivo (Ctrl+I)"
          >
            <i className="fa-solid fa-italic"></i>
          </button>
          <button
            type="button"
            onClick={setUnderline}
            className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
            title="Sottolineato (Ctrl+U)"
          >
            <i className="fa-solid fa-underline"></i>
          </button>
        </div>

        {/* Separatore */}
        <div className="toolbar-separator"></div>

        {/* Titoli */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => setHeading(1)}
            className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            title="Titolo 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => setHeading(2)}
            className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="Titolo 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => setHeading(3)}
            className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            title="Titolo 3"
          >
            H3
          </button>
        </div>

        {/* Separatore */}
        <div className="toolbar-separator"></div>

        {/* Liste */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={setBulletList}
            className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
            title="Elenco puntato"
          >
            <i className="fa-solid fa-list-ul"></i>
          </button>
          <button
            type="button"
            onClick={setOrderedList}
            className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
            title="Elenco numerato"
          >
            <i className="fa-solid fa-list-ol"></i>
          </button>
        </div>

        {/* Separatore */}
        <div className="toolbar-separator"></div>

        {/* Colori */}
        <div className="toolbar-group color-picker-group">
          <div className="color-picker-dropdown">
            <button
              type="button"
              className="toolbar-btn color-btn"
              title="Colore testo"
            >
              <i className="fa-solid fa-palette"></i>
            </button>
            <div className="color-picker-menu">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className="color-option"
                  style={{ backgroundColor: color.value }}
                  onClick={() => setColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Separatore */}
        <div className="toolbar-separator"></div>

        {/* Link */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={editor.isActive('link') ? removeLink : setLink}
            className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
            title={editor.isActive('link') ? 'Rimuovi link' : 'Inserisci link'}
          >
            <i className="fa-solid fa-link"></i>
          </button>
        </div>

        {/* Separatore */}
        <div className="toolbar-separator"></div>

        {/* Immagine */}
        <div className="toolbar-group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={triggerImageUpload}
            className="toolbar-btn"
            title="Inserisci immagine"
          >
            <i className="fa-solid fa-image"></i>
          </button>
        </div>
      </div>

      {/* Editor content */}
      <div className="rich-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichEditorTiptap;

