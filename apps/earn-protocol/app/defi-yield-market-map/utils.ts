import { DYM_CATEGORIES } from '@/app/defi-yield-market-map/constants'
import { type DYMProtocolItem } from '@/app/defi-yield-market-map/types'

export function dymGetInitials(label: string): string {
  const words = label.split(/[\s-]+/u)

  return words.length > 1
    ? words
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : label.slice(0, 2).toUpperCase()
}

export function dymFindProtocolItem(slug: string): DYMProtocolItem | undefined {
  for (const cat of DYM_CATEGORIES) {
    for (const sub of cat.subcategories) {
      const found = sub.items.find((p) => p.slug === slug)

      if (found) return found
    }
  }

  return undefined
}
