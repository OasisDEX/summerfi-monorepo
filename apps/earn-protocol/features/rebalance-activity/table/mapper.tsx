import {
  getScannerUrl,
  Icon,
  TableCellNodes,
  TableCellText,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type IconNamesList, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, mapDbNetworkToChainId, timeAgo } from '@summerfi/app-utils'
import { type RebalanceActivity } from '@summerfi/summer-protocol-db'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { getProtocolLabel } from '@/helpers/get-protocol-label'

const actionTypeMap: {
  [key: RebalanceActivity['actionType']]: { label: string; icon: IconNamesList }
} = {
  deposit: { label: 'Funds Deployed', icon: 'deposit' },
  withdraw: { label: 'Funds Withdrawn', icon: 'withdraw' },
  // eslint-disable-next-line camelcase
  rate_enhancement: { label: 'Rate Enhancement', icon: 'arrow_increase' },
  // eslint-disable-next-line camelcase
  risk_reduction: { label: 'Risk Reduction', icon: 'arrow_decrease' },
  'n/a': { label: 'n/a', icon: 'not_supported_icon' },
}

export const rebalanceActivityPurposeMapper = (
  item: RebalanceActivity,
): { label: string; icon: IconNamesList } => {
  return actionTypeMap[item.actionType]
}

export const rebalancingActivityMapper = (rawData: RebalanceActivity[]) => {
  return rawData.map((item) => {
    const asset = item.inputTokenSymbol as TokenSymbolsList

    const scannerLink = getScannerUrl(
      mapDbNetworkToChainId(item.network),
      item.rebalanceId.split('-')[0] ?? '',
    )

    const amount = new BigNumber(item.amount.toString()).shiftedBy(-item.inputTokenDecimals)

    const actionFromRawName = Array.isArray(item.fromName.split('-'))
      ? item.fromName.split('-')
      : ['n/a']
    const actionToRawName = Array.isArray(item.toName.split('-')) ? item.toName.split('-') : ['n/a']

    const actionFromLabel = getProtocolLabel(actionFromRawName, true)
    const actionToLabel = getProtocolLabel(actionToRawName, true)

    const purpose = rebalanceActivityPurposeMapper(item)

    return {
      content: {
        purpose: (
          <TableCellNodes gap="medium">
            <TableCellNodes gap="medium">
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
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
              <TableCellText
                style={{ color: 'var(--earn-protocol-secondary-40)', display: 'flex' }}
                as="div"
              >
                {formatCryptoBalance(amount)} rebalanced
                <Link href={scannerLink} target="_blank">
                  <WithArrow
                    as="p"
                    variant="p3"
                    style={{ color: 'var(--earn-protocol-primary-100)' }}
                    withStatic
                  >
                    &nbsp;
                  </WithArrow>
                </Link>
              </TableCellText>
            </TableCellNodes>
          </TableCellNodes>
        ),
        strategy: <TableCellText>{item.vaultName}</TableCellText>,
      },
    }
  })
}
