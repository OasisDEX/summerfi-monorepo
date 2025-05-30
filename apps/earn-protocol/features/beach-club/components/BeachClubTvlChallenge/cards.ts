import { formatFiatBalance } from '@summerfi/app-utils'

const getDefaultCards = (currentGroupTvl: number) => [
  {
    tvlGroup: '10K',
    rawTvlGroup: 10000,
    description: 'Congratulations, you already earned a SUMR boost!',
    boost: '0.002', // 0.2%
    sumrToEarn: 10000 * 0.002,
    currentGroupTvl,
  },
  {
    tvlGroup: '100K',
    rawTvlGroup: 100000,
    description:
      'Congratulations, your groups TVL has reach 100K. Each member can claim their SUMR boost now!',
    boost: '0.003', // 0.2%
    sumrToEarn: 100000 * 0.003,
    currentGroupTvl,
    colorfulBorder: true,
  },
  {
    tvlGroup: '250K',
    rawTvlGroup: 250000,
    description: `Keep going, you still need ${formatFiatBalance(250000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.004', // 0.4%
    sumrToEarn: 250000 * 0.004,
    currentGroupTvl,
  },
  {
    tvlGroup: '500K+',
    rawTvlGroup: 500000,
    description: `Keep going, you still need ${formatFiatBalance(500000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: 500000 * 0.005,
    currentGroupTvl,
  },
]

const getOneBillionCard = (currentGroupTvl: number) => ({
  tvlGroup: '1B',
  rawTvlGroup: 1000000000,
  description: `Keep going, you still need ${formatFiatBalance(1000000000 - currentGroupTvl)} to reach the next group!`,
  boost: '0.005', // 0.5%
  sumrToEarn: 1000000000 * 0.005,
  currentGroupTvl: 200000,
  colorfulBackground: true,
  colorfulBorder: true,
})

const getHiddenCards = (currentGroupTvl: number, seeAll: boolean) => [
  {
    tvlGroup: '1M',
    rawTvlGroup: 1000000,
    description: `Keep going, you still need ${formatFiatBalance(1000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: 1000000 * 0.005,
    currentGroupTvl,
  },
  {
    tvlGroup: '5M',
    rawTvlGroup: 5000000,
    description: `Keep going, you still need ${formatFiatBalance(5000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: 5000000 * 0.005,
    currentGroupTvl,
  },
  {
    tvlGroup: '10M',
    rawTvlGroup: 10000000,
    description: `Keep going, you still need ${formatFiatBalance(10000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: 10000000 * 0.005,
    currentGroupTvl,
  },
  {
    tvlGroup: '50M',
    rawTvlGroup: 50000000,
    description: `Keep going, you still need ${formatFiatBalance(50000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: 50000000 * 0.005,
    currentGroupTvl,
  },
  {
    tvlGroup: '100M',
    rawTvlGroup: 100000000,
    description: `Keep going, you still need ${formatFiatBalance(100000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: 100000000 * 0.005,
    currentGroupTvl,
  },
  {
    tvlGroup: '500M',
    rawTvlGroup: 500000000,
    description: `Keep going, you still need ${formatFiatBalance(500000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: 500000000 * 0.005,
    currentGroupTvl,
  },
  ...(seeAll ? [getOneBillionCard(currentGroupTvl)] : []),
]

export const getBeachClubTvlRewardsCards = (currentGroupTvl: number, seeAll: boolean) => {
  const defaultCards = getDefaultCards(currentGroupTvl)
  const hiddenCards = getHiddenCards(currentGroupTvl, seeAll)

  return {
    defaultCards,
    hiddenCards,
    oneBillionCard: getOneBillionCard(currentGroupTvl),
  }
}
