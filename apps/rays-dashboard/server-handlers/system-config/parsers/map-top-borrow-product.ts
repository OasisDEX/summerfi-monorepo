import {
  type NavigationMenuPanelListItem,
  OmniProductType,
  type ProductHubItem,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import capitalize from 'lodash-es/capitalize'

import { networksByName } from '@/constants/networks-list-ssr'
import { getGenericPositionUrl } from '@/helpers/get-generic-position-url'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { type tNavType } from '@/messages/types'

const zero = new BigNumber(0)

export function mapTopBorrowProduct(
  rows: ProductHubItem[],
  tNav: tNavType,
): NavigationMenuPanelListItem[] {
  const borrowRows = rows
    .filter(({ product }) => product.includes(OmniProductType.Borrow))
    .filter(({ liquidity }) => new BigNumber(liquidity ?? 0).gt(zero))
  const [topLtv] = borrowRows.sort((a, b) =>
    new BigNumber(b.maxLtv ?? 0).minus(new BigNumber(a.maxLtv ?? 0)).toNumber(),
  )
  const [topFee] = borrowRows
    .filter(({ fee }) => new BigNumber(fee ?? 0).gt(zero))
    .sort((a, b) => new BigNumber(a.fee ?? 0).minus(new BigNumber(b.fee ?? 0)).toNumber())
  const [topRewards] = borrowRows
    .filter(({ hasRewards }) => hasRewards)
    .sort((a, b) =>
      new BigNumber(b.liquidity ?? 0).minus(new BigNumber(a.liquidity ?? 0)).toNumber(),
    )

  return [
    {
      title: tNav('borrow-up-to-ltv', {
        maxLtv: formatDecimalAsPercent(new BigNumber(topLtv.maxLtv ?? 0)),
      }), // TODO: this is just a workaround to get this function to work start
      description: tNav('discover-the-highest-ltv'), // TODO: this is just a workaround to get this function to work start
      icon: {
        tokens: [topLtv.primaryToken, topLtv.secondaryToken] as TokenSymbolsList[],
        position: 'global',
      },
      tags: [
        [
          lendingProtocolsByName[topLtv.protocol as keyof typeof lendingProtocolsByName].label,
          lendingProtocolsByName[topLtv.protocol as keyof typeof lendingProtocolsByName].name,
        ],
        [capitalize(topLtv.network), networksByName[topLtv.network].name],
      ],
      url: getGenericPositionUrl({
        ...topLtv,
        product: [OmniProductType.Borrow],
      }),
    },
    {
      title: tNav('borrow-lowest-fee', {
        token: topFee.primaryToken,
        fee: formatDecimalAsPercent(new BigNumber(topFee.fee ?? 0)),
      }), // TODO: this is just a workaround to get this function to work start
      description: tNav('find-the-lowest-rates'), // TODO: this is just a workaround to get this function to work start
      icon: {
        position: 'global',
        tokens: [topFee.primaryToken, topFee.secondaryToken] as TokenSymbolsList[],
      },
      tags: [
        [
          lendingProtocolsByName[topFee.protocol as keyof typeof lendingProtocolsByName].label,
          lendingProtocolsByName[topFee.protocol as keyof typeof lendingProtocolsByName].name,
        ],
        [capitalize(topFee.network), networksByName[topFee.network].name],
      ],
      url: getGenericPositionUrl({
        ...topFee,
        product: [OmniProductType.Borrow],
      }),
    },
    {
      title: tNav('earn-rewards-while-borrowing'), // TODO: this is just a workaround to get this function to work start
      description: tNav('get-paid-to-borrow'), // TODO: this is just a workaround to get this function to work start
      icon: {
        position: 'global',
        tokens: [topRewards.primaryToken, topRewards.secondaryToken] as TokenSymbolsList[],
      },
      tags: [
        [
          lendingProtocolsByName[topRewards.protocol as keyof typeof lendingProtocolsByName].label,
          lendingProtocolsByName[topRewards.protocol as keyof typeof lendingProtocolsByName].name,
        ],
        [capitalize(topRewards.network), networksByName[topRewards.network].name],
      ],
      url: getGenericPositionUrl({
        ...topRewards,
        product: [OmniProductType.Borrow],
      }),
    },
  ]
}
