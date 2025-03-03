export const userActivityColumns = [
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
    title: 'Total Position Balance',
    key: 'balance',
    sortable: true,
  },
  {
    title: '',
    key: 'link',
    sortable: false,
  },
]

export const userActivityColumnsHiddenOnMobile = ['strategy', 'timestamp', 'balance', 'position']
export const userActivityColumnsHiddenOnTablet = ['timestamp', 'balance']
