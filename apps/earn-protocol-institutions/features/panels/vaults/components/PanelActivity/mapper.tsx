import { getArkNiceName, TableCellText, type TableRow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatDecimalAsPercent,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'

import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/features/charts/helpers'
import {
  type ActivityTableColumns,
  type InstitutionVaultActivityItem,
  InstitutionVaultActivityType,
} from '@/features/panels/vaults/components/PanelActivity/types'
import {
  type AdminAction,
  type GetVaultActivityLogByTimestampFromQuery,
} from '@/graphql/clients/vault-history/client'

import styles from './PanelActivity.module.css'

const getAmount = (amount: string | number, decimals: number): string => {
  return new BigNumber(amount).dividedBy(ten.pow(decimals)).toFixed(2)
}

export const formatActivityLogTypeToHuman = (type: string): string => {
  return type
    .split('_')
    .map((word) => capitalize(word))
    .join(' ')
}

const curationEventActionToRiskLevelMap: { [key in AdminAction]: string } = {
  ARK_CAP_CHANGED: 'Ark deposit cap',
  ARK_MAX_PCT_TVL_CHANGED: 'Ark max % of TVL',
  ARK_MAX_REBALANCE_INFLOW_CHANGED: 'Ark max rebalance inflow',
  ARK_MAX_REBALANCE_OUTFLOW_CHANGED: 'Ark max rebalance outflow',
  VAULT_CAP_CHANGED: 'Vault deposit cap',
  VAULT_MIN_BUFFER_CHANGED: 'Vault min buffer',
  VAULT_TIP_RATE_CHANGED: 'Vault tip rate',
}

export const mapActivityDataToTable: (props: {
  data: {
    vault: GetVaultActivityLogByTimestampFromQuery['vault']
    curationEvents: GetVaultActivityLogByTimestampFromQuery['curationEvents']
    roleEvents: GetVaultActivityLogByTimestampFromQuery['roleEvents']
  }
  vaultToken: SDKVaultType['inputToken']
}) => TableRow<ActivityTableColumns>[] = ({ data, vaultToken }) => {
  const mappedData: InstitutionVaultActivityItem[] = []

  // region rebalances
  if (data.vault?.rebalances && Array.isArray(data.vault.rebalances)) {
    data.vault.rebalances.forEach((rebalance) => {
      const amount = formatCryptoBalance(getAmount(rebalance.amount, vaultToken.decimals))
      const from =
        rebalance.from.name === 'BufferArk'
          ? 'Buffer Ark'
          : rebalance.from.name
            ? getArkNiceName({
                name: rebalance.from.name,
              } as SDKVaultishType['arks'][number])
            : formatAddress(rebalance.from.id)
      const to =
        rebalance.to.name === 'BufferArk'
          ? 'Buffer Ark'
          : rebalance.to.name
            ? getArkNiceName({
                name: rebalance.to.name,
              } as SDKVaultishType['arks'][number])
            : formatAddress(rebalance.to.id)

      mappedData.push({
        when: rebalance.timestamp,
        type: InstitutionVaultActivityType.REBALANCE,
        // XXXX.XX USDC has been rebalanced from Y to Z
        message: (
          <TableCellText className={styles.activityLogMessage} style={{ color: undefined }}>
            <strong>
              {amount}&nbsp;{vaultToken.symbol}&nbsp;
            </strong>
            has been rebalanced from&nbsp;<strong>{from}</strong>&nbsp;to&nbsp;<strong>{to}</strong>
          </TableCellText>
        ),
      })
    })
  }

  // region deposits
  if (data.vault?.deposits && Array.isArray(data.vault.deposits)) {
    data.vault.deposits.forEach((deposit) => {
      const amount = formatCryptoBalance(getAmount(deposit.amount, vaultToken.decimals))
      const user = formatAddress(deposit.from)

      mappedData.push({
        when: deposit.timestamp,
        type: InstitutionVaultActivityType.DEPOSIT,
        // User 0x1234...5678 has deposited XXXX.XX USDC
        message: (
          <TableCellText className={styles.activityLogMessage} style={{ color: undefined }}>
            User&nbsp;<strong>{user}</strong>&nbsp;has deposited&nbsp;
            <strong>
              {amount}&nbsp;{vaultToken.symbol}
            </strong>
          </TableCellText>
        ),
      })
    })
  }

  // region withdraws
  if (data.vault?.withdraws && Array.isArray(data.vault.withdraws)) {
    data.vault.withdraws.forEach((withdraw) => {
      const amount = formatCryptoBalance(getAmount(Math.abs(withdraw.amount), vaultToken.decimals))
      const user = formatAddress(withdraw.from)

      mappedData.push({
        when: withdraw.timestamp,
        type: InstitutionVaultActivityType.WITHDRAWAL,
        // User 0x1234...5678 has withdrawn XXXX.XX USDC
        message: (
          <TableCellText className={styles.activityLogMessage} style={{ color: undefined }}>
            User&nbsp;<strong>{user}</strong>&nbsp;has withdrawn&nbsp;
            <strong>
              {amount}&nbsp;{vaultToken.symbol}
            </strong>
          </TableCellText>
        ),
      })
    })
  }

  // region risk changes
  if (Array.isArray(data.curationEvents) && data.curationEvents.length > 0) {
    data.curationEvents.forEach((curationEvent) => {
      const isPercentageChange = curationEvent.action.includes('PCT')
      const amountBefore = isPercentageChange
        ? formatDecimalAsPercent(getAmount(curationEvent.valueBefore, 20))
        : formatCryptoBalance(getAmount(curationEvent.valueBefore, vaultToken.decimals))
      const amountAfter = isPercentageChange
        ? formatDecimalAsPercent(getAmount(curationEvent.valueAfter, 20))
        : formatCryptoBalance(getAmount(curationEvent.valueAfter, vaultToken.decimals))

      mappedData.push({
        when: curationEvent.timestamp,
        type: InstitutionVaultActivityType.RISK_CHANGE,
        message: (
          <TableCellText className={styles.activityLogMessage} style={{ color: undefined }}>
            <strong>{formatAddress(curationEvent.caller)}</strong>&nbsp;changed&nbsp;
            <strong>{curationEventActionToRiskLevelMap[curationEvent.action]}</strong>
            &nbsp;from&nbsp;<strong>{amountBefore}</strong>&nbsp;to&nbsp;
            <strong>{amountAfter}</strong>
          </TableCellText>
        ),
      })
    })
  }

  // region role events
  if (Array.isArray(data.roleEvents) && data.roleEvents.length > 0) {
    data.roleEvents.forEach((roleEvent) => {
      const actionLabel = roleEvent.action !== 'REVOKE_ROLE' ? 'granted' : 'revoked'
      const toFrom = roleEvent.action !== 'REVOKE_ROLE' ? 'to' : 'from'

      mappedData.push({
        when: roleEvent.timestamp,
        type: InstitutionVaultActivityType.ROLE_CHANGE,
        message: (
          <TableCellText className={styles.activityLogMessage} style={{ color: undefined }}>
            <strong>{formatAddress(roleEvent.caller)}</strong>&nbsp;{actionLabel}&nbsp;role&nbsp;
            <strong>{formatActivityLogTypeToHuman(roleEvent.role.name)}</strong>&nbsp;{toFrom}&nbsp;
            <strong>{formatAddress(roleEvent.role.owner)}</strong>
          </TableCellText>
        ),
      })
    })
  }

  return mappedData
    .sort((a, b) => b.when - a.when)
    .map((item) => ({
      content: {
        // some of the mapping needs to happen _after_ sorting
        when: (
          <TableCellText
            style={{
              width: '150px',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '12px',
              fontWeight: 500,
              justifySelf: 'flex-start',
            }}
          >
            {dayjs.unix(item.when).format(CHART_TIMESTAMP_FORMAT_DETAILED)}
          </TableCellText>
        ),
        type: formatActivityLogTypeToHuman(item.type), // simple capitalization
        activity: item.message,
      },
    }))
}
