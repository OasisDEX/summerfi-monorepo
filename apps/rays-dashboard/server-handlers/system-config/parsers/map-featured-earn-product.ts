import { EarnStrategies } from '@summerfi/app-db'
import { NavigationMenuPanelIcon, TokenSymbolsList } from '@summerfi/app-ui'
import { capitalize } from 'lodash'

import { networksByName } from '@/constants/networks-list-ssr'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { NavigationMenuPanelListItem } from '@/types/navigation'
import { ProductHubItem } from '@/types/product-hub'

export function mapFeaturedEarnProduct(items: ProductHubItem[]): NavigationMenuPanelListItem[] {
  return items.map((item) => {
    const {
      earnStrategy,
      earnStrategyDescription,
      network,
      primaryToken,
      protocol,
      reverseTokens,
      secondaryToken,
      weeklyNetApy,
    } = item

    // TODO: this is just a workaround to get this function to work start
    const title = weeklyNetApy ? 'nav.earn-on-your' : 'nav.earn-on-your-simple'
    const description =
      earnStrategy === EarnStrategies.other
        ? 'nav.earn-on-other-strategy'
        : earnStrategy === EarnStrategies.yield_loop
          ? 'nav.earn-on-yield-loop-strategy'
          : 'nav.earn-on-generic-strategy'
    // TODO: this is just a workaround to get this function to work end

    return {
      title,
      description,
      icon: {
        tokens:
          primaryToken === secondaryToken
            ? ([primaryToken] as TokenSymbolsList[])
            : reverseTokens
              ? ([secondaryToken, primaryToken] as TokenSymbolsList[])
              : ([primaryToken, secondaryToken] as TokenSymbolsList[]),
        position: 'global' as NavigationMenuPanelIcon['position'],
      },
      tags: [
        [
          earnStrategy === EarnStrategies.erc_4626 && earnStrategyDescription
            ? earnStrategyDescription
            : lendingProtocolsByName[protocol as keyof typeof lendingProtocolsByName].label,
          lendingProtocolsByName[protocol as keyof typeof lendingProtocolsByName].name,
        ],
        [capitalize(network), networksByName[network].name],
      ],
      url: '/', // TODO: this is just a workaround to get this function to work
    }
  })
}
