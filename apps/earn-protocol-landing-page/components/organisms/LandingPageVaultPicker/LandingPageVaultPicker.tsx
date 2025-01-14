'use client'
import { useEffect, useState } from 'react'
import {
  getResolvedForecastAmountParsed,
  useAmount,
  useAmountWithSwap,
  useTokenSelector,
  VaultCard,
  VaultSimulationForm,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType, TransactionAction } from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { type IToken, useSDK } from '@summerfi/sdk-client-react'

import landingPageVaultPickerStyles from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker.module.scss'

export const LandingPageVaultPicker = ({ vault }: { vault: SDKVaultishType }) => {
  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

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
    slippageConfig: { slippage: '0.01' }, // doesn't matter that much here
    sdk,
  })

  const resolvedForecastAmount = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  return (
    <div className={landingPageVaultPickerStyles.landingPageVaultPickerWrapper}>
      <VaultCard {...vault} secondary withTokenBonus={false} />
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
