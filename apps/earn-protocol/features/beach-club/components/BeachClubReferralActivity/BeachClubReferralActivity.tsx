import { type FC, useState } from 'react'
import { Button, Card } from '@summerfi/app-earn-ui'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubReferralActivityTable } from '@/features/beach-club/components/BeachClubReferralActivityTable/BeachClubReferralActivityTable'
import { getLatestActivity } from '@/features/latest-activity/api/get-latest-activity'

import classNames from './BeachClubReferralActivity.module.css'

interface BeachClubReferralActivityProps {
  beachClubData: BeachClubData
}

export const BeachClubReferralActivity: FC<BeachClubReferralActivityProps> = ({
  beachClubData,
}) => {
  const [currentReferralActivity, setCurrentReferralActivity] = useState(
    beachClubData.recruitedUsersLatestActivity.data,
  )
  const [currentReferralActivityPage, setCurrentReferralActivityPage] = useState(1)
  const [hasMoreReferralActivityItems, setHasMoreReferralActivityItems] = useState(
    beachClubData.recruitedUsersLatestActivity.pagination.totalPages > 1,
  )
  const [isLoadingReferralActivity, setIsLoadingReferralActivity] = useState(false)

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
      console.error('Error fetching more referral activity', error)
      setHasMoreReferralActivityItems(false)
    } finally {
      setIsLoadingReferralActivity(false)
    }
  }

  return (
    <Card className={classNames.beachClubReferralActivityWrapper}>
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
    </Card>
  )
}
