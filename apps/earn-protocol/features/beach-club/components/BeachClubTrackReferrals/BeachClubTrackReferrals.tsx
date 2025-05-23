import { useState } from 'react'
import { Button, Card } from '@summerfi/app-earn-ui'

import { BeachClubReferralActivityTable } from '@/features/beach-club/components/BeachClubReferralActivityTable/BeachClubReferralActivityTable'
import { BeachClubYourReferralsTable } from '@/features/beach-club/components/BeachClubYourReferralsTable/BeachClubYourReferralsTable'

import classNames from './BeachClubTrackReferrals.module.css'

enum TrackReferralsTab {
  REFERRAL_ACTIVITY = 'referral-activity',
  YOUR_REFERRALS = 'your-referrals',
}

const tabsOptions = [
  {
    label: 'Referral Activity',
    id: TrackReferralsTab.REFERRAL_ACTIVITY,
  },
  {
    label: 'Your Referrals',
    id: TrackReferralsTab.YOUR_REFERRALS,
  },
]

export const BeachClubTrackReferrals = () => {
  const [tab, setTab] = useState<TrackReferralsTab>(TrackReferralsTab.REFERRAL_ACTIVITY)

  const tables = {
    [TrackReferralsTab.REFERRAL_ACTIVITY]: (
      <BeachClubReferralActivityTable referralActivityList={[]} />
    ),
    [TrackReferralsTab.YOUR_REFERRALS]: <BeachClubYourReferralsTable referralActivityList={[]} />,
  }

  return (
    <Card className={classNames.beachClubTrackReferralsWrapper}>
      <div className={classNames.buttons}>
        {tabsOptions.map((item) => (
          <Button
            variant="primaryMedium"
            key={item.id}
            onClick={() => setTab(item.id)}
            className={tab === item.id ? classNames.tabActive : classNames.tab}
          >
            {item.label}
          </Button>
        ))}
      </div>
      {tables[tab]}
    </Card>
  )
}
