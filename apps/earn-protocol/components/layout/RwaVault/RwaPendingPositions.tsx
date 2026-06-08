import { Button, Card, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { RoundsVaultType } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

import { getRwaReceiptKey } from '@/hooks/use-rwa-claim'
import { type RwaReceipt } from '@/hooks/use-rwa-receipts'

type RwaPendingPositionsProps = {
  receipts: RwaReceipt[]
  isLoading: boolean
  // Receipt amounts are displayed in the vault's underlying asset terms (see note below).
  tokenSymbol: string
  tokenDecimals: number
  // Current vault share price in underlying-asset terms. Used to estimate the USDC
  // value of Output vault receipts that have not yet settled (no exchange rate available).
  vaultSharePrice?: BigNumber
  actionInProgressKey?: string
  error?: string
  onAction: (receipt: RwaReceipt) => void
}

// The "cancellable" (round still open) label depends on the rounds-vault side: an Input receipt is
// a pending deposit, an Output receipt a pending withdrawal.
const statusLabel = (receipt: RwaReceipt): string => {
  if (receipt.status === 'claimable') {
    return 'Claimable'
  }
  if (receipt.status === 'pending') {
    return 'Settling'
  }

  return receipt.vaultType === RoundsVaultType.Input ? 'Pending deposit' : 'Pending withdrawal'
}

const statusColor = {
  claimable: 'var(--earn-protocol-success-100)',
  cancellable: 'var(--earn-protocol-secondary-60)',
  pending: 'var(--earn-protocol-secondary-60)',
}

const actionLabel = (receipt: RwaReceipt): string => {
  if (receipt.status === 'cancellable') {
    return 'Cancel'
  }

  return receipt.vaultType === RoundsVaultType.Input ? 'Claim shares' : 'Claim assets'
}

/**
 * Lists the connected wallet's pending RWA positions (ERC-1155 receipts) with their
 * round, status and the available action (claim once settled, or cancel while the
 * round is still open). Mirrors the simple Card/Text style used across the app.
 *
 * NOTE: receipt balances are formatted using the vault's underlying-asset decimals,
 * consistent with how the app denominates positions. Revisit if the RWA SDK exposes
 * per-receipt token metadata.
 */
export const RwaPendingPositions = ({
  receipts,
  isLoading,
  tokenSymbol,
  tokenDecimals,
  vaultSharePrice,
  actionInProgressKey,
  error,
  onAction,
}: RwaPendingPositionsProps) => {
  // Nothing to show: keep the sidebar clean rather than rendering an empty card.
  if (!isLoading && receipts.length === 0) {
    return null
  }

  return (
    <Card
      variant="cardSecondary"
      style={{ flexDirection: 'column', gap: 'var(--general-space-12)' }}
    >
      <Text as="p" variant="h5">
        Your pending positions
      </Text>

      {isLoading && receipts.length === 0 ? (
        <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          Loading…
        </Text>
      ) : null}

      {receipts.map((receipt) => {
        const key = getRwaReceiptKey(receipt)
        const isProcessing = actionInProgressKey === key
        const isAnyProcessing = actionInProgressKey !== undefined
        const typeLabel = receipt.vaultType === RoundsVaultType.Input ? 'Deposit' : 'Withdrawal'
        const sharesBalance = new BigNumber(receipt.balance.toString()).shiftedBy(-tokenDecimals)
        // Output vault receipts hold fleet shares, not underlying assets. Convert to USDC
        // using the settlement exchange rate (settled rounds) or the current share price
        // (unsettled estimate) so the display is consistent with the rest of the UI.
        const humanBalance =
          receipt.vaultType === RoundsVaultType.Output
            ? receipt.exchangeRate && !new BigNumber(receipt.exchangeRate.value).isZero()
              ? // On-chain IPrice value is shares/USDC (receipt units per asset), so divide to get USDC.
                sharesBalance.div(new BigNumber(receipt.exchangeRate.value))
              : vaultSharePrice
                ? // vaultSharePrice is USDC/shares (position netValue / positionShares), so multiply.
                  sharesBalance.times(vaultSharePrice)
                : sharesBalance
            : sharesBalance

        return (
          <Card
            key={key}
            variant="cardPrimary"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-8)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text as="p" variant="p3semi">
                Round #{receipt.roundId.toString()} · {typeLabel}
              </Text>
              <Text as="span" variant="p4semi" style={{ color: statusColor[receipt.status] }}>
                {statusLabel(receipt)}
              </Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text as="span" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                {formatCryptoBalance(humanBalance)} {tokenSymbol}
              </Text>

              {receipt.status === 'pending' ? (
                <Text as="span" variant="p4" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                  Awaiting settlement
                </Text>
              ) : (
                <Button
                  variant={receipt.status === 'claimable' ? 'primarySmall' : 'secondarySmall'}
                  disabled={isAnyProcessing}
                  onClick={() => onAction(receipt)}
                >
                  {isProcessing ? 'Processing…' : actionLabel(receipt)}
                </Button>
              )}
            </div>
          </Card>
        )
      })}

      {error ? (
        <Text as="p" variant="p4" style={{ color: 'var(--earn-protocol-critical-100)' }}>
          {error}
        </Text>
      ) : null}
    </Card>
  )
}
