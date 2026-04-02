import './globals.css';
import ThemeProvider from '@/context/ThemeProvider';
import GamificationProvider from '@/context/GamificationProvider';
import ToastProvider from '@/context/ToastProvider';
import AuthProvider from '@/context/AuthProvider';
import ThemeToggle from '@/components/ThemeToggle';
import BadgeToast from '@/components/BadgeToast';

export const metadata = {
  title: 'Anket & Veri Toplama Platformu',
  description: 'Modern anket ve veri toplama sistemi — sorular oluşturun, şıklar ekleyin, oy verin ve sonuçları keşfedin.',
  keywords: ['anket', 'survey', 'oylama', 'veri toplama', 'geri bildirim'],
  openGraph: {
    title: 'Anket & Veri Toplama Platformu',
    description: 'Anketler oluşturun, oy verin, sonuçları keşfedin!',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Anket Platformu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anket & Veri Toplama Platformu',
    description: 'Anketler oluşturun, oy verin, sonuçları keşfedin!',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta property="og:title" content="Anket & Veri Toplama Platformu" />
        <meta property="og:description" content="Anketler oluşturun, oy verin, sonuçları keşfedin!" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <GamificationProvider>
              <ToastProvider>
                <div className="noise" />
                <div className="app">
                  {children}
                </div>
                <ThemeToggle />
                <BadgeToast />
              </ToastProvider>
            </GamificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
