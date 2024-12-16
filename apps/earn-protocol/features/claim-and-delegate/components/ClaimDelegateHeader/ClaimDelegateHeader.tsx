import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './ClaimDelegateHeader.module.scss'

export const ClaimDelegateHeader = () => {
  return (
    <div className={classNames.claimDelegateHeaderWrapper}>
      <Link href="/">
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
      <Text as="h2" variant="h2">
        Claim & Delegate
      </Text>
    </div>
  )
}
