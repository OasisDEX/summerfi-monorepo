/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { filterFeaturedProducts } from '@/server-handlers/system-config/parsers/filter-featured-products'
import { mapFeaturedEarnProduct } from '@/server-handlers/system-config/parsers/map-featured-earn-product'
import { mapFeaturedMultiplyProduct } from '@/server-handlers/system-config/parsers/map-featured-multiply-product'
import { mapFeaturedProductToFilterCriteria } from '@/server-handlers/system-config/parsers/map-featured-product-to-filter-criteria'
import { mapTopBorrowProduct } from '@/server-handlers/system-config/parsers/map-top-borrow-product'
import { mapTopTokens } from '@/server-handlers/system-config/parsers/map-top-tokens'
import { NavigationLinkTypes, NavigationMenuPanelListItem } from '@/types/navigation'
import { OmniProductType } from '@/types/omni-kit'
import { ProductHubData } from '@/types/product-hub'

interface MapNavigationLinkItemParams {
  items: NavigationLinkTypes[]
  productHub: ProductHubData
}

export function mapNavigationLinkItem({
  items,
  productHub,
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
            hoverColor: lendingProtocolsByName[protocol.slug].gradient,
            icon: {
              image: lendingProtocolsByName[protocol.slug].icon,
              position: 'title',
            },
          }),
          ...(token && {
            icon: {
              tokens: [token],
              position: 'title',
            },
          }),
          ...(link && { url: link }),
          ...(featureFlag && { featureFlag }),
          ...('nestedLinks' in item &&
            item.nestedLinks && {
              list: {
                ...(item.nestedLinks.displayTitle && {
                  header: item.nestedLinks.title,
                }),
                items: mapNavigationLinkItem({
                  items: item.nestedLinks.linksListCollection.items,
                  productHub,
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
            return mapFeaturedMultiplyProduct(filteredProducts)
          }
          case OmniProductType.Earn: {
            return mapFeaturedEarnProduct(filteredProducts)
          }
        }

        return [] as NavigationMenuPanelListItem[]
      }
      case 'NavigationTopProducts': {
        switch (item.product.slug) {
          case OmniProductType.Borrow: {
            return mapTopBorrowProduct(productHub.table)
          }
        }

        return [] as NavigationMenuPanelListItem[]
      }
      case 'NavigationTopToken': {
        return mapTopTokens(item.token, productHub.table)
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
