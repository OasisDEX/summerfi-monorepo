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
    destinationChain: state.destinationChain,
    recipient: state.walletAddress as `0x${string}`,
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
      sourceChain,
      destinationChain: state.destinationChain,
      amountRaw,
    })
    // await executeBridgeTransaction()
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
                    const newAmount = sumrBalanceOnSourceChain
                      .times(percentage)
                      .toFormat(2, BigNumber.ROUND_DOWN)

                    manualSetAmount(newAmount.toString())
                    simulateTransaction()
                  }}
                />
              }
            />
          </BridgeInput>
          <TransactionDetails
            gasOnSource={Number(gasOnSource)}
            destinationChain={state.destinationChain}
            amountReceived={Number(amountReceived)}
            lzFee={Number(lzFee)}
            error={simulationError}
          />
        </>
      }
      // error={isAmountGreaterThanBalance ? 'Insufficient balance' : undefined}
      primaryButton={{
        label: 'Bridge',
        action: handleBridge,
        disabled: !isReady || isAmountGreaterThanBalance,
      }}
    />
  )
}
