import { useState, useRef, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowLeft, Send, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // Add styles for gradient borders
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
  `;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Preload conversation on every visit
  useEffect(() => {
    const preloadedMessages: Message[] = [
      { role: 'bot', content: 'Hallo 👋, welkom bij GlobalHair Institute.' },
      { role: 'bot', content: 'Ik ben je persoonlijke assistent — hier om al je vragen over haartransplantatie te beantwoorden.' }
    ];

    let index = 0;
    const displayNextMessage = () => {
      if (index < preloadedMessages.length) {
        setMessages(prev => [...prev, preloadedMessages[index]]);
        index++;
        const delay = 700 + Math.random() * 200; // 700-900ms
        setTimeout(displayNextMessage, delay);
      } else {
        setShowOptions(true);
      }
    };
    
    displayNextMessage();
  }, []);

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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
      
      <div
        className="min-h-[var(--app-height)] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #040E15 0%, #333D46 100%)',
          scrollSnapType: 'none',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center px-4 py-3"
          style={{
            background: 'rgba(4, 14, 21, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1
            className="flex-1 text-center text-white text-lg font-medium pr-10"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            {language === 'nl' ? 'Chat' : 'Chat'}
          </h1>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto px-4 py-6 pb-28 space-y-4"
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
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div
                  className="max-w-[80%] px-4 py-3 silver-gradient-border"
                  style={{
                    background: 'linear-gradient(100deg, rgba(44, 54, 62, 0.03) 0%, rgba(234, 234, 234, 0.15) 50%, rgba(44, 54, 62, 0.03) 100%)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    borderRadius: '12px',
                    position: 'relative',
                  }}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div
                  className="max-w-[80%] px-4 py-3"
                  style={{
                    background: 'rgba(44, 54, 62, 0.4)',
                    borderRadius: '12px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  <p 
                    className="whitespace-pre-wrap"
                    style={{
                      color: '#CBCBCB',
                    }}
                  >
                    {msg.content}
                  </p>
                  {msg.source && typeof msg.source === 'string' && msg.source.startsWith('http') && (
                    <a
                      href={msg.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-white/70 hover:text-white/90 underline"
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
              <Loader2 className="animate-spin text-white/60" size={20} />
            </div>
          )}

          {showOptions && (
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => handleOptionClick('Vertel me meer over de werkwijze')}
                className="silver-gradient-border text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  backdropFilter: 'blur(10px)',
                  transition: 'background 0.3s',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                🧠 Vertel me meer over de werkwijze
              </button>
              <button
                onClick={() => handleOptionClick('Help me het juiste pakket kiezen')}
                className="silver-gradient-border text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  backdropFilter: 'blur(10px)',
                  transition: 'background 0.3s',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                💬 Help me het juiste pakket kiezen
              </button>
              <button
                onClick={() => handleOptionClick('Ik heb een andere vraag')}
                className="silver-gradient-border text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  backdropFilter: 'blur(10px)',
                  transition: 'background 0.3s',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                ❓ Ik heb een andere vraag
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
              className="flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none px-2 max-h-32"
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
    </>
  );
};

export default ChatPage;
