import {
  type NavigationMenuPanelIcon,
  type NavigationMenuPanelListItem,
  OmniProductType,
  type ProductHubItem,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { zero } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import capitalize from 'lodash-es/capitalize'

import { networksByName } from '@/constants/networks-list-ssr'
import { getGenericPositionUrl } from '@/helpers/get-generic-position-url'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { type tNavType } from '@/messages/types'

export function mapFeaturedMultiplyProduct(
  items: ProductHubItem[],
  tNav: tNavType,
): NavigationMenuPanelListItem[] {
  return items.map((item) => {
    const { maxMultiply, network, primaryToken, protocol, secondaryToken } = item

    // TODO: this is just a workaround to get this function to work start
    const title = tNav(maxMultiply ? 'multiply-get-up-to' : 'multiply-exposure', {
      maxMultiply: new BigNumber(maxMultiply ?? zero).toFixed(2),
      collateralToken: primaryToken,
      debtToken: secondaryToken,
    })
    const description = tNav('increase-your-exposure-against', { token: secondaryToken })
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
      url: getGenericPositionUrl({
        ...item,
        product: [OmniProductType.Multiply],
      }),
    }
  })
}
