import { formatFiatBalance } from '@summerfi/app-utils'

enum BeachClubTvlGroup {
  '0K' = 0,
  '10K' = 10000,
  '100K' = 100000,
  '250K' = 250000,
  '500K' = 500000,
  '1M' = 1000000,
}

const getCardDescription = ({
  currentGroupTvl,
  nextGroupTvl,
  groupTvl,
  previousGroupTvl,
}: {
  currentGroupTvl: number
  nextGroupTvl: number
  groupTvl: number
  previousGroupTvl: number
}) => {
  if (groupTvl === BeachClubTvlGroup['0K']) {
    return 'Congratulations, you’ve joined the Summer Beach Club and can now earn $SUMR and fee’s by referring others.'
  }

  if (currentGroupTvl >= previousGroupTvl && currentGroupTvl < nextGroupTvl) {
    return `You’re on your way to the next milestone. Keep referring to increase your referral TVL to boost your SUMR rewards.`
  }

  if (currentGroupTvl >= groupTvl) {
    return `Congratulations, your groups TVL has reach $${formatFiatBalance(groupTvl)}. View and claim your $SUMR and Fee’s as they accrue daily.`
  }

  return 'You’re making progress. Keep referring to hit the previous milestones first to unlock your extra SUMR boost.'
}

const getDefaultCards = (currentGroupTvl: number) => [
  {
    tvlGroup: '0K+',
    customTitle: 'Start Referring to Earn',
    rawTvlGroup: BeachClubTvlGroup['0K'],
    description: getCardDescription({
      currentGroupTvl,
      nextGroupTvl: BeachClubTvlGroup['10K'],
      groupTvl: BeachClubTvlGroup['0K'],
      previousGroupTvl: BeachClubTvlGroup['0K'],
    }),
    sumrApy: 0.001,
    currentGroupTvl,
    colorfulBorder: currentGroupTvl <= BeachClubTvlGroup['10K'],
    colorfulBackground: currentGroupTvl <= BeachClubTvlGroup['10K'],
    nextGroupTvl: BeachClubTvlGroup['100K'],
    previousGroupTvl: BeachClubTvlGroup['0K'],
  },
  {
    tvlGroup: '10K+',
    rawTvlGroup: BeachClubTvlGroup['10K'],
    description: getCardDescription({
      currentGroupTvl,
      nextGroupTvl: BeachClubTvlGroup['100K'],
      groupTvl: BeachClubTvlGroup['10K'],
      previousGroupTvl: BeachClubTvlGroup['0K'],
    }),
    boost: 1, // 100%
    sumrApy: 0.002,
    currentGroupTvl,
    colorfulBorder:
      currentGroupTvl <= BeachClubTvlGroup['100K'] && currentGroupTvl > BeachClubTvlGroup['10K'],
    colorfulBackground:
      currentGroupTvl <= BeachClubTvlGroup['100K'] && currentGroupTvl > BeachClubTvlGroup['10K'],
    nextGroupTvl: BeachClubTvlGroup['100K'],
    previousGroupTvl: BeachClubTvlGroup['0K'],
  },
  {
    tvlGroup: '100K+',
    rawTvlGroup: BeachClubTvlGroup['100K'],
    description: getCardDescription({
      currentGroupTvl,
      nextGroupTvl: BeachClubTvlGroup['250K'],
      groupTvl: BeachClubTvlGroup['100K'],
      previousGroupTvl: BeachClubTvlGroup['10K'],
    }),
    boost: 0.5, // 50%
    sumrApy: 0.003,
    currentGroupTvl,
    colorfulBorder:
      currentGroupTvl <= BeachClubTvlGroup['250K'] && currentGroupTvl > BeachClubTvlGroup['100K'],
    colorfulBackground:
      currentGroupTvl <= BeachClubTvlGroup['250K'] && currentGroupTvl > BeachClubTvlGroup['100K'],
    nextGroupTvl: BeachClubTvlGroup['250K'],
    previousGroupTvl: BeachClubTvlGroup['10K'],
  },
  {
    tvlGroup: '250K+',
    rawTvlGroup: BeachClubTvlGroup['250K'],
    description: getCardDescription({
      currentGroupTvl,
      nextGroupTvl: BeachClubTvlGroup['500K'],
      groupTvl: BeachClubTvlGroup['250K'],
      previousGroupTvl: BeachClubTvlGroup['100K'],
    }),
    boost: 0.33, // 33%
    sumrApy: 0.004,
    currentGroupTvl,
    colorfulBorder:
      currentGroupTvl <= BeachClubTvlGroup['500K'] && currentGroupTvl > BeachClubTvlGroup['250K'],
    colorfulBackground:
      currentGroupTvl <= BeachClubTvlGroup['500K'] && currentGroupTvl > BeachClubTvlGroup['250K'],
    nextGroupTvl: BeachClubTvlGroup['500K'],
    previousGroupTvl: BeachClubTvlGroup['250K'],
  },
  {
    tvlGroup: '500K+',
    rawTvlGroup: BeachClubTvlGroup['500K'],
    description: getCardDescription({
      currentGroupTvl,
      nextGroupTvl: BeachClubTvlGroup['1M'],
      groupTvl: BeachClubTvlGroup['500K'],
      previousGroupTvl: BeachClubTvlGroup['250K'],
    }),
    boost: 0.25, // 25%
    sumrApy: 0.005,
    currentGroupTvl,
    colorfulBorder: currentGroupTvl > BeachClubTvlGroup['500K'],
    colorfulBackground: currentGroupTvl > BeachClubTvlGroup['500K'],
    nextGroupTvl: BeachClubTvlGroup['1M'],
    previousGroupTvl: BeachClubTvlGroup['250K'],
  },
]

export const getBeachClubTvlRewardsCards = (currentGroupTvl: number) => {
  const defaultCards = getDefaultCards(currentGroupTvl)

  return {
    defaultCards,
  }
}
