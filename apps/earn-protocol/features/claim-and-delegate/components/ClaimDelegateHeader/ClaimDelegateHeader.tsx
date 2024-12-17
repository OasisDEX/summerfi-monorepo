import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { type ClaimDelegateState, ClaimDelegateSteps } from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateHeader.module.scss'

interface ClaimDelegateHeaderProps {
  state: ClaimDelegateState
}

export const ClaimDelegateHeader: FC<ClaimDelegateHeaderProps> = ({ state }) => {
  return (
    <div className={classNames.claimDelegateHeaderWrapper}>
      {state.step === ClaimDelegateSteps.TERMS && (
        <Link href={`/earn/portfolio/${state.walletAddress}`}>
          <Text
            as="p"
            variant="p1"
            style={{
              color: 'var(--earn-protocol-primary-100)',
              marginBottom: 'var(--general-space-12)',
            }}
          >
            {'<-'} SUMR Rewards
          </Text>
        </Link>
      )}
      {state.step !== ClaimDelegateSteps.TERMS && (
        <div className={classNames.pathLinkWrapper}>
          <Link href={`/earn/portfolio/${state.walletAddress}`}>
            <Text as="p" variant="p1" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              $SUMR
            </Text>
          </Link>{' '}
          /{' '}
          <Text as="p" variant="p1">
            Claim & Delegate
          </Text>
        </div>
      )}

      <Text as="h2" variant="h2">
        Claim & Delegate
      </Text>
    </div>
  )
}
