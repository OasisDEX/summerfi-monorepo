import { formatFiatBalance, formatShorthandNumber } from '@summerfi/app-utils'

export const rebalanceActivityHeading = {
  title: 'Lazy Summer Global Rebalance Activity',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget.',
}

export const getRebalanceActivityHeadingCards = ({
  totalItems,
  savedTimeInHours,
  savedGasCost,
}: {
  totalItems: number
  savedTimeInHours: number
  savedGasCost: number
}) => [
  {
    title: 'Rebalance actions',
    value: formatShorthandNumber(totalItems, { precision: 0 }),
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
  {
    title: 'User saved time',
    value: `${formatShorthandNumber(savedTimeInHours, { precision: 1 })} hours`,
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
  {
    title: 'Gas cost savings',
    value: `$${formatFiatBalance(savedGasCost)}`,
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
]
