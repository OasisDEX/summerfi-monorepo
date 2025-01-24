import { formatCryptoBalance, formatShorthandNumber } from '@summerfi/app-utils'

export const userActivityHeading = {
  title: 'Lazy Summer Global User Activity',
  description:
    'Below is a transparent view of global user activity for the Lazy Summer Protocol, showcasing the activity of all our users and access to their individual position pages.',
}

export const getUserActivityHeadingCards = ({
  totalItems,
  totalUsers,
  medianDeposit,
}: {
  totalItems: number
  totalUsers: number
  medianDeposit: number
}) => [
  {
    title: 'Total deposits',
    value: formatShorthandNumber(totalItems, { precision: 0 }),
    description: 'The total USD value of all deposits across all strategies and users. ',
  },
  {
    title: '# of users',
    value: `${formatShorthandNumber(totalUsers)} `,
    description: 'The total number of unique users using the Lazy Summer Protocol.',
  },
  {
    title: 'Median Deposits Size',
    value: `${formatCryptoBalance(medianDeposit)}`,
    description: 'The median size of a deposit across all users and positions. ',
  },
]
