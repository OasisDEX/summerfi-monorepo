import { type FC, useMemo } from 'react'
import { Card, Icon, TabBar, Text } from '@summerfi/app-earn-ui'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubHowItWorks } from '@/features/beach-club/components/BeachClubHowItWorks/BeachClubHowItWorks'
import { BeachClubTrackReferrals } from '@/features/beach-club/components/BeachClubTrackReferrals/BeachClubTrackReferrals'

import classNames from './BeachClubReferAndEarn.module.css'

enum ReferAndEarnTab {
  HOW_IT_WORKS = 'how_it_works',
  TRACK_REFERRALS = 'track_referrals',
}

interface BeachClubReferAndEarnProps {
  walletAddress: string
  beachClubData: BeachClubData
}

export const BeachClubReferAndEarn: FC<BeachClubReferAndEarnProps> = ({
  walletAddress,
  beachClubData,
}) => {
  const tabsOptions = useMemo(
    () => [
      {
        label: 'How it works',
        id: ReferAndEarnTab.HOW_IT_WORKS,
        content: (
          <BeachClubHowItWorks walletAddress={walletAddress} beachClubData={beachClubData} />
        ),
        activeColor: 'var(--beach-club-tab-underline)',
      },
      {
        label: 'Track referrals',
        id: ReferAndEarnTab.TRACK_REFERRALS,
        content: <BeachClubTrackReferrals beachClubData={beachClubData} />,
        activeColor: 'var(--beach-club-tab-underline)',
      },
    ],
    [walletAddress, beachClubData],
  )

  return (
    <div className={classNames.beachClubReferAndEarnWrapper}>
      <div className={classNames.header}>
        <Text
          as="div"
          variant="h4"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-16)' }}
        >
          <Icon iconName="users_beach_club" size={48} /> Refer and earn
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
