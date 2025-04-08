import { type FC } from 'react'
import { SDKChainId, type SDKSupportedChain } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { ClaimDelegateToBridge } from './ClaimDelegateToBridge'
import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

interface ClaimDelegateNetworkCardProps {
  chainId: SDKSupportedChain
  claimableAmount: number
  balance: number
  estimatedSumrPrice: number
  walletAddress: string
  onClaim: () => void
  isLoading?: boolean
  isChangingNetwork?: boolean
  isChangingNetworkTo?: SDKChainId
  isOnlyStep?: boolean
}

export const ClaimDelegateNetworkCard: FC<ClaimDelegateNetworkCardProps> = ({
  chainId,
  claimableAmount,
  balance,
  estimatedSumrPrice,
  walletAddress,
  onClaim,
  isLoading,
  isChangingNetwork,
  isChangingNetworkTo,
  isOnlyStep,
}) => {
  const isReadyToBridge = claimableAmount === 0 && balance > 0 && chainId !== SDKChainId.BASE
  const canClaim = claimableAmount > 0
  const formattedClaimable = formatCryptoBalance(claimableAmount)
  const formattedBalance = formatCryptoBalance(balance)

  if (isReadyToBridge) {
    return (
      <ClaimDelegateToBridge
        chainId={chainId}
        balance={formattedBalance}
        balanceInUSD={formatFiatBalance(balance * estimatedSumrPrice)}
        walletAddress={walletAddress}
      />
    )
  }

  return (
    <ClaimDelegateToClaim
      chainId={chainId}
      earned={formattedClaimable}
      balance={formattedBalance}
      earnedInUSD={formatFiatBalance(claimableAmount * estimatedSumrPrice)}
      onClaim={onClaim}
      isLoading={isLoading}
      isChangingNetwork={isChangingNetworkTo === chainId && isChangingNetwork}
      canClaim={canClaim}
      isOnlyStep={isOnlyStep}
    />
  )
}
