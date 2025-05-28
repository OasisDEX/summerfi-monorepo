import { Button, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './BeachClubHeading.module.css'

export const BeachClubHeading = () => {
  return (
    <div className={classNames.beachClubHeadingWrapper}>
      <Text
        as="h2"
        variant="h2colorfulBeachClub"
        style={{ marginBottom: 'var(--general-space-16)', marginTop: 'var(--general-space-24)' }}
      >
        Boost your $SUMR rewards{' '}
        <span style={{ WebkitTextFillColor: 'white' }}>with Beach Club</span>
      </Text>
      <Text
        as="p"
        variant="p1"
        style={{
          color: 'var(--earn-protocol-secondary-60)',
          marginBottom: 'var(--general-space-32)',
        }}
      >
        Share Lazy Summer and earn more while you relax. Soon it will be Summer. Time to chill, not
        chase yields.
      </Text>
      <Link href="/portfolio">
        <Button variant="beachClubLarge" style={{ minWidth: 'unset', maxWidth: '180px' }}>
          Share your code
        </Button>
      </Link>
    </div>
  )
}
