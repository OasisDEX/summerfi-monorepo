'use client'
import { type ReactNode, useState } from 'react'
import {
  Button,
  getScannerUrl,
  Icon,
  Table,
  TableCellNodes,
  type TableColumn,
  type TableRow,
  TableRowAccent,
  Text,
  ToggleButton,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, subgraphNetworkToId } from '@summerfi/app-utils'
import { RoundState, RoundsVaultType } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'
import Link from 'next/link'

import {
  type RwaReceiptHistoryRow,
  type RwaReceiptHistorySide,
} from '@/app/server-handlers/rwa-receipts-history/get-rwa-receipts-history'
import { useRwaReceiptsHistory } from '@/components/layout/VaultManageView/useVaultManageQuery'
import { getRwaReceiptKey, type RwaReceipt, type RwaReceiptStatus } from '@/hooks/use-rwa-claim'

type ColumnKey = 'amount' | 'date' | 'settledDate' | 'action'

type RwaDepositsWithdrawalsProps = {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress: string
  // Gates the (lazy) fetch — true once the expander is open.
  enabled: boolean
  // Underlying asset symbol (e.g. USDC) all amounts are denominated in for display.
  tokenSymbol: string
  // Current vault share price (netValue / shares) used to value withdrawal share receipts in USDC.
  vaultSharePrice?: BigNumber
  actionInProgressKey?: string
  actionError?: string
  onAction?: (receipt: RwaReceipt) => void
}

const DESCRIPTION =
  'This Vault uses async deposit and withdrawals, which are typically processed once a day, ' +
  'Monday to Friday. Once a withdrawal is processed, it can take several days, and sometimes ' +
  'longer, to settle and become claimable if capital is needed to be withdrawn from a market ' +
  'with longer redemption periods. If you have any questions on deposits or withdrawals, get in ' +
  'touch with the team '

// Subgraph round-state strings → the SDK's numeric RoundState (used to reconstruct a claim/cancel).
const toRoundState = (state: RwaReceiptHistoryRow['roundState']): RoundState => {
  if (state === 'OPENED') return RoundState.Opened
  if (state === 'IN_SETTLEMENT') return RoundState.InSettlement

  return RoundState.Settled
}

const secondaryColor = 'var(--color-text-secondary)'

// Left accent bar colour by lifecycle (mirrors the VaultExposure table's accent): green once
// claimable, neutral while pending/requested, muted once completed.
const accentColor = (row: RwaReceiptHistoryRow): string => {
  if (row.status === 'claimable') return 'var(--earn-protocol-success-100)'
  if (row.status === 'completed') return 'var(--earn-protocol-secondary-60)'

  return 'var(--earn-protocol-primary-100)'
}

const statusLabel = (row: RwaReceiptHistoryRow): string => {
  if (row.side === 'deposit') {
    if (row.status === 'completed') return 'Completed'
    if (row.status === 'claimable') return 'Ready to claim'

    return 'Pending'
  }

  if (row.status === 'completed') return 'Settled'
  if (row.status === 'claimable') return 'Settled'
  if (row.status === 'pending') return 'In settlement'

  return 'Withdrawal requested'
}

// Deposits show the deposited USDC. Withdrawals hold fleet shares, valued in USDC via the current
// share price (the realised settled USDC is only known after the claim — shown as the settled line).
const primaryAmount = (
  row: RwaReceiptHistoryRow,
  vaultSharePrice?: BigNumber,
): BigNumber | null => {
  const principal = row.principalAmount != null ? new BigNumber(row.principalAmount) : null

  if (row.side === 'deposit') {
    return principal
  }

  if (principal && vaultSharePrice) {
    return principal.times(vaultSharePrice)
  }
  if (row.settledAmount != null) {
    return new BigNumber(row.settledAmount)
  }

  return principal
}

const formatDateTime = (unixSeconds: number | null): string =>
  unixSeconds != null ? dayjs.unix(unixSeconds).format('MMMM DD, YYYY HH:mm') : '-'

const formatDate = (unixSeconds: number | null): string =>
  unixSeconds != null ? dayjs.unix(unixSeconds).format('MMMM DD, YYYY') : '-'

const buildReceipt = (row: RwaReceiptHistoryRow): RwaReceipt => ({
  vaultType: row.side === 'deposit' ? RoundsVaultType.Input : RoundsVaultType.Output,
  roundId: BigInt(row.roundId),
  balance: BigInt(row.balance),
  roundState: toRoundState(row.roundState),
  // Only ever read for actionable (claimable/cancellable) rows; completed rows render no action.
  status: row.status as RwaReceiptStatus,
})

export const RwaDepositsWithdrawals = ({
  network,
  vaultId,
  walletAddress,
  enabled,
  tokenSymbol,
  vaultSharePrice,
  actionInProgressKey,
  actionError,
  onAction,
}: RwaDepositsWithdrawalsProps) => {
  const [activeSide, setActiveSide] = useState<RwaReceiptHistorySide>('deposit')
  const [hideCompleted, setHideCompleted] = useState(false)
  const chainId = subgraphNetworkToId(network)

  // Fetch only the active tab's page(s); the other side stays cached once visited.
  const depositsQuery = useRwaReceiptsHistory(
    network,
    vaultId,
    walletAddress,
    'deposit',
    enabled && activeSide === 'deposit',
  )
  const withdrawalsQuery = useRwaReceiptsHistory(
    network,
    vaultId,
    walletAddress,
    'withdrawal',
    enabled && activeSide === 'withdrawal',
  )
  const activeQuery = activeSide === 'deposit' ? depositsQuery : withdrawalsQuery

  const loadedRows = (activeQuery.data?.pages ?? []).flatMap((page) => page.rows)
  const filteredRows = hideCompleted
    ? loadedRows.filter((row) => row.status !== 'completed')
    : loadedRows

  const renderActionCell = (row: RwaReceiptHistoryRow): ReactNode => {
    if (row.status === 'completed') {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text as="span" variant="p3" style={{ color: secondaryColor }}>
            Claimed
          </Text>
        </div>
      )
    }

    const key = getRwaReceiptKey({
      vaultType: row.side === 'deposit' ? RoundsVaultType.Input : RoundsVaultType.Output,
      roundId: BigInt(row.roundId),
    })
    const isProcessing = actionInProgressKey === key
    const isAnyProcessing = actionInProgressKey !== undefined

    const canClaim = row.status === 'claimable'
    // Only pending deposits can be cancelled here (mirrors the mockup; withdrawals show a disabled
    // Claim until settled).
    const canCancel = row.side === 'deposit' && row.status === 'cancellable'
    const isActionable = canClaim || canCancel

    return (
      // Stop row-expand toggling when interacting with the action.
      <div
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <Button
          variant={canClaim ? 'primarySmall' : 'secondarySmall'}
          disabled={!isActionable || isAnyProcessing || !onAction}
          onClick={() => isActionable && onAction?.(buildReceipt(row))}
        >
          {isProcessing ? 'Processing…' : canCancel ? 'Cancel' : 'Claim'}
        </Button>
      </div>
    )
  }

  const renderAmountCell = (row: RwaReceiptHistoryRow): ReactNode => {
    const primary = primaryAmount(row, vaultSharePrice)
    const settled = row.settledAmount != null ? new BigNumber(row.settledAmount) : null

    return (
      <TableCellNodes>
        <TableRowAccent backgroundColor={accentColor(row)} />
        <Icon tokenName={tokenSymbol as TokenSymbolsList} variant="m" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 'var(--general-space-4)',
            minWidth: '130px',
          }}
        >
          <Text as="span" variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
            {primary ? formatCryptoBalance(primary) : '-'} {tokenSymbol}
          </Text>
          <Text as="span" variant="p4" style={{ color: secondaryColor }}>
            {row.side === 'withdrawal' && settled ? (
              <>
                {formatCryptoBalance(settled)}&nbsp;{tokenSymbol}&nbsp;
              </>
            ) : (
              ''
            )}
            &nbsp;
            {statusLabel(row)}
          </Text>
        </div>
      </TableCellNodes>
    )
  }

  // Expandable per-row details: the request tx, the settled amount (once known) and the claim tx,
  // surfaced progressively as the round moves Requested → In settlement → Settled.
  const renderDetails = (row: RwaReceiptHistoryRow): ReactNode => {
    const txLink = (label: string, txHash: string) => (
      <Link href={getScannerUrl(chainId, txHash)} target="_blank" rel="noreferrer">
        <WithArrow as="span" variant="p4semi" style={{ color: 'var(--color-text-link)' }}>
          {label}
        </WithArrow>
      </Link>
    )
    const detailRow = (label: string, value: ReactNode) => (
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--general-space-24)' }}
      >
        <Text as="span" variant="p4" style={{ color: secondaryColor }}>
          {label}
        </Text>
        <Text as="span" variant="p4semi" style={{ color: 'var(--color-text-primary)' }}>
          {value}
        </Text>
      </div>
    )
    const settledValue =
      row.settledAmount != null
        ? `${formatCryptoBalance(new BigNumber(row.settledAmount))} ${row.settledSymbol ?? tokenSymbol}`
        : null

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          width: '100%',
          gap: 'var(--general-space-8) var(--general-space-64)',
        }}
      >
        {detailRow(
          'Request transaction',
          row.requestTxHash ? txLink('View transaction', row.requestTxHash) : '-',
        )}
        {row.roundState === 'IN_SETTLEMENT'
          ? detailRow('Amount settled to date', settledValue ?? 'Pending')
          : null}
        {row.roundState === 'SETTLED' ? detailRow('Amount settled', settledValue ?? '-') : null}
        {row.roundState === 'SETTLED' && row.claimTxHash
          ? detailRow('Claim transaction', txLink('View transaction', row.claimTxHash))
          : null}
      </div>
    )
  }

  const columns: TableColumn<ColumnKey>[] = [
    {
      title: `Pending and Completed ${activeSide === 'deposit' ? 'Deposits' : 'Withdrawals'}`,
      key: 'amount',
    },
    {
      title: activeSide === 'deposit' ? 'Deposit Date' : 'Requested Date',
      key: 'date',
    },
    { title: 'Settled Date', key: 'settledDate' },
    { title: <div style={{ width: '100%', textAlign: 'right' }}>Action</div>, key: 'action' },
  ]

  const rows: TableRow<ColumnKey>[] = filteredRows.map((row) => ({
    id: row.id,
    content: {
      amount: renderAmountCell(row),
      date: (
        <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary)' }}>
          {formatDateTime(row.requestedAt)}
        </Text>
      ),
      settledDate: (
        <Text as="span" variant="p3" style={{ color: secondaryColor }}>
          {formatDate(row.settledAt)}
        </Text>
      ),
      action: renderActionCell(row),
    },
    details: renderDetails(row),
  }))

  const tabButtonStyle = (active: boolean) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 0 var(--general-space-8) 0',
    borderBottom: `2px solid ${active ? 'var(--color-text-link)' : 'transparent'}`,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--general-space-16)' }}>
      <Text as="p" variant="p2" style={{ color: secondaryColor }}>
        {DESCRIPTION}
        <a href="mailto:institutions@summer.fi" style={{ color: 'var(--color-text-link)' }}>
          here
        </a>
        .
      </Text>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'var(--general-space-24)',
          marginBottom: 'var(--general-space-16)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--general-space-24)' }}>
          <button
            type="button"
            style={tabButtonStyle(activeSide === 'deposit')}
            onClick={() => setActiveSide('deposit')}
          >
            <Text
              as="span"
              variant="p2semi"
              style={{
                color:
                  activeSide === 'deposit'
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
              }}
            >
              Deposits
            </Text>
          </button>
          <button
            type="button"
            style={tabButtonStyle(activeSide === 'withdrawal')}
            onClick={() => setActiveSide('withdrawal')}
          >
            <Text
              as="span"
              variant="p2semi"
              style={{
                color:
                  activeSide === 'withdrawal'
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
              }}
            >
              Withdrawals
            </Text>
          </button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}>
          <Text as="span" variant="p3semi">
            Hide completed
          </Text>
          <ToggleButton
            checked={hideCompleted}
            onChange={() => setHideCompleted((value) => !value)}
          />
        </div>
      </div>

      <Table
        rows={rows}
        columns={columns}
        isLoading={activeQuery.isLoading}
        skeletonLines={4}
        noRowsContent={
          <Text as="p" variant="p3" style={{ color: secondaryColor }}>
            {activeSide === 'deposit' ? 'No deposits yet' : 'No withdrawals yet'}
          </Text>
        }
      />

      {activeQuery.hasNextPage ? (
        <button
          type="button"
          onClick={() => void activeQuery.fetchNextPage()}
          disabled={activeQuery.isFetchingNextPage}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--general-space-4)',
            background: 'none',
            border: 'none',
            cursor: activeQuery.isFetchingNextPage ? 'default' : 'pointer',
            margin: 'var(--general-space-16) auto 0 auto',
          }}
        >
          <Text as="span" variant="p3semi" style={{ color: 'var(--color-text-link)' }}>
            {activeQuery.isFetchingNextPage ? 'Loading…' : 'View more'}
          </Text>
          {activeQuery.isFetchingNextPage ? null : (
            <Icon iconName="chevron_down" variant="xxs" color="var(--color-text-link)" />
          )}
        </button>
      ) : null}

      {actionError ? (
        <Text
          as="p"
          variant="p4"
          style={{
            color: 'var(--earn-protocol-critical-100)',
            marginTop: 'var(--general-space-8)',
          }}
        >
          {actionError}
        </Text>
      ) : null}
    </div>
  )
}
