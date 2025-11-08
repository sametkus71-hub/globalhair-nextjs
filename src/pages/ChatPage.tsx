import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { X, Send, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';
import { usePopupClose } from '@/components/PopupCloseButton';
import { DesktopContainer } from '@/components/layout/DesktopContainer';

enum ConversationState {
  GREETING = 'greeting',
  ASKING_SUBJECT = 'asking_subject',
  SHOWING_OPTIONS = 'showing_options',
  ASKING_CUSTOM_QUESTION = 'asking_custom_question',
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

// Question pool for dynamic starting questions
const STARTING_QUESTIONS = [
  // General + Trust
  'Hoe werkt een haartransplantatie bij jullie?',
  'Hoe ziet het stappenplan eruit van intake tot nazorg?',
  'Hoe waarborgen jullie veiligheid & kwaliteit?',
  
  // Personal Fit
  'Past een haartransplantatie bij mijn situatie?',
  'Kan ik voorbeelden zien die lijken op mijn haarlijn?',
  
  // Packages & Pricing
  'Welk pakket past het beste bij mij?',
  'Wat zijn de kosten en welke factoren bepalen de prijs?',
  'Wat is het verschil tussen behandeling in Nederland en Istanbul?',
  
  // Comfort & Medical
  'Hoe lang duurt het herstel?',
  'Doet een haartransplantatie pijn? Wat kan ik verwachten?',
  
  // Practical / Conversion
  'Wat is de wachttijd?',
  'Kan ik een consult inplannen?',
];

const FIXED_QUESTION = 'Ik heb een andere vraag';

// Helper function to get random questions from the pool
function getRandomQuestions(pool: string[], count: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Helper function to calculate intelligent character delays for ultra-smooth streaming
function getCharacterDelay(
  char: string,
  totalLength: number,
  currentIndex: number
): number {
  const baseDelay = 15; // Base typing speed (60-70 WPM human average)
  const variance = Math.random() * 8; // Natural variance
  
  // Adaptive speed based on message length
  let speedMultiplier = 1;
  if (totalLength <= 50) speedMultiplier = 1.8;       // Very short: slower
  else if (totalLength <= 120) speedMultiplier = 1.4; // Short: slightly slower
  else if (totalLength <= 300) speedMultiplier = 1.1; // Medium: barely slower
  // Long messages: normal speed
  
  const adjustedBase = baseDelay * speedMultiplier;
  
  // Punctuation-based natural pauses
  if (char.match(/[.!?]/)) return 250 + variance; // End of sentence
  if (char.match(/[,;:]/)) return 150 + variance;  // Clause break
  if (char === '\n') return 200 + variance;        // Line break
  if (char === ' ') return adjustedBase - 3 + variance; // Spaces are quick
  
  return adjustedBase + variance;
}

// Helper function to stream static text character by character for ultra-smooth animation
async function streamStaticText(
  text: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  // Initial delay to let bubble settle in
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const chars = text.split('');
  let accumulatedText = '';
  
  for (let i = 0; i < chars.length; i++) {
    const currentChar = chars[i];
    accumulatedText += currentChar;
    onChunk(accumulatedText);
    
    if (i < chars.length - 1) {
      const delay = getCharacterDelay(currentChar, text.length, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function sendMessageStreaming(
  message: string, 
  sessionId: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const url = 'https://radux.app.n8n.cloud/webhook/438ccf83-5a80-4605-8195-a586e4e03c34/chat?action=sendMessage';
  
  try {
    // Initial delay before streaming starts
    await new Promise(resolve => setTimeout(resolve, 250));
    
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
      // Stream character by character for ultra-smooth animation
      const chars = content.split('');
      let accumulatedText = '';
      
      for (let i = 0; i < chars.length; i++) {
        const currentChar = chars[i];
        
        accumulatedText += currentChar;
        onChunk(accumulatedText);
        
        // Intelligent delay based on character and message length
        if (i < chars.length - 1) {
          const delay = getCharacterDelay(currentChar, content.length, i);
          await new Promise(resolve => setTimeout(resolve, delay));
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

  // Aggressive layout locking for mobile keyboard
  useLayoutEffect(() => {
    // Lock body - prevent scrolling but don't fix position
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.maxHeight = '100vh';
    
    // Lock HTML element too
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.maxHeight = '100vh';
    
    // Prevent browser scroll restoration
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Prevent touch scrolling except in messages container
    const preventScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.messages-container')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.maxHeight = '';
      
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.maxHeight = '';
      
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

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

    /* Shine effect for subject buttons */
    @keyframes shine {
      0% {
        background-position: -200% center;
      }
      100% {
        background-position: 200% center;
      }
    }

    .subject-button {
      position: relative;
      overflow: hidden;
      background: linear-gradient(
        135deg, 
        rgba(255, 255, 255, 0.04) 0%, 
        rgba(255, 255, 255, 0.08) 50%, 
        rgba(255, 255, 255, 0.04) 100%
      );
      background-size: 200% 100%;
      animation: shine 4s ease-in-out infinite;
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .subject-button:hover {
      background: linear-gradient(
        135deg, 
        rgba(255, 255, 255, 0.08) 0%, 
        rgba(255, 255, 255, 0.12) 50%, 
        rgba(255, 255, 255, 0.08) 100%
      );
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .subject-button:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
  const [customQuestion, setCustomQuestion] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [showInputField, setShowInputField] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>([]);
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

  // Cleanup interrupted streaming state on mount (e.g., after page reload)
  useEffect(() => {
    // Only run cleanup if we have messages that might be stuck
    if (messages.length > 0) {
      // Always reset loading state on mount
      setIsLoading(false);
      
      // Clean up any messages stuck in streaming state
      setMessages(prev => 
        prev.map(msg => 
          msg.isStreaming ? { ...msg, isStreaming: false } : msg
        )
      );
      
      console.log('[Chat] Cleaned up interrupted streaming state on mount');
    }
  }, []); // Empty deps = run once on mount

  // Aggressive layout locking for mobile keyboard
  useLayoutEffect(() => {
    // Lock body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100vh';
    document.body.style.maxHeight = '100vh';
    document.body.style.top = '0';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.bottom = '0';
    
    // Lock HTML element
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.maxHeight = '100vh';
    
    // Prevent browser scroll restoration
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Prevent touch scrolling except in messages container and interactive elements
    const preventScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Allow touches on:
      // 1. Messages container (for scrolling)
      // 2. Input/textarea elements (for typing)
      // 3. Buttons (for clicking)
      // 4. Chat input wrapper (the bottom input area)
      const isInteractiveElement = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'BUTTON' ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('button') ||
        target.closest('.chat-input-wrapper'); // Allow the entire input area
      
      const isInMessagesContainer = target.closest('.messages-container');
      
      // Only prevent if NOT in messages container AND NOT an interactive element
      if (!isInMessagesContainer && !isInteractiveElement) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.maxHeight = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
      
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.maxHeight = '';
      
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    const savedName = localStorage.getItem('chat-user-name');
    const savedState = localStorage.getItem('chat-conversation-state');
    const savedSubject = localStorage.getItem('chat-selected-subject');
    const savedQuestions = localStorage.getItem('chat-displayed-questions');
    
    if (savedName) {
      setUserName(savedName);
    }
    
    if (savedState) {
      setConversationState(savedState as ConversationState);
    }
    
    if (savedSubject) {
      setSelectedSubject(savedSubject);
    }

    // Load or generate random questions
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        setDisplayedQuestions(parsed);
      } catch (e) {
        console.error('Failed to parse saved questions:', e);
        // Generate new questions if parsing fails
        const randomQuestions = getRandomQuestions(STARTING_QUESTIONS, 2);
        setDisplayedQuestions([...randomQuestions, FIXED_QUESTION]);
      }
    } else {
      // Generate new random questions on first load
      const randomQuestions = getRandomQuestions(STARTING_QUESTIONS, 2);
      setDisplayedQuestions([...randomQuestions, FIXED_QUESTION]);
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

  // Persist displayed questions to localStorage
  useEffect(() => {
    if (displayedQuestions.length > 0) {
      localStorage.setItem('chat-displayed-questions', JSON.stringify(displayedQuestions));
    }
  }, [displayedQuestions]);

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

  const startConversationFlow = async () => {
    preloadTimeoutsRef.current.forEach(clearTimeout);
    preloadTimeoutsRef.current = [];
    
    // State 1: GREETING - with streaming
    const greetingMessage: Message = {
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      senderLabel: 'GlobalHair bot',
      isStreaming: true
    };
    
    setMessages([greetingMessage]);
    
    // Stream the greeting text
    await streamStaticText(
      'Hallo, ik ben je persoonlijke assistent - hier om al je vragen over haartransplantatie te beantwoorden.',
      (chunk) => {
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === 0 ? { ...msg, content: chunk } : msg
          )
        );
      }
    );
    
    // Mark greeting as complete
    setMessages(prev => 
      prev.map((msg, idx) => 
        idx === 0 ? { ...msg, isStreaming: false } : msg
      )
    );
    
    // Transition to ASKING_SUBJECT after 800ms
    const timeout1 = window.setTimeout(async () => {
      setConversationState(ConversationState.ASKING_SUBJECT);
      
      const askSubjectMessage: Message = {
        role: 'bot',
        content: '',
        timestamp: new Date().toISOString(),
        senderLabel: 'GlobalHair bot',
        isStreaming: true
      };
      
      setMessages(prev => [...prev, askSubjectMessage]);
      
      // Stream the question
      await streamStaticText(
        'Waar kan ik je vandaag mee helpen?',
        (chunk) => {
          setMessages(prev => 
            prev.map((msg, idx) => 
              idx === prev.length - 1 ? { ...msg, content: chunk } : msg
            )
          );
        }
      );
      
      // Mark as complete
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, isStreaming: false } : msg
        )
      );
      
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
    setShowInputField(false); // Reset input visibility
    
    // Special handling for "Ik heb een andere vraag"
    if (subject === 'Ik heb een andere vraag') {
      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: subject,
        timestamp: new Date().toISOString(),
        senderLabel: userName || 'Jij'
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Add streaming message IMMEDIATELY (before state change)
      const askQuestionMessage: Message = {
        role: 'bot',
        content: '',
        timestamp: new Date().toISOString(),
        senderLabel: 'GlobalHair bot',
        isStreaming: true
      };
      
      setMessages(prev => [...prev, askQuestionMessage]);
      
      // Transition to ASKING_CUSTOM_QUESTION state AFTER adding streaming message
      setConversationState(ConversationState.ASKING_CUSTOM_QUESTION);
      
      // Ask for the custom question with streaming
      setTimeout(async () => {
        await streamStaticText(
          'Waar zou je meer over willen weten?',
          (chunk) => {
            setMessages(prev => 
              prev.map((msg, idx) => 
                idx === prev.length - 1 ? { ...msg, content: chunk } : msg
              )
            );
          }
        );
        
        // Mark as complete
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === prev.length - 1 ? { ...msg, isStreaming: false } : msg
          )
        );
        
        // Add breathing time before showing input
        setTimeout(() => {
          setShowInputField(true);
        }, 600);
      }, 800);
      return;
    }
    
    // For other options, continue with the existing flow
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: subject,
      timestamp: new Date().toISOString(),
      senderLabel: userName || 'Jij'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add streaming message IMMEDIATELY (before state change)
    const askNameMessage: Message = {
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      senderLabel: 'GlobalHair bot',
      isStreaming: true
    };
    
    setMessages(prev => [...prev, askNameMessage]);
    
    // Transition to ASKING_NAME state AFTER adding streaming message
    setConversationState(ConversationState.ASKING_NAME);
    
    // Ask for name with streaming
    setTimeout(async () => {
      // Stream the question
      await streamStaticText(
        'Voordat we verder gaan, mag ik je naam weten?',
        (chunk) => {
          setMessages(prev => 
            prev.map((msg, idx) => 
              idx === prev.length - 1 ? { ...msg, content: chunk } : msg
            )
          );
        }
      );
      
      // Mark as complete
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, isStreaming: false } : msg
        )
      );
      
      // Add breathing time before showing input
      setTimeout(() => {
        setShowInputField(true);
      }, 600);
    }, 800);
  };

  const handleCustomQuestionSubmit = () => {
    if (!customQuestion.trim()) return;
    
    setShowInputField(false); // Reset input visibility
    const question = customQuestion.trim();
    
    // Add user's custom question as a message
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
      senderLabel: userName || 'Jij'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Update selectedSubject to include the custom question
    setSelectedSubject(`Ik heb een andere vraag: ${question}`);
    setCustomQuestion('');
    
    // Add streaming message IMMEDIATELY (before state change)
    const askNameMessage: Message = {
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      senderLabel: 'GlobalHair bot',
      isStreaming: true
    };
    
    setMessages(prev => [...prev, askNameMessage]);
    
    // Now ask for name AFTER adding streaming message
    setConversationState(ConversationState.ASKING_NAME);
    
    setTimeout(async () => {
      await streamStaticText(
        'Voordat we verder gaan, mag ik je naam weten?',
        (chunk) => {
          setMessages(prev => 
            prev.map((msg, idx) => 
              idx === prev.length - 1 ? { ...msg, content: chunk } : msg
            )
          );
        }
      );
      
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, isStreaming: false } : msg
        )
      );
      
      // Add breathing time before showing input
      setTimeout(() => {
        setShowInputField(true);
      }, 600);
    }, 800);
  };

  const handleCustomQuestionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomQuestionSubmit();
    }
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
    
    // Focus the textarea after webhook completes and state settles
    setTimeout(() => {
      if (conversationState === ConversationState.ACTIVE_CHAT && textareaRef.current) {
        textareaRef.current.focus();
        console.log('[Chat] Focused textarea after name submission and webhook');
      }
    }, 200);
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
    
    // Wait for state to update and DOM to settle before focusing
    setTimeout(() => {
      if (conversationState === ConversationState.ACTIVE_CHAT && textareaRef.current) {
        textareaRef.current.focus();
        console.log('[Chat] Refocused input after message send');
      }
    }, 200); // Increased delay to ensure DOM is ready
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

  // Helper function to check if we should show the sender label
  const shouldShowSenderLabel = (currentIndex: number, messages: Message[]): boolean => {
    if (currentIndex === 0) return true; // Always show on first message
    
    const currentMsg = messages[currentIndex];
    const previousMsg = messages[currentIndex - 1];
    
    // Hide label if both current and previous are bot messages
    if (currentMsg.role === 'bot' && previousMsg.role === 'bot') {
      return false;
    }
    
    return true;
  };

  // Check if any message is currently streaming
  const isAnyMessageStreaming = messages.some(msg => msg.isStreaming === true);

  return (
    <>
      <style>{chatInputStyles}</style>
      <MetaHead
        title={language === 'nl' ? 'Chat' : 'Chat'}
        description={language === 'nl' ? 'Chat met ons' : 'Chat with us'}
        language={language}
      />
      
      <div
        className={`chat-page reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          width: '100vw',
          maxWidth: '100vw',
          zIndex: 50
        }}
      >
        <DesktopContainer>
          {/* Header with Logo and Close Button */}
          <div 
            className="fixed top-0 left-0 right-0 lg:left-auto lg:right-auto lg:max-w-[500px] lg:mx-auto transition-all duration-500" 
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
            className="chat-root h-[100vh] flex flex-col relative"
            style={{
              maxHeight: '100vh',
              scrollSnapType: 'none',
              zIndex: 2,
            }}
          >
            {/* Messages */}
            <div 
              className="messages-container flex-1 overflow-y-auto px-4 pt-24 pb-48 space-y-4 hide-scrollbar"
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
                {msg.senderLabel && shouldShowSenderLabel(idx, messages) && (
                  <span 
                    className="text-[10px] mb-0.5 px-1"
                    style={{
                      color: 'rgba(255, 255, 255, 0.35)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: '300',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {msg.senderLabel}
                  </span>
                )}
                
                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] px-4 py-3 ${msg.role === 'user' ? 'silver-gradient-border' : ''}`}
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(234, 234, 234, 0.18) 0%, rgba(234, 234, 234, 0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(44, 54, 62, 0.5) 0%, rgba(44, 54, 62, 0.3) 100%)',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    boxShadow: msg.role === 'user' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '160%',
                    letterSpacing: '-0.04em',
                    position: 'relative',
                  }}
                >
                  <p 
                    className="whitespace-pre-wrap"
                    style={{
                      color: msg.role === 'user' ? 'rgb(255, 255, 255)' : 'rgb(220, 220, 220)',
                    }}
                  >
                    <span style={{
                      transition: 'opacity 0.08s ease-out',
                      opacity: 1
                    }}>
                      {msg.content}
                    </span>
                    {msg.isStreaming && (
                      <span 
                        className="inline-block ml-0.5 w-0.5 h-4"
                        style={{ 
                          verticalAlign: 'middle',
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          animation: 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                          transition: 'transform 0.05s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} 
                      />
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
              <div className="flex flex-col gap-2 mt-4 items-end">
                {displayedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubjectClick(question)}
                    className="subject-button text-left"
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '5px',
                      padding: '7px 12px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                      maxWidth: '70%',
                      cursor: 'pointer',
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Custom Question Input */}
            {conversationState === ConversationState.ASKING_CUSTOM_QUESTION && !isAnyMessageStreaming && showInputField && (
              <div className="flex flex-col gap-2 mt-4 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    onKeyDown={handleCustomQuestionKeyDown}
                    placeholder="Typ je vraag..."
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none px-4 py-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '15px',
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleCustomQuestionSubmit}
                    disabled={!customQuestion.trim()}
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

            {/* Name Input */}
            {conversationState === ConversationState.ASKING_NAME && !isAnyMessageStreaming && showInputField && (
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
                className="fixed left-0 right-0 lg:left-auto lg:right-auto lg:max-w-[500px] lg:mx-auto"
                style={{
                  bottom: 'max(env(safe-area-inset-bottom, 0px), 100px)',
                  padding: '1rem 0.5rem 1.5rem 0.5rem',
                  zIndex: 50,
                  maxHeight: '30vh',
                  backgroundColor: 'transparent',
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
                    className="flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none border-none px-2 max-h-32 hide-scrollbar"
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
        </DesktopContainer>
      </div>
    </>
  );
};

export default ChatPage;
