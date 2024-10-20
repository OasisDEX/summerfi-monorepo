export enum TableSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface TableSortedColumn<K> {
  key: K
  direction: TableSortDirection
}
