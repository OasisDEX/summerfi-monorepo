import {
  getArkNiceName,
  getProtocolLabel,
  getScannerUrl,
  getUniqueColor,
  Icon,
  TableCellText,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatDecimalAsPercent,
  subgraphNetworkToId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import {
  type InstitutionVaultActivityItem,
  type InstitutionVaultActivityTableRow,
  InstitutionVaultActivityType,
} from '@/features/panels/vaults/components/PanelActivity/types'
import {
  type AdminAction,
  type GetVaultActivityLogByTimestampFromQuery,
} from '@/graphql/clients/vault-history/client'

import styles from './PanelActivity.module.css'

dayjs.extend(advancedFormat)

const getAmount = (amount: string | number, decimals: number): string => {
  return new BigNumber(amount).dividedBy(ten.pow(decimals)).toString()
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

const ActivityArrow = ({ reversed = false }: { reversed?: boolean }) => (
  <Icon
    iconName={reversed ? 'arrow_backward' : 'arrow_forward'}
    style={{ display: 'inline-block', margin: '0 4px' }}
    size={12}
  />
)

const TxScannerLink = ({ vaultChainid, hash }: { vaultChainid: number; hash: string }) => {
  return (
    <Link
      href={getScannerUrl(vaultChainid, hash)}
      target="_blank"
      rel="noreferrer"
      className={styles.txLink}
    >
      view&nbsp;tx&nbsp;
      <Icon
        iconName="arrow_increase"
        size={14}
        style={{
          display: 'inline-block',
        }}
      />
    </Link>
  )
}

export const mapActivityDataToTable: (props: {
  data: {
    vault: GetVaultActivityLogByTimestampFromQuery['vault']
    curationEvents: GetVaultActivityLogByTimestampFromQuery['curationEvents']
    roleEvents: GetVaultActivityLogByTimestampFromQuery['roleEvents']
  }
  vault: SDKVaultishType
}) => InstitutionVaultActivityTableRow[] = ({ data, vault }) => {
  const mappedData: InstitutionVaultActivityItem[] = []
  const vaultChainid = subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))

  // region rebalances
  if (data.vault?.rebalances && Array.isArray(data.vault.rebalances)) {
    data.vault.rebalances.forEach((rebalance) => {
      const amount = formatCryptoBalance(getAmount(rebalance.amount, vault.inputToken.decimals))
      const from =
        rebalance.from.name === 'BufferArk'
          ? 'Buffer Ark'
          : rebalance.from.name
            ? getArkNiceName({
                name: rebalance.from.name,
              } as SDKVaultishType['arks'][number])
            : formatAddress(rebalance.from.id)
      const protocolFrom = rebalance.from.name?.split('-') ?? ['n/a']
      const protocolLabelFrom = getProtocolLabel(protocolFrom)
      const protocolLabelFromColor = getUniqueColor(protocolLabelFrom)
      const to =
        rebalance.to.name === 'BufferArk'
          ? 'Buffer Ark'
          : rebalance.to.name
            ? getArkNiceName({
                name: rebalance.to.name,
              } as SDKVaultishType['arks'][number])
            : formatAddress(rebalance.to.id)
      const protocolTo = rebalance.to.name?.split('-') ?? ['n/a']
      const protocolLabelTo = getProtocolLabel(protocolTo)
      const protocolLabelToColor = getUniqueColor(protocolLabelTo)

      mappedData.push({
        when: rebalance.timestamp,
        type: InstitutionVaultActivityType.REBALANCE,
        // XXXX.XX USDC has been rebalanced from Y to Z
        message: (
          <TableCellText
            as="div"
            className={styles.activityLogMessage}
            style={{ color: undefined }}
          >
            <strong style={{ color: protocolLabelFromColor }}>{from}</strong>
            <ActivityArrow />
            <strong>
              {amount}&nbsp;{vault.inputToken.symbol}&nbsp;
            </strong>
            <ActivityArrow />
            <strong style={{ color: protocolLabelToColor }}>{to}</strong>
          </TableCellText>
        ),
        details: (
          <TableCellText
            as="div"
            className={styles.activityLogMessageDetails}
            style={{ color: undefined }}
          >
            <div>
              <strong>
                {amount}&nbsp;{vault.inputToken.symbol}&nbsp;
              </strong>
              has been rebalanced from&nbsp;<strong>{from}</strong>&nbsp;to&nbsp;
              <strong>{to}</strong>
            </div>
            <TxScannerLink vaultChainid={vaultChainid} hash={rebalance.hash} />
          </TableCellText>
        ),
      })
    })
  }

  // region deposits
  if (data.vault?.deposits && Array.isArray(data.vault.deposits)) {
    data.vault.deposits.forEach((deposit) => {
      const amount = formatCryptoBalance(getAmount(deposit.amount, vault.inputToken.decimals))
      const user = formatAddress(deposit.from)

      mappedData.push({
        when: deposit.timestamp,
        type: InstitutionVaultActivityType.DEPOSIT,
        // User 0x1234...5678 has deposited XXXX.XX USDC
        message: (
          <TableCellText
            as="div"
            className={styles.activityLogMessage}
            style={{ color: undefined }}
          >
            <strong>{user}</strong>&nbsp;
            <ActivityArrow />
            <strong style={{ color: 'var(--earn-protocol-success-100)' }}>
              +{amount}&nbsp;{vault.inputToken.symbol}
            </strong>
          </TableCellText>
        ),
        details: (
          <TableCellText className={styles.activityLogMessageDetails} style={{ color: undefined }}>
            <div>
              User&nbsp;<strong>{user}</strong>&nbsp;has deposited&nbsp;
              <strong>
                {amount}&nbsp;{vault.inputToken.symbol}
              </strong>
            </div>
            <TxScannerLink vaultChainid={vaultChainid} hash={deposit.hash} />
          </TableCellText>
        ),
      })
    })
  }

  // region withdraws
  if (data.vault?.withdraws && Array.isArray(data.vault.withdraws)) {
    data.vault.withdraws.forEach((withdraw) => {
      const amount = formatCryptoBalance(
        getAmount(Math.abs(withdraw.amount), vault.inputToken.decimals),
      )
      const user = formatAddress(withdraw.from)

      mappedData.push({
        when: withdraw.timestamp,
        type: InstitutionVaultActivityType.WITHDRAWAL,
        // User 0x1234...5678 has withdrawn XXXX.XX USDC
        message: (
          <TableCellText
            as="div"
            className={styles.activityLogMessage}
            style={{ color: undefined }}
          >
            <strong>{user}</strong>&nbsp;
            <ActivityArrow reversed />
            <strong style={{ color: 'var(--earn-protocol-critical-100)' }}>
              -{amount}&nbsp;{vault.inputToken.symbol}
            </strong>
          </TableCellText>
        ),
        details: (
          <TableCellText className={styles.activityLogMessageDetails} style={{ color: undefined }}>
            <div>
              User&nbsp;<strong>{user}</strong>&nbsp;has withdrawn&nbsp;
              <strong>
                {amount}&nbsp;{vault.inputToken.symbol}
              </strong>
            </div>
            <TxScannerLink vaultChainid={vaultChainid} hash={withdraw.hash} />
          </TableCellText>
        ),
      })
    })
  }

  // region risk changes
  if (Array.isArray(data.curationEvents) && data.curationEvents.length > 0) {
    data.curationEvents.forEach((curationEvent) => {
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
        : null

      const arkChangedNiceName = arkChanged ? getArkNiceName(arkChanged) : null

      mappedData.push({
        when: curationEvent.timestamp,
        type: InstitutionVaultActivityType.RISK_CHANGE,
        message: (
          <TableCellText
            as="div"
            className={styles.activityLogMessage}
            style={{ color: undefined }}
          >
            {arkChangedNiceName ? (
              <>
                <strong>{arkChangedNiceName}</strong>&nbsp;
              </>
            ) : (
              ''
            )}
            <strong>{curationEventActionToRiskLevelMap[curationEvent.action]}</strong>&nbsp;
            <strong style={{ opacity: 0.6, color: beforeColor }}>
              <s>{amountBefore}</s>
            </strong>
            <ActivityArrow />
            <strong style={{ color: afterColor }}>{amountAfter}</strong>
          </TableCellText>
        ),
        details: (
          <TableCellText className={styles.activityLogMessageDetails} style={{ color: undefined }}>
            <div>
              <strong>{formatAddress(curationEvent.caller)}</strong>&nbsp;changed&nbsp;
              {arkChangedNiceName ? (
                <>
                  <strong>{arkChangedNiceName}</strong>&nbsp;
                </>
              ) : (
                ''
              )}
              <strong>{curationEventActionToRiskLevelMap[curationEvent.action]}</strong>
              &nbsp;from&nbsp;<strong>{amountBefore}</strong>&nbsp;to&nbsp;
              <strong>{amountAfter}</strong>
            </div>
            <TxScannerLink vaultChainid={vaultChainid} hash={curationEvent.hash} />
          </TableCellText>
        ),
      })
    })
  }

  // region role events
  if (Array.isArray(data.roleEvents) && data.roleEvents.length > 0) {
    data.roleEvents.forEach((roleEvent) => {
      const actionLabel = roleEvent.action !== 'REVOKE_ROLE' ? 'granted' : 'revoked'
      const actionLabelColor =
        roleEvent.action !== 'REVOKE_ROLE'
          ? 'var(--earn-protocol-success-100)'
          : 'var(--earn-protocol-critical-100)'
      const toFrom = roleEvent.action !== 'REVOKE_ROLE' ? 'to' : 'from'

      mappedData.push({
        when: roleEvent.timestamp,
        type: InstitutionVaultActivityType.ROLE_CHANGE,
        message: (
          <TableCellText
            as="div"
            className={styles.activityLogMessage}
            style={{ color: undefined }}
          >
            <strong>{formatActivityLogTypeToHuman(roleEvent.role.name)}</strong>&nbsp;
            <span style={{ color: actionLabelColor }}>{actionLabel}</span>
            &nbsp;
            <ActivityArrow />
            <strong>{formatAddress(roleEvent.role.owner)}</strong>
          </TableCellText>
        ),
        details: (
          <TableCellText className={styles.activityLogMessageDetails} style={{ color: undefined }}>
            <div>
              <strong>{formatAddress(roleEvent.caller)}</strong>&nbsp;{actionLabel}&nbsp;role&nbsp;
              <strong>{formatActivityLogTypeToHuman(roleEvent.role.name)}</strong>&nbsp;{toFrom}
              &nbsp;
              <strong>{formatAddress(roleEvent.role.owner)}</strong>
            </div>
            <TxScannerLink vaultChainid={vaultChainid} hash={roleEvent.hash} />
          </TableCellText>
        ),
      })
    })
  }

  return mappedData
    .sort((a, b) => b.when - a.when)
    .map((item) => {
      const monthLabel = dayjs.unix(item.when).format('MMMM YYYY')

      return {
        timestamp: item.when,
        monthLabel,
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
              {dayjs.unix(item.when).format('MMM Do, HH:mm:ss')}
            </TableCellText>
          ),
          type: formatActivityLogTypeToHuman(item.type), // simple capitalization
          activity: item.message,
        },
        details: item.details,
      }
    })
}
