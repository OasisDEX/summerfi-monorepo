import { type FC } from 'react'
import { Button, Card, Text } from '@summerfi/app-earn-ui'
import { UiTransactionStatuses } from '@summerfi/app-types'
import Link from 'next/link'

import { getDelegateOptInMerklButtonLabel } from './helpers'

import classNames from './ClaimDelegateOptInMerkl.module.css'

interface ClaimDelegateOptInMerklProps {
  onAccept: () => void
  onReject: () => void
  merklStatus?: UiTransactionStatuses
}

export const ClaimDelegateOptInMerkl: FC<ClaimDelegateOptInMerklProps> = ({
  onAccept,
  onReject,
  merklStatus,
}) => {
  const buttonLabel = getDelegateOptInMerklButtonLabel({ merklStatus })

  const isDisabled =
    merklStatus === UiTransactionStatuses.PENDING || merklStatus === UiTransactionStatuses.COMPLETED

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
