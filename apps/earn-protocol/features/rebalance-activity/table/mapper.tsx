import {
  getScannerUrl,
  Icon,
  TableCellNodes,
  TableCellText,
  type TableSortedColumn,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type IconNamesList,
  type SDKGlobalRebalancesType,
  type SDKGlobalRebalanceType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, subgraphNetworkToSDKId, timeAgo } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { rebalanceActivitySorter } from '@/features/rebalance-activity/table/sorter'
import { getProtocolLabel } from '@/helpers/get-protocol-label'

export const rebalanceActivityPurposeMapper = (
  item: SDKGlobalRebalanceType,
): { label: string; icon: IconNamesList } => {
  const actionFromRawName = item.from.name?.split('-')[0] ?? 'n/a'
  const actionToRawName = item.to.name?.split('-')[0] ?? 'n/a'

  const isFromBuffer = actionFromRawName === 'BufferArk'
  const isToBuffer = actionToRawName === 'BufferArk'

  if (!isFromBuffer && !isToBuffer && Number(item.fromPostAction.depositLimit) !== 0) {
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

  return { label: 'n/a', icon: 'not_supported_icon' }
}

export const rebalancingActivityMapper = (
  rawData: SDKGlobalRebalancesType,
  sortConfig?: TableSortedColumn<string>,
) => {
  const sorted = rebalanceActivitySorter({ data: rawData, sortConfig })

  return sorted.map((item) => {
    const asset = item.asset.symbol as TokenSymbolsList

    const scannerLink = getScannerUrl(
      subgraphNetworkToSDKId(item.protocol.network),
      item.id.split('-')[0] ?? '',
    )

    const amount = new BigNumber(item.amount.toString()).shiftedBy(-item.asset.decimals)

    const actionFromRawName = item.from.name?.split('-') ?? ['n/a']
    const actionToRawName = item.to.name?.split('-') ?? ['n/a']

    const actionFromLabel = getProtocolLabel(actionFromRawName)
    const actionToLabel = getProtocolLabel(actionToRawName)

    const purpose = rebalanceActivityPurposeMapper(item)

    return {
      content: {
        purpose: (
          <TableCellNodes gap="medium">
            <TableCellNodes gap="medium">
              {purpose.icon && (
                <Icon
                  iconName={purpose.icon}
                  variant="xs"
                  color="var(--earn-protocol-secondary-40)"
                />
              )}
            </TableCellNodes>
            <TableCellNodes
              gap="small"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <TableCellNodes gap="medium">
                <TableCellText>{purpose.label}</TableCellText>
              </TableCellNodes>
              <TableCellNodes gap="medium">
                <TableCellText
                  suppressHydrationWarning
                  style={{ color: 'var(--earn-protocol-secondary-40)' }}
                >
                  {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
                </TableCellText>
              </TableCellNodes>
            </TableCellNodes>
          </TableCellNodes>
        ),
        action: (
          <TableCellNodes
            gap="small"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <TableCellNodes gap="small" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TableCellText>{actionFromLabel}</TableCellText>
              <Text style={{ color: 'var(--earn-protocol-secondary-40)', fontSize: '14px' }}>
                →
              </Text>
              <TableCellText>{actionToLabel}</TableCellText>
            </TableCellNodes>
            <TableCellNodes gap="small">
              <Icon tokenName={asset} variant="s" />
              <TableCellText style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                {formatCryptoBalance(amount)} rebalanced
              </TableCellText>{' '}
            </TableCellNodes>
          </TableCellNodes>
        ),
        strategy: <TableCellText>{item.vault.name}</TableCellText>,
        transaction: (
          <Link href={scannerLink} target="_blank">
            <WithArrow
              as="p"
              variant="p3"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
              withStatic
            >
              View
            </WithArrow>
          </Link>
        ),
      },
    }
  })
}
