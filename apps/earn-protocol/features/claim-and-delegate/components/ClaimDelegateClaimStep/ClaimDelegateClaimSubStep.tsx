import { type FC } from 'react'
import { Button, LoadingSpinner, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKChainId } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { ClaimDelegateTxStatuses } from '@/features/claim-and-delegate/types'

import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

import classNames from './ClaimDelegateClaimStep.module.scss'

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
  claimStatus: ClaimDelegateTxStatuses | undefined
  clientChainId: SDKChainId
  resolvedWalletAddress: string
  userWalletAddress?: string
  hasReturnedToClaimStep: boolean
  onBack: () => void
  onAccept: () => void
  onSkip: () => void
}

const getButtonText = (
  _status: ClaimDelegateTxStatuses | undefined,
  claimOnChainId: SDKChainId,
  clientChainId: SDKChainId,
  isLoading?: boolean,
) => {
  if (isLoading) return 'Claiming...'

  switch (_status) {
    case ClaimDelegateTxStatuses.COMPLETED:
      return 'Continue'
    case ClaimDelegateTxStatuses.PENDING:
      return 'Claiming...'
    case ClaimDelegateTxStatuses.FAILED:
      return claimOnChainId !== clientChainId
        ? isLoading
          ? 'Switching network...'
          : 'Switch Network'
        : 'Retry'
    default:
      return claimOnChainId !== clientChainId
        ? isLoading
          ? 'Switching network...'
          : 'Switch Network'
        : 'Claim'
  }
}

export const ClaimDelegateClaimSubStep: FC<ClaimDelegateClaimSubStepProps> = ({
  hubClaimItem,
  satelliteClaimItems,
  claimOnChainId,
  setClaimOnChainId,
  externalData,
  estimatedSumrPrice,
  claimStatus,
  clientChainId,
  resolvedWalletAddress,
  userWalletAddress,
  hasReturnedToClaimStep,
  onBack,
  onAccept,
  onSkip,
}) => {
  const sumrToClaim =
    externalData.sumrToClaim.claimableAggregatedRewards.perChain[claimOnChainId] ?? 0

  const isButtonDisabled =
    claimStatus === ClaimDelegateTxStatuses.PENDING ||
    (sumrToClaim === 0 && claimStatus !== ClaimDelegateTxStatuses.COMPLETED) ||
    userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase()

  return (
    <>
      <div>
        {hubClaimItem && (
          <ClaimDelegateToClaim
            {...hubClaimItem}
            earned={formatCryptoBalance(
              externalData.sumrToClaim.claimableAggregatedRewards.perChain[hubClaimItem.chainId] ??
                0,
            )}
            earnedInUSD={formatFiatBalance(
              Number(
                externalData.sumrToClaim.claimableAggregatedRewards.perChain[
                  hubClaimItem.chainId
                ] ?? 0,
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
      </div>

      <div className={classNames.footerWrapper}>
        <div className={classNames.mainActionsGroup}>
          <Button variant="secondaryMedium" onClick={onBack}>
            <Text variant="p3semi" as="p">
              Back
            </Text>
          </Button>

          <Button
            variant="primarySmall"
            onClick={onAccept}
            disabled={isButtonDisabled}
            isLoading={claimStatus === ClaimDelegateTxStatuses.PENDING}
          >
            {claimStatus === ClaimDelegateTxStatuses.PENDING && (
              <LoadingSpinner size={20} className="mr-2" color="var(--color-secondary-60)" />
            )}
            <Text variant="p3semi" as="p">
              {getButtonText(
                claimStatus,
                claimOnChainId,
                clientChainId,
                claimStatus === ClaimDelegateTxStatuses.PENDING,
              )}
            </Text>
          </Button>
        </div>

        <Button variant="textMedium" onClick={onSkip}>
          <WithArrow variant="p3semi" as="p">
            {hasReturnedToClaimStep ? 'Continue' : 'Skip'}
          </WithArrow>
        </Button>
      </div>
    </>
  )
}
