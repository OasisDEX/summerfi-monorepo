export const curationActivityColumns = [
  {
    title: 'Activity',
    key: 'activity',
    sortable: false,
  },
  {
    title: 'Change',
    key: 'change',
    sortable: false,
  },
  {
    title: 'Onchain Tx',
    key: 'transaction',
    sortable: false,
  },
]

export const curationActivityColumnsHiddenOnTablet = ['transaction']

export const curationActivityColumnsHiddenOnMobile = ['caller', 'timestamp', 'transaction']
