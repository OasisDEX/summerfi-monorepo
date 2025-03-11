'use client'
import { type FC, useReducer, useState } from 'react'
import { useChain } from '@account-kit/react'
import { Modal, Sidebar, type SidebarProps, useAmount, useMobileCheck } from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type DropdownRawOption,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { chainIdToSDKNetwork, networkNameToSDKNetwork } from '@summerfi/app-utils'
import { isAddress } from 'viem'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { SendFormContent } from '@/features/send/components/SendFormContent/SendFormContent'
import { getSendPrimaryBtnLabel } from '@/features/send/helpers/get-send-primary-btn-label'
import { useSendTransaction } from '@/features/send/hooks/use-send-transaction'
import { sendReducer, sendState } from '@/features/send/state'
import { SendTxStatuses } from '@/features/send/types'
import { revalidateUser } from '@/helpers/revalidation-handlers'
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

  const [state, dispatch] = useReducer(sendReducer, sendState)

  const defaultDropdownValue = {
    label: walletData.assets[0].symbol.toUpperCase(),
    value: walletData.assets[0].symbol,
    tokenSymbol: walletData.assets[0].symbol.toUpperCase() as TokenSymbolsList,
  }
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const [dropdownValue, setDropdownValue] = useState<DropdownOption>(defaultDropdownValue)

  const isMobileOrTablet = isMobile || isTablet

  const {
    chain: { id },
  } = useChain()

  const dropdownOptions = walletData.assets
    .filter((item) => networkNameToSDKNetwork(item.network) === chainIdToSDKNetwork(id))
    .map((asset) => ({
      label: asset.symbol.toUpperCase(),
      value: asset.symbol,
      tokenSymbol: asset.symbol.toUpperCase() as TokenSymbolsList,
    }))

  const { publicClient } = usePublicClient({
    chain: SDKChainIdToAAChainMap[id as keyof typeof SDKChainIdToAAChainMap],
  })

  const {
    token: selectedToken,
    tokenBalance: selectedTokenBalance,
    tokenBalanceLoading: selectedTokenBalanceLoading,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: dropdownValue.value,
    tokenSymbol: dropdownValue.value,
    chainId: id,
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
      .find((item) => item.symbol === dropdownValue.value)
      ?.priceUSD.toString(),
    selectedToken,
    initialAmount: undefined,
  })

  const { sendTransaction, isLoading } = useSendTransaction({
    onSuccess: () => {
      dispatch({ type: 'update-tx-status', payload: SendTxStatuses.COMPLETED })
    },
    onError: () => {
      dispatch({ type: 'update-tx-status', payload: SendTxStatuses.FAILED })
    },
    amount: amountRaw,
    token: selectedToken,
    recipient: state.recipientAddress,
  })

  const handleDropdownChange = (option: DropdownRawOption) => {
    setDropdownValue(
      dropdownOptions.find((item) => item.value === option.value) ?? dropdownOptions[0],
    )
    manualSetAmount('0')
  }

  const isDisabled =
    !isAddress(state.recipientAddress) || !amountParsed.gt(0) || isLoading || !isOwner

  const sidebarProps: SidebarProps = {
    title: 'Send',
    content: (
      <SendFormContent
        amountDisplay={amountDisplay}
        amountDisplayUSD={amountDisplayUSD}
        dropdownValue={dropdownValue}
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
      />
    ),
    primaryButton: {
      label: getSendPrimaryBtnLabel({ state }),
      action: () => {
        if (state.txStatus === SendTxStatuses.COMPLETED) {
          dispatch({ type: 'reset' })
          manualSetAmount('0')
          revalidateUser(walletAddress)

          return onClose()
        }

        dispatch({ type: 'update-tx-status', payload: SendTxStatuses.PENDING })

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
  }

  return isMobile ? (
    <Sidebar {...sidebarProps} />
  ) : (
    <Modal openModal={isOpen} closeModal={onClose}>
      <Sidebar {...sidebarProps} />
    </Modal>
  )
}
