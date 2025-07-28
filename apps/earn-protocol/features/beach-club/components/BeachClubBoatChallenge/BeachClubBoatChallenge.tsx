import { type FC, useMemo } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubBoatChallengeRewardCard } from '@/features/beach-club/components/BeachClubBoatChallengeRewardCard/BeachClubBoatChallengeRewardCard'

import { getBeachClubBoatCards } from './get-cards'
import { getBeachClubBoatChallengeStats } from './get-stats'

import classNames from './BeachClubBoatChallenge.module.css'

interface BeachClubBoatChallengeProps {
  beachClubData: BeachClubData
  walletAddress: string
}

export const BeachClubBoatChallenge: FC<BeachClubBoatChallengeProps> = ({
  beachClubData,
  walletAddress,
}) => {
  const currentPoints = Number(
    beachClubData.rewards.find((reward) => reward.currency === 'points')?.balance ?? 0,
  )
  const earningPointsPerDay = Number(
    beachClubData.rewards.find((reward) => reward.currency === 'points')?.amount_per_day ?? 0,
  )
  const accountReferred = Number(beachClubData.active_users_count ?? 0)

  const stats = useMemo(
    () => getBeachClubBoatChallengeStats({ currentPoints, earningPointsPerDay, accountReferred }),
    [currentPoints, earningPointsPerDay, accountReferred],
  )

  const cards = useMemo(
    () => getBeachClubBoatCards(currentPoints, earningPointsPerDay),
    [currentPoints, earningPointsPerDay],
  )

  return (
    <div className={classNames.beachClubBoatChallengeWrapper}>
      <Text
        as="p"
        variant="p2"
        style={{
          color: 'var(--earn-protocol-secondary-60)',
        }}
      >
        The Summer Beach Boat Challenge is a supplementary points-based program where you can earn
        exclusive merch. Your points are calculated hourly based on the total TVL you refer and the
        number of unique accounts you bring in that actively use the Lazy Summer Protocol.
      </Text>
      {stats.map((stat, idx) => (
        <div key={stat.description} className={classNames.textual}>
          <Text as="h2" variant={idx === 0 ? 'h2colorfulBeachClub' : 'h2'}>
            {stat.value}
          </Text>
          <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
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
        {cards.map((card) => (
          <BeachClubBoatChallengeRewardCard
            key={card.reward.type}
            walletAddress={walletAddress}
            {...card}
          />
        ))}
      </div>
    </div>
  )
}
