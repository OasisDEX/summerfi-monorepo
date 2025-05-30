import { formatFiatBalance } from '@summerfi/app-utils'

enum BeachClubTvlGroup {
  '10K' = 10000,
  '100K' = 100000,
  '250K' = 250000,
  '500K' = 500000,
  '1M' = 1000000,
  '5M' = 5000000,
  '10M' = 10000000,
  '50M' = 50000000,
  '100M' = 100000000,
  '500M' = 500000000,
  '1B' = 1000000000,
}

const getDefaultCards = (currentGroupTvl: number) => [
  {
    tvlGroup: '10K',
    rawTvlGroup: BeachClubTvlGroup['10K'],
    description: 'Congratulations, you already earned a SUMR boost!',
    boost: '0.002', // 0.2%
    sumrToEarn: BeachClubTvlGroup['10K'] * 0.002,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['100K'],
  },
  {
    tvlGroup: '100K',
    rawTvlGroup: BeachClubTvlGroup['100K'],
    description:
      'Congratulations, your groups TVL has reach 100K. Each member can claim their SUMR boost now!',
    boost: '0.003', // 0.2%
    sumrToEarn: BeachClubTvlGroup['100K'] * 0.003,
    currentGroupTvl,
    colorfulBorder: true,
    nextGroupTvl: BeachClubTvlGroup['250K'],
  },
  {
    tvlGroup: '250K',
    rawTvlGroup: BeachClubTvlGroup['250K'],
    description: `Keep going, you still need ${formatFiatBalance(250000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.004', // 0.4%
    sumrToEarn: BeachClubTvlGroup['250K'] * 0.004,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['500K'],
  },
  {
    tvlGroup: '500K+',
    rawTvlGroup: BeachClubTvlGroup['500K'],
    description: `Keep going, you still need ${formatFiatBalance(500000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: BeachClubTvlGroup['500K'] * 0.005,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['1M'],
  },
]

const getOneBillionCard = (currentGroupTvl: number) => ({
  tvlGroup: '1B',
  rawTvlGroup: BeachClubTvlGroup['1B'],
  description: `Keep going, you still need ${formatFiatBalance(1000000000 - currentGroupTvl)} to reach the next group!`,
  boost: '0.005', // 0.5%
  sumrToEarn: BeachClubTvlGroup['1B'] * 0.005,
  currentGroupTvl: 200000,
  colorfulBackground: true,
  colorfulBorder: true,
  nextGroupTvl: BeachClubTvlGroup['1B'],
})

const getHiddenCards = (currentGroupTvl: number, seeAll: boolean) => [
  {
    tvlGroup: '1M',
    rawTvlGroup: BeachClubTvlGroup['1M'],
    description: `Keep going, you still need ${formatFiatBalance(1000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: BeachClubTvlGroup['1M'] * 0.005,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['5M'],
  },
  {
    tvlGroup: '5M',
    rawTvlGroup: BeachClubTvlGroup['5M'],
    description: `Keep going, you still need ${formatFiatBalance(5000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: BeachClubTvlGroup['5M'] * 0.005,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['10M'],
  },
  {
    tvlGroup: '10M',
    rawTvlGroup: BeachClubTvlGroup['10M'],
    description: `Keep going, you still need ${formatFiatBalance(10000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: BeachClubTvlGroup['10M'] * 0.005,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['50M'],
  },
  {
    tvlGroup: '50M',
    rawTvlGroup: BeachClubTvlGroup['50M'],
    description: `Keep going, you still need ${formatFiatBalance(50000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: BeachClubTvlGroup['50M'] * 0.005,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['100M'],
  },
  {
    tvlGroup: '100M',
    rawTvlGroup: BeachClubTvlGroup['100M'],
    description: `Keep going, you still need ${formatFiatBalance(100000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: BeachClubTvlGroup['100M'] * 0.005,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['500M'],
  },
  {
    tvlGroup: '500M',
    rawTvlGroup: BeachClubTvlGroup['500M'],
    description: `Keep going, you still need ${formatFiatBalance(500000000 - currentGroupTvl)} to reach the next group!`,
    boost: '0.005', // 0.5%
    sumrToEarn: BeachClubTvlGroup['500M'] * 0.005,
    currentGroupTvl,
    nextGroupTvl: BeachClubTvlGroup['1B'],
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
