import { type FC } from 'react'
import { SDKChainId } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { ClaimDelegateToBridge } from './ClaimDelegateToBridge'
import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

interface ClaimDelegateNetworkCardProps {
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  claimableAmount: number
  balance: number
  estimatedSumrPrice: number
  walletAddress: string
  onClaim: () => void
  isLoading?: boolean
  isChangingNetwork?: boolean
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
      isChangingNetwork={isChangingNetwork}
      canClaim={canClaim}
      isOnlyStep={isOnlyStep}
    />
  )
}
