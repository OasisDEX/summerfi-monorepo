import { Card, Icon, TabBar, Text } from '@summerfi/app-earn-ui'

import { BeachClubBoatChallenge } from '@/features/beach-club/components/BeachClubBoatChallenge/BeachClubBoatChallenge'
import { BeachClubRewardsStats } from '@/features/beach-club/components/BeachClubRewardsStats/BeachClubRewardsStats'

import classNames from './BeachClubRewards.module.css'

enum ReferAndEarnTab {
  TVL_CHALLENGES = 'tvl_challenges',
  BEACH_BOAT_CHALLENGE = 'beach_boat_challenge',
}

const tabsOptions = [
  {
    label: 'TVL Challenges',
    id: ReferAndEarnTab.TVL_CHALLENGES,
    content: <BeachClubRewardsStats />,
    activeColor: 'var(--beach-club-tab-underline)',
  },
  {
    label: 'Beach Boat Challenge',
    id: ReferAndEarnTab.BEACH_BOAT_CHALLENGE,
    content: <BeachClubBoatChallenge />,
    activeColor: 'var(--beach-club-tab-underline)',
  },
]

export const BeachClubRewards = () => {
  return (
    <div className={classNames.beachClubRewardsWrapper}>
      <div className={classNames.header}>
        <Text
          as="div"
          variant="h4"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-16)' }}
        >
          <Icon iconName="beach_club_rewards" size={48} /> Beach Club Rewards
        </Text>
      </div>
      <Card variant="cardSecondary">
        <TabBar
          tabs={tabsOptions}
          textVariant="p3semi"
          tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
        />
      </Card>
    </div>
  )
}
