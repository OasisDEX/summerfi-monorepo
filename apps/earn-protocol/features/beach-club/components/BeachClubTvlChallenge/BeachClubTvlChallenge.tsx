import { type FC, useMemo } from 'react'
import { BeachClubRewardSimulation, Icon, Text, Tooltip } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubTvlChallengeRewardCard } from '@/features/beach-club/components/BeachClubTvlChallengeRewardCard/BeachClubTvlChallengeRewardCard'

import { getBeachClubTvlRewardsCards } from './cards'

import classNames from './BeachClubTvlChallenge.module.css'

interface BeachClubTvlChallengeProps {
  beachClubData: BeachClubData
}

export const BeachClubTvlChallenge: FC<BeachClubTvlChallengeProps> = ({ beachClubData }) => {
  const currentGroupTvl = Number(beachClubData.total_deposits_referred_usd ?? 0)

  const stats = [
    {
      id: 1,
      value: `$${formatFiatBalance(currentGroupTvl)}`,
      description: 'Cumulative TVL from referrals',
    },
    {
      id: 2,
      value: formatCryptoBalance(
        beachClubData.rewards.find((reward) => reward.currency === 'SUMR')?.balance ?? 0,
      ),
      description: 'Earned $SUMR',
    },
    {
      id: 3,
      value: `$${formatFiatBalance(
        beachClubData.rewards
          .filter((reward) => reward.currency !== 'SUMR' && reward.currency !== 'points')
          .reduce((acc, reward) => acc + Number(reward.balance_usd), 0),
      )}`,
      description: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
          Earned Fee&apos;s{' '}
          <Tooltip
            tooltip="Earned fee's are the total accrued fee's from your Beach Club referrals to date, denominated in dollars."
            tooltipWrapperStyles={{ minWidth: '200px' }}
          >
            <Icon iconName="info" size={24} />
          </Tooltip>
        </div>
      ),
    },
  ]

  const { defaultCards } = useMemo(
    () => getBeachClubTvlRewardsCards(currentGroupTvl),
    [currentGroupTvl],
  )

  return (
    <div className={classNames.beachClubTvlChallengeWrapper}>
      <div className={classNames.statsWrapper}>
        {stats.map((stat, idx) => (
          <div key={stat.id} className={classNames.textual}>
            <Text as="h2" variant={idx === 0 ? 'h2colorfulBeachClub' : 'h2'}>
              {stat.value}
            </Text>
            <Text as="div" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {stat.description}
            </Text>
          </div>
        ))}
      </div>
      {/* <div className={classNames.leaderboardLink}>
        <Link href="/" target="_blank" style={{ textAlign: 'center' }}>
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
            See leaderboard
          </WithArrow>
        </Link>
      </div> */}
      <div
        className={classNames.rewardCardsWrapper}
        style={{ marginTop: 'var(--general-space-32)' }}
      >
        {defaultCards.map((card) => (
          <BeachClubTvlChallengeRewardCard
            key={card.tvlGroup}
            {...card}
            referralCode={beachClubData.custom_code ?? beachClubData.referral_code ?? undefined}
          />
        ))}
      </div>
      <BeachClubRewardSimulation tvl={currentGroupTvl} />
    </div>
  )
}
