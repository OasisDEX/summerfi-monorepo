import { NavigationMenuPanelIcon, TokenSymbolsList } from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash'
import { getTranslations } from 'next-intl/server'

import { networksByName } from '@/constants/networks-list-ssr'
import { zero } from '@/helpers/formatters'
import { getGenericPositionUrl } from '@/helpers/get-generic-position-url'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { NavigationMenuPanelListItem } from '@/types/navigation'
import { OmniProductType } from '@/types/omni-kit'
import { ProductHubItem } from '@/types/product-hub'

export function mapFeaturedMultiplyProduct(
  items: ProductHubItem[],
  tNav: Awaited<ReturnType<typeof getTranslations<'nav'>>>,
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
        product: [OmniProductType.Earn],
      }),
    }
  })
}
