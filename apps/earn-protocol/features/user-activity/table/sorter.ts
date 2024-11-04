import { type TableSortedColumn } from '@summerfi/app-earn-ui'
import { simpleSort, SortDirection } from '@summerfi/app-utils'

import { type UsersActivity } from '@/app/server-handlers/sdk/get-users-activity'

export const userActivitySorter = ({
  data,
  sortConfig,
}: {
  data: UsersActivity
  sortConfig?: TableSortedColumn<string>
}) => {
  switch (sortConfig?.key) {
    case 'amount':
      return data.sort((a, b) =>
        simpleSort({ a: a.amount, b: b.amount, direction: sortConfig.direction }),
      )
    case 'timestamp':
      return data.sort((a, b) =>
        simpleSort({ a: a.timestamp, b: b.timestamp, direction: sortConfig.direction }),
      )
    default:
      return data.sort((a, b) =>
        simpleSort({ a: a.timestamp, b: b.timestamp, direction: SortDirection.DESC }),
      )
  }
}
