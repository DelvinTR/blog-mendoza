import type { Metadata } from 'next';
import { Righteous, Inter, Playfair_Display, Caveat, Shadows_Into_Light_Two } from 'next/font/google';
import './globals.css';

const righteous = Righteous({ weight: '400', subsets: ['latin'], variable: '--font-righteous' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300', '400', '500', '600', '700'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
});
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700'],
});
const shadowsIntoLight = Shadows_Into_Light_Two({
  subsets: ['latin'],
  variable: '--font-shadows',
  weight: '400',
});

export const metadata: Metadata = {
  title: "Vinot's Blog — Voyages & Aventures Vintage",
  description: 'Explorez le monde à travers des récits authentiques, des photos captivantes et des aventures inspirantes. Un blog de voyage vintage et cinématique.',
  keywords: 'voyage, blog, vintage, aventure, photographie, récits de voyage',
  authors: [{ name: 'Vinot' }],
  openGraph: {
    title: "Vinot's Blog — Voyages & Aventures Vintage",
    description: 'Voyages authentiques, photos captivantes, aventures inspirantes.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${righteous.variable} ${inter.variable} ${playfair.variable} ${caveat.variable} ${shadowsIntoLight.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
