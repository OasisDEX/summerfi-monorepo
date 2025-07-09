import { type MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/earn/secure/'],
    },
    sitemap: ['https://summer.fi/earn/sitemap.xml'],
  }
}
