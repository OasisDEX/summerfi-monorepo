import { type FC } from 'react'
import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import {
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

import { getDelegateOptInMerklButtonLabel } from './helpers'

import classNames from './ClaimDelegateOptInMerkl.module.css'

interface ClaimDelegateOptInMerklProps {
  state: ClaimDelegateState
  onAccept: () => void
  onReject: () => void
}

export const ClaimDelegateOptInMerkl: FC<ClaimDelegateOptInMerklProps> = ({
  state,
  onAccept,
  onReject,
}) => {
  const buttonLabel = getDelegateOptInMerklButtonLabel({ merklStatus: state.merklStatus })

  const isDisabled =
    state.merklStatus === ClaimDelegateTxStatuses.PENDING ||
    state.merklStatus === ClaimDelegateTxStatuses.COMPLETED

  return (
    <Card variant="cardSecondary" className={classNames.claimDelegateOptInMerklWrapper}>
      <Text as="h5" variant="h5" className={classNames.headingText}>
        Approve Merkl Distribution
      </Text>
      <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        The Lazy Summer Protocol recently moved reward claiming over to{' '}
        <Link
          href="https://merkl.xyz"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--earn-protocol-primary-100)' }}
        >
          Merkl
        </Link>
        . Before claiming through Merkl for the first time, please approve the distribution contract
        that will allow you to collect the rewards through the Summer.fi interface.
      </Text>
      <div className={classNames.buttonsWrapper}>
        <Button variant="primarySmall" onClick={onAccept} disabled={isDisabled}>
          {buttonLabel}
        </Button>
        <Button variant="secondarySmall" onClick={onReject} disabled={isDisabled}>
          Reject
        </Button>
      </div>
    </Card>
  )
}
