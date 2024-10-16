'use client'
import { Fragment, type ReactNode, useState } from 'react'
import { TableSortDirection, type TableSortedColumn } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'

import styles from './Table.module.scss'

interface Column<K> {
  title: ReactNode
  key: K
  sortable?: boolean
}

type Row<K extends string> = {
  [key in K]: ReactNode
}

interface TableProps<K extends string> {
  rows: {
    content: Row<K>
    details?: ReactNode
  }[]
  columns: Column<K>[]
  handleSort?: (config: TableSortedColumn<K>) => void
}

export function Table<K extends string>({ rows, columns, handleSort }: TableProps<K>) {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<K> | null>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  // Handle sorting by column
  const handleColumnSorting = (column: K, isSortable?: boolean) => {
    if (!isSortable) {
      return
    }

    let direction = TableSortDirection.ASC

    if (
      sortConfig &&
      sortConfig.key === column &&
      sortConfig.direction === TableSortDirection.ASC
    ) {
      direction = TableSortDirection.DESC
    }

    const update = { key: column, direction }

    setSortConfig(update)
    handleSort?.(update)
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-space-x-small)',
                      width: 'fit-content',
                      cursor: column.sortable ? 'pointer' : 'default',
                    }}
                    onClick={() => handleColumnSorting(column.key, column.sortable)}
                  >
                    {column.title}
                    {sortConfig?.key === column.key && column.sortable ? (
                      <Icon
                        iconName={
                          sortConfig.direction === TableSortDirection.ASC
                            ? 'chevron_up'
                            : 'chevron_down'
                        }
                        size={10}
                        color="rgba(119, 117, 118, 1)"
                      />
                    ) : null}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              <tr
                onClick={() => setExpandedRow(expandedRow === rowIndex ? null : rowIndex)}
                style={{ cursor: row.details ? 'pointer' : 'default' }}
              >
                {Object.values(row.content).map((item, idx) => (
                  <td key={idx}>
                    {idx === 0 && row.details ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-space-x-small)',
                        }}
                      >
                        {item as ReactNode}{' '}
                        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                        {idx === 0 ? (
                          <Icon
                            iconName={expandedRow === rowIndex ? 'chevron_up' : 'chevron_down'}
                            variant="xxs"
                            color="rgba(119, 117, 118, 1)"
                          />
                        ) : null}
                      </div>
                    ) : (
                      <>{item as ReactNode}</>
                    )}
                  </td>
                ))}
              </tr>
              {expandedRow === rowIndex && row.details && (
                <tr className={styles.expandedRow}>
                  <td colSpan={columns.length}>
                    <div className={styles.details}>{row.details}</div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
