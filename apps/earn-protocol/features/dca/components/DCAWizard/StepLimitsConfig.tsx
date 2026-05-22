import { type ChangeEvent, type FC, useEffect, useRef, useState } from 'react'
import { DatePicker, Input, Text, useAmount } from '@summerfi/app-earn-ui'
import { type IToken } from '@summerfi/app-types'

import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { DEFAULT_MAX_TRADES, MAX_TRADES } from '@/features/dca/lib/dca-wizard-constants'
import { type DCAConfig } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

const THRESHOLD_DECIMALS = 8

interface StepLimitsConfigProps {
  config: DCAConfig
  sourceSymbol: string
  targetSymbol: string
  isSourceEthVault: boolean
  isTargetEthVault: boolean
  ethPrice: number
  thresholdError: string | null
  patchConfig: (patch: Partial<DCAConfig>) => void
}

export const StepLimitsConfig: FC<StepLimitsConfigProps> = ({
  config,
  sourceSymbol,
  targetSymbol,
  isSourceEthVault,
  isTargetEthVault,
  ethPrice,
  thresholdError,
  patchConfig,
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isThresholdFocused, setIsThresholdFocused] = useState(false)

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
  const currentEthPriceValue = Number(ethPrice.toFixed(THRESHOLD_DECIMALS))
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

  const {
    amountRaw: thresholdRaw,
    amountDisplay: thresholdDisplay,
    handleAmountChange: handleThresholdAmountChange,
    manualSetAmount: manualSetThreshold,
    onBlur: defaultThresholdOnBlur,
    onFocus: defaultThresholdOnFocus,
  } = useAmount({
    tokenDecimals: THRESHOLD_DECIMALS,
    selectedToken: {
      decimals: THRESHOLD_DECIMALS,
      symbol: 'USD',
    } as IToken,
    initialAmount: thresholdValue?.toString(),
    inputChangeHandler: ({ value }) => {
      const parsedValue = Number(value.split(' ')[0] ?? 0)

      handleThresholdChange(Number.isFinite(parsedValue) ? parsedValue : undefined)
    },
    inputName: 'dca-threshold',
  })

  const manualSetThresholdRef = useRef(manualSetThreshold)

  useEffect(() => {
    manualSetThresholdRef.current = manualSetThreshold
  }, [manualSetThreshold])

  useEffect(() => {
    if (isThresholdFocused) {
      return
    }

    const nextThreshold = thresholdValue?.toString()

    if (thresholdRaw === nextThreshold) {
      return
    }

    manualSetThresholdRef.current(nextThreshold)
  }, [isThresholdFocused, thresholdRaw, thresholdValue])

  const handleDeadlineChange = (date: Date | undefined) => {
    patchConfig({ deadline: date ? date.toISOString() : undefined })
  }

  const minDeadlineDate = (() => {
    const tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    return tomorrow
  })()

  const onThresholdInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value === '') {
      manualSetThreshold(undefined)
      handleThresholdChange(undefined)

      return
    }

    handleThresholdAmountChange(ev)
  }

  const onCurrentEthPriceClick = () => {
    if (!Number.isFinite(currentEthPriceValue) || currentEthPriceValue <= 0) {
      return
    }

    const nextValue = currentEthPriceValue.toString()

    manualSetThresholdRef.current(nextValue)
    handleThresholdChange(currentEthPriceValue)
  }

  return (
    <DCAWizardStepCard title="Step 4 - Set limits and conditions">
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
            <Text as="p" variant="p4" className={classNames.mutedText}>
              {thresholdDescription}
            </Text>
            <Input
              variant="dark"
              inputMode="decimal"
              value={thresholdDisplay}
              onChange={onThresholdInputChange}
              onFocus={() => {
                setIsThresholdFocused(true)
                defaultThresholdOnFocus()
              }}
              onBlur={() => {
                setIsThresholdFocused(false)
                defaultThresholdOnBlur()
              }}
              button={
                isThresholdFocused ? null : (
                  <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                    {isTargetEthVault
                      ? `${targetSymbol}/${sourceSymbol}`
                      : `${sourceSymbol}/${targetSymbol}`}
                  </Text>
                )
              }
            />
            <Text as="p" variant="p4" className={classNames.mutedText}>
              Current price:{' '}
              <button
                type="button"
                className={classNames.currentPriceButton}
                onClick={onCurrentEthPriceClick}
              >
                ${ethPrice.toLocaleString()}
              </button>
            </Text>
            {thresholdError ? (
              <Text as="p" variant="p4" style={{ color: 'var(--earn-protocol-critical-100)' }}>
                {thresholdError}
              </Text>
            ) : null}
          </div>
        ) : null}

        <div className={classNames.conditionCardContent}>
          <div className={classNames.conditionHeader}>
            <div>
              <Text as="h4" variant="p2semi">
                Only trade until
              </Text>
            </div>
          </div>
          <Text as="p" variant="p4" className={classNames.mutedText}>
            Stop the strategy once this date is reached.
          </Text>
          <DatePicker
            isMobile={isMobile}
            onChange={handleDeadlineChange}
            value={config.deadline ? new Date(config.deadline) : undefined}
            minDate={minDeadlineDate}
          />
        </div>

        <div className={classNames.conditionCardContent}>
          <div className={classNames.conditionHeader}>
            <div>
              <Text as="h4" variant="p2semi">
                Max. Number of Trades{' '}
                <Text as="span" className={classNames.requiredStar}>
                  *
                </Text>
              </Text>
            </div>
          </div>
          <Text as="p" variant="p4" className={classNames.mutedText}>
            Stop the strategy after this many successful trades.
          </Text>
          <Input
            variant="dark"
            type="number"
            min={1}
            max={MAX_TRADES}
            step={1}
            required
            value={config.maxTrades}
            onChange={(ev) => {
              const parsedValue = Number(ev.target.value)

              if (!Number.isFinite(parsedValue)) {
                patchConfig({ maxTrades: DEFAULT_MAX_TRADES })

                return
              }

              patchConfig({
                maxTrades: Math.max(1, Math.min(MAX_TRADES, Math.round(parsedValue))),
              })
            }}
          />
        </div>
      </div>
    </DCAWizardStepCard>
  )
}
