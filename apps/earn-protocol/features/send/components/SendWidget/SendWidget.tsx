'use client'
import { type FC, useReducer } from 'react'
import { useChain } from '@account-kit/react'
import {
  getTokenGuarded,
  Modal,
  SDKChainIdToAAChainMap,
  Sidebar,
  type SidebarProps,
  useAmount,
  useClientChainId,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import {
  type Address,
  type DropdownRawOption,
  type SupportedNetworkIds,
  SupportedSDKNetworks,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import {
  networkNameToSDKId,
  networkNameToSDKNetwork,
  supportedSDKNetworkId,
} from '@summerfi/app-utils'
import { isAddress } from 'viem'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/cached/get-wallet-assets/types'
import { revalidateUser } from '@/app/server-handlers/revalidation-handlers'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { SendFormContent } from '@/features/send/components/SendFormContent/SendFormContent'
import { getSendPrimaryBtnLabel } from '@/features/send/helpers/get-send-primary-btn-label'
import { getSendSidebarTitle } from '@/features/send/helpers/get-send-sidebar-title'
import { useSendTransaction } from '@/features/send/hooks/use-send-transaction'
import { sendReducer, sendState } from '@/features/send/state'
import { SendStep, SendTxStatuses } from '@/features/send/types'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'
import { usePublicClient } from '@/hooks/use-public-client'
import { useTokenBalance } from '@/hooks/use-token-balance'

interface SendWidgetProps {
  walletAddress: string
  isOpen: boolean
  onClose: () => void
  walletData: PortfolioAssetsResponse
  isOwner?: boolean
}

export const SendWidget: FC<SendWidgetProps> = ({
  walletAddress,
  isOpen,
  onClose,
  walletData,
  isOwner,
}) => {
  const { deviceType } = useDeviceType()
  const inputChangeHandler = useHandleInputChangeEvent()

  const walletDataAssetsSortedByUsdValue = walletData.assets
    .sort((a, b) => b.balanceUSD - a.balanceUSD)
    // this needs to be fixed on the wallet assets level
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .filter(({ network }) => networkNameToSDKId(network) !== undefined)

  const defaultDropdownValue = {
    label: walletDataAssetsSortedByUsdValue[0].symbol.toUpperCase(),
    value: `${walletDataAssetsSortedByUsdValue[0].id}_${walletDataAssetsSortedByUsdValue[0].network}`,
    tokenSymbol: walletDataAssetsSortedByUsdValue[0].symbol.toUpperCase() as TokenSymbolsList,
    chainId: networkNameToSDKId(walletDataAssetsSortedByUsdValue[0].network) as SupportedNetworkIds,
  }

  const [state, dispatch] = useReducer(sendReducer, {
    ...sendState,
    tokenDropdown: defaultDropdownValue,
    walletAddress,
  })

  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const isMobileOrTablet = isMobile || isTablet

  const { clientChainId } = useClientChainId()

  const { setChain } = useChain()

  const dropdownOptions = walletDataAssetsSortedByUsdValue
    .filter((item) =>
      Object.values(SupportedSDKNetworks).includes(
        networkNameToSDKNetwork(item.network) as SupportedSDKNetworks,
      ),
    )
    .filter((item) => !!getTokenGuarded(item.symbol.toLocaleUpperCase()))
    .map((asset) => ({
      label: asset.symbol.toUpperCase(),
      value: `${asset.id}_${asset.network}`,
      tokenSymbol: asset.symbol.toUpperCase() as TokenSymbolsList,
      chainId: networkNameToSDKId(asset.network) as SupportedNetworkIds,
    }))

  const { publicClient } = usePublicClient({
    chain: SDKChainIdToAAChainMap[supportedSDKNetworkId(state.tokenDropdown.chainId)],
  })

  const {
    token: selectedToken,
    tokenBalance: selectedTokenBalance,
    tokenBalanceLoading: selectedTokenBalanceLoading,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: state.tokenDropdown.tokenSymbol,
    tokenSymbol: state.tokenDropdown.tokenSymbol,
    chainId: state.tokenDropdown.chainId,
  })

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
    tokenDecimals: selectedToken?.decimals ?? 18,
    tokenPrice: walletData.assets
      .find((item) => item.symbol === state.tokenDropdown.tokenSymbol)
      ?.priceUSD.toString(),
    selectedToken,
    initialAmount: undefined,
    inputChangeHandler,
    inputName: 'send-widget-amount',
  })

  const {
    sendTransaction,
    isLoading: _isTxLoading,
    transactionData,
    txHashes,
    removeTxHash,
  } = useSendTransaction({
    onSuccess: () => {
      dispatch({ type: 'update-tx-status', payload: SendTxStatuses.COMPLETED })
      dispatch({ type: 'update-step', payload: SendStep.COMPLETED })
    },
    onError: () => {
      dispatch({ type: 'update-tx-status', payload: SendTxStatuses.FAILED })
      dispatch({ type: 'update-step', payload: SendStep.INIT })
    },
    amount: amountRaw,
    token: selectedToken,
    recipient: state.recipientAddress,
    chainId: state.tokenDropdown.chainId,
    publicClient,
  })

  const { transactionFee, loading: transactionFeeLoading } = useGasEstimation({
    chainId: state.tokenDropdown.chainId,
    transaction: transactionData,
    walletAddress: walletAddress as Address,
    publicClient,
  })

  const handleDropdownChange = (option: DropdownRawOption) => {
    dispatch({
      type: 'update-token-dropdown',
      payload: dropdownOptions.find((item) => item.value === option.value) ?? dropdownOptions[0],
    })
    manualSetAmount('0')
  }

  const isLoading = state.txStatus === SendTxStatuses.PENDING || _isTxLoading

  const hasInsufficientBalance = !!selectedTokenBalance?.lt(amountDisplay)

  const isDisabled =
    !isAddress(state.recipientAddress) ||
    !amountParsed.gt(0) ||
    isLoading ||
    !isOwner ||
    hasInsufficientBalance

  const isCorrectChain = clientChainId === state.tokenDropdown.chainId

  const sidebarProps: SidebarProps = {
    title: getSendSidebarTitle({ state }),
    content: (
      <SendFormContent
        amountDisplay={amountDisplay}
        amountDisplayUSD={amountDisplayUSD}
        dropdownOptions={dropdownOptions}
        selectedTokenBalance={selectedTokenBalance}
        selectedTokenBalanceLoading={selectedTokenBalanceLoading}
        isOwner={isOwner}
        isLoading={isLoading}
        onFocus={onFocus}
        onBlur={onBlur}
        handleDropdownChange={handleDropdownChange}
        handleAmountChange={handleAmountChange}
        manualSetAmount={manualSetAmount}
        state={state}
        dispatch={dispatch}
        transactionFee={transactionFee}
        transactionFeeLoading={transactionFeeLoading}
        hasInsufficientBalance={hasInsufficientBalance}
      />
    ),
    primaryButton: {
      label: getSendPrimaryBtnLabel({
        state,
        isCorrectChain,
      }),
      action: () => {
        if (!isCorrectChain) {
          setChain({
            chain: SDKChainIdToAAChainMap[supportedSDKNetworkId(state.tokenDropdown.chainId)],
          })

          return
        }

        if (state.txStatus === SendTxStatuses.COMPLETED) {
          dispatch({
            type: 'reset',
            payload: { txStatus: undefined, step: SendStep.INIT, recipientAddress: '' },
          })
          manualSetAmount('0')
          revalidateUser(walletAddress)

          return onClose()
        }

        dispatch({ type: 'update-tx-status', payload: SendTxStatuses.PENDING })
        dispatch({ type: 'update-step', payload: SendStep.PENDING })

        return sendTransaction()
      },
      disabled: isDisabled,
      loading: isLoading,
    },
    isMobileOrTablet,
    drawerOptions: {
      slideFrom: 'right',
      forceMobileOpen: isOpen,
      closeDrawer: onClose,
    },
    footnote: (
      <>
        {txHashes.map((txData) => (
          <TransactionHashPill
            key={txData.hash}
            transactionData={txData}
            removeTxHash={removeTxHash}
            chainId={state.tokenDropdown.chainId}
          />
        ))}
      </>
    ),
  }

  return isMobile ? (
    <Sidebar {...sidebarProps} />
  ) : (
    <Modal openModal={isOpen} closeModal={onClose}>
      <Sidebar {...sidebarProps} />
    </Modal>
  )
}
