import { formatWithSeparators } from '@summerfi/app-utils'

export const getBeachClubBoatChallengeStats = ({
  currentPoints,
  earningPointsPerDay,
  accountReferred,
}: {
  currentPoints: number
  earningPointsPerDay: number
  accountReferred: number
}) => [
  {
    value: `${formatWithSeparators(currentPoints, { precision: 2 })}`,
    description: 'Speed Challenge Points',
  },
  {
    value: formatWithSeparators(earningPointsPerDay, { precision: 2 }),
    description: 'Earning points / Day',
  },
  {
    value: `${formatWithSeparators(accountReferred)}`,
    description: 'Account Referred',
  },
]
