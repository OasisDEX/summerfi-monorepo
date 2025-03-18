export const topDepositorsColumns = [
  {
    title: 'User',
    key: 'user',
    sortable: false,
  },
  {
    title: 'Position Balance',
    key: 'balance',
    sortable: true,
  },
  {
    title: 'USD Value',
    key: 'balanceUsd',
    sortable: true,
  },
  {
    title: 'Strategy',
    key: 'strategy',
    sortable: false,
  },
  {
    title: 'Change (7d)',
    key: 'changeSevenDays',
    sortable: true,
  },
  {
    title: 'Projected 1yr Earnings',
    key: 'projectedOneYearEarnings',
    sortable: true,
  },
  {
    title: '# of Deposits',
    key: 'noOfDeposits',
    sortable: true,
  },
  {
    title: 'Earnings Streak',
    key: 'earningsStreak',
    sortable: true,
  },
  {
    title: '',
    key: 'link',
    sortable: false,
  },
]

export const topDepositorsColumnsHiddenOnTablet = [
  'changeSevenDays',
  'projectedOneYearEarnings',
  'noOfDeposits',
  'earningsStreak',
  'balanceUsd',
]

export const topDepositorsColumnsHiddenOnMobile = [
  'strategy',
  'changeSevenDays',
  'balanceUsd',
  'projectedOneYearEarnings',
  'noOfDeposits',
  'earningsStreak',
]
