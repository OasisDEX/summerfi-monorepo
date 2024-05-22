import { EarnStrategies } from '@summerfi/app-db'
import { capitalize } from 'lodash'

import { networksByName } from '@/constants/networks-list'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { NavigationMenuPanelIcon, NavigationMenuPanelListItem } from '@/types/navigation'
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
            ? [primaryToken]
            : reverseTokens
              ? [secondaryToken, primaryToken]
              : [primaryToken, secondaryToken],
        position: 'global' as NavigationMenuPanelIcon['position'],
      },
      tags: [
        [
          earnStrategy === EarnStrategies.erc_4626 && earnStrategyDescription
            ? earnStrategyDescription
            : lendingProtocolsByName[protocol as keyof typeof lendingProtocolsByName].label,
          lendingProtocolsByName[protocol as keyof typeof lendingProtocolsByName].gradient,
        ],
        [capitalize(network), networksByName[network].gradient],
      ],
      url: '/', // TODO: this is just a workaround to get this function to work
    }
  })
}
