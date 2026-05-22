import { type ChangeEvent, type FC, useEffect, useRef, useState } from 'react'
import { Icon, Input, Text, TextNumberAnimated, useAmount } from '@summerfi/app-earn-ui'
import { type IToken } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { type PeriodSummary } from '@/features/dca/hooks/usePeriodSummaries'
import { FREQUENCY_OPTIONS, type FrequencyOptionId } from '@/features/dca/lib/dca-wizard-constants'

import classNames from '@/features/dca/components/dca.module.css'

interface StepAmountFrequencyProps {
  amount: number
  frequencyDays: number
  selectedFrequencyOption: FrequencyOptionId
  sourceTokenDecimals: number
  sourceSymbol: string
  targetSymbol: string
  estimatedTargetAmount: number | null
  sourceToTargetRate: number | null
  periodSummaries: PeriodSummary[]
  canPreviewPrevious: boolean
  canPreviewNext: boolean
  onPreviewPrevious: () => void
  onPreviewNext: () => void
  onAmountChange: (amount: number) => void
  onFrequencyChange: (frequencyDays: number) => void
}

export const StepAmountFrequency: FC<StepAmountFrequencyProps> = ({
  amount,
  frequencyDays,
  selectedFrequencyOption,
  sourceTokenDecimals,
  sourceSymbol,
  targetSymbol,
  estimatedTargetAmount,
  sourceToTargetRate,
  periodSummaries,
  canPreviewPrevious,
  canPreviewNext,
  onPreviewPrevious,
  onPreviewNext,
  onAmountChange,
  onFrequencyChange,
}) => {
  const [isAmountFocused, setIsAmountFocused] = useState(false)

  const {
    amountRaw,
    amountDisplay,
    handleAmountChange,
    manualSetAmount,
    onBlur: defaultOnBlur,
    onFocus: defaultOnFocus,
  } = useAmount({
    tokenDecimals: sourceTokenDecimals,
    selectedToken: {
      decimals: sourceTokenDecimals,
      symbol: sourceSymbol,
    } as IToken,
    initialAmount: amount.toString(),
    inputChangeHandler: ({ value }) => {
      onAmountChange(Number(value.split(' ')[0] ?? 0))
    },
    inputName: 'dca-amount',
  })

  const manualSetAmountRef = useRef(manualSetAmount)

  useEffect(() => {
    manualSetAmountRef.current = manualSetAmount
  }, [manualSetAmount])

  useEffect(() => {
    if (isAmountFocused) {
      return
    }

    const nextAmount = amount.toString()

    if (amountRaw === nextAmount) {
      return
    }

    manualSetAmountRef.current(nextAmount)
  }, [amount, amountRaw, isAmountFocused])

  const onAmountInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value === '') {
      manualSetAmount(undefined)
      onAmountChange(0)

      return
    }

    handleAmountChange(ev)
  }

  return (
    <DCAWizardStepCard title="Step 3 - Set up your amount and frequency">
      <div className={classNames.frequencyCardGrid}>
        {FREQUENCY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={option.disabled}
            onClick={() => {
              if (option.disabled) return

              if (option.id === 'custom') {
                document.getElementById('dca-frequency-days-input')?.focus()

                return
              }

              onFrequencyChange(option.days ?? 1)
            }}
            className={`${classNames.frequencyCard} ${
              selectedFrequencyOption === option.id ? classNames.frequencyCardActive : ''
            } ${option.disabled ? classNames.frequencyCardDisabled : ''}`}
          >
            <Text as="span" variant="p2semi">
              {option.label}
            </Text>
            <Text as="span" variant="p4" className={classNames.mutedText}>
              {option.sublabel}
            </Text>
          </button>
        ))}
      </div>

      <div className={classNames.amountRow}>
        <div className={classNames.amountInputsColumn}>
          <Input
            variant="dark"
            inputMode="decimal"
            value={amountDisplay}
            inputWrapperStyles={{ border: '1px solid var(--earn-protocol-neutral-80)' }}
            onChange={onAmountInputChange}
            onFocus={() => {
              setIsAmountFocused(true)
              defaultOnFocus()
            }}
            onBlur={() => {
              setIsAmountFocused(false)
              defaultOnBlur()
            }}
            button={
              isAmountFocused ? null : (
                <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                  {sourceSymbol}{' '}
                  <Text as="span" className={classNames.requiredStar}>
                    *
                  </Text>
                </Text>
              )
            }
          />
          <Input
            variant="dark"
            id="dca-frequency-days-input"
            type="number"
            min={1}
            max={90}
            step="1"
            value={frequencyDays}
            inputWrapperStyles={{ border: '1px solid var(--earn-protocol-neutral-80)' }}
            onChange={(ev) => onFrequencyChange(Math.max(1, Math.min(90, Number(ev.target.value))))}
            button={
              <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                Days{' '}
                <Text as="span" className={classNames.requiredStar}>
                  *
                </Text>
              </Text>
            }
          />
        </div>
        <div className={classNames.pricePreviewBlock}>
          <Text
            as="p"
            variant="p3"
            className={classNames.mutedText}
            style={{
              marginBottom: '-6px',
            }}
          >
            At current price
          </Text>
          <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
            {estimatedTargetAmount ? (
              <>
                <TextNumberAnimated value={estimatedTargetAmount} variant="h5" /> {targetSymbol}
              </>
            ) : (
              `— ${targetSymbol}`
            )}
          </Text>
          {sourceToTargetRate ? (
            <Text as="span" variant="p4" className={classNames.mutedText}>
              1 {sourceSymbol} ~={' '}
              <TextNumberAnimated
                value={sourceToTargetRate}
                format={{ maximumFractionDigits: targetSymbol === 'ETH' ? 8 : 4 }}
                variant="p4"
              />{' '}
              {targetSymbol}
            </Text>
          ) : null}
        </div>
      </div>

      <div className={classNames.periodSummariesContainer}>
        <button
          type="button"
          className={classNames.previewControlButton}
          onClick={onPreviewPrevious}
          disabled={!canPreviewPrevious}
        >
          <Icon iconName="arrow_backward" size={16} />
        </button>
        <div className={classNames.statsGrid}>
          {periodSummaries.map((summary, index) => {
            // Find first period where executions are capped (executions < runs)
            const isLimitMet = summary.executions < summary.runs
            // Don't render periods after limit is met
            const shouldRender = !periodSummaries.some((s, i) => i < index && s.executions < s.runs)

            if (!shouldRender) return null

            return (
              <div key={summary.days} className={classNames.kpiCard}>
                <Text as="p" variant="p2semi" className={classNames.mutedText}>
                  {summary.days >= 365 && summary.days % 365 === 0
                    ? `${summary.days / 365} year${summary.days / 365 === 1 ? '' : 's'}`
                    : `${summary.days} days`}
                </Text>
                <Text as="span" variant="p4" className={classNames.mutedText}>
                  Spend ~
                  {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                  {summary.totalSourceAmount ? formatCryptoBalance(summary.totalSourceAmount) : 0}
                  &nbsp;{sourceSymbol}
                </Text>
                <Text as="span" variant="p4" className={classNames.mutedText}>
                  Accumulate ~
                  {summary.totalTargetAmount ? formatCryptoBalance(summary.totalTargetAmount) : 0}
                  &nbsp;{targetSymbol}
                </Text>
                <Text as="span" variant="p4" className={classNames.mutedText}>
                  {summary.executions} execution{summary.executions === 1 ? '' : 's'}
                  {isLimitMet && ' (limit met)'}
                </Text>
              </div>
            )
          })}
        </div>
        <button
          type="button"
          className={classNames.previewControlButton}
          onClick={onPreviewNext}
          disabled={!canPreviewNext}
        >
          <Icon iconName="arrow_forward" size={16} />
        </button>
      </div>
    </DCAWizardStepCard>
  )
}
