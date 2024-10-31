import { Icon, TableCellText, type TableSortedColumn, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType, type TokenSymbolsList } from '@summerfi/app-types'
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

export const rebalancingActivityMapper = (
  rawData: SDKGlobalRebalancesType,
  sortConfig?: TableSortedColumn<string>,
) => {
  const sorted = rebalanceActivitySorter({ data: rawData, sortConfig })

  return sorted.map((item) => {
    const asset = item.asset.symbol as TokenSymbolsList
    // NOT YET AVAILABLE IN SUBGRAPH
    // const typeIcon = item.type === 'reduce' ? 'arrow_decrease' : 'arrow_increase'
    // const typeLabel = item.type === 'reduce' ? 'Reduce' : 'Increase'

    const typeIcon = 'arrow_decrease'
    const typeLabel = `Reduce`

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

    return {
      content: {
        purpose: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            <Icon iconName={typeIcon} variant="xxs" color="rgba(119, 117, 118, 1)" />
            <TableCellText>{typeLabel} Risk</TableCellText>
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
