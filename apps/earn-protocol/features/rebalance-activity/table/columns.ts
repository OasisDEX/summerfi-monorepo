export const rebalancingActivityColumns = [
  {
    title: 'Purpose',
    key: 'purpose',
    sortable: false,
  },
  {
    title: 'Action',
    key: 'action',
    sortable: false,
  },
  {
    title: 'Amount',
    key: 'amount',
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
    title: 'Transaction',
    key: 'transaction',
    sortable: false,
  },
]

export const rebalancingActivityColumnsHiddenOnMobile = [
  'amount',
  'strategy',
  'timestamp',
  'transaction',
]
