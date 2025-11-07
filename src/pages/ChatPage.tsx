import { useState, useRef, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { X, Send, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';
import { usePopupClose } from '@/components/PopupCloseButton';

enum ConversationState {
  GREETING = 'greeting',
  ASKING_SUBJECT = 'asking_subject',
  SHOWING_OPTIONS = 'showing_options',
  ASKING_NAME = 'asking_name',
  ACTIVE_CHAT = 'active_chat'
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  source?: string;
  error?: boolean;
  timestamp?: string;
  senderLabel?: string;
  isStreaming?: boolean;
}

interface ChatResponse {
  output?: string;
  answer?: string;
  source?: string;
  canEscalate?: boolean;
  [key: string]: any;
}

async function sendMessageStreaming(
  message: string, 
  sessionId: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const url = 'https://radux.app.n8n.cloud/webhook/438ccf83-5a80-4605-8195-a586e4e03c34/chat?action=sendMessage';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatInput: message, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.output || data.answer || data.response || data.content || data.text || '';
    
    if (content) {
      // Split into words while preserving spaces and punctuation
      const words = content.split(/(\s+)/);
      let accumulatedText = '';
      
      // Stream word by word with delay for ChatGPT-like effect
      for (let i = 0; i < words.length; i++) {
        accumulatedText += words[i];
        onChunk(accumulatedText);
        
        // 35ms delay between words for natural streaming
        if (i < words.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 35));
        }
      }
    } else {
      onChunk('Geen antwoord ontvangen.');
    }
  } catch (error) {
    console.error('[Chat] Error:', error);
    onChunk('Sorry, er is iets fout gegaan bij het verwerken van je vraag.');
  }
}

const ChatPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Add styles for gradient borders and hide scrollbars
  const chatInputStyles = `
    .chat-input-wrapper::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      padding: 1px;
      background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .silver-gradient-border::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 12px;
      padding: 1px;
      background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .silver-gradient-border-round::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      padding: 1px;
      background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    /* Hide scrollbars while maintaining scroll functionality */
    .hide-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    
    .hide-scrollbar::-webkit-scrollbar {
      display: none;  /* Chrome, Safari and Opera */
    }

    /* Message entrance animation */
    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .animate-fade-in-up {
      animation: fade-in-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [nameInput, setNameInput] = useState('');
  const [conversationState, setConversationState] = useState<ConversationState>(ConversationState.GREETING);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isExiting, setIsExiting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const preloadTimeoutsRef = useRef<number[]>([]);
  const { handlePopupClose } = usePopupClose();

  // Initialize session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('n8n-chat-session-id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log('[Chat] Loaded existing session:', storedSessionId);
    } else {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('n8n-chat-session-id', newSessionId);
      setSessionId(newSessionId);
      console.log('[Chat] Created new session:', newSessionId);
    }
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    const savedName = localStorage.getItem('chat-user-name');
    const savedState = localStorage.getItem('chat-conversation-state');
    const savedSubject = localStorage.getItem('chat-selected-subject');
    
    if (savedName) {
      setUserName(savedName);
    }
    
    if (savedState) {
      setConversationState(savedState as ConversationState);
    }
    
    if (savedSubject) {
      setSelectedSubject(savedSubject);
    }
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
        return; // Skip preloaded messages if we have saved ones
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    
    // Start conversation flow from GREETING
    startConversationFlow();
    
    return () => {
      preloadTimeoutsRef.current.forEach(clearTimeout);
      preloadTimeoutsRef.current = [];
    };
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chat-conversation-state', conversationState);
  }, [conversationState]);

  useEffect(() => {
    if (selectedSubject) {
      localStorage.setItem('chat-selected-subject', selectedSubject);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem('chat-user-name', userName);
    }
  }, [userName]);

  // Detect scroll for header background
  useEffect(() => {
    const messagesContainer = document.querySelector('.messages-container');
    
    const handleScroll = () => {
      if (messagesContainer) {
        setIsScrolled(messagesContainer.scrollTop > 20);
      }
    };
    
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const startConversationFlow = () => {
    preloadTimeoutsRef.current.forEach(clearTimeout);
    preloadTimeoutsRef.current = [];
    
    // State 1: GREETING
    const greetingMessage: Message = {
      role: 'bot',
      content: 'Hallo, ik ben je persoonlijke assistent - hier om al je vragen over haartransplantatie te beantwoorden.',
      timestamp: new Date().toISOString(),
      senderLabel: 'GlobalHair bot'
    };
    
    setMessages([greetingMessage]);
    
    // Transition to ASKING_SUBJECT after 800ms
    const timeout1 = window.setTimeout(() => {
      setConversationState(ConversationState.ASKING_SUBJECT);
      
      const askSubjectMessage: Message = {
        role: 'bot',
        content: 'Waar kan ik je vandaag mee helpen?',
        timestamp: new Date().toISOString(),
        senderLabel: 'GlobalHair bot'
      };
      
      setMessages(prev => [...prev, askSubjectMessage]);
      
      // Transition to SHOWING_OPTIONS after 800ms
      const timeout2 = window.setTimeout(() => {
        setConversationState(ConversationState.SHOWING_OPTIONS);
      }, 800);
      
      preloadTimeoutsRef.current.push(timeout2);
    }, 800);
    
    preloadTimeoutsRef.current.push(timeout1);
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: subject,
      timestamp: new Date().toISOString(),
      senderLabel: userName || 'Jij'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setConversationState(ConversationState.ASKING_NAME);
    
    // Ask for name
    setTimeout(() => {
      const askNameMessage: Message = {
        role: 'bot',
        content: 'Voordat we verder gaan, mag ik je naam weten?',
        timestamp: new Date().toISOString(),
        senderLabel: 'GlobalHair bot'
      };
      
      setMessages(prev => [...prev, askNameMessage]);
    }, 800);
  };

  const handleNameSubmit = async () => {
    if (!nameInput.trim()) return;
    
    const name = nameInput.trim();
    setUserName(name);
    setNameInput('');
    
    // Add user message with name
    const userMessage: Message = {
      role: 'user',
      content: name,
      timestamp: new Date().toISOString(),
      senderLabel: name
    };
    
    setMessages(prev => [...prev, userMessage]);
    setConversationState(ConversationState.ACTIVE_CHAT);
    
    // Create placeholder bot message for streaming
    const placeholderBot: Message = {
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      senderLabel: 'GlobalHair bot',
      isStreaming: true
    };
    setMessages(prev => [...prev, placeholderBot]);
    setIsLoading(true);
    
    // Send first message to n8n with context and stream response
    const contextMessage = `Gebruiker ${name} heeft als onderwerp gekozen: "${selectedSubject}". ${selectedSubject === "Ik heb een andere vraag" ? "De gebruiker heeft een andere vraag." : ""}`;
    
    await sendMessageStreaming(
      contextMessage, 
      sessionId,
      (chunk) => {
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === prev.length - 1 ? { ...msg, content: chunk } : msg
          )
        );
        scrollToBottom();
      }
    );

    // Finalize the message
    setMessages(prev => 
      prev.map((msg, idx) => 
        idx === prev.length - 1 ? { ...msg, isStreaming: false } : msg
      )
    );
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || conversationState !== ConversationState.ACTIVE_CHAT) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage, 
      timestamp: new Date().toISOString(),
      senderLabel: userName
    }]);

    // Create placeholder bot message for streaming
    const placeholderBot: Message = {
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      senderLabel: 'GlobalHair bot',
      isStreaming: true
    };
    setMessages(prev => [...prev, placeholderBot]);
    setIsLoading(true);

    await sendMessageStreaming(
      userMessage,
      sessionId,
      (chunk) => {
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === prev.length - 1 ? { ...msg, content: chunk } : msg
          )
        );
        scrollToBottom();
      }
    );

    // Finalize the message
    setMessages(prev => 
      prev.map((msg, idx) => 
        idx === prev.length - 1 ? { ...msg, isStreaming: false } : msg
      )
    );
    setIsLoading(false);
    
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNameInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSubmit();
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  const handleRestart = () => {
    // Clear all localStorage
    localStorage.removeItem('chat-messages');
    localStorage.removeItem('chat-user-name');
    localStorage.removeItem('chat-conversation-state');
    localStorage.removeItem('chat-selected-subject');
    
    // Reset state
    setMessages([]);
    setUserName('');
    setSelectedSubject('');
    setConversationState(ConversationState.GREETING);
    
    // Restart conversation flow
    startConversationFlow();
  };

  // Only show restart button in development (Lovable environment)
  const isDevEnvironment = window.location.hostname.includes('lovable') || 
                           window.location.hostname.includes('localhost');

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style>{chatInputStyles}</style>
      <MetaHead
        title={language === 'nl' ? 'Chat' : 'Chat'}
        description={language === 'nl' ? 'Chat met ons' : 'Chat with us'}
        language={language}
      />
      
      <div
        className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
        style={{
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          zIndex: 50
        }}
      >
        {/* Header with Logo and Close Button */}
        <div 
          className="fixed top-0 left-0 right-0 transition-all duration-500" 
          style={{ 
            zIndex: 100,
            backdropFilter: isScrolled ? 'blur(60px) saturate(200%)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(60px) saturate(200%)' : 'none',
            background: isScrolled 
              ? 'linear-gradient(180deg, rgba(4, 14, 21, 0.92) 0%, rgba(4, 14, 21, 0.88) 20%, rgba(8, 20, 30, 0.75) 40%, rgba(12, 25, 35, 0.45) 70%, transparent 100%)' 
              : 'transparent',
          }}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <img 
                src={hairtransplantLogo} 
                alt="GHI Hairtransplant Logo" 
                style={{ height: '2.5rem' }}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Dev-only restart button */}
              {isDevEnvironment && (
                <button
                  onClick={handleRestart}
                  className="px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10 border border-white/20"
                  aria-label="Restart chat"
                >
                  Restart
                </button>
              )}
              
              <button
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5 relative z-10"
                aria-label="Close chat"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div
          className="h-[var(--app-height)] flex flex-col relative"
          style={{
            scrollSnapType: 'none',
            zIndex: 2,
          }}
        >
          {/* Messages */}
          <div 
            className="messages-container flex-1 overflow-y-auto px-4 pt-24 pb-28 space-y-4 hide-scrollbar"
            style={{
              position: 'relative',
              scrollSnapType: 'none',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col animate-fade-in-up ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Label */}
                {msg.senderLabel && (
                  <span 
                    className="text-xs mb-1 px-1"
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    {msg.senderLabel}
                  </span>
                )}
                
                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] px-4 py-3`}
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(234, 234, 234, 0.18) 0%, rgba(234, 234, 234, 0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(44, 54, 62, 0.5) 0%, rgba(44, 54, 62, 0.3) 100%)',
                    border: msg.role === 'user' ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    boxShadow: msg.role === 'user' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    position: 'relative',
                  }}
                >
                  <p 
                    className="whitespace-pre-wrap"
                    style={{
                      color: msg.role === 'user' ? 'rgba(255, 255, 255, 0.95)' : 'rgb(220, 220, 220)',
                    }}
                  >
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block ml-1 w-1 h-4 bg-white/60 animate-pulse" style={{ verticalAlign: 'middle' }} />
                    )}
                  </p>
                  {msg.source && typeof msg.source === 'string' && msg.source.startsWith('http') && (
                    <a
                      href={msg.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm underline transition-colors"
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                    >
                      Bron
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {msg.error && (
                    <span className="text-red-400/80 text-sm ml-2">⚠</span>
                  )}
                </div>
                
                {/* Timestamp */}
                {msg.timestamp && (
                  <span 
                    className="text-xs mt-1 px-1"
                    style={{
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Loader2 className="animate-spin" style={{ color: 'rgba(255, 255, 255, 0.6)' }} size={20} />
              </div>
            )}

            {/* Subject Options */}
            {conversationState === ConversationState.SHOWING_OPTIONS && (
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => handleSubjectClick('Vertel me meer over de werkwijze')}
                  className="text-left"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                  }}
                >
                  Vertel me meer over de werkwijze
                </button>
                <button
                  onClick={() => handleSubjectClick('Help me het juiste pakket kiezen')}
                  className="text-left"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                  }}
                >
                  Help me het juiste pakket kiezen
                </button>
                <button
                  onClick={() => handleSubjectClick('Ik heb een andere vraag')}
                  className="text-left"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                  }}
                >
                  Ik heb een andere vraag
                </button>
              </div>
            )}

            {/* Name Input */}
            {conversationState === ConversationState.ASKING_NAME && (
              <div className="flex flex-col gap-2 mt-4 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={handleNameInputKeyDown}
                    placeholder="Vul je naam in..."
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none px-4 py-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '15px',
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleNameSubmit}
                    disabled={!nameInput.trim()}
                    className="silver-gradient-border-round transition-all disabled:opacity-30"
                    style={{
                      padding: '0.8rem',
                      borderRadius: '9999px',
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.02) 100%)',
                      position: 'relative',
                    }}
                  >
                    <Send className="text-white" size={20} />
                  </button>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Only show in ACTIVE_CHAT state */}
          {conversationState === ConversationState.ACTIVE_CHAT && (
            <div
              className="sticky bottom-0"
              style={{
                padding: '1rem 0.5rem',
                zIndex: 3,
              }}
            >
              <div
                className="flex items-end gap-2 p-2 chat-input-wrapper"
                style={{
                  borderRadius: '9999px',
                  background: 'linear-gradient(100deg, rgba(44, 54, 62, 0.05) 0%, rgba(234, 234, 234, 0.15) 50%, rgba(44, 54, 62, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  padding: '0.3rem 0.3rem 0.3rem 1rem',
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Typ een bericht..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none px-2 max-h-32 hide-scrollbar"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    paddingTop: '0.6rem',
                    paddingBottom: '0.6rem',
                  }}
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="silver-gradient-border-round transition-all disabled:opacity-30"
                  style={{
                    padding: '0.8rem',
                    borderRadius: '9999px',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    position: 'relative',
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin text-white" size={20} />
                  ) : (
                    <Send className="text-white" size={20} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
