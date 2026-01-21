import { type FC, type ReactNode, useMemo } from 'react'
import { Button, Card, Icon, LoadingSpinner, Text, Tooltip, WithArrow } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { humanReadableChainToLabelMap } from '@summerfi/app-utils'
import clsx from 'clsx'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import classNames from './ClaimDelegateClaimStep.module.css'

interface ClaimDelegateToClaimProps {
  earned: string
  earnedAdditionalInfo?: ReactNode
  claimableRaw: number
  earnedInUSD: string
  balance: string
  chainId: SupportedNetworkIds
  onClaim: () => void
  isLoading?: boolean
  isChangingNetwork?: boolean
  canClaim: boolean
  isOnlyStep?: boolean
  isOwner?: boolean
  needsToAuthorizeStakingRewardsCallerBase?: boolean
}

export const ClaimDelegateToClaim: FC<ClaimDelegateToClaimProps> = ({
  earned,
  earnedAdditionalInfo,
  claimableRaw,
  balance,
  chainId,
  onClaim,
  isLoading,
  isOnlyStep,
  isChangingNetwork,
  canClaim,
  isOwner,
  needsToAuthorizeStakingRewardsCallerBase,
}) => {
  const buttonLabel = useMemo(() => {
    if (needsToAuthorizeStakingRewardsCallerBase) {
      return 'Approve 1/2'
    }
    if (isChangingNetwork) {
      return 'Switching network...'
    }
    if (isLoading) {
      return 'Claiming...'
    }

    return isOnlyStep ? 'Claim' : 'Claim 1/2'
  }, [isLoading, isChangingNetwork, isOnlyStep, needsToAuthorizeStakingRewardsCallerBase])

  return (
    <Card className={classNames.cardWrapper + (canClaim ? '' : ` ${classNames.disabled}`)}>
      {canClaim && (
        <div className={clsx(classNames.tagWrapper, classNames.claim)}>
          <Text as="p" variant="p4semi">
            Available to claim
          </Text>
        </div>
      )}

      <div className={classNames.networkWrapper}>
        {networkSDKChainIdIconMap(chainId)}
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {humanReadableChainToLabelMap[chainId]}
        </Text>
      </div>
      <div className={classNames.valueWithIcon}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--general-space-4)',
            position: 'relative',
          }}
        >
          <Icon tokenName="SUMR" size={36} />
        </div>
        <div className={classNames.valueWrapper}>
          <Tooltip
            tooltip={
              <>
                {earnedAdditionalInfo ? (
                  earnedAdditionalInfo
                ) : (
                  <>{claimableRaw.toFixed(2)}&nbsp;SUMR</>
                )}
              </>
            }
            tooltipName="claimable-sumr-tooltip"
            showAbove
            tooltipWrapperStyles={{
              top: '-40px',
              minWidth: '300px',
            }}
          >
            <Text as="h2" variant="h2">
              {earned}
            </Text>
          </Tooltip>
        </div>
      </div>
      <div className={classNames.walletBalanceWrapper}>
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {balance} in wallet
        </Text>
      </div>
      <div className={classNames.ctaWrapper}>
        <Button
          variant="neutralSmall"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
            onClaim()
          }}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          disabled={!canClaim || isLoading || isChangingNetwork || !isOwner}
        >
          {isLoading ?? isChangingNetwork ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
              <LoadingSpinner size={16} color="var(--earn-protocol-secondary-40)" />
              <span>{buttonLabel}</span>
            </div>
          ) : (
            <WithArrow
              reserveSpace
              variant="p4semi"
              as="p"
              style={{
                color: 'inherit',
              }}
            >
              {buttonLabel}
            </WithArrow>
          )}
        </Button>
      </div>
    </Card>
  )
}
