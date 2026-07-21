'use client'

import { type FC, useEffect } from 'react'
import { Button, Card, LoadingSpinner, Modal, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { formatUnits } from 'viem'
import { useAccount, useSwitchChain } from 'wagmi'

import { CHAIN_LABELS } from '@/constants/chains'
import { useAutoCloseCountdown } from '@/hooks/useAutoCloseCountdown'
import { type StepStatus, type UnstakeRequest, useUnstakeFlow } from '@/hooks/useUnstakeFlow'
import { type UnstakeStepType } from '@/lib/unstake-plan'

const statusLabels: { [status in StepStatus]: string } = {
  pending: '',
  'in-progress': 'Waiting for confirmation…',
  done: 'Done',
  error: 'Failed — you can retry',
}

const stepDescriptions: { [type in UnstakeStepType]: string } = {
  approve:
    'A one-time permission that lets the staking contract move your staked SUMR receipt token. No funds leave your wallet in this step.',
  unstake:
    'Returns your staked SUMR to your wallet. If this stake is still locked, an early-unstake penalty is deducted from the amount returned.',
  claim: "Collects the reward tokens you've earned from staking but haven't claimed yet.",
}

interface UnstakeModalProps {
  request: UnstakeRequest | null
  onClose: () => void
  /** Seamlessly re-fetch the SUMR staking data (no full-page reload). */
  onRefresh?: () => void
}

export const UnstakeModal: FC<UnstakeModalProps> = ({ request, onClose, onRefresh }) => {
  const { address, chainId: connectedChainId } = useAccount()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const flow = useUnstakeFlow(request, address)

  const position = request?.position ?? null
  const stake = request?.stake ?? null
  const onWrongChain = position !== null && connectedChainId !== position.chainId

  // Automatic seamless refresh: on success (unstake or claim done) refetch immediately; on a
  // failure after something already executed, refetch too. No full-page reload.
  useEffect(() => {
    if (flow.allDone) onRefresh?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.allDone])

  useEffect(() => {
    if (flow.errorMessage && flow.executedAny) onRefresh?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.errorMessage, flow.executedAny])

  // On success, auto-close after a visible 5s countdown; closing manually earlier resets it.
  const secondsLeft = useAutoCloseCountdown(flow.allDone, 5, onClose)

  const showPenalty =
    stake !== null &&
    stake.isLocked &&
    (position?.penaltyEnabled ?? false) &&
    (stake.penaltyAmount ?? 0n) > 0n

  const format = (amount: bigint, decimals = position?.sumrDecimals ?? 18) =>
    formatCryptoBalance(formatUnits(amount, decimals))

  const close = () => {
    // Any executed tx ⇒ seamlessly re-read (stake indices/rewards change on unstake). No reload.
    if (flow.executedAny) onRefresh?.()
    onClose()
  }

  const title = stake === null ? 'Claim rewards' : 'Unstake SUMR'

  return (
    <Modal openModal={request !== null} closeModal={close} withCloseButton>
      <Card
        variant="cardSecondary"
        style={{
          flexDirection: 'column',
          gap: 'var(--general-space-16)',
          width: 'min(440px, 92vw)',
        }}
      >
        <Text as="h5" variant="h5">
          {title}
        </Text>

        {flow.loading ? <LoadingSpinner /> : null}

        {showPenalty && stake && position ? (
          <Card variant="cardPrimary" style={{ flexDirection: 'column', gap: 8 }}>
            <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-warning-100)' }}>
              Early-unstake penalty
            </Text>
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              This stake is still locked. Unstaking now applies a{' '}
              {stake.penaltyPercentage?.toFixed(2)}% penalty of {format(stake.penaltyAmount ?? 0n)}{' '}
              {position.sumrSymbol}. You&apos;ll receive ≈{' '}
              {format(stake.amount - (stake.penaltyAmount ?? 0n))} {position.sumrSymbol}.
            </Text>
          </Card>
        ) : null}

        {!flow.loading
          ? flow.steps.map((step, index) => {
              const status = flow.statuses[index]
              const isCurrent = index === flow.currentIndex
              const locked = index > flow.currentIndex

              return (
                <Card
                  key={`${step.type}-${index}`}
                  variant="cardPrimary"
                  style={{ opacity: locked ? 0.5 : 1, flexDirection: 'column', gap: 8 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text as="p" variant="p2semi">
                      {index + 1}. {step.label}
                    </Text>
                    <Text
                      as="p"
                      variant="p3"
                      style={{
                        color:
                          status === 'done'
                            ? 'var(--earn-protocol-success-100)'
                            : status === 'error'
                              ? 'var(--earn-protocol-critical-100)'
                              : 'var(--earn-protocol-secondary-60)',
                      }}
                    >
                      {statusLabels[status]}
                    </Text>
                  </div>

                  <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                    {stepDescriptions[step.type]}
                  </Text>

                  {isCurrent && !flow.allDone ? (
                    onWrongChain ? (
                      <Button
                        variant="secondarySmall"
                        disabled={isSwitching}
                        onClick={() => position && switchChain({ chainId: position.chainId })}
                      >
                        {isSwitching
                          ? 'Switching…'
                          : `Switch to ${position ? CHAIN_LABELS[position.chainId] : ''}`}
                      </Button>
                    ) : (
                      <Button
                        variant="primarySmall"
                        disabled={status === 'in-progress'}
                        onClick={() => void flow.executeCurrent()}
                      >
                        {status === 'in-progress'
                          ? 'Confirm in wallet…'
                          : status === 'error'
                            ? 'Retry'
                            : 'Sign transaction'}
                      </Button>
                    )
                  ) : null}
                </Card>
              )
            })
          : null}

        {flow.errorMessage ? (
          <Text
            as="p"
            variant="p3"
            style={{
              color: 'var(--earn-protocol-critical-100)',
              overflowWrap: 'anywhere',
              maxHeight: 120,
              overflowY: 'auto',
            }}
          >
            {flow.errorMessage}
          </Text>
        ) : null}

        {flow.allDone ? (
          <>
            <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-success-100)' }}>
              {stake === null
                ? 'Rewards claimed — they are now in your wallet.'
                : 'Done — your SUMR is back in your wallet.'}
            </Text>
            <Text
              as="p"
              variant="p3"
              style={{ color: 'var(--earn-protocol-secondary-60)', textAlign: 'center' }}
            >
              This window will close after {secondsLeft} second{secondsLeft === 1 ? '' : 's'}
            </Text>
          </>
        ) : null}
      </Card>
    </Modal>
  )
}
