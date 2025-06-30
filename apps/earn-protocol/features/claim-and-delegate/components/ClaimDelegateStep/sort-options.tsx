import { Icon, Text } from '@summerfi/app-earn-ui'

export enum DelegateSortOptions {
  HIGHEST_VOTING_WEIGHT = 'highest-voting-weight',
  HIGHEST_VOTE_REWARD_POWER = 'highest-vote-reward-power',
}

export const getDelegateSortOptions = (sortBy: DelegateSortOptions) => [
  {
    value: DelegateSortOptions.HIGHEST_VOTE_REWARD_POWER,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color:
              sortBy === DelegateSortOptions.HIGHEST_VOTE_REWARD_POWER
                ? 'var(--earn-protocol-primary-100)'
                : 'var(--earn-protocol-secondary-100)',
          }}
        >
          Highest Vote and Reward Power
        </Text>
        {sortBy === DelegateSortOptions.HIGHEST_VOTE_REWARD_POWER && (
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
    value: DelegateSortOptions.HIGHEST_VOTING_WEIGHT,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color:
              sortBy === DelegateSortOptions.HIGHEST_VOTING_WEIGHT
                ? 'var(--earn-protocol-primary-100)'
                : 'var(--earn-protocol-secondary-100)',
          }}
        >
          Highest $SUMR voting weight
        </Text>
        {sortBy === DelegateSortOptions.HIGHEST_VOTING_WEIGHT && (
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
