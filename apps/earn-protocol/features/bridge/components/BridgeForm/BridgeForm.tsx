import { type Dispatch, type FC } from 'react'
import { useChain } from '@account-kit/react'
import {
  InputWithDropdown,
  Sidebar,
  SUMR_CAP,
  useAmount,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  formatToBigNumber,
  isSupportedHumanNetwork,
  sdkNetworkToChain,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { BridgeFormTitle } from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { BridgeInput } from '@/features/bridge/components/BridgeInput/BridgeInput'
import { ChainSelectors } from '@/features/bridge/components/ChainSelectors/ChainSelectors'
import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'
import { TransactionDetails } from '@/features/bridge/components/TransactionDetails/TransactionDetails'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useBridgeTransaction } from '@/features/bridge/hooks/use-bridge-transaction'
import {
  type BridgeExternalData,
  type BridgeReducerAction,
  type BridgeState,
} from '@/features/bridge/types'
import { useRiskVerification } from '@/hooks/use-risk-verification'
import { useToken } from '@/hooks/use-token'

interface BridgeFormProps {
  dispatch: Dispatch<BridgeReducerAction>
  state: BridgeState
  externalData: BridgeExternalData
}

export const BridgeForm: FC<BridgeFormProps> = ({ state, dispatch, externalData }) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { chain: sourceChain, setChain: setSourceChain } = useChain()

  const { token: sumrToken } = useToken({
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
    tokenDecimals: SUMR_DECIMALS,
    tokenPrice: estimatedSumrPrice.toString(),
    selectedToken: sumrToken,
  })

  const { checkRisk } = useRiskVerification({
    cookiePrefix: TermsOfServiceCookiePrefix.SUMR_CLAIM_TOKEN,
  })

  const { executeBridgeTransaction, isLoading, error } = useBridgeTransaction({
    amount: amountRaw ?? '0',
    sourceChain,
    destinationChain: state.destinationChain,
    recipient: state.walletAddress as `0x${string}`,
    onSuccess: () => {
      console.log('Bridge successful')
      // Add any success handling like showing a notification
    },
    onError: () => {
      console.log('Bridge failed')
      // Add any error handling like showing an error message
    },
  })

  const handleBridge = async () => {
    const risk = await checkRisk()

    if (risk.isRisky) return

    console.log('Bridging:', {
      sourceChain,
      destinationChain: state.destinationChain,
      amountRaw,
    })

    await executeBridgeTransaction()
  }

  const handleDestinationChainChange = (newDestination: SDKNetwork) => {
    dispatch({ type: 'update-destination-chain', payload: sdkNetworkToChain(newDestination) })
  }

  const handleSourceChainChange = (network: SDKNetwork) => {
    const nextSourceChain = sdkNetworkToChain(network)

    setSourceChain({ chain: nextSourceChain })
  }

  console.log('Current BridgeForm state:', state)

  const sourceNetwork = chainIdToSDKNetwork(sourceChain.id)

  const humanNetworkName = sdkNetworkToHumanNetwork(sourceNetwork)

  if (!isSupportedHumanNetwork(humanNetworkName)) {
    throw new Error('Invalid source chain')
  }

  const sumrBalanceOnSourceChain = formatToBigNumber(state.sumrBalances[humanNetworkName])
  const isAmountGreaterThanBalance = amountParsed.gt(sumrBalanceOnSourceChain)

  return (
    <Sidebar
      centered
      title="Bridge"
      customHeader={<BridgeFormTitle />}
      content={
        <>
          <ChainSelectors
            sourceChain={sourceChain}
            destinationChain={state.destinationChain}
            onSourceChainChange={handleSourceChainChange}
            onDestinationChainChange={handleDestinationChainChange}
          />
          <Spacer />
          <BridgeInput>
            <InputWithDropdown
              value={amountDisplay}
              heading={{
                label: 'Balance',
                value: `${formatCryptoBalance(sumrBalanceOnSourceChain)} SUMR`,
              }}
              secondaryValue={amountDisplayUSD}
              handleChange={handleAmountChange}
              handleDropdownChange={() => {}}
              onFocus={onFocus}
              onBlur={onBlur}
              options={[{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }]}
              dropdownValue={{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }}
              selectAllOnFocus
              tagsRow={
                <QuickActionTags
                  onSelect={(percentage) => {
                    const newAmount = sumrBalanceOnSourceChain
                      .times(percentage)
                      .toFormat(2, BigNumber.ROUND_DOWN)

                    manualSetAmount(newAmount.toString())
                  }}
                />
              }
            />
          </BridgeInput>
          <TransactionDetails
            gasOnSource={0} // These values will need to come from somewhere else now
            destinationChain={state.destinationChain}
            amountReceived={0}
            lzFee={0}
            error={error?.message}
          />
        </>
      }
      primaryButton={{
        label: isLoading ? 'Bridging...' : 'Bridge',
        action: handleBridge,
        disabled: isAmountGreaterThanBalance || isLoading,
      }}
    />
  )
}
