import { type FC, useMemo } from 'react'
import { Card, Icon, TabBar, Text } from '@summerfi/app-earn-ui'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubBoatChallenge } from '@/features/beach-club/components/BeachClubBoatChallenge/BeachClubBoatChallenge'
import { BeachClubTvlChallenge } from '@/features/beach-club/components/BeachClubTvlChallenge/BeachClubTvlChallenge'

import classNames from './BeachClubRewards.module.css'

enum ReferAndEarnTab {
  TVL_CHALLENGES = 'tvl_challenges',
  BEACH_BOAT_CHALLENGE = 'beach_boat_challenge',
}

interface BeachClubRewardsProps {
  beachClubData: BeachClubData
}

export const BeachClubRewards: FC<BeachClubRewardsProps> = ({ beachClubData }) => {
  const tabsOptions = useMemo(
    () => [
      {
        label: 'TVL Challenges',
        id: ReferAndEarnTab.TVL_CHALLENGES,
        content: <BeachClubTvlChallenge beachClubData={beachClubData} />,
        activeColor: 'var(--beach-club-tab-underline)',
      },
      {
        label: 'Beach Boat Challenge',
        id: ReferAndEarnTab.BEACH_BOAT_CHALLENGE,
        content: <BeachClubBoatChallenge beachClubData={beachClubData} />,
        activeColor: 'var(--beach-club-tab-underline)',
      },
    ],
    [beachClubData],
  )

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
