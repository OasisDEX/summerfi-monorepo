import {
  getArkNiceName,
  getScannerUrl,
  Icon,
  TableCellNodes,
  TableCellText,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import {
  formatAddress,
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
  VAULT_PERFORMANCE_RATE_CHANGED: 'Performance fee adjusted',
  ARK_ADDED: 'New market added',
  ARK_REMOVED: 'Existing market removed',
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
    // ARK_ADDED / ARK_REMOVED are market add/remove events, not numeric config
    // changes: there is no before→after value, only the affected market.
    const isMarketChange =
      curationEvent.action.includes('ADDED') || curationEvent.action.includes('REMOVED')
    const isPercentageChange =
      curationEvent.action.includes('PCT') || curationEvent.action.includes('RATE')
    const isArkChange = curationEvent.action.includes('ARK')
    const isValueIncrease = isMarketChange
      ? curationEvent.action.includes('ADDED')
      : new BigNumber(curationEvent.valueAfter).isGreaterThan(curationEvent.valueBefore)
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
    // A removed ark is no longer in vault.arks, so fall back to its address.
    const arkChangedNiceName = arkChanged
      ? getArkNiceName(arkChanged)
      : isMarketChange
        ? formatAddress(curationEvent.targetContract)
        : undefined
    const eventLabel = getEventLabel(curationEvent.action)

    return {
      content: {
        activity: (
          <TableCellNodes
            gap="medium"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon
              iconName={isValueIncrease ? 'arrow_increase' : 'arrow_decrease'}
              size={14}
              style={{ color: 'var(--earn-protocol-secondary-40)', marginRight: '4px' }}
            />
            <TableCellNodes
              gap="small"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <TableCellText>{eventLabel}</TableCellText>
              <TableCellText style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                {timeAgo({
                  from: new Date(),
                  to: new Date(Number(curationEvent.timestamp) * 1000),
                })}
              </TableCellText>
            </TableCellNodes>
          </TableCellNodes>
        ),
        change: (
          <TableCellNodes
            gap="small"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            {isMarketChange ? (
              <TableCellText style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                {arkChangedNiceName}
              </TableCellText>
            ) : (
              <>
                <TableCellNodes gap="small">
                  {arkChangedNiceName ? `${arkChangedNiceName} ` : ''}
                </TableCellNodes>
                <TableCellNodes gap="small">
                  <TableCellText style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                    {amountBefore}
                  </TableCellText>
                  <Text style={{ color: 'var(--earn-protocol-secondary-40)', fontSize: '14px' }}>
                    →
                  </Text>
                  <TableCellText style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                    {amountAfter}
                  </TableCellText>
                </TableCellNodes>
              </>
            )}
          </TableCellNodes>
        ),
        transaction: (
          <Link href={getScannerUrl(vaultChainId, curationEvent.hash)} target="_blank">
            <WithArrow
              as="div"
              variant="p3semi"
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
