import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import { GlobalVideoBackground } from '@/components/GlobalVideoBackground';
import { SplashLoader } from '@/components/SplashLoader';
import { CookieConsent } from '@/components/CookieConsent';

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
  metadataBase: new URL('https://globalhair.institute'),
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* Meta Pixel Script */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1605900147237994');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1605900147237994&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

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
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}