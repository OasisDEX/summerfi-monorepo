'use client'
import { type FC, useState } from 'react'
import { useChain } from '@account-kit/react'
import {
  InputWithDropdown,
  Sidebar,
  SkeletonLine,
  SUMR_CAP,
  useAmount,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import { formatCryptoBalance, sdkNetworkToChain } from '@summerfi/app-utils'
import { base, type Chain } from 'viem/chains'

import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { BridgeFormTitle } from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { BridgeInput } from '@/features/bridge/components/BridgeInput/BridgeInput'
import { ChainSelectors } from '@/features/bridge/components/ChainSelectors/ChainSelectors'
import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'
import { TransactionDetails } from '@/features/bridge/components/TransactionDetails/TransactionDetails'
import { useBridgeTransaction } from '@/features/bridge/hooks/use-bridge-transaction'
import { type BridgeExternalData } from '@/features/bridge/types'
import { usePublicClient } from '@/hooks/use-public-client'
import { useRiskVerification } from '@/hooks/use-risk-verification'
import { useTokenBalance } from '@/hooks/use-token-balance'

interface BridgeFormProps {
  walletAddress: string
  externalData: BridgeExternalData | null
}

export const BridgeForm: FC<BridgeFormProps> = ({ walletAddress, externalData }) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { chain: sourceChain, setChain: setSourceChain } = useChain()

  const [destinationChain, setDestinationChain] = useState<Chain>(base)

  const { publicClient } = usePublicClient({ chain: sourceChain })

  const {
    token: sumrToken,
    tokenBalance: sumrBalance,
    tokenBalanceLoading: isSumrBalanceLoading,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: 'SUMMER',
    tokenSymbol: 'SUMMER',
    chainId: sourceChain.id,
  })
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const {
    amountRaw,
    amountParsed,
    amountDisplay,
    amountDisplayUSD,
    manualSetAmount,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({
    tokenDecimals: 18,
    tokenPrice: estimatedSumrPrice.toString(),
    selectedToken: sumrToken,
  })

  const { checkRisk } = useRiskVerification({
    cookiePrefix: TermsOfServiceCookiePrefix.SUMR_CLAIM_TOKEN,
  })

  const {
    gasOnSource,
    amountReceived,
    lzFee,
    isReady,
    simulationError,
    executeBridgeTransaction,
    simulateTransaction,
  } = useBridgeTransaction({
    amount: amountRaw ?? '0',
    sourceChain,
    destinationChain,
    recipient: walletAddress as `0x${string}`,
    externalData,
    onSuccess: () => {
      // Handle success
      console.log('Bridge successful')
    },
    onError: () => {
      // Handle error
      console.log('Bridge failed')
    },
  })

  const handleBridge = async () => {
    const risk = await checkRisk()

    if (risk.isRisky) return

    console.log('Bridging:', {
      sourceChain: sourceChain.id,
      destinationChain: destinationChain.id,
      amountRaw,
    })
    // await executeBridgeTransaction()
  }

  const handleCancel = () => {
    manualSetAmount('')
    simulateTransaction()
  }

  const handleDestinationChainChange = (network: SDKNetwork) => {
    setDestinationChain(sdkNetworkToChain(network))
  }

  const handleSourceChainChange = (network: SDKNetwork) => {
    console.log('changing source chain to', network)

    const nextSourceChain = sdkNetworkToChain(network)
    console.log('nextSourceChain', nextSourceChain)
    setSourceChain({ chain: nextSourceChain })
  }

  console.log('amountRaw', amountRaw)
  console.log('amountParsed', amountParsed)
  console.log('amountDisplay', amountDisplay)
  console.log('amountDisplayUSD', amountDisplayUSD)

  return (
    <Sidebar
      centered
      title="Bridge"
      customHeader={<BridgeFormTitle />}
      content={
        <>
          <ChainSelectors
            sourceChain={sourceChain}
            destinationChain={destinationChain}
            onSourceChainChange={handleSourceChainChange}
            onDestinationChainChange={handleDestinationChainChange}
          />
          <Spacer />
          <BridgeInput>
            <InputWithDropdown
              value={amountDisplay}
              heading={{
                label: 'Balance',
                value: isSumrBalanceLoading ? (
                  <SkeletonLine width={60} height={10} />
                ) : sumrBalance ? (
                  `${formatCryptoBalance(sumrBalance)} SUMR`
                ) : (
                  '-'
                ),
              }}
              secondaryValue={amountDisplayUSD}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleAmountChange(e)
                simulateTransaction()
              }}
              handleDropdownChange={() => {}}
              onFocus={onFocus}
              onBlur={onBlur}
              options={[{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }]}
              dropdownValue={{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }}
              selectAllOnFocus
              tagsRow={
                <QuickActionTags
                  onSelect={(percentage) => {
                    const newAmount = sumrBalance ? sumrBalance.times(percentage).toFixed(2) : '0'

                    manualSetAmount(newAmount)
                    simulateTransaction()
                  }}
                />
              }
            />
          </BridgeInput>
          <TransactionDetails
            gasOnSource={Number(gasOnSource)}
            destinationChain={destinationChain}
            amountReceived={Number(amountReceived)}
            lzFee={Number(lzFee)}
            error={simulationError}
          />
        </>
      }
      primaryButton={{
        label: 'Bridge',
        action: handleBridge,
        disabled: !isReady,
      }}
      secondaryButton={{
        label: 'Cancel',
        action: handleCancel,
      }}
    />
  )
}
