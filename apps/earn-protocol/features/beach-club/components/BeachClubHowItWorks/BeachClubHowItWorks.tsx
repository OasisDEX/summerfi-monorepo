import { Button, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { BeachClubSteps } from '@/features/beach-club/components/BeachClubSteps/BeachClubSteps'

export const BeachClubHowItWorks = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Text
        as="p"
        variant="p2"
        style={{
          color: 'var(--earn-protocol-secondary-60)',
          marginBottom: 'var(--general-space-16)',
          width: '100%',
          textAlign: 'left',
        }}
      >
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield.
      </Text>
      <Link href="/" target="_blank" style={{ width: '100%', textAlign: 'left' }}>
        <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
          Read the details
        </WithArrow>
      </Link>
      <div
        style={{
          marginTop: 'var(--general-space-24)',
          marginBottom: 'var(--general-space-32)',
          width: '100%',
        }}
      >
        <BeachClubSteps />
      </div>
      <Text
        as="h5"
        variant="h5"
        style={{
          color: 'var(--earn-protocol-secondary-60)',
          textAlign: 'center',
          marginBottom: 'var(--general-space-16)',
        }}
      >
        Generate your uniques referal code
      </Text>
      <Button
        variant="primaryLarge"
        style={{
          maxWidth: '148px',
          minWidth: 'unset',
          background: 'var(--beach-club-primary-100)',
        }}
      >
        Generate <Icon iconName="stars" size={20} />
      </Button>
    </div>
  )
}
