import {
  getArkNiceName,
  getScannerUrl,
  TableCellNodes,
  TableCellText,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  subgraphNetworkToId,
  supportedSDKNetwork,
  ten,
  timeAgo,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { type VaultCurationEvent } from '@/features/curation-activity/types'

const curationEventActionToLabelMap: { [key: string]: string } = {
  ARK_CAP_CHANGED: 'Ark deposit cap',
  ARK_MAX_PCT_TVL_CHANGED: 'Ark max % of TVL',
  ARK_MAX_REBALANCE_INFLOW_CHANGED: 'Ark max rebalance inflow',
  ARK_MAX_REBALANCE_OUTFLOW_CHANGED: 'Ark max rebalance outflow',
  VAULT_CAP_CHANGED: 'Vault deposit cap',
  VAULT_MIN_BUFFER_CHANGED: 'Vault min buffer',
  VAULT_TIP_RATE_CHANGED: 'Vault tip rate',
}

const getAmount = (amount: string | number, decimals: number): string => {
  return new BigNumber(amount).dividedBy(ten.pow(decimals)).toString()
}

const getEventLabel = (action: string): string => {
  return curationEventActionToLabelMap[action] ?? action.toLowerCase().split('_').join(' ')
}

export const curationActivityMapper = (
  curationEvents: VaultCurationEvent[],
  vault: SDKVaultType | SDKVaultishType,
) => {
  const vaultChainId = subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))

  return curationEvents.map((curationEvent) => {
    const isPercentageChange =
      curationEvent.action.includes('PCT') || curationEvent.action.includes('RATE')
    const isArkChange = curationEvent.action.includes('ARK')
    const isValueIncrease = new BigNumber(curationEvent.valueAfter).isGreaterThan(
      curationEvent.valueBefore,
    )
    const beforeColor = !isValueIncrease
      ? 'var(--earn-protocol-success-100)'
      : 'var(--earn-protocol-critical-100)'
    const afterColor = isValueIncrease
      ? 'var(--earn-protocol-success-100)'
      : 'var(--earn-protocol-critical-100)'
    const amountBefore = isPercentageChange
      ? formatDecimalAsPercent(getAmount(curationEvent.valueBefore, 20))
      : formatCryptoBalance(getAmount(curationEvent.valueBefore, vault.inputToken.decimals))
    const amountAfter = isPercentageChange
      ? formatDecimalAsPercent(getAmount(curationEvent.valueAfter, 20))
      : formatCryptoBalance(getAmount(curationEvent.valueAfter, vault.inputToken.decimals))
    const arkChanged = isArkChange
      ? vault.arks.find(
          (ark) => curationEvent.targetContract.toLowerCase() === ark.id.toLowerCase(),
        )
      : undefined
    const arkChangedNiceName = arkChanged ? getArkNiceName(arkChanged) : undefined
    const eventLabel = getEventLabel(curationEvent.action)

    return {
      content: {
        activity: (
          <TableCellNodes
            gap="small"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <TableCellText>{arkChangedNiceName ? `${arkChangedNiceName} ` : ''}</TableCellText>
            <TableCellText style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              {eventLabel.toLowerCase()}
            </TableCellText>
          </TableCellNodes>
        ),
        change: (
          <TableCellNodes
            gap="small"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <TableCellNodes gap="small">
              <TableCellText style={{ color: beforeColor }}>{amountBefore}</TableCellText>
              <Text style={{ color: 'var(--earn-protocol-secondary-40)', fontSize: '14px' }}>
                →
              </Text>
              <TableCellText style={{ color: afterColor }}>{amountAfter}</TableCellText>
            </TableCellNodes>
          </TableCellNodes>
        ),
        timestamp: (
          <TableCellText suppressHydrationWarning>
            {timeAgo({ from: new Date(), to: new Date(Number(curationEvent.timestamp) * 1000) })}
          </TableCellText>
        ),
        transaction: (
          <Link href={getScannerUrl(vaultChainId, curationEvent.hash)} target="_blank">
            <WithArrow
              as="div"
              variant="p3semi"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
              withStatic
            >
              &nbsp;
            </WithArrow>
          </Link>
        ),
      },
    }
  })
}
