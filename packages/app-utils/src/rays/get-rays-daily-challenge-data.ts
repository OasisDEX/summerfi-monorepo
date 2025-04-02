import dayjs from 'dayjs'

const dailyRaysAmount = 10
const bonusRaysAmount = 30

const getRaysDailyChallengeDateFormat = () => dayjs().format('YYYY-MM-DD')
const s1Cutoff = dayjs('2025-01-24').subtract(1, 'day') // because its a full day

// this function is taken from oasis-borrow, if you make changes here you should also update it there
export const getRaysDailyChallengeData = (
  claimedDates?: string[],
): {
  dailyChallengeRays: number
  streakRays: number
  allBonusRays: number
  currentStreak: number
  streaks: number
} => {
  if (!claimedDates) {
    return {
      dailyChallengeRays: 0,
      streakRays: 0,
      allBonusRays: 0,
      currentStreak: 0,
      streaks: 0,
    }
  }
  // season 1 cutoff
  const claimedDatesFiltered = claimedDates.filter((date) => dayjs(date).isAfter(s1Cutoff))

  // every day the user claims the daily challenge, they get 100 points
  // every 7 consecutive days, the user gets a 500 points bonus
  const dailyChallengeRays = claimedDatesFiltered.length * dailyRaysAmount

  const consecutiveDaysMap = claimedDatesFiltered
    .sort((a, b) => {
      return dayjs(a).isBefore(dayjs(b)) ? -1 : 1
    })
    .reduce((acc, date, index, array) => {
      // if it is the first date, we will always have a streak of 1
      if (index === 0) {
        return acc.set(date, 1)
      }
      // if the difference between the current date and the previous date is 1 day
      // we will increment the streak by 1
      if (dayjs(date).diff(dayjs(array[index - 1]), 'day') === 1) {
        if (acc.get(array[index - 1]) === 7) {
          // if the previous streak was 7, we will not increment the streak
          return acc.set(date, 1)
        }

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return acc.set(date, (acc.get(array[index - 1]) || 0) + 1)
      }

      // if the difference between the current date and the previous date is not 1 day
      // we will start a new streak of 1
      return acc.set(date, 1)
    }, new Map<string, number>())

  // all we need is to filter the values that are equal to 7
  const streaks = Array.from(consecutiveDaysMap.values()).filter((streak) => streak === 7).length

  // and we can reuse the consecutiveDaysMap for the current streak
  // returning the last value of the map for today or yesterday (the case if not claimed today)
  const currentStreak =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    consecutiveDaysMap.get(getRaysDailyChallengeDateFormat()) ||
    consecutiveDaysMap.get(
      dayjs(getRaysDailyChallengeDateFormat()).subtract(1, 'day').format('YYYY-MM-DD'),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    ) ||
    0

  const streakRays = streaks * bonusRaysAmount

  return {
    dailyChallengeRays,
    streakRays,
    allBonusRays: dailyChallengeRays + streakRays,
    currentStreak,
    streaks,
  }
}
