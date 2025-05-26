import { Text } from '@summerfi/app-earn-ui'

import { BeachClubBigBanner } from '@/features/beach-club/components/BeachClubBigBannner/BeachClubBigBanner'
import { BeachClubReferAndEarn } from '@/features/beach-club/components/BeachClubReferAndEarn/BeachClubReferAndEarn'
import { BeachClubRewards } from '@/features/beach-club/components/BeachClubRewards/BeachClubRewards'

import classNames from './PortfolioBeachClub.module.css'

export const PortfolioBeachClub = () => {
  return (
    <div className={classNames.beachClubWrapper}>
      <Text as="h3" variant="h3" style={{ marginTop: 'var(--general-space-16)' }}>
        Unlock exclusive rewards with Lazy Summer Beach Club.
      </Text>
      <Text as="h3" variant="h3colorfulBeachClub" style={{ marginBottom: '80px' }}>
        The more you share the more you earn.
      </Text>
      <BeachClubBigBanner />
      <BeachClubReferAndEarn />
      <BeachClubRewards />
    </div>
  )
}
