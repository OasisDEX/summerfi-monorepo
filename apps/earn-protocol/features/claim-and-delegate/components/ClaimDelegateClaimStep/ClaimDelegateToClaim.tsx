import { type FC } from 'react'
import { Button, Card, Icon, LoadingSpinner, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKChainId } from '@summerfi/app-types'
import { humanReadableChainToLabelMap } from '@summerfi/app-utils'
import clsx from 'clsx'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateToClaimProps {
  earned: string
  earnedInUSD: string
  balance: string
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  onClaim: () => void
  isLoading?: boolean
  isChangingNetwork?: boolean
  canClaim: boolean
  isOnlyStep?: boolean
}

export const ClaimDelegateToClaim: FC<ClaimDelegateToClaimProps> = ({
  earned,
  earnedInUSD,
  balance,
  chainId,
  onClaim,
  isLoading,
  isOnlyStep,
  isChangingNetwork,
  canClaim,
}) => {
  const getButtonLabel = () => {
    if (isChangingNetwork) {
      return 'Switching network...'
    }
    if (isLoading) {
      return 'Claiming...'
    }

    return isOnlyStep ? 'Claim 1/1' : 'Claim 1/2'
  }

  return (
    <Card className={classNames.cardWrapper + (canClaim ? '' : ` ${classNames.disabled}`)}>
      {canClaim && (
        <div
          className={clsx(classNames.tagWrapper, classNames.claim, {
            [classNames.onlyStep]: isOnlyStep,
          })}
        >
          <Text as="p" variant="p4semi" className={classNames.tabLabel}>
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
          <Text as="h2" variant="h2">
            {earned}
          </Text>
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
          onClick={(e) => {
            e.stopPropagation()
            onClaim()
          }}
          disabled={!canClaim || isLoading || isChangingNetwork}
        >
          {isLoading || isChangingNetwork ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
              <LoadingSpinner size={16} color="var(--earn-protocol-secondary-40)" />
              <span>{getButtonLabel()}</span>
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
              {getButtonLabel()}
            </WithArrow>
          )}
        </Button>
      </div>
    </Card>
  )
}
