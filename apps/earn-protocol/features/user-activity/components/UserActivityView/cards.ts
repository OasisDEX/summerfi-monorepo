import { formatShorthandNumber } from '@summerfi/app-utils'

export const userActivityHeading = {
  title: 'Lazy Summer Global User Activity',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget.',
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
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
  {
    title: '# of users',
    value: `${formatShorthandNumber(totalUsers)} `,
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
  {
    title: 'Median Deposits Size',
    value: `${formatShorthandNumber(medianDeposit, { precision: 2 })}`,
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
]
