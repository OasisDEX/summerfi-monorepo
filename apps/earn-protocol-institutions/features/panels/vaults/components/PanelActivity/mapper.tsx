import { getArkNiceName, TableCellText, type TableRow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { formatAddress, formatCryptoBalance, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'

import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/features/charts/helpers'
import {
  type ActivityTableColumns,
  type InstitutionVaultActivityItem,
  InstitutionVaultActivityType,
} from '@/features/panels/vaults/components/PanelActivity/types'
import { type GetVaultActivityLogByTimestampFromQuery } from '@/graphql/clients/vault-history/client'

import styles from './PanelActivity.module.css'

const getAmount = (amount: string | number, decimals: number): string => {
  return new BigNumber(amount).dividedBy(ten.pow(decimals)).toFixed(2)
}

export const mapActivityDataToTable: (props: {
  data: GetVaultActivityLogByTimestampFromQuery['vault']
  vaultToken: SDKVaultType['inputToken']
}) => TableRow<ActivityTableColumns>[] = ({ data, vaultToken }) => {
  const mappedData: InstitutionVaultActivityItem[] = []

  // region rebalances
  if (data?.rebalances && Array.isArray(data.rebalances)) {
    data.rebalances.forEach((rebalance) => {
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
  if (data?.deposits && Array.isArray(data.deposits)) {
    data.deposits.forEach((deposit) => {
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
  if (data?.withdraws && Array.isArray(data.withdraws)) {
    data.withdraws.forEach((withdraw) => {
      const amount = formatCryptoBalance(getAmount(withdraw.amount, vaultToken.decimals))
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
  // (waits for subgraph support)
  if (data?.withdraws && Array.isArray(data.withdraws)) {
    // Placeholder for future risk change activities mapping
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
        type: capitalize(item.type),
        activity: item.message,
      },
    }))
}
