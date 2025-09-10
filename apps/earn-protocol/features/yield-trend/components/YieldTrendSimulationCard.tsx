import { useCallback, useEffect, useMemo } from 'react'
import {
  Button,
  Card,
  Dropdown,
  getDisplayToken,
  Input,
  Text,
  TextNumberAnimated,
  useAmount,
  VaultTitleDropdownContentBlock,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type GetVaultsApyResponse,
  type IToken,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

import { isStablecoin } from '@/helpers/is-stablecoin'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'

import yieldTrendViewStyles from './YieldTrendView.module.css'

export const YieldTrendSimulationCard = ({
  vaults,
  selectedVault,
  selectedVaultApy,
  selectedVaultToken,
  selectedVaultTokenDecimals,
  selectedVaultTokenPriceUSD,
  medianDefiApy,
  medianDefiApy7d,
  medianDefiApy30d,
  setSelectedVault,
}: {
  vaults: SDKVaultishType[]
  selectedVault: SDKVaultishType
  selectedVaultApy: GetVaultsApyResponse[`${string}-${number}`]
  selectedVaultToken: string
  selectedVaultTokenDecimals: number
  selectedVaultTokenPriceUSD?: string | null
  medianDefiApy: number
  medianDefiApy7d: number
  medianDefiApy30d: number
  setSelectedVault: (vault: SDKVaultishType) => void
}) => {
  const selectedToken = useMemo<DropdownRawOption>(() => {
    return {
      content: getDisplayToken(selectedVault.inputToken.symbol, { swapUSDT: true }),
      value: getDisplayToken(selectedVault.inputToken.symbol, { swapUSDT: true }),
    }
  }, [selectedVault])
  const inputChangeHandler = useHandleInputChangeEvent()

  const handleTokenSelection = useCallback(
    (dropdownToken: DropdownRawOption) => {
      const vault = vaults.find((v) => {
        if (dropdownToken.value === 'ETH') {
          return v.inputToken.symbol === 'WETH'
        }

        return v.inputToken.symbol === dropdownToken.value
      })

      if (vault) {
        setSelectedVault(vault)
      }
    },
    [setSelectedVault, vaults],
  )

  const handleVaultSelection = useCallback(
    (dropdownVault: DropdownRawOption) => {
      const vault = vaults.find((v) => `${v.id}_${v.protocol.network}` === dropdownVault.value)

      if (vault) {
        setSelectedVault(vault)
      }
    },
    [setSelectedVault, vaults],
  )

  const tokenDropdownOptions = useMemo(() => {
    const uniqueTokens = new Map<string, { content: string; value: string }>()

    vaults.forEach((vault) => {
      const tokenSymbol = getDisplayToken(vault.inputToken.symbol, { swapUSDT: true })

      if (!uniqueTokens.has(tokenSymbol)) {
        uniqueTokens.set(tokenSymbol, { content: tokenSymbol, value: tokenSymbol })
      }
    })

    return Array.from(uniqueTokens.values())
  }, [vaults])

  const vaultsDropdownOptions = useMemo(() => {
    return vaults.map((vault) => ({
      content: (
        <VaultTitleDropdownContentBlock
          vault={vault}
          style={{
            minWidth: '250px',
          }}
        />
      ),
      value: `${vault.id}_${vault.protocol.network}`,
    }))
  }, [vaults])

  const {
    amountDisplay: calculatorAmountDisplay,
    amountParsed: calculatorAmountParsed,
    onBlur: calculatorOnBlur,
    onFocus: calculatorOnFocus,
    handleAmountChange: calculatorHandleAmountChange,
    manualSetAmount: calculatorManualSetAmount,
  } = useAmount({
    tokenDecimals: selectedVaultTokenDecimals,
    tokenPrice: selectedVaultTokenPriceUSD,
    selectedToken: {
      decimals: selectedVaultTokenDecimals,
      symbol: selectedVaultToken,
    } as unknown as IToken,
    initialAmount: isStablecoin(selectedVaultToken) ? '1000' : '1',
    inputChangeHandler,
    inputName: 'yield-trend-calculator-amount',
  })

  const earnDifference = useMemo(() => {
    // the difference between the Lazy Summer yield and the median DeFi yield (yearly, in USD)
    const medianDefi1yEarnings = new BigNumber(medianDefiApy)
      .times(Number(selectedVaultTokenPriceUSD))
      .times(calculatorAmountParsed)
    const lazySummer1yEarnings = new BigNumber(selectedVaultApy.apy)
      .times(Number(selectedVaultTokenPriceUSD))
      .times(calculatorAmountParsed)

    return lazySummer1yEarnings.minus(medianDefi1yEarnings)
  }, [calculatorAmountParsed, medianDefiApy, selectedVaultApy.apy, selectedVaultTokenPriceUSD])

  useEffect(() => {
    // Update the calculator amount display when the selected vault token changes
    if (isStablecoin(selectedVaultToken)) {
      calculatorManualSetAmount('1000')
    } else {
      calculatorManualSetAmount('1')
    }
    // need to update the calculator amount display when the selected vault token changes (hook does not detect that)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStablecoin(selectedVaultToken)])

  return (
    <Card variant="cardSecondary">
      <div className={yieldTrendViewStyles.headerCardGrid}>
        <div className={yieldTrendViewStyles.headerCardLeft}>
          <Dropdown
            options={tokenDropdownOptions}
            dropdownValue={selectedToken}
            onChange={handleTokenSelection}
          >
            <Text variant="p1semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
              {selectedVaultToken} Median DeFi Yield
            </Text>
          </Dropdown>
          <Text variant="h3">{formatDecimalAsPercent(medianDefiApy)}</Text>
          <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
            Median yield across markets for a specific asset, calculated for all protocols supported
            on DeFiLlama.
          </Text>
          <div className={yieldTrendViewStyles.divider} />
          <div className={yieldTrendViewStyles.headerCardLeftAPY}>
            <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              7d APY
            </Text>
            <Text variant="p3semi">{formatDecimalAsPercent(medianDefiApy7d)}</Text>
          </div>
          <div className={yieldTrendViewStyles.headerCardLeftAPY}>
            <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              30d APY
            </Text>
            <Text variant="p3semi">{formatDecimalAsPercent(medianDefiApy30d)}</Text>
          </div>
        </div>
        <Card
          className={clsx(
            yieldTrendViewStyles.headerCardCenter,
            yieldTrendViewStyles.headerCardBrighter,
          )}
        >
          <Text variant="p1semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
            Lazy Summer Yield
          </Text>
          <TextNumberAnimated
            variant="h3colorful"
            suffix="%"
            value={Number(formatDecimalAsPercent(selectedVaultApy.apy, { noPercentSign: true }))}
          />
          <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
            Current yield for a specific asset on Summer.fi, continuously optimized across the top
            protocols by AI powered keepers.
          </Text>
          <div className={yieldTrendViewStyles.divider} />
          <div className={yieldTrendViewStyles.headerCardLeftAPY}>
            <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              7d APY
            </Text>
            <Text variant="p3semi">
              {selectedVaultApy.sma7d ? formatDecimalAsPercent(selectedVaultApy.sma7d) : 'n/a'}
            </Text>
          </div>
          <div className={yieldTrendViewStyles.headerCardLeftAPY}>
            <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              30d APY
            </Text>
            <Text variant="p3semi">
              {selectedVaultApy.sma30d ? formatDecimalAsPercent(selectedVaultApy.sma30d) : 'n/a'}
            </Text>
          </div>
        </Card>
        <Card
          className={clsx(
            yieldTrendViewStyles.headerCardRight,
            yieldTrendViewStyles.headerCardBrighter,
          )}
        >
          <Text variant="p2semi" style={{ color: 'var(--color-text-secondary)' }}>
            Deposit
          </Text>
          <Card className={yieldTrendViewStyles.depositCard}>
            <Dropdown
              options={vaultsDropdownOptions}
              dropdownValue={{
                content: selectedVault.inputToken.symbol,
                value: selectedVault.id,
              }}
              onChange={handleVaultSelection}
            >
              <VaultTitleDropdownContentBlock
                vault={selectedVault}
                style={{
                  minWidth: '250px',
                }}
              />
            </Dropdown>
          </Card>
          <Card className={yieldTrendViewStyles.depositCard}>
            <Input
              width={250}
              placeholder="1000.00"
              value={calculatorAmountDisplay}
              variant="wrapper"
              onBlur={calculatorOnBlur}
              onFocus={calculatorOnFocus}
              onChange={calculatorHandleAmountChange}
              className={yieldTrendViewStyles.depositCardInput}
            />
            <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              {selectedVaultToken}
            </Text>
          </Card>
          <Text
            variant="p2semi"
            style={{
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--spacing-space-medium)',
            }}
          >
            You would earn an extra (a year)
          </Text>
          <TextNumberAnimated variant="h3colorful" prefix="$" value={earnDifference.toNumber()} />
          <Button variant="primaryMedium" style={{ marginTop: 'var(--spacing-space-medium)' }}>
            Deposit
          </Button>
        </Card>
      </div>
    </Card>
  )
}
