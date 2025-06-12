'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Dropdown,
  getTwitterShareUrl,
  HeadingWithCards,
  Input,
  Text,
  useAmount,
  useCurrentUrl,
  VaultTitleDropdownContentBlock,
} from '@summerfi/app-earn-ui'
import { type DropdownRawOption, type IToken, type SDKVaultishType } from '@summerfi/app-types'
import clsx from 'clsx'

import { isStablecoin } from '@/helpers/is-stablecoin'

import yieldTrendViewStyles from './YieldTrendView.module.css'

export const YieldTrendView = ({ vaults }: { vaults: SDKVaultishType[] }) => {
  const currentUrl = useCurrentUrl()

  const [selectedVault, setSelectedVault] = useState<SDKVaultishType>(() => {
    return vaults[0]
  })

  const selectedToken = useMemo<DropdownRawOption>(() => {
    return {
      content: selectedVault.inputToken.symbol,
      value: selectedVault.inputToken.symbol,
    }
  }, [selectedVault])

  const handleTokenSelection = useCallback(
    (dropdownToken: DropdownRawOption) => {
      const vault = vaults.find((v) => v.inputToken.symbol === dropdownToken.value)

      if (vault) {
        setSelectedVault(vault)
      }
    },
    [vaults],
  )

  const handleVaultSelection = useCallback(
    (dropdownVault: DropdownRawOption) => {
      const vault = vaults.find((v) => `${v.id}_${v.protocol.network}` === dropdownVault.value)

      if (vault) {
        setSelectedVault(vault)
      }
    },
    [vaults],
  )

  const selectedVaultToken = selectedVault.inputToken.symbol
  const selectedVaultTokenPriceUSD = selectedVault.inputTokenPriceUSD
  const selectedVaultTokenDecimals = selectedVault.inputToken.decimals

  const tokenDropdownOptions = useMemo(() => {
    const uniqueTokens = new Map<string, { content: string; value: string }>()

    vaults.forEach((vault) => {
      const tokenSymbol = vault.inputToken.symbol.replace('USD₮0', 'USDT')

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
    amountRaw: calculatorAmountRaw,
    amountParsed: calculatorAmountParsed,
    onBlur: calculatorOnBlur,
    onFocus: calculatorOnFocus,
    handleAmountChange: calculatorHandleAmountChange,
  } = useAmount({
    tokenDecimals: selectedVaultTokenDecimals,
    tokenPrice: selectedVaultTokenPriceUSD,
    selectedToken: {
      decimals: selectedVaultTokenDecimals,
      symbol: selectedVaultToken,
    } as unknown as IToken,
    initialAmount: isStablecoin(selectedVaultToken) ? '1000' : '1',
  })

  return (
    <div className={yieldTrendViewStyles.wrapper}>
      <HeadingWithCards
        title="DeFi Yield"
        social={{
          linkToCopy: currentUrl,
          linkToShare: getTwitterShareUrl({
            url: currentUrl,
            text: 'Check out the latest DeFi yield trends and how Lazy Summer Protocol optimizes yields with AI!',
          }),
        }}
        description="Stop second guessing how much you should be earning on your crypto assets. Quickly see the median DeFi yield on specific assets from  top DeFi protocols, and how they compare to what you can earn by optimizing only the best of DeFi with Lazy Summer Protocol."
      />
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
            <Text variant="h3">4.31%</Text>
            <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
              Median yield across markets for a specific asset, calculated for all protocols
              supported on DeFiLlama.
            </Text>
            <div className={yieldTrendViewStyles.divider} />
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                30d APY
              </Text>
              <Text variant="p3semi">3.22%</Text>
            </div>
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                90d APY
              </Text>
              <Text variant="p3semi">3.91%</Text>
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
            <Text variant="h3colorful">10.72%</Text>
            <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
              Current yield for a specific asset on Summer.fi, continuously optimized across the top
              protocols by AI powered keepers.
            </Text>
            <div className={yieldTrendViewStyles.divider} />
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                30d APY
              </Text>
              <Text variant="p3semi">10.22%</Text>
            </div>
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                90d APY
              </Text>
              <Text variant="p3semi">10.91%</Text>
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
            <Text variant="h3colorful">$6,411</Text>
            <Button variant="primaryMedium" style={{ marginTop: 'var(--spacing-space-medium)' }}>
              Deposit
            </Button>
          </Card>
        </div>
      </Card>
    </div>
  )
}
