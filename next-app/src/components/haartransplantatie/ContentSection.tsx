import { ReactNode } from 'react';

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const ContentSection = ({ children, className = '', id }: ContentSectionProps) => {
  return (
    <section 
      id={id}
      className={`min-h-screen w-full relative ${className}`}
    >
      {children}
    </section>
  );
};