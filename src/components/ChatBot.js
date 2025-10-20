import React, { useState, useRef, useEffect } from 'react';
import TourService from '../services/TourService';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Ciao! Sono l'assistente virtuale di Go2West. Posso aiutarti con informazioni sui nostri tour negli USA, Canada, Messico, America Centrale, Sud America, Caraibi e Polinesia Francese. Cosa vorresti sapere?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRef = useRef(null);
  const typingTimerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);
  const [isSpeechVisible, setIsSpeechVisible] = useState(false);
  const bubbleText = "Chatta con me!";

  // Scroll automatico ai nuovi messaggi
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus sull'input quando si apre la chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Typewriter effetto su hover
  const startTypewriter = () => {
    if (!speechRef.current) return;
    // reset contenuto
    speechRef.current.innerHTML = '';
    let i = 0;

    const type = () => {
      if (!isHoveringRef.current) return; // interrompi se uscito hover
      if (i < bubbleText.length) {
        const partial = bubbleText.substring(0, i + 1);
        speechRef.current.innerHTML = `${partial}<span class="chat-caret" aria-hidden="true"></span>`;
        i += 1;
        typingTimerRef.current = setTimeout(type, 60);
      } else {
        // mantiene il caret che lampeggia al termine
        speechRef.current.innerHTML = `${bubbleText}<span class="chat-caret" aria-hidden="true"></span>`;
      }
    };

    setIsHovering(true);
    isHoveringRef.current = true;
    setIsSpeechVisible(true);
    type();
  };

  const stopTypewriter = () => {
    setIsHovering(false);
    isHoveringRef.current = false;
    setIsSpeechVisible(false);
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    if (speechRef.current) {
      speechRef.current.innerHTML = '';
    }
  };

  // Teaser mobile periodico: 5s on, 1s off
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    let showTimer = null;
    let hideTimer = null;

    const runCycle = () => {
      if (!mql.matches || isOpen) return;
      startTypewriter();
      showTimer = setTimeout(() => {
        stopTypewriter();
        hideTimer = setTimeout(runCycle, 1000);
      }, 5000);
    };

    if (mql.matches && !isOpen) runCycle();

    const onChange = () => {
      stopTypewriter();
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (mql.matches && !isOpen) runCycle();
    };
    mql.addEventListener('change', onChange);

    return () => {
      stopTypewriter();
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
      mql.removeEventListener('change', onChange);
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await TourService.sendChatMessage(inputMessage);

      if (data.status === 'success') {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          text: data.error || "Mi dispiace, si è verificato un errore. Riprova più tardi o contatta direttamente l'agenzia.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Errore nella chat:', error);
      
      let errorText = "Mi dispiace, non riesco a connettermi al servizio. Riprova più tardi.";
      
      // Se l'errore contiene informazioni specifiche, usale
      if (error.message && error.message.includes('503')) {
        errorText = "Il servizio chatbot non è attualmente disponibile. Per informazioni sui tour, contatta direttamente l'agenzia.";
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chatbot-container">
      {/* Chat Bubble */}
      <div 
        className={`chat-bubble ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        onMouseEnter={startTypewriter}
        onMouseLeave={stopTypewriter}
      >
        {isOpen ? (
          <img 
            src="/images/chatbot/statue-of-liberty.png" 
            alt="Assistente Chat - Statua della Libertà"
            className="statue-icon"
          />
        ) : (
          <img 
            src="/images/chatbot/statue-of-liberty.gif" 
            alt="Statua della Libertà - Assistente Chat"
            className="statue-icon"
          />
        )}
        <div className={`chat-speech-bubble${isSpeechVisible ? ' show' : ''}`} role="status" aria-live="polite">
          <span className="chat-speech-text" ref={speechRef}></span>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="chat-header-text">
                <h4>Assistente Go2West</h4>
                <span className="chat-status">Online</span>
              </div>
            </div>
            <button className="chat-close" onClick={toggleChat}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <div className="message-text">
                    {message.text}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi un messaggio..."
                className="chat-input"
                rows="1"
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                className="chat-send-button"
                disabled={!inputMessage.trim() || isLoading}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
            <div className="chat-footer-text">
              Powered by Go2West AI Assistant
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
