import {
  type NavigationLinkTypes,
  type NavigationMenuPanelListItem,
  OmniProductType,
  type ProductHubData,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { type getTranslations } from 'next-intl/server'

import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { filterFeaturedProducts } from '@/server-handlers/system-config/parsers/filter-featured-products'
import { mapFeaturedEarnProduct } from '@/server-handlers/system-config/parsers/map-featured-earn-product'
import { mapFeaturedMultiplyProduct } from '@/server-handlers/system-config/parsers/map-featured-multiply-product'
import { mapFeaturedProductToFilterCriteria } from '@/server-handlers/system-config/parsers/map-featured-product-to-filter-criteria'
import { mapTopBorrowProduct } from '@/server-handlers/system-config/parsers/map-top-borrow-product'
import { mapTopTokens } from '@/server-handlers/system-config/parsers/map-top-tokens'

interface MapNavigationLinkItemParams {
  items: NavigationLinkTypes[]
  productHub: ProductHubData
  tNav: Awaited<ReturnType<typeof getTranslations<'nav'>>>
}

export function mapNavigationLinkItem({
  items,
  productHub,
  tNav,
}: MapNavigationLinkItemParams): NavigationMenuPanelListItem[] {
  // eslint-disable-next-line consistent-return, array-callback-return
  return items.flatMap((item) => {
    switch (item.__typename) {
      case 'NavigationLink': {
        const { description, featureFlag, label, link, protocol, star, token } = item

        return {
          title: label,
          description,
          promoted: star,
          ...(protocol && {
            protocolName: protocol.slug,
            icon: {
              image: lendingProtocolsByName[protocol.slug].icon,
              position: 'title',
            },
          }),
          ...(token && {
            icon: {
              tokens: [token] as TokenSymbolsList[],
              position: 'title',
            },
          }),
          ...(link && { url: link }),
          ...(featureFlag && { featureFlag }),
          ...('nestedLinks' in item &&
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            item.nestedLinks && {
              list: {
                ...(item.nestedLinks.displayTitle && {
                  header: item.nestedLinks.title,
                }),
                items: mapNavigationLinkItem({
                  items: item.nestedLinks.linksListCollection.items,
                  productHub,
                  tNav,
                }),
                ...(item.nestedLinks.link && {
                  link: item.nestedLinks.link,
                }),
                tight: item.nestedLinks.tight,
              },
            }),
        }
      }
      case 'FeaturedProduct': {
        const filteredProducts = filterFeaturedProducts({
          filters: {
            products: [mapFeaturedProductToFilterCriteria(item)],
          },
          rows: productHub.table,
        })

        switch (item.product.slug) {
          case OmniProductType.Multiply: {
            return mapFeaturedMultiplyProduct(filteredProducts, tNav)
          }
          case OmniProductType.Earn: {
            return mapFeaturedEarnProduct(filteredProducts, tNav)
          }
        }

        return [] as NavigationMenuPanelListItem[]
      }
      case 'NavigationTopProducts': {
        switch (item.product.slug) {
          case OmniProductType.Borrow: {
            return mapTopBorrowProduct(productHub.table, tNav)
          }
        }

        return [] as NavigationMenuPanelListItem[]
      }
      case 'NavigationTopToken': {
        return mapTopTokens(item.token, productHub.table, tNav)
      }
      case 'NavigationSpecialModule': {
        return {
          title: 'Navigation module',
          navigationModule: item.moduleName[0],
        }
      }
    }
  })
}
