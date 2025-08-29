import { EarnStrategies } from '@summerfi/app-db'
import {
  type NavigationMenuPanelIcon,
  type NavigationMenuPanelListItem,
  OmniProductType,
  type ProductHubItem,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatDecimalAsPercent, zero } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import capitalize from 'lodash-es/capitalize'

import { networksByName } from '@/constants/networks-list-ssr'
import { getGenericPositionUrl } from '@/helpers/get-generic-position-url'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { type tNavType } from '@/messages/types'

export function mapFeaturedEarnProduct(
  items: ProductHubItem[],
  tNav: tNavType,
): NavigationMenuPanelListItem[] {
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
    const title = tNav(weeklyNetApy ? 'earn-on-your' : 'earn-on-your-simple', {
      token: primaryToken,
      apy: formatDecimalAsPercent(weeklyNetApy ? new BigNumber(weeklyNetApy) : zero),
    })
    const description = tNav(
      earnStrategy === EarnStrategies.other
        ? 'earn-on-other-strategy'
        : earnStrategy === EarnStrategies.yield_loop
          ? 'earn-on-yield-loop-strategy'
          : 'earn-on-generic-strategy',
      {
        earnStrategyDescription,
        protocol:
          lendingProtocolsByName[
            protocol as keyof typeof lendingProtocolsByName
          ].label.toUpperCase(),
        token: primaryToken,
      },
    )
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
      url: getGenericPositionUrl({
        ...item,
        product: [OmniProductType.Earn],
      }),
    }
  })
}
