import { Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './BeachClubEarnBig.module.css'

const paragraphs = [
  {
    title: 'Get rewarded in $SUMR. The token that powers DeFi’s best yield optimizer',
    description:
      '$SUMR is the governance token for the Lazy Summer Protocol. A DeFi yield optimization protocol that earns DeFi’s highest quality yields, all of the time, for everyone.',
    link: {
      label: 'Link to table',
      href: '/',
    },
  },
  {
    title: 'Get rewarded in fees. Earn extra income on top of $SUMR rewards.',
    description:
      'Every time someone uses your referral, you earn a share of the protocol fees—paid directly to you. This is extra income on top of the $SUMR rewards you already earn.',
    link: {
      label: 'Link to table',
      href: '/',
    },
  },
]

export const BeachClubEarnBig = () => {
  return (
    <div className={classNames.beachClubEarnBigWrapper}>
      <Text as="h2" variant="h2">
        Earn big $SUMR and token fee’s for sharing.
      </Text>
      <Text
        as="h2"
        variant="h2colorfulBeachClub"
        style={{ marginBottom: 'var(--general-space-64)' }}
      >
        The more you share, the more you earn.
      </Text>

      <div className={classNames.paragraphsWrapper}>
        {paragraphs.map((paragraph) => (
          <div key={paragraph.title} className={classNames.paragraphSection}>
            <Text as="h5" variant="h5" style={{ marginBottom: 'var(--general-space-8)' }}>
              {paragraph.title}
            </Text>
            <Text
              as="p"
              variant="p2"
              style={{
                marginBottom: 'var(--general-space-8)',
                color: 'var(--earn-protocol-secondary-60)',
              }}
            >
              {paragraph.description}
            </Text>
            <Link href={paragraph.link.href} target="_blank">
              <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
                {paragraph.link.label}
              </WithArrow>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
