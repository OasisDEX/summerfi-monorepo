'use client'
import { type FC, useState } from 'react'
import { useChain } from '@account-kit/react'
import { Sidebar } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import { sdkNetworkToChain } from '@summerfi/app-utils'
import { base, type Chain } from 'viem/chains'

import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { BridgeFormTitle } from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { BridgeInput } from '@/features/bridge/components/BridgeInput/BridgeInput'
import { ChainSelectors } from '@/features/bridge/components/ChainSelectors/ChainSelectors'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'
import { TransactionDetails } from '@/features/bridge/components/TransactionDetails/TransactionDetails'
import { useBridgeTransaction } from '@/features/bridge/hooks/use-bridge-transaction'
import { type BridgeExternalData } from '@/features/bridge/types'
import { useRiskVerification } from '@/hooks/use-risk-verification'

interface BridgeFormProps {
  walletAddress: string
  externalData: BridgeExternalData | null
}

export const BridgeForm: FC<BridgeFormProps> = ({ walletAddress, externalData }) => {
  const { chain: sourceChain, setChain: setSourceChain, isSettingChain } = useChain()
  console.log('sourceChain', sourceChain)
  console.log('isSettingChain', isSettingChain)
  const [destinationChain, setDestinationChain] = useState<Chain>(base)
  const [amount, setAmount] = useState<string>('')

  // const {
  //   amountRaw: amountRawStake,
  //   amountParsed: amountParsedStake,
  //   manualSetAmount: manualSetAmountStake,
  //   amountDisplay: amountDisplayStake,
  //   amountDisplayUSD: amountDisplayUSDStake,
  //   handleAmountChange: handleAmountChangeStake,
  //   onBlur: onBlurStake,
  //   onFocus: onFocusStake,
  // } = useAmount({
  //   tokenDecimals: 18,
  //   tokenPrice: estimatedSumrPrice.toString(),
  //   selectedToken: sumrToken,
  // })

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
    amount,
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
      amount,
    })
    // await executeBridgeTransaction()
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
          <BridgeInput
            value={amount}
            onChange={(value) => {
              setAmount(value)
              simulateTransaction()
            }}
            placeholder="Enter amount to bridge"
          />
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
        action: () => {
          /* handle cancel */
        },
      }}
    />
  )
}
