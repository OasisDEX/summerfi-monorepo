'use client'
import { useEffect, useState } from 'react'
import {
  getResolvedForecastAmountParsed,
  SUMR_CAP,
  useAmount,
  useAmountWithSwap,
  useLocalConfig,
  useTokenSelector,
  VaultCard,
  VaultSimulationForm,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType, TransactionAction } from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { useSDK } from '@summerfi/sdk-client-react'
import { type IToken } from '@summerfi/sdk-common'

import landingPageVaultPickerStyles from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker.module.scss'

export const LandingPageVaultPicker = ({ vault }: { vault: SDKVaultishType }) => {
  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)
  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault,
    chainId: vaultChainId,
  })
  const [token, setToken] = useState<IToken>()

  const sdk = useSDK({ chainId: vaultChainId })

  useEffect(() => {
    const getToken = async () => {
      const _token = await sdk.getTokenBySymbol({
        chainId: vaultChainId,
        symbol: selectedTokenOption.value,
      })

      setToken(_token)
    }

    getToken()
  }, [selectedTokenOption.value, sdk, vaultChainId])

  const {
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSD,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({ vault, selectedToken: token, initialAmount: '1000' })

  const { amountDisplayUSDWithSwap, rawToTokenAmount } = useAmountWithSwap({
    vault,
    vaultChainId: subgraphNetworkToSDKId(vault.protocol.network),
    amountDisplay,
    amountDisplayUSD,
    transactionType: TransactionAction.DEPOSIT,
    selectedTokenOption,
    slippageConfig,
    sdk,
  })

  const resolvedForecastAmount = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  return (
    <div className={landingPageVaultPickerStyles.landingPageVaultPickerWrapper}>
      <VaultCard
        {...vault}
        secondary
        withTokenBonus={sumrNetApyConfig.withSumr}
        sumrPrice={estimatedSumrPrice}
      />
      <VaultSimulationForm
        vaultData={vault}
        selectedTokenOption={selectedTokenOption}
        handleTokenSelectionChange={handleTokenSelectionChange}
        tokenOptions={tokenOptions}
        handleAmountChange={handleAmountChange}
        inputProps={{
          onFocus,
          onBlur,
          amountDisplay,
          amountDisplayUSDWithSwap,
          manualSetAmount,
        }}
        resolvedForecastAmount={resolvedForecastAmount}
        amountParsed={amountParsed}
        hiddenHeaderChevron
      />
    </div>
  )
}
