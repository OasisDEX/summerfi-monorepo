import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import { formatWithSeparators } from '@summerfi/app-utils'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubBoatChallengeRewardCard } from '@/features/beach-club/components/BeachClubBoatChallengeRewardCard/BeachClubBoatChallengeRewardCard'
import { BeachClubBoatChallengeRewardCardType } from '@/features/beach-club/constants/reward-cards'

import classNames from './BeachClubBoatChallenge.module.css'

const getStats = (currentPoints: number, earningPointsPerDay: number, accountReferred: number) => [
  {
    value: `${formatWithSeparators(currentPoints, { precision: 2 })}`,
    description: 'Speed Challenge Points',
  },
  {
    value: formatWithSeparators(earningPointsPerDay, { precision: 2 }),
    description: 'Earning points / Day',
  },
  {
    value: `${formatWithSeparators(accountReferred)}`,
    description: 'Account Referred',
  },
]

const getCards = (currentPoints: number, earningPointsPerDay: number) => {
  const calculateDaysLeft = (requiredPoints: number) => {
    if (earningPointsPerDay <= 0) return 0
    const pointsNeeded = requiredPoints - currentPoints

    if (pointsNeeded <= 0) return 0

    return Math.ceil(pointsNeeded / earningPointsPerDay)
  }

  return [
    {
      requiredPoints: 10000,
      currentPoints,
      left: 23,
      unlocked: currentPoints >= 10000,
      reward: {
        type: BeachClubBoatChallengeRewardCardType.T_SHIRT,
      },
    },
    {
      requiredPoints: 20000,
      currentPoints,
      left: 23,
      unlocked: currentPoints >= 20000,
      reward: {
        type: BeachClubBoatChallengeRewardCardType.HOODIE,
      },
    },
    {
      requiredPoints: 20000,
      currentPoints,
      left: 23,
      unlocked: currentPoints >= 20000,
      reward: {
        type: BeachClubBoatChallengeRewardCardType.BEACH_CLUB_NFT,
      },
    },
  ].map((card) => ({
    ...card,
    daysToUnlock: calculateDaysLeft(card.requiredPoints),
  }))
}

interface BeachClubBoatChallengeProps {
  beachClubData: BeachClubData
}

export const BeachClubBoatChallenge: FC<BeachClubBoatChallengeProps> = ({ beachClubData }) => {
  const currentPoints = Number(
    beachClubData.rewards.find((reward) => reward.currency === 'points')?.balance ?? 0,
  )
  const earningPointsPerDay = Number(
    beachClubData.rewards.find((reward) => reward.currency === 'points')?.amount_per_day ?? 0,
  )

  const accountReferred = Number(beachClubData.active_users_count ?? 0)

  return (
    <div className={classNames.beachClubBoatChallengeWrapper}>
      {getStats(currentPoints, earningPointsPerDay, accountReferred).map((stat, idx) => (
        <div key={stat.description} className={classNames.textual}>
          <Text as="h2" variant={idx === 0 ? 'h2colorfulBeachClub' : 'h2'}>
            {stat.value}
          </Text>
          <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            {stat.description}
          </Text>
        </div>
      ))}
      {/* <div className={classNames.leaderboardLink}>
        <Link href="/" target="_blank" style={{ textAlign: 'center' }}>
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
            See leaderboard
          </WithArrow>
        </Link>
      </div> */}
      <div className={classNames.rewardCardsWrapper}>
        {getCards(currentPoints, earningPointsPerDay).map((card) => (
          <BeachClubBoatChallengeRewardCard key={card.reward.type} {...card} />
        ))}
      </div>
    </div>
  )
}
