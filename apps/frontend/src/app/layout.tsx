import type { Metadata } from 'next';
import { Geist, Geist_Mono, Parisienne } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const parisienne = Parisienne({
  variable: '--font-parisienne',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Trip Itinerary',
  description: 'Trip Itinerary',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parisienne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
