'use client'

import { type FC, useEffect } from 'react'
import { Button, Card, LoadingSpinner, Modal, Text } from '@/components/ui'
import { useAccount, useSwitchChain } from 'wagmi'

import { CHAIN_LABELS } from '@/constants/chains'
import { useAutoCloseCountdown } from '@/hooks/useAutoCloseCountdown'
import { type StepStatus, useExitFlow } from '@/hooks/useExitFlow'
import { type ExitStepType } from '@/lib/exit-plan'
import { type FleetPosition } from '@/lib/positions'

const statusLabels: { [status in StepStatus]: string } = {
  pending: '',
  'in-progress': 'Waiting for confirmation…',
  done: 'Done',
  error: 'Failed — you can retry',
}

// Plain-language, one-line explanations of each on-chain step for non-technical users.
const stepDescriptions: { [type in ExitStepType]: string } = {
  approve:
    'A one-time permission that lets the Summer.fi withdrawal contract move your vault shares. No funds leave your wallet in this step.',
  exit: 'Converts your vault shares back into tokens and sends them to your wallet.',
  claim: "Collects any reward tokens you've earned but haven't claimed yet.",
}

interface ExitModalProps {
  position: FleetPosition | null
  onClose: () => void
  /** Seamlessly re-fetch the positions list (no full-page reload). */
  onRefresh?: () => void
}

export const ExitModal: FC<ExitModalProps> = ({ position, onClose, onRefresh }) => {
  const { address, chainId: connectedChainId } = useAccount()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const flow = useExitFlow(position, address)

  const onWrongChain = position !== null && connectedChainId !== position.chainId

  // Automatic seamless refresh: on success (whole flow done) refetch immediately; on a failure
  // after something already executed, refetch too (state may have partially changed). No reload.
  useEffect(() => {
    if (flow.allDone) onRefresh?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.allDone])

  useEffect(() => {
    if (flow.errorMessage && flow.executedAny) onRefresh?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.errorMessage, flow.executedAny])

  // On success, auto-close after a visible 5s countdown; closing manually earlier resets it.
  // (The list already refetched on allDone, so the countdown only needs to close.)
  const secondsLeft = useAutoCloseCountdown(flow.allDone, 5, onClose)

  const close = () => {
    // Closing after any executed tx still refreshes the list seamlessly (no reload).
    if (flow.executedAny) onRefresh?.()
    onClose()
  }

  return (
    <Modal openModal={position !== null} closeModal={close} withCloseButton>
      <Card
        variant="cardSecondary"
        style={{
          flexDirection: 'column',
          gap: 'var(--general-space-16)',
          width: 'min(440px, 92vw)',
        }}
      >
        <Text as="h5" variant="h5">
          Exit {position?.displayName ?? ''}
        </Text>

        {flow.loading ? <LoadingSpinner /> : null}

        {flow.paused ? (
          <Card variant="cardPrimary">
            <Text as="p" variant="p2">
              This vault is currently paused on-chain and withdrawals will fail. Please try again
              later.
            </Text>
          </Card>
        ) : null}

        {!flow.loading && !flow.paused
          ? flow.steps.map((step, index) => {
              const status = flow.statuses[index]
              const isCurrent = index === flow.currentIndex
              const locked = index > flow.currentIndex

              return (
                <Card
                  key={step.type}
                  variant="cardPrimary"
                  style={{
                    opacity: locked ? 0.5 : 1,
                    flexDirection: 'column',
                    gap: 8,
                  }}
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
              All done — your {position?.asset.symbol} is back in your wallet.
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
