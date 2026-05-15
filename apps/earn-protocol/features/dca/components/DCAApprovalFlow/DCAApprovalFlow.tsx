'use client'

import { type FC, useEffect } from 'react'
import { Button, Card, Icon, Text } from '@summerfi/app-earn-ui'

import { useDCAApproval } from '@/features/dca/hooks/useDCAApproval'
import { type DCAConfig, type DCAResolvedPair } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface DCAApprovalFlowProps {
  config: DCAConfig
  pair: DCAResolvedPair
  onComplete: () => void
  onBack: () => void
}

export const DCAApprovalFlow: FC<DCAApprovalFlowProps> = ({ config, pair, onComplete, onBack }) => {
  const { steps, activeIndex, isComplete, runStep } = useDCAApproval()

  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(onComplete, 800)

      return () => clearTimeout(timeout)
    }

    return undefined
  }, [isComplete, onComplete])

  return (
    <div className={classNames.layout}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-16)' }}>
        <Card variant="cardPrimary">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-16)' }}>
            <div>
              <Text as="h3" variant="h4">
                Authorize your DCA strategy
              </Text>
              <Text
                as="p"
                variant="p3"
                style={{ color: 'var(--earn-protocol-secondary-100)', opacity: 0.7 }}
              >
                Three signatures, one strategy. Funds remain in your wallet between executions.
              </Text>
            </div>

            {steps.map((step, index) => {
              const isActive = index === activeIndex && !isComplete
              const isDone = step.status === 'done'

              return (
                <div
                  key={step.id}
                  className={`${classNames.approvalStep} ${
                    isActive ? classNames.approvalStepActive : ''
                  }`}
                >
                  <div
                    className={`${classNames.approvalCircle} ${
                      isActive ? classNames.approvalCircleActive : ''
                    } ${isDone ? classNames.approvalCircleDone : ''}`}
                  >
                    {isDone ? '✓' : index + 1}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--general-space-8)',
                      flex: 1,
                    }}
                  >
                    <Text as="h4" variant="p1semi">
                      {step.title}
                    </Text>
                    <Text as="p" variant="p3" style={{ opacity: 0.7 }}>
                      {step.description}
                    </Text>
                    {step.errorMessage ? (
                      <Text
                        as="p"
                        variant="p3"
                        style={{ color: 'var(--earn-protocol-critical-100)' }}
                      >
                        {step.errorMessage}
                      </Text>
                    ) : null}

                    <div style={{ display: 'flex', gap: 'var(--general-space-8)' }}>
                      <Button
                        variant="primaryMedium"
                        disabled={!isActive || step.status === 'pending'}
                        onClick={() => runStep(index)}
                        style={{ minWidth: 'unset' }}
                      >
                        {step.status === 'pending'
                          ? 'Waiting…'
                          : isDone
                            ? 'Signed'
                            : index === 0
                              ? 'Approve'
                              : index === 1
                                ? 'Sign'
                                : 'Create strategy'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--general-space-12)',
              }}
            >
              <Button variant="secondaryLarge" onClick={onBack} style={{ minWidth: 'unset' }}>
                Back to wizard
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="cardSecondary">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-16)' }}>
          <Text as="h4" variant="h5">
            What you&apos;re signing
          </Text>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--general-space-8)',
              padding: 'var(--general-space-12)',
              borderRadius: 8,
              background: 'var(--earn-protocol-primary-100)',
            }}
          >
            <Icon tokenName={pair.fromVault.inputToken.symbol as never} size={24} />
            <Text as="span" variant="p2semi" style={{ opacity: 0.7 }}>
              →
            </Text>
            <Icon tokenName={pair.toVault.inputToken.symbol as never} size={24} />
            <Text as="span" variant="p3semi" style={{ marginLeft: 'auto' }}>
              {pair.fromVault.inputToken.symbol} → {pair.toVault.inputToken.symbol}
            </Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              {
                label: 'Amount per run',
                value: `${config.amount} ${pair.fromVault.inputToken.symbol}`,
              },
              {
                label: 'Frequency',
                value: `${config.frequency} day${config.frequency === 1 ? '' : 's'}`,
              },
              {
                label: 'Signatures progress',
                value: `${steps.filter((step) => step.status === 'done').length} / ${steps.length}`,
              },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 'var(--general-space-8) 0',
                  borderBottom: '1px solid var(--earn-protocol-secondary-60)',
                }}
              >
                <Text as="span" variant="p4" style={{ opacity: 0.7 }}>
                  {row.label}
                </Text>
                <Text as="span" variant="p3semi">
                  {row.value}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
