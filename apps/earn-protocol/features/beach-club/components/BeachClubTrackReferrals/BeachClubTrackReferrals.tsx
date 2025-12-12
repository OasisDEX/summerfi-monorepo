import { type FC, useState } from 'react'
import { Button, Card } from '@summerfi/app-earn-ui'

import { type BeachClubData } from '@/app/server-handlers/raw-calls/beach-club/types'
import { getBeachClubRecruitedUsers } from '@/features/beach-club/api/get-beach-club-recruited-users'
import { BeachClubYourReferralsTable } from '@/features/beach-club/components/BeachClubYourReferralsTable/BeachClubYourReferralsTable'

import classNames from './BeachClubTrackReferrals.module.css'

interface BeachClubTrackReferralsProps {
  beachClubData: BeachClubData
}

export const BeachClubTrackReferrals: FC<BeachClubTrackReferralsProps> = ({ beachClubData }) => {
  const [currentYourReferrals, setCurrentYourReferrals] = useState(
    beachClubData.recruitedUsersWithRewards.data,
  )

  const [currentYourReferralsPage, setCurrentYourReferralsPage] = useState(1)
  const [hasMoreYourReferralsItems, setHasMoreYourReferralsItems] = useState(
    beachClubData.recruitedUsersWithRewards.pagination.totalPages > 1,
  )
  const [isLoadingYourReferrals, setIsLoadingYourReferrals] = useState(false)

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

  return (
    <Card className={classNames.beachClubTrackReferralsWrapper}>
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
    </Card>
  )
}
