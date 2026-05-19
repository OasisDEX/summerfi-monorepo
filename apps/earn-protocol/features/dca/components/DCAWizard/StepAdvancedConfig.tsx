import { type FC, useEffect, useState } from 'react'
import { DatePicker, Input, Text } from '@summerfi/app-earn-ui'

import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { type DCAConfig } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface StepAdvancedConfigProps {
  config: DCAConfig
  sourceSymbol: string
  targetSymbol: string
  isSourceEthVault: boolean
  isTargetEthVault: boolean
  ethPrice: number
  patchConfig: (patch: Partial<DCAConfig>) => void
}

export const StepAdvancedConfig: FC<StepAdvancedConfigProps> = ({
  config,
  sourceSymbol,
  targetSymbol,
  isSourceEthVault,
  isTargetEthVault,
  ethPrice,
  patchConfig,
}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 960px)')
    const onChange = (mediaQueryEvent: MediaQueryListEvent) => setIsMobile(mediaQueryEvent.matches)

    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const isNeverBuyAbove = isTargetEthVault
  const isNeverSellBelow = !isNeverBuyAbove && isSourceEthVault

  const thresholdTitle = isNeverBuyAbove
    ? 'Never buy above'
    : isNeverSellBelow
      ? 'Never sell below'
      : null
  const thresholdDescription = isNeverBuyAbove
    ? `Skip executions when ${targetSymbol} trades above this price.`
    : isNeverSellBelow
      ? `Skip executions when ${sourceSymbol} trades below this price.`
      : null
  const currentEthPriceLabel = `Current ETH price: $${ethPrice.toLocaleString()}`
  const thresholdValue = isNeverBuyAbove ? config.neverBuyAbove : config.neverSellBelow

  const handleThresholdChange = (value: number | undefined) => {
    if (isNeverBuyAbove) {
      patchConfig({ neverBuyAbove: value })

      return
    }

    if (isNeverSellBelow) {
      patchConfig({ neverSellBelow: value })
    }
  }

  const handleDeadlineChange = (date: Date | undefined) => {
    patchConfig({ deadline: date ? date.toISOString() : undefined })
  }

  return (
    <DCAWizardStepCard title="Step 4 - Advanced configuration">
      <div className={classNames.conditionsStack}>
        {thresholdTitle && thresholdDescription ? (
          <div className={classNames.conditionCardContent}>
            <div className={classNames.conditionHeader}>
              <div>
                <Text as="h4" variant="p2semi">
                  {thresholdTitle}
                </Text>
              </div>
            </div>
            <Input
              variant="dark"
              type="number"
              min={0}
              step="any"
              value={thresholdValue ?? ''}
              onChange={(ev) => {
                const nextValue = ev.target.value

                if (nextValue === '') {
                  handleThresholdChange(undefined)

                  return
                }

                handleThresholdChange(Number(nextValue))
              }}
            />
            <Text as="p" variant="p4" className={classNames.mutedText}>
              {thresholdDescription}
              <br />
              {currentEthPriceLabel}
            </Text>
          </div>
        ) : null}

        <div className={classNames.conditionCardContent}>
          <div className={classNames.conditionHeader}>
            <div>
              <Text as="h4" variant="p2semi">
                Maximum Number of Trades
              </Text>
            </div>
          </div>
          <Input
            variant="dark"
            type="number"
            min={1}
            step={1}
            value={config.maxTrades ?? ''}
            onChange={(ev) => {
              const nextValue = ev.target.value

              if (nextValue === '') {
                patchConfig({ maxTrades: undefined })

                return
              }

              patchConfig({ maxTrades: Number(nextValue) })
            }}
          />
          <Text as="p" variant="p4" className={classNames.mutedText}>
            Stop the strategy after this many successful trades.
          </Text>
        </div>

        <div className={classNames.conditionCardContent}>
          <div className={classNames.conditionHeader}>
            <div>
              <Text as="h4" variant="p2semi">
                Only trade until
              </Text>
            </div>
          </div>
          <DatePicker
            isMobile={isMobile}
            onChange={handleDeadlineChange}
            value={config.deadline ? new Date(config.deadline) : undefined}
          />
          <Text as="p" variant="p4" className={classNames.mutedText}>
            Stop the strategy once this date is reached.
          </Text>
        </div>
      </div>
    </DCAWizardStepCard>
  )
}
