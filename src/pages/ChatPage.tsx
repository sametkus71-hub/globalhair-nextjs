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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage, sessionId);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: response.answer || 'No response',
        source: response.source,
      }]);
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
      <MetaHead
        title={language === 'nl' ? 'Chat' : 'Chat'}
        description={language === 'nl' ? 'Chat met ons' : 'Chat with us'}
        language={language}
      />
      
      <div
        className="min-h-[var(--app-height)] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #040E15 0%, #333D46 100%)',
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
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-white/20 text-white'
                    : msg.error
                    ? 'bg-red-500/20 text-white'
                    : 'bg-white/10 text-white'
                }`}
                style={{
                  fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.source && (
                  <a
                    href={msg.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-white/80 hover:text-white underline"
                  >
                    {language === 'nl' ? 'Bron' : 'Source'}
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-4 py-3 bg-white/10"
                style={{
                  fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Loader2 className="animate-spin text-white/60" size={20} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="sticky bottom-0 p-4"
          style={{
            background: 'rgba(4, 14, 21, 0.8)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            className="flex items-end gap-2 rounded-2xl p-2"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'nl' ? 'Typ een bericht...' : 'Type a message...'}
              className="flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none px-2 py-2 max-h-32"
              style={{
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
              }}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl transition-all disabled:opacity-30"
              style={{
                background: input.trim() && !isLoading 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
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
