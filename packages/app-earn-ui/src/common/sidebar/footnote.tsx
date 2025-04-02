import { Text } from '@/components/atoms/Text/Text'

export const sidebarFootnote = {
  title: 'Key details about your assets',
  list: [
    'No minimum required',
    'Deposit any asset from your wallet into a strategy',
    'Assets will be automatically converted to the base token used in that strategy.',
    'Native yield earnings paid in base token used in the strategy',
    'Withdraw to any asset back to you wallet from the strategy',
    <>
      <Text as="span" variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
        Automatic diversified exposure.
      </Text>{' '}
      Risk management and limits on exposure all handled by class leading risk curator,
      BlockAnalitica
    </>,
  ] satisfies (string | React.ReactNode)[] as (string | React.ReactNode)[],

  tooltip: {
    style: {
      maxWidth: '504px',
      width: '504px',
      left: '-159px',
    },
  },
}
