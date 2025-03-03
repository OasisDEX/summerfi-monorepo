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
    key: 'balanceUSD',
    sortable: true,
  },
  {
    title: 'Strategy',
    key: 'strategy',
    sortable: false,
  },
  {
    title: 'Change (7d)',
    key: 'change7d',
    sortable: true,
  },
  {
    title: 'Projected 1yr Earnings',
    key: 'projected1yrEarnings',
    sortable: true,
  },
  {
    title: '# of Deposits',
    key: 'numberOfDeposits',
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
  'change7d',
  'projected1yrEarnings',
  'numberOfDeposits',
  'earningsStreak',
  'balanceUSD',
]

export const topDepositorsColumnsHiddenOnMobile = [
  'strategy',
  'change7d',
  'balanceUSD',
  'projected1yrEarnings',
  'numberOfDeposits',
  'earningsStreak',
]
