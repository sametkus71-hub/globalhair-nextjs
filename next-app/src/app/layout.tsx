import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import { GlobalVideoBackground } from '@/components/GlobalVideoBackground';
import { SplashLoader } from '@/components/SplashLoader';
import { ViewportHeightSetter } from '@/components/ViewportHeightSetter';
import { CookieConsent } from '@/components/CookieConsent';
import { DevBadge } from '@/components/DevBadge';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zoom completely
  interactiveWidget: 'resizes-content', // Forces layout viewport to resize with keyboard
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

        {/* Instant Splash Screen Script & Style */}
        <style dangerouslySetInnerHTML={{
          __html: `
            #instant-splash {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #0C1B2A;
              z-index: 9999;
              transition: opacity 0.5s ease-out;
            }
            body.splash-seen #instant-splash {
              display: none;
            }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (sessionStorage.getItem('hasSeenSplash')) {
                document.body.classList.add('splash-seen');
              }
            } catch(e) {}
          `
        }} />

        <ViewportHeightSetter />
        <div id="instant-splash"></div>
        <SplashLoader />
        <GlobalVideoBackground />
        <Providers>
          <div id="main-content" className="relative transition-all duration-300 ease-out">
            {children}
          </div>
          <CookieConsent />
        </Providers>
        <DevBadge />
        <div id="portal-root" />
      </body>
    </html>
  );
}