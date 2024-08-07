import {
  type NavigationMenuPanelType,
  type NavigationResponse,
  type ProductHubData,
} from '@summerfi/app-types'

import { type tNavType } from '@/messages/types'
import { mapNavigationLinkItem } from '@/server-handlers/system-config/parsers/map-navigation-link-item'

interface ParseNavigationResponseParams {
  navigationResponse: NavigationResponse
  productHub: ProductHubData
  tNav: tNavType
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
