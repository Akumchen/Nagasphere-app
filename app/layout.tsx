
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'NagaSphere - Nagaland Local Marketplace',
    template: '%s | NagaSphere',
  },
  description:
    'Discover products, services and local businesses across Nagaland. What you need. Someone here has it.',
  applicationName: 'NagaSphere',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'NagaSphere',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#173c2a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
