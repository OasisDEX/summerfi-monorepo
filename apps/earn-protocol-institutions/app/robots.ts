import { type MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      // TODO: to adjust to institutions
      // disallow: ['/'],
    },
    sitemap: ['https://institutions.summer.fi/sitemap.xml'],
  }
}
