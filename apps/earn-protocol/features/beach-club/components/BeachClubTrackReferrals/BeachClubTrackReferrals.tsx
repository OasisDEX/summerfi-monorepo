import { type FC, useMemo, useState } from 'react'
import { Button, Card } from '@summerfi/app-earn-ui'
import BigNumber from 'bignumber.js'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubReferralActivityTable } from '@/features/beach-club/components/BeachClubReferralActivityTable/BeachClubReferralActivityTable'
import { BeachClubYourReferralsTable } from '@/features/beach-club/components/BeachClubYourReferralsTable/BeachClubYourReferralsTable'
import { type BeachClubReferralList } from '@/features/beach-club/types'

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

interface BeachClubTrackReferralsProps {
  beachClubData: BeachClubData
}

export const BeachClubTrackReferrals: FC<BeachClubTrackReferralsProps> = ({ beachClubData }) => {
  const [tab, setTab] = useState<TrackReferralsTab>(TrackReferralsTab.REFERRAL_ACTIVITY)

  const trackReferralsList: BeachClubReferralList = useMemo(() => {
    return Object.values(beachClubData.recruitedUsersRewards).map((user) => ({
      address: user.id,
      tvl: user.tvl,
      earnedToDate: user.rewards
        .filter((reward) => reward.currency !== 'points')
        .reduce((acc, reward) => acc.plus(reward.balance_usd ?? '0'), new BigNumber(0))
        .toString(),
      forecastAnnualisedEarnings: user.rewards
        .filter((reward) => reward.currency !== 'points')
        .reduce(
          (acc, reward) => acc.plus(Number(reward.amount_per_day_usd ?? 0) * 365),
          new BigNumber(0),
        )
        .toString(),
    }))
  }, [beachClubData])

  const tables = {
    [TrackReferralsTab.REFERRAL_ACTIVITY]: (
      <BeachClubReferralActivityTable
        referralActivityList={beachClubData.recruitedUsersLatestActivity}
      />
    ),
    [TrackReferralsTab.YOUR_REFERRALS]: (
      <BeachClubYourReferralsTable trackReferralsList={trackReferralsList} />
    ),
  }

  return (
    <Card className={classNames.beachClubTrackReferralsWrapper}>
      <div className={classNames.buttons}>
        {tabsOptions.map((item) => (
          <Button
            variant="beachClubMedium"
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
