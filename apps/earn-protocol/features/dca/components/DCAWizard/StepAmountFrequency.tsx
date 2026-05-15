import { type FC } from 'react'
import { Icon, Input, Text, TextNumberAnimated } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { type PeriodSummary } from '@/features/dca/hooks/usePeriodSummaries'
import {
  FREQUENCY_OPTIONS,
  type FrequencyOptionId,
  MAX_FREQUENCY_DAYS,
} from '@/features/dca/lib/dca-wizard-constants'

import classNames from '@/features/dca/components/dca.module.css'

interface StepAmountFrequencyProps {
  amount: number
  frequencyDays: number
  selectedFrequencyOption: FrequencyOptionId
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

      <div className={classNames.step3Row}>
        <div className={classNames.step3InputsColumn}>
          <Input
            variant="dark"
            type="number"
            min={0}
            step="any"
            value={Number.isFinite(amount) ? amount : ''}
            inputWrapperStyles={{ border: '1px solid var(--earn-protocol-neutral-80)' }}
            onChange={(ev) => onAmountChange(Number(ev.target.value))}
            button={
              <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                {sourceSymbol}
              </Text>
            }
          />
          <Input
            variant="dark"
            id="dca-frequency-days-input"
            type="number"
            min={1}
            max={MAX_FREQUENCY_DAYS}
            step="1"
            value={frequencyDays}
            inputWrapperStyles={{ border: '1px solid var(--earn-protocol-neutral-80)' }}
            onChange={(ev) =>
              onFrequencyChange(Math.max(1, Math.min(MAX_FREQUENCY_DAYS, Number(ev.target.value))))
            }
            button={
              <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                Days
              </Text>
            }
          />
        </div>
        <div className={classNames.pricePreviewBlock}>
          <Text as="p" variant="p3" className={classNames.mutedText}>
            {targetSymbol} you will receive at current price
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

      <div className={classNames.statsGrid}>
        {periodSummaries.map((summary) => (
          <div key={summary.days} className={classNames.kpiCard}>
            <Text as="p" variant="p2semi" className={classNames.mutedText}>
              {summary.days >= 365 && summary.days % 365 === 0
                ? `${summary.days / 365} year${summary.days / 365 === 1 ? '' : 's'}`
                : `${summary.days} days`}
            </Text>
            <Text as="span" variant="p4" className={classNames.mutedText}>
              Spend ~{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {summary.totalSourceAmount ? formatCryptoBalance(summary.totalSourceAmount) : 0}
              &nbsp;{sourceSymbol}
            </Text>
            <Text as="span" variant="p4" className={classNames.mutedText}>
              Accumulate ~
              {summary.totalTargetAmount ? formatCryptoBalance(summary.totalTargetAmount) : 0}
              &nbsp;{targetSymbol}
            </Text>
          </div>
        ))}
      </div>
      <div className={classNames.previewControls}>
        <button
          type="button"
          className={classNames.previewControlButton}
          onClick={onPreviewPrevious}
          disabled={!canPreviewPrevious}
        >
          <Icon iconName="arrow_backward" size={16} />
        </button>
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
