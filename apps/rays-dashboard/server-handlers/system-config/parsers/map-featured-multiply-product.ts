import { NavigationMenuPanelIcon, TokenSymbolsList } from '@summerfi/app-ui'
import { capitalize } from 'lodash'

import { networksByName } from '@/constants/networks-list-ssr'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { NavigationMenuPanelListItem } from '@/types/navigation'
import { ProductHubItem } from '@/types/product-hub'

export function mapFeaturedMultiplyProduct(items: ProductHubItem[]): NavigationMenuPanelListItem[] {
  return items.map((item) => {
    const { maxMultiply, network, primaryToken, protocol, secondaryToken } = item

    // TODO: this is just a workaround to get this function to work start
    const title = maxMultiply ? 'nav.multiply-get-up-to' : 'nav.multiply-exposure'
    const description = 'nav.increase-your-exposure-against'
    // TODO: this is just a workaround to get this function to work end

    return {
      title,
      description,
      icon: {
        tokens: [primaryToken, secondaryToken] as TokenSymbolsList[],
        position: 'global' as NavigationMenuPanelIcon['position'],
      },
      tags: [
        [
          lendingProtocolsByName[protocol as keyof typeof lendingProtocolsByName].label,
          lendingProtocolsByName[protocol as keyof typeof lendingProtocolsByName].name,
        ],
        [capitalize(network), networksByName[network].name],
      ],
      url: '/', // TODO: this is just a workaround to get this function to work
    }
  })
}
