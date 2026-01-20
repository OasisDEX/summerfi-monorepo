import { type Dispatch, type FC, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  ERROR_TOAST_CONFIG,
  InputWithDropdown,
  Sidebar,
  SUCCESS_TOAST_CONFIG,
  useAmount,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  formatToBigNumber,
  isSupportedHumanNetwork,
  isSupportedSDKChain,
  sdkNetworkToChain,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import { Address } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { useRouter, useSearchParams } from 'next/navigation'

import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import BridgeFormTitle from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { BridgeInput } from '@/features/bridge/components/BridgeInput/BridgeInput'
import { ChainSelectors } from '@/features/bridge/components/ChainSelectors/ChainSelectors'
import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'
import { TransactionDetails } from '@/features/bridge/components/TransactionDetails/TransactionDetails'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useBridgeTransaction } from '@/features/bridge/hooks/use-bridge-transaction'
import { type BridgeReducerAction, type BridgeState } from '@/features/bridge/types'
import { sdkNetworkToAAChain } from '@/helpers/sdk-network-to-aa-chain'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useRiskVerification } from '@/hooks/use-risk-verification'
import { useToken } from '@/hooks/use-token'

interface BridgeFormStartStepProps {
  dispatch: Dispatch<BridgeReducerAction>
  state: BridgeState
  sumrPriceUsd: number
}

export const BridgeFormStartStep: FC<BridgeFormStartStepProps> = ({
  state,
  dispatch,
  sumrPriceUsd,
}) => {
  const router = useRouter()
  const { chain: sourceChain, setChain: setSourceChain, isSettingChain } = useChain()
  const { userWalletAddress, isLoadingAccount: isUserWalletLoading } = useUserWallet()
  const sourceNetwork = chainIdToSDKNetwork(sourceChain.id)
  const humanNetworkName = sdkNetworkToHumanNetwork(sourceNetwork)
  const searchParams = useSearchParams()
  const inputChangeHandler = useHandleInputChangeEvent()

  const sourceChainFromParams = searchParams.get('source_chain')
  const amountFromParams = searchParams.get('amount')
  const viaParam = searchParams.get('via')

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

  // Add a ref to track if we've already initialized from params
  const initializedRef = useRef(false)

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
    tokenPrice: sumrPriceUsd.toString(),
    selectedToken: sumrToken,
    initialAmount: amountFromParams ?? undefined,
    inputChangeHandler,
    inputName: 'bridge-amount',
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

  const { publicClient } = useNetworkAlignedClient({
    chainId: sourceChain.id,
    overrideNetwork: sourceNetwork,
  })

  const {
    transactionFee: gasEstimate,
    rawTransactionFee: rawGasEstimate,
    loading: isEstimatingGas,
  } = useGasEstimation({
    chainId: sourceChain.id,
    transaction: !isSourceMatchingDestination ? transaction : undefined,
    walletAddress: Address.createFromEthereum({ value: state.walletAddress }).value,
    publicClient,
  })

  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)

  useEffect(() => {
    if (!userWalletAddress && !isUserWalletLoading) {
      try {
        router.push('/earn')
      } catch (err) {
        dispatch({
          type: 'error',
          payload: 'Failed to redirect. Please try again.',
        })
        // eslint-disable-next-line no-console
        console.error('Failed to redirect to /earn:', err)
      }
    }

    if (
      !isUserWalletLoading &&
      userWalletAddress?.toLowerCase() !== state.walletAddress.toLowerCase()
    ) {
      router.push(`/bridge/${userWalletAddress}`)
    }
  }, [userWalletAddress, state.walletAddress, dispatch, isUserWalletLoading, router])

  useEffect(() => {
    const switchChain = async () => {
      if (sourceChainFromParams) {
        const chainId = parseInt(sourceChainFromParams, 10)

        if (!isNaN(chainId) && isSupportedSDKChain(chainId)) {
          const network = chainIdToSDKNetwork(chainId)
          const nextSourceChain = sdkNetworkToChain(network)

          try {
            // Add a check to prevent unnecessary switching
            if (sourceChain.id !== nextSourceChain.id) {
              await setSourceChain({ chain: nextSourceChain })
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to switch chain:', err)

            dispatch({
              type: 'error',
              payload: err instanceof Error ? err.message : 'Failed to switch chain',
            })
          }
        }
      }
    }

    switchChain()
  }, [sourceChainFromParams, setSourceChain, dispatch, sourceChain.id])

  useEffect(() => {
    if (amountFromParams && !initializedRef.current) {
      initializedRef.current = true
      manualSetAmount(amountFromParams)

      if (!isSourceMatchingDestination) {
        prepareTransaction(amountFromParams)
      }
    }
  }, [amountFromParams, manualSetAmount, isSourceMatchingDestination, prepareTransaction])

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
      toast.error('Failed to create bridge transaction', ERROR_TOAST_CONFIG)

      return
    }

    dispatch({
      type: 'bridge-transaction-created',
      payload: {
        hash: tx.hash,
        amount: amountDisplay,
      },
    })
    toast.success('Bridge transaction submitted successfully', SUCCESS_TOAST_CONFIG)
  }

  const handleDestinationChainChange = (newDestination: SupportedSDKNetworks) => {
    dispatch({ type: 'update-destination-chain', payload: sdkNetworkToAAChain(newDestination) })
    if (amountParsed.gt(0)) {
      prepareTransaction()
    }
  }

  const handleSourceChainChange = (network: SupportedSDKNetworks) => {
    const nextSourceChain = sdkNetworkToAAChain(network)

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

  const secondaryButtonConfig = {
    claim: {
      url: `/claim/${state.walletAddress}`,
      label: 'Return to claim',
    },
    portfolio: {
      url: `/portfolio/${state.walletAddress}?via=bridge`,
      label: 'Return to portfolio',
    },
    default: undefined,
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
                      .decimalPlaces(2, BigNumber.ROUND_DOWN)

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
            destinationChain={state.destinationChain}
            error={!isSettingChain ? validationError : ''}
          />
        </>
      }
      primaryButton={{
        label:
          isEstimatingGas || isPreparing
            ? 'Estimating...'
            : isSettingChain
              ? 'Switching chain...'
              : isLoading
                ? 'Bridging...'
                : 'Bridge',
        loading: isLoading || isEstimatingGas || isPreparing || isSettingChain,
        action: handleBridge,
        disabled:
          !transaction ||
          isEstimatingGas ||
          isPreparing ||
          isAmountGreaterThanBalance ||
          isLoading ||
          !isReady ||
          isSourceMatchingDestination ||
          isSettingChain,
      }}
      secondaryButton={
        secondaryButtonConfig[viaParam as keyof typeof secondaryButtonConfig] ??
        secondaryButtonConfig.default
      }
    />
  )
}
