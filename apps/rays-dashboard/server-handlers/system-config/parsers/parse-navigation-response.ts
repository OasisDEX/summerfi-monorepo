import { NavigationMenuPanelType } from '@summerfi/app-ui'
import { getTranslations } from 'next-intl/server'

import { mapNavigationLinkItem } from '@/server-handlers/system-config/parsers/map-navigation-link-item'
import { NavigationResponse } from '@/types/navigation'
import { ProductHubData } from '@/types/product-hub'

interface ParseNavigationResponseParams {
  navigationResponse: NavigationResponse
  productHub: ProductHubData
  tNav: Awaited<ReturnType<typeof getTranslations>>
}

export function parseNavigationResponse({
  navigationResponse,
  productHub,
  tNav,
}: ParseNavigationResponseParams): NavigationMenuPanelType[] {
  return navigationResponse.data.navigation.listOfPanelsCollection.items.map((panel) => ({
    label: panel.label,
    lists: panel.listsOfLinksCollection.items.map((list) => ({
      ...(list.displayTitle && {
        header: list.title,
      }),
      items: mapNavigationLinkItem({ items: list.linksListCollection.items, productHub, tNav }),
      ...(list.link && {
        link: list.link,
      }),
      tight: list.tight,
    })),
  }))
}
