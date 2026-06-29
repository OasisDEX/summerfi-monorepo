import { type ChangeEvent, type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  LoadingSpinner,
  MobileDrawer,
  Modal,
  Text,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { RoundsVaultType } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import { formatUnits, parseUnits } from 'viem'

import { type RwaReceiptHistoryRow } from '@/app/server-handlers/rwa-receipts-history/get-rwa-receipts-history'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getRwaReceiptKey } from '@/hooks/use-rwa-claim'

const percentageButtons = [0.25, 0.5, 0.75, 1]

// Parse a human-readable decimal string into base units, returning null for empty/invalid input.
const parseAmount = (value: string, decimals: number): bigint | null => {
  const trimmed = value.trim()

  if (trimmed === '') {
    return null
  }

  try {
    return parseUnits(trimmed as `${number}`, decimals)
  } catch {
    return null
  }
}

const RwaCancelModal: FC<{
  row: RwaReceiptHistoryRow
  tokenSymbol: string
  // Redeem-independent part of the user's resulting position, in input-asset (USDC) base units.
  positionFloorBaseUnits: bigint
  // Factor to value this receipt's contribution in USDC (1 for deposits; the share price for
  // withdrawals, whose receipts are denominated in fleet shares).
  usdcPerNative: string
  isProcessing: boolean
  onConfirm: (cancelAmount: bigint) => void
}> = ({ row, tokenSymbol, positionFloorBaseUnits, usdcPerNative, isProcessing, onConfirm }) => {
  const isDeposit = row.side === 'deposit'
  const decimals = row.underlyingDecimals
  const balance = BigInt(row.balance)
  // minPositionSize is the Fleet minimum in the input asset (USDC) base units.
  const minPositionSize = BigInt(row.minPositionSize)

  // Withdrawal receipts are denominated in fleet shares; deposits in the input asset (e.g. USDC).
  const unitLabel = isDeposit ? tokenSymbol : 'shares'
  const fullHuman = formatUnits(balance, decimals)

  const [amountStr, setAmountStr] = useState(fullHuman)

  // The base-unit amount to redeem. Treat "at or above the full balance" as an exact full-balance
  // cancel so rounding in the human string can't leave sub-minimum dust behind.
  const redeemAmount = useMemo(() => {
    const parsed = parseAmount(amountStr, decimals)

    if (parsed === null || parsed <= 0n) {
      return 0n
    }

    return parsed >= balance ? balance : parsed
  }, [amountStr, balance, decimals])

  // The user's resulting overall position (USDC base units) after this cancel. A deposit's
  // *uncancelled* remainder stays queued and settles into the position; a withdrawal's *cancelled*
  // part returns to the position. minPositionSize constrains this whole position, not one receipt.
  const nativeContribution = isDeposit ? balance - redeemAmount : redeemAmount
  const usdcContribution = BigInt(
    new BigNumber(nativeContribution.toString())
      .times(usdcPerNative)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString(),
  )
  const resultingPosition = positionFloorBaseUnits + usdcContribution

  // The on-chain validateMinPosition modifier reverts when the resulting position lands in the
  // forbidden (0, min) band — it must be exactly zero (full exit) or at least the minimum.
  const resultingBelowMin = resultingPosition > 0n && resultingPosition < minPositionSize
  const amountValid = redeemAmount > 0n && redeemAmount <= balance && !resultingBelowMin

  const minLabel = formatCryptoBalance(new BigNumber(formatUnits(minPositionSize, decimals)))
  const resultingLabel = formatCryptoBalance(
    new BigNumber(formatUnits(resultingPosition, decimals)),
  )

  const percentBaseUnits = (percent: number): bigint =>
    percent >= 1 ? balance : (balance * BigInt(Math.round(percent * 100))) / 100n

  const handleInputChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { value } = changeEvent.target

    // Allow only a numeric/decimal string (or empty while editing).
    if (value !== '' && !/^\d*\.?\d*$/u.test(value)) {
      return
    }

    const parsed = parseAmount(value, decimals)

    // Clamp anything above the receipt balance to the full amount.
    if (parsed !== null && parsed > balance) {
      setAmountStr(fullHuman)

      return
    }

    setAmountStr(value)
  }

  return (
    <Card variant="cardSecondary" style={{ maxWidth: '446px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--general-space-12)',
          padding: 'var(--general-space-8)',
        }}
      >
        <Text
          as="h5"
          variant="h5"
          style={{ marginBottom: 'var(--general-space-4)', textAlign: 'center' }}
        >
          Cancel {isDeposit ? 'deposit' : 'withdrawal'}
        </Text>
        <Text variant="p3" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          {isDeposit
            ? `Cancel your pending deposit and return the queued ${tokenSymbol} to your wallet. While the round is open you can cancel the full amount or part of it.`
            : `Cancel your pending withdrawal and return the queued shares to your vault position. While the round is open you can cancel the full amount or part of it.`}
        </Text>
        <Text variant="p3" style={{ marginBottom: 'var(--general-space-8)', textAlign: 'center' }}>
          You can cancel up to{' '}
          <strong>
            {formatCryptoBalance(new BigNumber(fullHuman))} {unitLabel}
          </strong>
          .
        </Text>

        <Input
          placeholder="0.00"
          variant="dark"
          inputWrapperStyles={{ textAlign: 'center' }}
          value={amountStr}
          onChange={handleInputChange}
        />

        <div
          style={{
            display: 'flex',
            gap: 'var(--general-space-8)',
            justifyContent: 'space-between',
          }}
        >
          {percentageButtons.map((percent) => (
            <Badge
              key={percent}
              value={`${percent * 100}%`}
              disabled={isProcessing}
              onClick={() => setAmountStr(formatUnits(percentBaseUnits(percent), decimals))}
              isActive={redeemAmount > 0n && redeemAmount === percentBaseUnits(percent)}
            />
          ))}
        </div>

        {resultingBelowMin ? (
          <Alert
            variant="warning"
            noIcon
            error={
              <>
                This would leave your position at ~{resultingLabel} {tokenSymbol}, below the{' '}
                {minLabel} {tokenSymbol} minimum.{' '}
                {isDeposit
                  ? 'Cancel a smaller amount, or the full balance.'
                  : 'Cancel a larger amount (or nothing) so your position is zero or above the minimum.'}
              </>
            }
          />
        ) : null}

        <Button
          variant="primarySmall"
          style={{ marginTop: 'var(--general-space-8)' }}
          disabled={!amountValid || isProcessing}
          onClick={!amountValid || isProcessing ? undefined : () => onConfirm(redeemAmount)}
        >
          {isProcessing ? (
            <LoadingSpinner size={20} />
          ) : (
            `Cancel ${isDeposit ? 'deposit' : 'withdrawal'}`
          )}
        </Button>
      </div>
    </Card>
  )
}

/**
 * Renders the per-receipt "Cancel" button for an OPENED-round deposit/withdrawal, opening a modal
 * (or mobile drawer) that lets the user cancel the full balance or a partial amount. The actual
 * transaction is owned by the parent (shared useRwaClaim wiring) and triggered via `onConfirm`; the
 * modal auto-closes once that action completes successfully.
 */
export const RwaCancelModalButton: FC<{
  row: RwaReceiptHistoryRow
  tokenSymbol: string
  // Redeem-independent part of the resulting position (input-asset base units) + the USDC valuation
  // factor for this receipt — see RwaCancelModal.
  positionFloorBaseUnits: bigint
  usdcPerNative: string
  // True when no action handler is wired (e.g. a non-owner view) — keeps the button inert.
  disabled: boolean
  actionInProgressKey?: string
  actionError?: string
  onConfirm: (cancelAmount: bigint) => void
}> = ({
  row,
  tokenSymbol,
  positionFloorBaseUnits,
  usdcPerNative,
  disabled,
  actionInProgressKey,
  actionError,
  onConfirm,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenClose = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const receiptKey = getRwaReceiptKey({
    vaultType: row.side === 'deposit' ? RoundsVaultType.Input : RoundsVaultType.Output,
    roundId: BigInt(row.roundId),
  })
  const isProcessing = actionInProgressKey === receiptKey
  const isAnyProcessing = actionInProgressKey !== undefined

  // Close the modal once this row's cancel completes without error (in-progress → cleared). On
  // error the modal stays open so the user can see the toast and retry.
  const wasProcessingRef = useRef(false)

  useEffect(() => {
    if (isProcessing) {
      wasProcessingRef.current = true

      return
    }

    if (wasProcessingRef.current) {
      wasProcessingRef.current = false

      if (!actionError) {
        setIsOpen(false)
      }
    }
  }, [isProcessing, actionError])

  const modalContent = (
    <RwaCancelModal
      row={row}
      tokenSymbol={tokenSymbol}
      positionFloorBaseUnits={positionFloorBaseUnits}
      usdcPerNative={usdcPerNative}
      isProcessing={isProcessing}
      onConfirm={onConfirm}
    />
  )

  return (
    // Stop row-expand toggling when interacting with the action.
    <div
      style={{ display: 'flex', justifyContent: 'flex-end' }}
      onClick={(clickEvent) => clickEvent.stopPropagation()}
    >
      <Button
        variant="secondarySmall"
        disabled={disabled || (isAnyProcessing && !isProcessing)}
        onClick={handleOpenClose}
      >
        {isProcessing ? 'Processing…' : 'Cancel'}
      </Button>
      {isMobileOrTablet ? (
        <MobileDrawer isOpen={isOpen} onClose={handleOpenClose} height="auto">
          {modalContent}
        </MobileDrawer>
      ) : (
        <Modal openModal={isOpen} closeModal={handleOpenClose} noScroll>
          {modalContent}
        </Modal>
      )}
    </div>
  )
}
