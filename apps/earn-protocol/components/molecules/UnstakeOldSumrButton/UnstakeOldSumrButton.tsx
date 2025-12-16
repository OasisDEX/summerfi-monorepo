'use client'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useAuthModal, useChain } from '@account-kit/react'
import {
  Button,
  ERROR_TOAST_CONFIG,
  LoadingSpinner,
  SDKChainIdToAAChainMap,
  SUCCESS_TOAST_CONFIG,
  Text,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { formatDecimalToBigInt } from '@summerfi/app-utils'

import { useUnstakeSumrTransaction } from '@/features/claim-and-delegate/hooks/use-unstake-sumr-transaction'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'
import { useRevalidateUser } from '@/hooks/use-revalidate'

export const UnstakeOldSumrButton = ({
  oldStakedAmount,
  walletAddress,
  onFinished,
}: {
  oldStakedAmount: string
  walletAddress: string
  onFinished?: () => void
}) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const { chain, isSettingChain, setChain } = useChain()
  const { userWalletAddress, isLoadingAccount } = useUserWallet()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const revalidateUser = useRevalidateUser()
  const { unstakeSumrTransaction, isLoading: isLoadingUnstakeTransaction } =
    useUnstakeSumrTransaction({
      amount: formatDecimalToBigInt(oldStakedAmount, 18),
      onSuccess: () => {
        toast.success('Unstaked $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
        revalidateUser(userWalletAddress)
        onFinished?.()
      },
      onError: () => {
        toast.error('Failed to unstake $SUMR tokens', ERROR_TOAST_CONFIG)
        onFinished?.()
      },
    })

  const resolvedWalletAddress = walletAddress as string
  const isCorrectNetwork = chain.id === SupportedNetworkIds.Base

  const hasOldStakedSumr = Number(oldStakedAmount) > 0.2

  const isLoading =
    isLoadingAccount || isLoadingUnstakeTransaction || isAuthModalOpen || isSettingChain

  const handleRemoveStakeInOldModule = useCallback(() => {
    if (userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase()) {
      return
    }
    if (!isCorrectNetwork) {
      setChain({ chain: SDKChainIdToAAChainMap[SupportedNetworkIds.Base] })

      return
    }
    unstakeSumrTransaction()
    buttonClickEventHandler(`portfolio-sumr-rewards-staked-sumr-add-remove-stake`)
  }, [
    buttonClickEventHandler,
    isCorrectNetwork,
    resolvedWalletAddress,
    setChain,
    userWalletAddress,
    unstakeSumrTransaction,
  ])

  const handleConnect = useCallback(() => {
    buttonClickEventHandler(`portfolio-sumr-rewards-staked-sumr-connect`)
    if (!userWalletAddress) {
      openAuthModal()
    }
  }, [buttonClickEventHandler, openAuthModal, userWalletAddress])

  const button = useMemo(() => {
    if (isLoading) {
      return (
        <Button variant="unstyled" disabled>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            <LoadingSpinner size={18} />
          </Text>
        </Button>
      )
    }

    if (!hasOldStakedSumr) {
      return (
        <Button variant="unstyled" disabled>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            Remove Old Staked SUMR
          </Text>
        </Button>
      )
    }

    if (!userWalletAddress) {
      return (
        <Button variant="unstyled" onClick={handleConnect}>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            Remove Old Staked SUMR
          </Text>
        </Button>
      )
    }

    return (
      <Button
        variant="unstyled"
        disabled={userWalletAddress.toLowerCase() !== resolvedWalletAddress.toLowerCase()}
        onClick={handleRemoveStakeInOldModule}
      >
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
          Remove Old Staked SUMR
        </Text>
      </Button>
    )
  }, [
    handleConnect,
    handleRemoveStakeInOldModule,
    hasOldStakedSumr,
    isLoading,
    resolvedWalletAddress,
    userWalletAddress,
  ])

  return button
}
