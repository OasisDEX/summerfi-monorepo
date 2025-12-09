import { Icon, Text } from '@summerfi/app-earn-ui'

export enum DelegateSortOptions {
  HIGHEST_VOTE_AMOUNT = 'highest-vote-amount',
  HIGHEST_DELEGATE_COUNT = 'highest-delegate-count',
}

export const getDelegateSortOptions = (sortBy: DelegateSortOptions) => [
  {
    value: DelegateSortOptions.HIGHEST_VOTE_AMOUNT,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color:
              sortBy === DelegateSortOptions.HIGHEST_VOTE_AMOUNT
                ? 'var(--earn-protocol-primary-100)'
                : 'var(--earn-protocol-secondary-100)',
          }}
        >
          Highest Vote amount
        </Text>
        {sortBy === DelegateSortOptions.HIGHEST_VOTE_AMOUNT && (
          <Icon
            iconName="checkmark"
            size={14}
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          />
        )}
      </div>
    ),
  },
  {
    value: DelegateSortOptions.HIGHEST_DELEGATE_COUNT,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color:
              sortBy === DelegateSortOptions.HIGHEST_DELEGATE_COUNT
                ? 'var(--earn-protocol-primary-100)'
                : 'var(--earn-protocol-secondary-100)',
          }}
        >
          Highest delegate count
        </Text>
        {sortBy === DelegateSortOptions.HIGHEST_DELEGATE_COUNT && (
          <Icon
            iconName="checkmark"
            size={14}
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          />
        )}
      </div>
    ),
  },
]
