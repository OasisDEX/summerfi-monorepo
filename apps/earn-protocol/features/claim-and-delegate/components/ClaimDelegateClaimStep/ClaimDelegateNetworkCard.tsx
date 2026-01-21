import { type FC, type ReactNode } from 'react'
import { AuthorizedStakingRewardsCallerBaseStatus, SupportedNetworkIds } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { ClaimDelegateToBridge } from './ClaimDelegateToBridge'
import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

interface ClaimDelegateNetworkCardProps {
  chainId: SupportedNetworkIds
  claimableAmount: number
  balance: number
  sumrPriceUsd: number
  walletAddress: string
  onClaim: () => void
  isLoading?: boolean
  isChangingNetwork?: boolean
  isChangingNetworkTo?: SupportedNetworkIds
  isOnlyStep?: boolean
  isOwner?: boolean
  earnedAdditionalInfo?: ReactNode
  authorizedStakingRewardsCallerBase?: AuthorizedStakingRewardsCallerBaseStatus
}

export const ClaimDelegateNetworkCard: FC<ClaimDelegateNetworkCardProps> = ({
  chainId,
  claimableAmount,
  balance,
  sumrPriceUsd,
  walletAddress,
  onClaim,
  isLoading,
  isChangingNetwork,
  isChangingNetworkTo,
  isOnlyStep,
  isOwner,
  earnedAdditionalInfo,
  authorizedStakingRewardsCallerBase,
}) => {
  const needsToAuthorizeStakingRewardsCallerBase =
    chainId === SupportedNetworkIds.Base &&
    authorizedStakingRewardsCallerBase === AuthorizedStakingRewardsCallerBaseStatus.NOAUTH
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
        balanceInUSD={formatFiatBalance(balance * sumrPriceUsd)}
        walletAddress={walletAddress}
      />
    )
  }

  return (
    <ClaimDelegateToClaim
      chainId={chainId}
      earned={formattedClaimable}
      earnedAdditionalInfo={earnedAdditionalInfo}
      claimableRaw={claimableAmount}
      balance={formattedBalance}
      earnedInUSD={formatFiatBalance(claimableAmount * sumrPriceUsd)}
      onClaim={onClaim}
      isLoading={isLoading}
      isChangingNetwork={isChangingNetworkTo === chainId && isChangingNetwork}
      canClaim={canClaim}
      isOnlyStep={isOnlyStep}
      isOwner={isOwner}
      needsToAuthorizeStakingRewardsCallerBase={needsToAuthorizeStakingRewardsCallerBase}
    />
  )
}
