import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Connect Auto',
    short_name: 'Connect Auto',
    description: 'Garage et véhicules d’occasion à Milhaud, près de Nîmes',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#11151B',
    theme_color: '#11151B',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
