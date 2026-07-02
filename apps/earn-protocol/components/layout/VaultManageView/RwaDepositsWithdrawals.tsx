'use client'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  ERROR_TOAST_CONFIG,
  getScannerUrl,
  Icon,
  SUCCESS_TOAST_CONFIG,
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
import { RwaCancelModalButton } from '@/components/layout/VaultManageView/RwaCancelModalButton'
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
  // The user's current settled Fleet position value in the input asset (USDC). Used as the base for
  // the min-position cancel check (resulting overall position must be zero or >= the minimum).
  positionNetValue?: BigNumber
  // Pre-claim RWA position: `positionNetValue` is synthesized from total exposure (already includes
  // the pending deposit), so the settled base is treated as zero and the live receipt balances are
  // added instead — avoids double-counting the very deposit being cancelled.
  isRwaPendingPosition?: boolean
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

// Turn the raw SDK/wallet error into a short, human-readable toast message.
const parseActionError = (raw: string): string => {
  const lower = raw.toLowerCase()

  if (
    lower.includes('user rejected') ||
    lower.includes('user denied') ||
    lower.includes('rejected the request')
  ) {
    return 'Transaction rejected'
  }

  // Blockchain/wallet errors can be very long — keep just the first line, capped for readability.
  const firstLine = raw.split('\n')[0].trim()

  return firstLine.length > 140 ? `${firstLine.slice(0, 139)}…` : firstLine
}

// `cancelAmount` (base units) redeems only part of the receipt on a cancel; omit it (claims, or a
// full cancel) to act on the whole balance.
const buildReceipt = (row: RwaReceiptHistoryRow, cancelAmount?: bigint): RwaReceipt => ({
  vaultType: row.side === 'deposit' ? RoundsVaultType.Input : RoundsVaultType.Output,
  roundId: BigInt(row.roundId),
  balance: BigInt(row.balance),
  roundState: toRoundState(row.roundState),
  // Only ever read for actionable (claimable/cancellable) rows; completed rows render no action.
  status: row.status as RwaReceiptStatus,
  amount: cancelAmount,
})

export const RwaDepositsWithdrawals = ({
  network,
  vaultId,
  walletAddress,
  enabled,
  tokenSymbol,
  vaultSharePrice,
  positionNetValue,
  isRwaPendingPosition = false,
  actionInProgressKey,
  actionError,
  onAction,
}: RwaDepositsWithdrawalsProps) => {
  const [activeSide, setActiveSide] = useState<RwaReceiptHistorySide>('deposit')
  const [hideCompleted, setHideCompleted] = useState(false)
  const chainId = subgraphNetworkToId(network)

  // Toast the outcome of a table-triggered claim/cancel. `actionInProgressKey`/`actionError` come
  // only from this table's onAction (useRwaClaim), so an action finishing = key clears: success if
  // no error, otherwise the parsed error. A ref tracks the verb so the message reads naturally.
  const lastActionVerbRef = useRef<'claimed' | 'cancelled'>('claimed')
  const prevActionKeyRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const wasInProgress = prevActionKeyRef.current !== undefined

    prevActionKeyRef.current = actionInProgressKey

    // Only react to the transition from "in progress" → "done".
    if (!wasInProgress || actionInProgressKey !== undefined) {
      return
    }

    if (actionError) {
      toast.error(parseActionError(actionError), ERROR_TOAST_CONFIG)
    } else {
      toast.success(`Successfully ${lastActionVerbRef.current}`, SUCCESS_TOAST_CONFIG)
    }
  }, [actionInProgressKey, actionError])

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

  // Sum of all loaded receipt balances on the active side (native base units). For deposits these are
  // the user's pending deposits, which all settle into the eventual position. Bounded by what's been
  // loaded — with many pages the floor can be under-counted (the on-chain check is the backstop).
  const sumLoadedBalances = loadedRows.reduce((acc, row) => acc + BigInt(row.balance), 0n)

  // The redeem-independent part of the user's resulting position (in input-asset / USDC base units)
  // plus the factor to value this receipt's cancelled amount in USDC. The modal adds the
  // amount-dependent part and enforces that the resulting overall position is zero or >= the minimum.
  const buildCancelPosition = (row: RwaReceiptHistoryRow) => {
    // Settled Fleet position in input-asset base units. Zeroed for a pre-claim RWA position (whose
    // synthetic netValue already includes the pending deposit) so it isn't double-counted; fleet
    // shares and the input asset share decimals, so a single shift covers both sides.
    const settledBaseUnits =
      isRwaPendingPosition || !positionNetValue || positionNetValue.lte(0)
        ? 0n
        : BigInt(
            positionNetValue
              .shiftedBy(row.underlyingDecimals)
              .integerValue(BigNumber.ROUND_FLOOR)
              .toString(),
          )

    if (row.side === 'deposit') {
      // Other pending deposits (besides this receipt) also settle into the position; deposit receipts
      // are already denominated in the input asset, so the USDC factor is 1.
      const otherPending = sumLoadedBalances - BigInt(row.balance)

      return {
        positionFloorBaseUnits: settledBaseUnits + (otherPending > 0n ? otherPending : 0n),
        usdcPerNative: '1',
      }
    }

    // Withdrawal: cancelling returns shares to the settled position (other pending withdrawals leave
    // and don't count). The receipt is in shares, valued in USDC via the current share price.
    return {
      positionFloorBaseUnits: settledBaseUnits,
      usdcPerNative: vaultSharePrice?.gt(0) ? vaultSharePrice.toString() : '1',
    }
  }

  const renderActionCell = (row: RwaReceiptHistoryRow): ReactNode => {
    if (row.status === 'completed') {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: '120px' }}>
          <Text as="span" variant="p3" style={{ color: secondaryColor }}>
            Claimed
          </Text>
        </div>
      )
    }

    // While a round is open the pending deposit OR withdrawal can be cancelled (in full or part) via
    // a modal, redeeming the queued asset back 1:1; once settled it becomes claimable instead.
    if (row.status === 'cancellable') {
      const { positionFloorBaseUnits, usdcPerNative } = buildCancelPosition(row)

      return (
        <RwaCancelModalButton
          row={row}
          tokenSymbol={tokenSymbol}
          positionFloorBaseUnits={positionFloorBaseUnits}
          usdcPerNative={usdcPerNative}
          disabled={!onAction}
          actionInProgressKey={actionInProgressKey}
          actionError={actionError}
          onConfirm={(cancelAmount) => {
            lastActionVerbRef.current = 'cancelled'
            onAction?.(buildReceipt(row, cancelAmount))
          }}
        />
      )
    }

    const key = getRwaReceiptKey({
      vaultType: row.side === 'deposit' ? RoundsVaultType.Input : RoundsVaultType.Output,
      roundId: BigInt(row.roundId),
    })
    const isProcessing = actionInProgressKey === key
    const isAnyProcessing = actionInProgressKey !== undefined

    const canClaim = row.status === 'claimable'

    return (
      // Stop row-expand toggling when interacting with the action.
      <div
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <Button
          variant={canClaim ? 'primarySmall' : 'secondarySmall'}
          disabled={!canClaim || isAnyProcessing || !onAction}
          onClick={() => {
            if (!canClaim) {
              return
            }
            lastActionVerbRef.current = 'claimed'
            onAction?.(buildReceipt(row))
          }}
        >
          {isProcessing ? 'Processing…' : 'Claim'}
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
    </div>
  )
}
