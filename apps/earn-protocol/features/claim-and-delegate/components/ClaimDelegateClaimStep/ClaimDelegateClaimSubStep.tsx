import { type FC } from 'react'
import { type SDKChainId } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

interface ClaimDelegateClaimSubStepProps {
  hubClaimItem:
    | {
        chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
      }
    | undefined
  satelliteClaimItems: {
    chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  }[]
  claimOnChainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  setClaimOnChainId: (chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM) => void
  externalData: {
    sumrToClaim: {
      claimableAggregatedRewards: {
        perChain: { [key: number]: number }
      }
    }
  }
  estimatedSumrPrice: number
}

export const ClaimDelegateClaimSubStep: FC<ClaimDelegateClaimSubStepProps> = ({
  hubClaimItem,
  satelliteClaimItems,
  claimOnChainId,
  setClaimOnChainId,
  externalData,
  estimatedSumrPrice,
}) => {
  return (
    <>
      {hubClaimItem && (
        <ClaimDelegateToClaim
          {...hubClaimItem}
          earned={formatCryptoBalance(
            externalData.sumrToClaim.claimableAggregatedRewards.perChain[hubClaimItem.chainId] ?? 0,
          )}
          earnedInUSD={formatFiatBalance(
            Number(
              externalData.sumrToClaim.claimableAggregatedRewards.perChain[hubClaimItem.chainId] ??
                0,
            ) * estimatedSumrPrice,
          )}
          isActive={claimOnChainId === hubClaimItem.chainId}
          onClick={() => setClaimOnChainId(hubClaimItem.chainId)}
        />
      )}
      {satelliteClaimItems.map((item) => (
        <ClaimDelegateToClaim
          key={item.chainId}
          {...item}
          earned={formatCryptoBalance(
            externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0,
          )}
          earnedInUSD={formatFiatBalance(
            Number(
              externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0,
            ) * estimatedSumrPrice,
          )}
          isActive={claimOnChainId === item.chainId}
          onClick={() => setClaimOnChainId(item.chainId)}
        />
      ))}
    </>
  )
}
