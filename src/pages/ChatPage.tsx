import { useState, useRef, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { X, Send, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';
import { usePopupClose, SwipeablePopupWrapper } from '@/components/PopupCloseButton';

interface Message {
  role: 'user' | 'bot';
  content: string;
  source?: string;
  error?: boolean;
}

interface ChatResponse {
  output?: string;
  answer?: string;
  source?: string;
  canEscalate?: boolean;
  [key: string]: any;
}

async function sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
  const url = 'https://radux.app.n8n.cloud/webhook/438ccf83-5a80-4605-8195-a586e4e03c34/chat?action=sendMessage';
  
  console.log('[Chat] Sending message:', { chatInput: message, sessionId });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      chatInput: message,
      sessionId: sessionId 
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Chat] Error response:', response.status, errorText);
    throw new Error(`Network error: ${response.status}`);
  }

  const data = await response.json();
  console.log('[Chat] Response received:', data);
  
  return {
    answer: data.output || data.answer || data.response || 'No response',
    source: data.source,
    canEscalate: data.canEscalate,
    ...data
  };
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
  const [showOptions, setShowOptions] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [isExiting, setIsExiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    
    if (savedName) {
      setUserName(savedName);
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
    
    // Only show preloaded messages if no saved messages exist
    preloadTimeoutsRef.current.forEach(clearTimeout);
    preloadTimeoutsRef.current = [];
    
    const greeting = savedName 
      ? `Hallo ${savedName}, ik ben je persoonlijke assistent - hier om al je vragen over haartransplantatie te beantwoorden.`
      : 'Hallo, ik ben je persoonlijke assistent - hier om al je vragen over haartransplantatie te beantwoorden.';
    
    const preloadedMessages: Message[] = [
      { role: 'bot', content: greeting },
      { role: 'bot', content: 'Waar kan ik je vandaag mee helpen?' }
    ];

    let index = 0;
    const displayNextMessage = () => {
      if (index < preloadedMessages.length) {
        const nextMsg = preloadedMessages[index];
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === nextMsg.role && last.content === nextMsg.content) {
            return prev;
          }
          return [...prev, nextMsg];
        });
        index++;
        const delay = 800;
        const id = window.setTimeout(displayNextMessage, delay);
        preloadTimeoutsRef.current.push(id);
      } else {
        setShowOptions(true);
      }
    };
    
    displayNextMessage();
    
    return () => {
      preloadTimeoutsRef.current.forEach(clearTimeout);
      preloadTimeoutsRef.current = [];
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Detect and save user name from messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') return;
    
    // Look for name patterns in Dutch
    const patterns = [
      /(?:mijn naam is|ik ben|ik heet|naam is)\s+([A-Z][a-zéèêëàâäôöûüïíóúñ]+)/i,
      /^([A-Z][a-zéèêëàâäôöûüïíóúñ]+)$/
    ];
    
    for (const pattern of patterns) {
      const match = lastMessage.content.match(pattern);
      if (match && match[1]) {
        const detectedName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        setUserName(detectedName);
        localStorage.setItem('chat-user-name', detectedName);
        console.log('[Chat] Detected user name:', detectedName);
        break;
      }
    }
  }, [messages]);

  const handleOptionClick = (optionText: string) => {
    setShowOptions(false);
    setMessages(prev => [...prev, { role: 'user', content: optionText }]);

    setTimeout(() => {
      if (optionText.includes('werkwijze')) {
        setMessages(prev => [...prev, 
          { role: 'bot', content: 'Natuurlijk. We combineren medische precisie met persoonlijke zorg. Elke behandeling begint met een uitgebreide analyse, gevolgd door een behandeling op maat — uitgevoerd door ervaren specialisten.' }
        ]);
        setTimeout(() => {
          setMessages(prev => [...prev,
            { role: 'bot', content: 'Wil je daarna meer weten over de pakketten, of meteen een consult plannen?' }
          ]);
        }, 800);
      } else if (optionText.includes('pakket')) {
        setMessages(prev => [...prev,
          { role: 'bot', content: 'Uitstekend. Ik kan je helpen bepalen welk pakket het best bij jouw situatie past.' }
        ]);
        setTimeout(() => {
          setMessages(prev => [...prev,
            { role: 'bot', content: 'Wil je me eerst iets vertellen over je huidige haarstatus of je gewenste resultaat?' }
          ]);
        }, 800);
      } else {
        setMessages(prev => [...prev,
          { role: 'bot', content: 'Geen probleem 👍. Stel gerust je vraag — ik help je zo goed mogelijk verder.' }
        ]);
      }
    }, 800);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
    console.log('[Chat] messages updated:', messages);
  }, [messages]);

  const handleSend = async () => {
    console.log('[Chat] handleSend called, input:', input, 'isLoading:', isLoading);
    if (!input.trim() || isLoading) return;

    // Ensure we have a sessionId
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const storedSessionId = localStorage.getItem('n8n-chat-session-id');
      if (storedSessionId) {
        currentSessionId = storedSessionId;
      } else {
        currentSessionId = crypto.randomUUID();
        localStorage.setItem('n8n-chat-session-id', currentSessionId);
      }
      setSessionId(currentSessionId);
    }

    const userMessage = input.trim();
    console.log('[Chat] Adding user message:', userMessage);
    setInput('');
    setMessages(prev => {
      const updated = [...prev, { role: 'user' as const, content: userMessage }];
      console.log('[Chat] Messages after user add:', updated.length);
      return updated;
    });
    setIsLoading(true);

    try {
      console.log('[Chat] Sending to API...');
      const response = await sendMessage(userMessage, currentSessionId);
      console.log('[Chat] API response received:', response);
      setMessages(prev => {
        const updated = [...prev, {
          role: 'bot' as const,
          content: response.answer || 'No response',
          source: response.source,
        }];
        console.log('[Chat] Messages after bot add:', updated.length);
        return updated;
      });
    } catch (error) {
      console.error('[Chat] Error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: language === 'nl' 
          ? 'Sorry, er is iets fout gegaan.' 
          : 'Sorry, something went wrong.',
        error: true,
      }]);
    } finally {
      setIsLoading(false);
      console.log('[Chat] handleSend complete');
      // Focus back on input after message is sent
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    if (window.history.length > 1) {
      setTimeout(() => {
        navigate(-1);
      }, 350);
    } else {
      handlePopupClose(350);
    }
  };

  return (
    <>
      <style>{chatInputStyles}</style>
      <MetaHead
        title={language === 'nl' ? 'Chat' : 'Chat'}
        description={language === 'nl' ? 'Chat met ons' : 'Chat with us'}
        language={language}
      />
      
      <SwipeablePopupWrapper onClose={handleClose}>
        <div
          className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
          style={{
            background: 'linear-gradient(180deg, rgb(4, 14, 21) 0%, rgb(51, 61, 70) 100%)',
            overflow: 'hidden',
            position: 'fixed',
            inset: 0,
            zIndex: 50
          }}
        >
          <div
            className="min-h-[var(--app-height)] flex flex-col"
            style={{
              scrollSnapType: 'none',
            }}
          >
          {/* Header with Logo and Close Button */}
          <div
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4"
          >
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={hairtransplantLogo} 
              alt="GHI Hairtransplant Logo" 
              style={{ height: '2.5rem' }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Close chat"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto px-4 pt-20 pb-28 space-y-4 hide-scrollbar"
          style={{
            position: 'relative',
            zIndex: 0,
            scrollSnapType: 'none',
          }}
        >
          {messages.length === 0 && (
            <div className="text-center text-white/60 mt-20">
              <p style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}>
                {language === 'nl' 
                  ? 'Stel een vraag om te beginnen' 
                  : 'Ask a question to start'}
              </p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div
                  className="max-w-[80%] px-4 py-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(234, 234, 234, 0.18) 0%, rgba(234, 234, 234, 0.12) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '18px 18px 4px 18px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    position: 'relative',
                  }}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div
                  className="max-w-[80%] px-4 py-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(44, 54, 62, 0.5) 0%, rgba(44, 54, 62, 0.3) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px 18px 18px 4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5',
                  }}
                >
                  <p 
                    className="whitespace-pre-wrap"
                    style={{
                      color: 'rgb(220, 220, 220)',
                    }}
                  >
                    {msg.content}
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
                      {language === 'nl' ? 'Bron' : 'Source'}
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {msg.error && (
                    <span className="text-red-400/80 text-sm ml-2">⚠</span>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <Loader2 className="animate-spin" style={{ color: 'rgba(255, 255, 255, 0.6)' }} size={20} />
            </div>
          )}

          {showOptions && (
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => handleOptionClick('Vertel me meer over de werkwijze')}
                className="text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '14px',
                  padding: '16px 24px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Vertel me meer over de werkwijze
              </button>
              <button
                onClick={() => handleOptionClick('Help me het juiste pakket kiezen')}
                className="text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '14px',
                  padding: '16px 24px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Help me het juiste pakket kiezen
              </button>
              <button
                onClick={() => handleOptionClick('Ik heb een andere vraag')}
                className="text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '14px',
                  padding: '16px 24px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Ik heb een andere vraag
              </button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="sticky bottom-0"
          style={{
            padding: '1rem 0.5rem',
            zIndex: 10,
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
              placeholder={language === 'nl' ? 'Typ een bericht...' : 'Type a message...'}
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
          </div>
        </div>
      </SwipeablePopupWrapper>
    </>
  );
};

export default ChatPage;
