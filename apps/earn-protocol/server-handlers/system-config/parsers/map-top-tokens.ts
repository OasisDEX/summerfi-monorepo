/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { type NavigationMenuPanelListItem, type ProductHubItem } from '@summerfi/app-types'
import { INTERNAL_LINKS } from '@summerfi/app-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { type tNavType } from '@/messages/types'

const zero = new BigNumber(0)

export function mapTopTokens(
  token: string,
  rows: ProductHubItem[],
  tNav: tNavType,
): NavigationMenuPanelListItem[] {
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
            title: tNav('earn'), // TODO: this is just a workaround to get this function to work start
            url: `${INTERNAL_LINKS.earn}?deposit-token=${token}`,
            description: tNav.rich(
              topApyActive && topApyPassive
                ? 'tokens-earn'
                : topApyActive
                  ? 'tokens-earn-active'
                  : 'tokens-earn-passive',
              {
                token,
                apyActive: formatDecimalAsPercent(new BigNumber(topApyActive?.weeklyNetApy ?? 0)),
                apyPassive: formatDecimalAsPercent(new BigNumber(topApyPassive?.weeklyNetApy ?? 0)),
                em: (chunks) => `<em>${chunks}</em>`,
              },
            ),
          },
        ]
      : []),
    ...(topMultiple
      ? [
          {
            title: tNav('multiply'), // TODO: this is just a workaround to get this function to work start
            description: tNav.rich('tokens-multiply', {
              token,
              maxMultiple: new BigNumber(topMultiple.maxMultiply ?? 0).toFixed(2),
              em: (chunks) => `<em>${chunks}</em>`,
            }), // TODO: this is just a workaround to get this function to work start
            url: `${INTERNAL_LINKS.multiply}?collateral-token=${token}`,
          },
        ]
      : []),
    ...(topFee
      ? [
          {
            title: tNav('borrow'), // TODO: this is just a workaround to get this function to work start
            description: tNav.rich('tokens-borrow', {
              token,
              fee: formatDecimalAsPercent(new BigNumber(topFee.fee ?? 0)),
              em: (chunks) => `<em>${chunks}</em>`,
            }), // TODO: this is just a workaround to get this function to work start
            url: `${INTERNAL_LINKS.borrow}?collateral-token=${token}`,
          },
        ]
      : []),
  ]
}
