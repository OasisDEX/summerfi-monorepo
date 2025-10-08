import { type LockedSumrPositionsTableColumns } from '@/features/portfolio/components/PortfolioLockedSumrInfoV2/types'

export const yourLockedSumrPositionsTableColumns: {
  title: string
  key: LockedSumrPositionsTableColumns
}[] = [
  {
    title: 'SUMR Stake Position',
    key: 'position',
  },
  {
    title: 'SUMR Staked',
    key: 'staked',
  },
  {
    title: 'SUMR Stake lock period',
    key: 'lockPeriod',
  },
  {
    title: 'SUMR Rewards (1 yr)',
    key: 'rewards',
  },
  {
    title: 'USD Earnings (1 yr)',
    key: 'usdEarnings',
  },
  {
    title: 'Remove stake penalty',
    key: 'removeStakePenalty',
  },
  {
    title: 'Actions',
    key: 'action',
  },
]
