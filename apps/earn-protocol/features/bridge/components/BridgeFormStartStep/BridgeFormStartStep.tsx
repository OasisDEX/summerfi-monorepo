import { type Dispatch, type FC, useEffect, useState } from 'react'
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
import { Address } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { redirect } from 'next/navigation'

import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { BridgeFormTitle } from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { BridgeInput } from '@/features/bridge/components/BridgeInput/BridgeInput'
import { ChainSelectors } from '@/features/bridge/components/ChainSelectors/ChainSelectors'
import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'
import { TransactionDetails } from '@/features/bridge/components/TransactionDetails/TransactionDetails'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useBridgeTransaction } from '@/features/bridge/hooks/use-bridge-transaction'
import { type BridgeReducerAction, type BridgeState } from '@/features/bridge/types'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useRiskVerification } from '@/hooks/use-risk-verification'
import { useToken } from '@/hooks/use-token'
import { useUserWallet } from '@/hooks/use-user-wallet'

interface BridgeFormStartStepProps {
  dispatch: Dispatch<BridgeReducerAction>
  state: BridgeState
}

export const BridgeFormStartStep: FC<BridgeFormStartStepProps> = ({ state, dispatch }) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { chain: sourceChain, setChain: setSourceChain } = useChain()
  const { userWalletAddress } = useUserWallet()
  const sourceNetwork = chainIdToSDKNetwork(sourceChain.id)
  const humanNetworkName = sdkNetworkToHumanNetwork(sourceNetwork)

  if (!isSupportedHumanNetwork(humanNetworkName)) {
    dispatch({
      type: 'error',
      payload: 'Invalid source chain',
    })

    throw new Error('Invalid source chain')
  }

  const sumrBalanceOnSourceChain = formatToBigNumber(state.sumrBalances[humanNetworkName])

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
    onBlur: defaultOnBlur,
    onFocus: defaultOnFocus,
  } = useAmount({
    tokenDecimals: SUMR_DECIMALS,
    tokenPrice: estimatedSumrPrice.toString(),
    selectedToken: sumrToken,
  })

  const { checkRisk } = useRiskVerification({
    cookiePrefix: TermsOfServiceCookiePrefix.SUMR_CLAIM_TOKEN,
  })

  const {
    executeBridgeTransaction,
    prepareTransaction,
    clearTransaction,
    transaction,
    isPreparing,
    isLoading,
    error,
    isReady,
  } = useBridgeTransaction({
    amount: amountRaw ?? '0',
    sourceChain,
    destinationChain: state.destinationChain,
    recipient: Address.createFromEthereum({ value: state.walletAddress }),
    onSuccess: () => {},
    onError: () => {
      dispatch({
        type: 'error',
        payload: 'Failed to create transaction',
      })
    },
  })

  const isSourceMatchingDestination = sourceChain.id === state.destinationChain.id
  const isAmountGreaterThanBalance = amountParsed.gt(sumrBalanceOnSourceChain)

  const validationError = isSourceMatchingDestination
    ? 'Please select a different destination network'
    : isAmountGreaterThanBalance
      ? 'Insufficient balance'
      : error?.message

  const {
    transactionFee: gasEstimate,
    rawTransactionFee: rawGasEstimate,
    loading: isEstimatingGas,
  } = useGasEstimation({
    chainId: sourceChain.id,
    transaction: !isSourceMatchingDestination ? transaction : undefined,
    walletAddress: Address.createFromEthereum({ value: state.walletAddress }).value,
    overrideNetwork: sourceNetwork,
  })

  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)

  useEffect(() => {
    if (userWalletAddress !== state.walletAddress) {
      redirect(`/bridge/${userWalletAddress}`)
    }
  }, [userWalletAddress, state.walletAddress])

  const handleBridge = async () => {
    const risk = await checkRisk()

    if (risk.isRisky) return

    const tx = await executeBridgeTransaction()

    if (!tx) {
      // eslint-disable-next-line no-console
      console.error('Failed to create transaction', error)
      dispatch({
        type: 'error',
        payload: 'Failed to create transaction',
      })

      return
    }

    dispatch({
      type: 'bridge-transaction-created',
      payload: {
        hash: tx.hash,
        amount: amountDisplay,
      },
    })
  }

  const handleDestinationChainChange = (newDestination: SDKNetwork) => {
    dispatch({ type: 'update-destination-chain', payload: sdkNetworkToChain(newDestination) })
    if (amountParsed.gt(0)) {
      prepareTransaction()
    }
  }

  const handleSourceChainChange = (network: SDKNetwork) => {
    const nextSourceChain = sdkNetworkToChain(network)

    setSourceChain({ chain: nextSourceChain })
    if (amountParsed.gt(0)) {
      prepareTransaction()
    }
  }

  const gasOnSource = transaction ? gasEstimate ?? '0' : '0'
  const gasOnSourceRaw = transaction ? rawGasEstimate ?? '0' : '0'

  const handleAmountChangeWithPercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPercentage(null)
    handleAmountChange(e)
  }

  return (
    <Sidebar
      centered
      hiddenHeaderChevron
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
              handleChange={handleAmountChangeWithPercentage}
              handleDropdownChange={() => {}}
              onBlur={() => {
                defaultOnBlur()
                clearTransaction()
                if (!isSourceMatchingDestination) {
                  prepareTransaction()
                }
              }}
              onFocus={defaultOnFocus}
              options={[{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }]}
              dropdownValue={{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }}
              selectAllOnFocus
              tagsRow={
                <QuickActionTags
                  selectedValue={selectedPercentage}
                  onSelect={(percentage) => {
                    setSelectedPercentage(percentage)
                    const newAmount = sumrBalanceOnSourceChain
                      .times(percentage)
                      .div(100)
                      .toFormat(2, BigNumber.ROUND_DOWN)

                    clearTransaction()
                    manualSetAmount(newAmount.toString())
                    if (!isSourceMatchingDestination) {
                      prepareTransaction(newAmount.toString())
                    }
                  }}
                />
              }
            />
          </BridgeInput>
          <TransactionDetails
            loading={
              (isEstimatingGas && !gasEstimate) ||
              (isPreparing && !transaction) ||
              isPreparing ||
              isEstimatingGas
            }
            gasOnSource={gasOnSource}
            gasOnSourceRaw={gasOnSourceRaw}
            amountReceived={transaction?.metadata.toAmount.toBigNumber().toString() ?? '0'}
            lzFee={transaction?.metadata.lzFeeUsd ?? '0'}
            lzFeeRaw={transaction?.metadata.lzFee.toBigNumber().toString() ?? '0'}
            totalFee={new BigNumber(gasOnSource)
              .plus(new BigNumber(transaction?.metadata.lzFee.toBigNumber().toString() ?? '0'))
              .toString()}
            totalFeeRaw={new BigNumber(gasOnSourceRaw)
              .plus(new BigNumber(transaction?.metadata.lzFee.toBigNumber().toString() ?? '0'))
              .toString()}
            destinationChain={state.destinationChain}
            error={validationError}
          />
        </>
      }
      primaryButton={{
        label: isEstimatingGas || isPreparing ? 'Estimating...' : 'Bridge',
        loading: isEstimatingGas || isPreparing,
        action: handleBridge,
        disabled:
          isEstimatingGas ||
          isPreparing ||
          isAmountGreaterThanBalance ||
          isLoading ||
          !isReady ||
          isSourceMatchingDestination,
      }}
    />
  )
}
