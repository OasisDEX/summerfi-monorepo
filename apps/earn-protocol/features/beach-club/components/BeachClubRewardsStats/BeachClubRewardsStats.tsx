import { Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'

import { BeachClubRewardCard } from '@/features/beach-club/components/BeachClubRewardCard/BeachClubRewardCard'
import { BeachClubRewardSimulation } from '@/features/beach-club/components/BeachClubRewardSimulation/BeachClubRewardSimulation'

import classNames from './BeachClubRewardsStats.module.css'

export const BeachClubRewardsStats = () => {
  const stats = [
    {
      value: `$${formatFiatBalance(100000)}`,
      description: 'Total TVL',
    },
    {
      value: formatCryptoBalance(48323),
      description: 'Earned $SUMR',
    },
    {
      value: `$${formatFiatBalance(8323)}`,
      description: "Earned Fee's",
    },
  ]

  const cards = [
    {
      isLocked: false,
      tvlGroup: '10K',
      rawTvlGroup: 10000,
      description: 'Congratulations, you already earned a SUMR boost!',
      boost: '0.25', // 25%
      sumrToEarn: '1000',
      currentGroupTvl: 200000,
      boostClaimed: true,
    },
    {
      isLocked: true,
      tvlGroup: '100K',
      rawTvlGroup: 100000,
      description:
        'Congratulations, your groups TVL has reach 100K. Each member can claim their SUMR boost now!',
      boost: '0.25', // 25%
      sumrToEarn: '1000',
      currentGroupTvl: 200000,
      boostClaimed: false,
      colorfulBorder: true,
    },
    {
      isLocked: true,
      tvlGroup: '250K',
      rawTvlGroup: 250000,
      description: `Keep going, you still need ${formatFiatBalance(250000 - 200000)} to reach the next group!`,
      boost: '0.25', // 25%
      sumrToEarn: '1000',
      currentGroupTvl: 200000,
      boostClaimed: false,
    },
    {
      isLocked: true,
      tvlGroup: '500K',
      rawTvlGroup: 500000,
      description: `Keep going, you still need ${formatFiatBalance(500000 - 200000)} to reach the next group!`,
      boost: '0.25', // 25%
      sumrToEarn: '1000',
      currentGroupTvl: 200000,
      boostClaimed: false,
    },
    {
      isLocked: true,
      tvlGroup: '1M',
      rawTvlGroup: 1000000,
      description: `Keep going, you still need ${formatFiatBalance(1000000 - 200000)} to reach the next group!`,
      boost: '0.25', // 25%
      sumrToEarn: '1000',
      currentGroupTvl: 200000,
      boostClaimed: false,
      colorfulBackground: true,
      colorfulBorder: true,
    },
  ]

  return (
    <div className={classNames.beachClubRewardsStatsWrapper}>
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
          <BeachClubRewardCard key={card.tvlGroup} {...card} />
        ))}
      </div>
      <BeachClubRewardSimulation />
    </div>
  )
}
