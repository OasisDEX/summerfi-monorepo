import { type FC } from 'react'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { ClaimDelegateToBridge } from './ClaimDelegateToBridge'
import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

interface ClaimDelegateNetworkCardProps {
  chainId: SupportedNetworkIds
  claimableAmount: number
  balance: number
  estimatedSumrPrice: number
  walletAddress: string
  onClaim: () => void
  isLoading?: boolean
  isChangingNetwork?: boolean
  isChangingNetworkTo?: SupportedNetworkIds
  isOnlyStep?: boolean
  isOwner?: boolean
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
  isOwner,
}) => {
  const isReadyToBridge =
    claimableAmount === 0 && balance > 0 && chainId !== SupportedNetworkIds.Base
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
      isOwner={isOwner}
    />
  )
}
