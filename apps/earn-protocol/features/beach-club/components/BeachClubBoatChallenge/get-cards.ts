import { BeachClubBoatChallengeRewardCardType } from '@/features/beach-club/constants/reward-cards'

export const getBeachClubBoatCards = (currentPoints: number, earningPointsPerDay: number) => {
  const calculateDaysLeft = (requiredPoints: number) => {
    if (earningPointsPerDay <= 0) return '-'
    const pointsNeeded = requiredPoints - currentPoints

    if (pointsNeeded <= 0) return 0

    return Math.ceil(pointsNeeded / earningPointsPerDay)
  }

  return [
    {
      requiredPoints: 1000,
      currentPoints,
      left: 1000,
      unlocked: currentPoints >= 1000,
      reward: {
        type: BeachClubBoatChallengeRewardCardType.BEACH_CLUB_NFT,
      },
    },
    {
      requiredPoints: 5000,
      currentPoints,
      left: 250,
      unlocked: currentPoints >= 5000,
      reward: {
        type: BeachClubBoatChallengeRewardCardType.T_SHIRT,
      },
    },
    {
      requiredPoints: 10000,
      currentPoints,
      left: 100,
      unlocked: currentPoints >= 10000,
      reward: {
        type: BeachClubBoatChallengeRewardCardType.HOODIE,
      },
    },
  ].map((card) => ({
    ...card,
    daysToUnlock: calculateDaysLeft(card.requiredPoints),
    pointsToUnlock: card.requiredPoints - currentPoints,
  }))
}
