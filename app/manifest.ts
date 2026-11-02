import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'NagaSphere - Nagaland Local Marketplace',
    short_name: 'NagaSphere',
    description:
      'Discover products, services and local businesses across Nagaland.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#102d20',
    theme_color: '#173c2a',
    icons: [
      {
        src: '/nagasphere-logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
