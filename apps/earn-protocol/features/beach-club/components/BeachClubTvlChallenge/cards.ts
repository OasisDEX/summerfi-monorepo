import { formatFiatBalance } from '@summerfi/app-utils'

const getDefaultCards = (currentGroupTvl: number) => [
  {
    isLocked: false,
    tvlGroup: '10K',
    rawTvlGroup: 10000,
    description: 'Congratulations, you already earned a SUMR boost!',
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
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
    currentGroupTvl,
    boostClaimed: false,
    colorfulBorder: true,
  },
  {
    isLocked: true,
    tvlGroup: '250K',
    rawTvlGroup: 250000,
    description: `Keep going, you still need ${formatFiatBalance(250000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
  },
  {
    isLocked: true,
    tvlGroup: '500K+',
    rawTvlGroup: 500000,
    description: `Keep going, you still need ${formatFiatBalance(500000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
  },
]

const getOneBillionCard = (currentGroupTvl: number) => ({
  isLocked: true,
  tvlGroup: '1B',
  rawTvlGroup: 1000000000,
  description: `Keep going, you still need ${formatFiatBalance(1000000000 - currentGroupTvl)} to reach the next group!`,
  boost: '0.25', // 25%
  sumrToEarn: '1000',
  currentGroupTvl: 200000,
  boostClaimed: false,
  colorfulBackground: true,
  colorfulBorder: true,
})

const getHiddenCards = (currentGroupTvl: number, seeAll: boolean) => [
  {
    isLocked: true,
    tvlGroup: '1M',
    rawTvlGroup: 1000000,
    description: `Keep going, you still need ${formatFiatBalance(1000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
  },
  {
    isLocked: true,
    tvlGroup: '5M',
    rawTvlGroup: 5000000,
    description: `Keep going, you still need ${formatFiatBalance(5000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
  },
  {
    isLocked: true,
    tvlGroup: '10M',
    rawTvlGroup: 10000000,
    description: `Keep going, you still need ${formatFiatBalance(10000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
  },
  {
    isLocked: true,
    tvlGroup: '50M',
    rawTvlGroup: 50000000,
    description: `Keep going, you still need ${formatFiatBalance(50000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
  },
  {
    isLocked: true,
    tvlGroup: '100M',
    rawTvlGroup: 100000000,
    description: `Keep going, you still need ${formatFiatBalance(100000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
  },
  {
    isLocked: true,
    tvlGroup: '500M',
    rawTvlGroup: 500000000,
    description: `Keep going, you still need ${formatFiatBalance(500000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.25', // 25%
    sumrToEarn: '1000',
    currentGroupTvl,
    boostClaimed: false,
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
