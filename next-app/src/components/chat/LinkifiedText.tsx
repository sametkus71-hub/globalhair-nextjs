'use client';

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

export function LinkifiedText({ text, className }: LinkifiedTextProps) {
  // Regex to match URLs (http://, https://, www., and common TLDs)
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|nl|org|net|io|dev|ai|be|de|fr|uk|us)[^\s]*)/gi;
  
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;
  
  // Reset regex index
  urlRegex.lastIndex = 0;
  
  // Find all URLs in the text
  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the URL as a clickable link
    let url = match[0];
    // Add https:// if missing
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[rgba(100,180,255,0.9)] hover:text-[rgba(120,200,255,1)] underline cursor-pointer transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {match[0]}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <span className={className}>{parts.length > 0 ? parts : text}</span>;
}
