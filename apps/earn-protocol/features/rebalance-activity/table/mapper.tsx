import { Icon, TableCellText, type TableSortedColumn, Text, WithArrow } from '@summerfi/app-earn-ui'
import {
  type IconNamesList,
  type SDKGlobalRebalancesType,
  type SDKGlobalRebalanceType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, timeAgo } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { rebalanceActivitySorter } from '@/features/rebalance-activity/table/sorter'

export const arkNameMap: { [key: string]: string } = {
  BufferArk: 'Buffer',
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  PendlePt: 'Pendle',
}

const purposeMapper = (item: SDKGlobalRebalanceType): { label: string; icon?: IconNamesList } => {
  const actionFromRawName = item.from.name?.split('-')[0] ?? 'n/a'
  const actionToRawName = item.to.name?.split('-')[0] ?? 'n/a'

  const isFromBuffer = actionFromRawName === 'BufferArk'
  const isToBuffer = actionToRawName === 'BufferArk'

  if (!isFromBuffer && !isToBuffer && Number(item.from.depositLimit) !== 0) {
    return Number(item.fromPostAction.totalValueLockedUSD) + Number(item.amountUSD) <
      Number(item.fromPostAction.depositLimit)
      ? { label: 'Rate Enhancement', icon: 'arrow_increase' }
      : { label: 'Risk Reduction', icon: 'arrow_decrease' }
  }

  if (!isFromBuffer && !isToBuffer && Number(item.fromPostAction.depositLimit) === 0) {
    return { label: 'Risk Reduction', icon: 'arrow_decrease' }
  }

  if (isFromBuffer) {
    return { label: 'Funds Deployed', icon: 'deposit' }
  }

  if (isToBuffer) {
    return { label: 'Funds Withdrawn', icon: 'withdraw' }
  }

  // eslint-disable-next-line no-console
  console.error('Unknown rebalance purpose, fallback to n/a')

  return { label: 'n/a' }
}

export const rebalancingActivityMapper = (
  rawData: SDKGlobalRebalancesType,
  sortConfig?: TableSortedColumn<string>,
) => {
  const sorted = rebalanceActivitySorter({ data: rawData, sortConfig })

  return sorted.map((item) => {
    const asset = item.asset.symbol as TokenSymbolsList

    // dummy mapping for now
    const providerLink =
      {
        'Summer Earn Protocol': '/',
      }[item.protocol.name] ?? '/'

    const amount = new BigNumber(item.amount.toString()).shiftedBy(-item.asset.decimals)

    const actionFromRawName = item.from.name?.split('-')[0] ?? 'n/a'
    const actionToRawName = item.to.name?.split('-')[0] ?? 'n/a'

    const actionFromLabel = arkNameMap[actionFromRawName] ?? actionFromRawName
    const actionToLabel = arkNameMap[actionToRawName] ?? actionToRawName

    const purpose = purposeMapper(item)

    return {
      content: {
        purpose: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            {purpose.icon && (
              <Icon
                iconName={purpose.icon}
                variant="xs"
                color="var(--earn-protocol-secondary-40)"
              />
            )}
            <TableCellText>{purpose.label}</TableCellText>
          </div>
        ),
        action: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <TableCellText>{actionFromLabel}</TableCellText>
            <Text style={{ color: 'var(--earn-protocol-secondary-40)', fontSize: '14px' }}>→</Text>
            <TableCellText>{actionToLabel}</TableCellText>
          </div>
        ),
        amount: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-space-2x-small)',
            }}
          >
            <Icon tokenName={asset} variant="s" />
            <TableCellText>{formatCryptoBalance(amount)}</TableCellText>
          </div>
        ),
        strategy: <TableCellText>{item.vault.name}</TableCellText>,
        timestamp: (
          <TableCellText>
            {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
          </TableCellText>
        ),
        provider: (
          <Link href={providerLink}>
            <WithArrow
              as="p"
              variant="p3"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
              reserveSpace
            >
              {item.protocol.name}
            </WithArrow>
          </Link>
        ),
      },
    }
  })
}
