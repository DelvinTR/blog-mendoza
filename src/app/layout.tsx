import type { Metadata } from 'next';
import { Righteous, Inter } from 'next/font/google';
import './globals.css';

const righteous = Righteous({ weight: '400', subsets: ['latin'], variable: '--font-righteous' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Vintage Travel Blog',
  description: 'A retro 70s inspired travel blog.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${righteous.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
