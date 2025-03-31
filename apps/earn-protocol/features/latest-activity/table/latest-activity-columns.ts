export const latestActivityColumns = [
  {
    title: 'Position',
    key: 'position',
    sortable: false,
  },
  {
    title: 'Activity',
    key: 'activity',
    sortable: false,
  },
  {
    title: 'Amount',
    key: 'amountUsd',
    sortable: true,
  },
  {
    title: 'Strategy',
    key: 'strategy',
    sortable: false,
  },
  {
    title: 'Timestamp',
    key: 'timestamp',
    sortable: true,
  },
  {
    title: 'Total Position Balance',
    key: 'balanceUsd',
    sortable: true,
  },
  {
    title: '',
    key: 'link',
    sortable: false,
  },
]

export const latestActivityColumnsHiddenOnMobile = [
  'strategy',
  'timestamp',
  'balanceUsd',
  'position',
]
export const latestActivityColumnsHiddenOnTablet = ['timestamp', 'balanceUsd']
