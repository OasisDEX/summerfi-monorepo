import { type FC, useState } from 'react'
import { Button, Card } from '@summerfi/app-earn-ui'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { getBeachClubRecruitedUsers } from '@/features/beach-club/api/get-beach-club-recruited-users'
import { BeachClubReferralActivityTable } from '@/features/beach-club/components/BeachClubReferralActivityTable/BeachClubReferralActivityTable'
import { BeachClubYourReferralsTable } from '@/features/beach-club/components/BeachClubYourReferralsTable/BeachClubYourReferralsTable'
import { getLatestActivity } from '@/features/latest-activity/api/get-latest-activity'

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
  const [currentReferralActivity, setCurrentReferralActivity] = useState(
    beachClubData.recruitedUsersLatestActivity.data,
  )
  const [currentReferralActivityPage, setCurrentReferralActivityPage] = useState(1)
  const [hasMoreReferralActivityItems, setHasMoreReferralActivityItems] = useState(
    beachClubData.recruitedUsersLatestActivity.pagination.totalPages > 1,
  )
  const [isLoadingReferralActivity, setIsLoadingReferralActivity] = useState(false)

  const [currentYourReferrals, setCurrentYourReferrals] = useState(
    beachClubData.recruitedUsersWithRewards.data,
  )

  const [currentYourReferralsPage, setCurrentYourReferralsPage] = useState(1)
  const [hasMoreYourReferralsItems, setHasMoreYourReferralsItems] = useState(
    beachClubData.recruitedUsersWithRewards.pagination.totalPages > 1,
  )
  const [isLoadingYourReferrals, setIsLoadingYourReferrals] = useState(false)

  const handleMoreReferralActivityItems = async () => {
    if (!hasMoreReferralActivityItems) return

    setIsLoadingReferralActivity(true)

    try {
      const nextPage = currentReferralActivityPage + 1
      const res = await getLatestActivity({
        page: nextPage,
        usersAddresses: beachClubData.recruitedUsersLatestActivity.data.map(
          (item) => item.userAddress,
        ),
      })

      if (
        res.data.length === 0 ||
        nextPage >= beachClubData.recruitedUsersLatestActivity.pagination.totalPages
      ) {
        setHasMoreReferralActivityItems(false)
      } else {
        setCurrentReferralActivity((prev) => [...prev, ...res.data])
        setCurrentReferralActivityPage((prev) => prev + 1)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching more user activity', error)
      setHasMoreReferralActivityItems(false)
    } finally {
      setIsLoadingReferralActivity(false)
    }
  }

  const handleMoreYourReferralsItems = async () => {
    if (!hasMoreYourReferralsItems || !beachClubData.referral_code) return

    setIsLoadingYourReferrals(true)

    try {
      const nextPage = currentYourReferralsPage + 1
      const res = await getBeachClubRecruitedUsers({
        page: nextPage,
        limit: 10,
        referralCode: beachClubData.referral_code,
      })

      if (
        res.data.length === 0 ||
        nextPage >= beachClubData.recruitedUsersWithRewards.pagination.totalPages
      ) {
        setHasMoreYourReferralsItems(false)
      } else {
        setCurrentYourReferrals((prev) => [...prev, ...res.data])
        setCurrentYourReferralsPage((prev) => prev + 1)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching more your referrals', error)
      setHasMoreYourReferralsItems(false)
    } finally {
      setIsLoadingYourReferrals(false)
    }
  }

  const tables = {
    [TrackReferralsTab.REFERRAL_ACTIVITY]: (
      <>
        <BeachClubReferralActivityTable referralActivityList={currentReferralActivity} />
        {hasMoreReferralActivityItems && (
          <Button
            variant="textBeachClubMedium"
            onClick={handleMoreReferralActivityItems}
            disabled={isLoadingReferralActivity}
          >
            {isLoadingReferralActivity ? 'Loading...' : 'Load more'}
          </Button>
        )}
      </>
    ),
    [TrackReferralsTab.YOUR_REFERRALS]: (
      <>
        <BeachClubYourReferralsTable trackReferralsList={currentYourReferrals} />
        {hasMoreYourReferralsItems && (
          <Button
            variant="textBeachClubMedium"
            onClick={handleMoreYourReferralsItems}
            disabled={isLoadingYourReferrals}
          >
            {isLoadingYourReferrals ? 'Loading...' : 'Load more'}
          </Button>
        )}
      </>
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
