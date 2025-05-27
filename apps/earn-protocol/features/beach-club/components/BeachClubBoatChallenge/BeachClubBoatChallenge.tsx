import { Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'

import {
  BeachClubBoatChallengeRewardCard,
  BeachClubBoatChallengeRewardCardType,
} from '@/features/beach-club/components/BeachClubBoatChallengeRewardCard/BeachClubBoatChallengeRewardCard'

import classNames from './BeachClubBoatChallenge.module.css'

const currentPoints = 15000

const stats = [
  {
    value: `${formatFiatBalance(currentPoints).split('.')[0]}`,
    description: 'Speed Challenge Points',
  },
  {
    value: formatCryptoBalance(2.33),
    description: 'Earning points / Day',
  },
  {
    value: `${formatFiatBalance(12323).split('.')[0]}`,
    description: 'Account Referred',
  },
]

const cards = [
  {
    requiredPoints: 10000,
    currentPoints,
    left: 23,
    unlocked: true,
    reward: {
      type: BeachClubBoatChallengeRewardCardType.T_SHIRT,
    },
  },
  {
    requiredPoints: 20000,
    currentPoints,
    left: 23,
    unlocked: false,
    reward: {
      type: BeachClubBoatChallengeRewardCardType.HOODIE,
    },
  },
  {
    requiredPoints: 20000,
    currentPoints,
    left: 23,
    unlocked: false,
    reward: {
      type: BeachClubBoatChallengeRewardCardType.BEACH_CLUB_NFT,
    },
  },
]

export const BeachClubBoatChallenge = () => {
  return (
    <div className={classNames.beachClubBoatChallengeWrapper}>
      {stats.map((stat, idx) => (
        <div key={stat.description} className={classNames.textual}>
          <Text as="h2" variant={idx === 0 ? 'h2colorfulBeachClub' : 'h2'}>
            {stat.value}
          </Text>
          <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            {stat.description}
          </Text>
        </div>
      ))}
      <div className={classNames.leaderboardLink}>
        <Link href="/" target="_blank" style={{ textAlign: 'center' }}>
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
            See leaderboard
          </WithArrow>
        </Link>
      </div>
      <div className={classNames.rewardCardsWrapper}>
        {cards.map((card) => (
          <BeachClubBoatChallengeRewardCard key={card.reward.type} {...card} />
        ))}
      </div>
    </div>
  )
}
