import { Text } from '@/components/atoms/Text/Text'

export const sidebarFootnote = {
  title: 'Key details about your assets',
  list: [
    'No minimum required',
    'Earning paid in same currency as currency deposited',
    'Deposit any asset from your wallet into a strategy',
    'Assets will be automatically converted to the base token used in that strategy.',
    <>
      <Text as="span" variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
        No single point of failure.
      </Text>{' '}
      No single point can cause system failure, ensuring security and reliability.
    </>,
  ],

  tooltip: {
    style: {
      maxWidth: '504px',
      width: '504px',
      left: '-159px',
    },
  },
}
