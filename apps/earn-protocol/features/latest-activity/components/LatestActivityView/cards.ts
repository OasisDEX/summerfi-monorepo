import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

export const latestActivityHeading = {
  title: 'Lazy Summer Global User Activity',
  description:
    'Below is a transparent view of global user activity for the Lazy Summer Protocol, showcasing the activity of all our users and access to their individual position pages.',
}

export const getLatestActivityHeadingCards = ({
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
    value: formatFiatBalance(totalItems).split('.')[0],
    description: 'The total number of deposits across all strategies and users.',
  },
  {
    title: '# of users',
    value: `${formatFiatBalance(totalUsers).split('.')[0]}`,
    description: 'The total number of unique users using the Lazy Summer Protocol.',
  },
  {
    title: 'Median Deposits Size',
    value: `$${formatCryptoBalance(medianDeposit)}`,
    description: 'The median size of a deposit across all users and positions. ',
  },
]
