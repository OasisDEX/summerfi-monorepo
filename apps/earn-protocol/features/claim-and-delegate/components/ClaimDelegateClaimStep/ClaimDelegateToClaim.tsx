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
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  onClaim: () => void
  isLoading?: boolean
  canClaim: boolean
}

export const ClaimDelegateToClaim: FC<ClaimDelegateToClaimProps> = ({
  earned,
  earnedInUSD,
  chainId,
  onClaim,
  isLoading,
  canClaim,
}) => {
  return (
    <Card className={classNames.cardWrapper + (canClaim ? '' : ` ${classNames.disabled}`)}>
      {canClaim && (
        <div className={clsx(classNames.tagWrapper, classNames.claim)}>
          <Text as="p" variant="p4semi" className={classNames.tabLabel}>
            Available to claim
          </Text>
        </div>
      )}
      <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        On {humanReadableChainToLabelMap[chainId]}
      </Text>
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
          <div style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
            {networkSDKChainIdIconMap(chainId)}
          </div>
        </div>
        <div className={classNames.valueWrapper}>
          <Text as="h2" variant="h2">
            {earned}
          </Text>
          <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            ${earnedInUSD}
          </Text>
        </div>
      </div>
      <Button
        variant="neutralSmall"
        onClick={(e) => {
          e.stopPropagation()
          onClaim()
        }}
        disabled={!canClaim || isLoading}
      >
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
            <LoadingSpinner size={16} color="var(--earn-protocol-secondary-40)" />
            <span>Claiming...</span>
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
            Claim
          </WithArrow>
        )}
      </Button>
    </Card>
  )
}
