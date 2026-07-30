import type { Metadata } from 'next';
import './globals.css';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'RANDY — Creative Studio & Personal Portfolio',
  description:
    'Interactive fluid masking hero section and scroll-driven agency portfolio with GSAP animations & WebGL graphics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-yellow-400 selection:text-black">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
