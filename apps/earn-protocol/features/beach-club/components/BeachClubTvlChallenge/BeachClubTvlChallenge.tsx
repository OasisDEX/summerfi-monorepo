import { type FC, useMemo, useState } from 'react'
import { AnimateHeight, BeachClubRewardSimulation, Icon, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { BeachClubTvlChallengeRewardCard } from '@/features/beach-club/components/BeachClubTvlChallengeRewardCard/BeachClubTvlChallengeRewardCard'
import { BeachClubVerticalDots } from '@/features/beach-club/components/BeachClubVerticalDots/BeachClubVerticalDots'

import { getBeachClubTvlRewardsCards } from './cards'

import classNames from './BeachClubTvlChallenge.module.css'

interface BeachClubTvlChallengeProps {
  beachClubData: BeachClubData
}

export const BeachClubTvlChallenge: FC<BeachClubTvlChallengeProps> = ({ beachClubData }) => {
  const [seeAll, setSeeAll] = useState(false)

  const currentGroupTvl = Number(beachClubData.total_deposits_referred_usd ?? 0)

  const stats = [
    {
      value: `$${formatFiatBalance(currentGroupTvl)}`,
      description: 'Total TVL',
    },
    {
      value: formatCryptoBalance(
        beachClubData.rewards.find((reward) => reward.currency === 'SUMR')?.balance ?? 0,
      ),
      description: 'Earned $SUMR',
    },
    {
      value: `$${formatFiatBalance(
        beachClubData.rewards
          .filter((reward) => reward.currency !== 'SUMR' && reward.currency !== 'points')
          .reduce((acc, reward) => acc + Number(reward.balance), 0),
      )}`,
      description: "Earned Fee's",
    },
  ]

  const { defaultCards, hiddenCards, oneBillionCard } = useMemo(
    () => getBeachClubTvlRewardsCards(currentGroupTvl, seeAll),
    [currentGroupTvl, seeAll],
  )

  return (
    <div className={classNames.beachClubTvlChallengeWrapper}>
      <div className={classNames.statsWrapper}>
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
          <BeachClubTvlChallengeRewardCard key={card.tvlGroup} {...card} />
        ))}
      </div>
      <AnimateHeight
        id="reward-cards-wrapper"
        show={seeAll}
        fade={false}
        contentClassName={classNames.rewardCardsWrapper}
        className={classNames.animateHeightWrapper}
      >
        {hiddenCards.map((card) => (
          <BeachClubTvlChallengeRewardCard key={card.tvlGroup} {...card} />
        ))}
      </AnimateHeight>

      {!seeAll && (
        <Text
          as="div"
          variant="p3semi"
          onClick={() => setSeeAll(!seeAll)}
          className={classNames.seeAllWrapper}
        >
          See all <Icon iconName="chevron_down" size={10} />
        </Text>
      )}
      {!seeAll && (
        <div className={classNames.verticalDotsWrapper}>
          <BeachClubVerticalDots />
        </div>
      )}
      {!seeAll && <BeachClubTvlChallengeRewardCard {...oneBillionCard} />}
      {seeAll && (
        <Text
          as="div"
          variant="p3semi"
          onClick={() => setSeeAll(!seeAll)}
          className={classNames.seeAllWrapper}
        >
          Hide all <Icon iconName="chevron_up" size={10} />
        </Text>
      )}
      <BeachClubRewardSimulation />
    </div>
  )
}
