/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-magic-numbers */
import { INTERNAL_LINKS } from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'

import { NavigationMenuPanelListItem } from '@/types/navigation'
import { ProductHubItem } from '@/types/product-hub'

const zero = new BigNumber(0)

export function mapTopTokens(token: string, rows: ProductHubItem[]): NavigationMenuPanelListItem[] {
  const tokenRows = rows.filter(
    ({ primaryToken }) => primaryToken.toUpperCase() === token.toUpperCase(),
  )

  const [topFee] = tokenRows
    .filter(({ fee }) => new BigNumber(fee ?? 0).gt(zero))
    .sort((a, b) => new BigNumber(a.fee ?? 0).minus(new BigNumber(b.fee ?? 0)).toNumber())

  const [topMultiple] = tokenRows
    .filter(({ maxMultiply }) => new BigNumber(maxMultiply ?? 0).gt(zero))
    .sort((a, b) =>
      new BigNumber(b.maxMultiply ?? 0).minus(new BigNumber(a.maxMultiply ?? 0)).toNumber(),
    )

  const [topApyActive] = tokenRows
    .filter(
      ({ managementType, weeklyNetApy }) =>
        managementType === 'active' && new BigNumber(weeklyNetApy ?? 0).gt(zero),
    )
    .sort((a, b) =>
      new BigNumber(b.weeklyNetApy ?? 0).minus(new BigNumber(a.weeklyNetApy ?? 0)).toNumber(),
    )

  const [topApyPassive] = tokenRows
    .filter(
      ({ managementType, weeklyNetApy }) =>
        managementType === 'passive' && new BigNumber(weeklyNetApy ?? 0).gt(zero),
    )
    .sort((a, b) =>
      new BigNumber(b.weeklyNetApy ?? 0).minus(new BigNumber(a.weeklyNetApy ?? 0)).toNumber(),
    )

  return [
    ...(topApyActive || topApyPassive
      ? [
          {
            title: 'nav.earn', // TODO: this is just a workaround to get this function to work start
            url: `${INTERNAL_LINKS.earn}?deposit-token=${token}`,
            description:
              topApyActive && topApyPassive // TODO: this is just a workaround to get this function to work start
                ? 'nav.tokens-earn'
                : topApyActive
                  ? 'nav.tokens-earn-active'
                  : 'nav.tokens-earn-passive',
          },
        ]
      : []),
    ...(topMultiple
      ? [
          {
            title: 'nav.multiply', // TODO: this is just a workaround to get this function to work start
            description: 'nav.tokens-multiply', // TODO: this is just a workaround to get this function to work start
            url: `${INTERNAL_LINKS.multiply}?collateral-token=${token}`,
          },
        ]
      : []),
    ...(topFee
      ? [
          {
            title: 'nav.borrow', // TODO: this is just a workaround to get this function to work start
            description: 'nav.tokens-borrow', // TODO: this is just a workaround to get this function to work start
            url: `${INTERNAL_LINKS.borrow}?collateral-token=${token}`,
          },
        ]
      : []),
  ]
}
