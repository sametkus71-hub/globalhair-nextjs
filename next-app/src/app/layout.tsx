import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { GlobalVideoBackground } from '@/components/GlobalVideoBackground';
import { SplashLoader } from '@/components/SplashLoader';
import { BookingModalOverlay } from '@/components/booking/BookingModalOverlay';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'GlobalHair Institute - Specialist in élk haartype & haarprobleem',
    template: '%s | GlobalHair Institute',
  },
  description: 'Bereik het beste resultaat met onze unieke GHI Stemcell repair™ en V6 Hairboost®. Wij zijn gespecialiseerd in oplossingen voor elk haartype en elk haarprobleem.',
  icons: {
    icon: 'https://GlobalHair.b-cdn.net/globalhair%20favicon4.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <link rel="preconnect" href="https://GlobalHair.b-cdn.net" />
        <link rel="dns-prefetch" href="https://GlobalHair.b-cdn.net" />
        {/* Preload critical video assets */}
        <link rel="preload" as="video" href="https://GlobalHair.b-cdn.net/Bg%20Videos/D%20-%20Basic%20BG%20V0%20(1).webm" type="video/webm" media="(min-width: 769px)" />
        <link rel="preload" as="video" href="https://GlobalHair.b-cdn.net/Bg%20Videos/P%20-%20Basic%20BG%20V0%20compressed.webm" type="video/webm" media="(max-width: 768px)" />

        <SplashLoader />
        <GlobalVideoBackground />
        <Providers>
          <div id="main-content" className="relative transition-all duration-300 ease-out">
            {children}
          </div>
          <BookingModalOverlay />
        </Providers>
      </body>
    </html>
  );
}