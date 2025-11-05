import type { Metadata } from 'next';
import { Space_Grotesk, Inter, Fira_Code } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Technology Radar',
  description: 'Create and share interactive technology radars',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
