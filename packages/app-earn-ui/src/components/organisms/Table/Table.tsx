'use client'
import { type CSSProperties, Fragment, type ReactNode, useState } from 'react'
import { SortDirection } from '@summerfi/app-utils'

import { Icon } from '@/components/atoms/Icon/Icon'
import { TableSkeleton } from '@/components/molecules/TableSkeleton/TableSkeleton'

import styles from './Table.module.scss'

interface Column<K> {
  title: ReactNode
  key: K
  sortable?: boolean
}

type Row<K extends string> = {
  [key in K]: ReactNode
}

export interface TableSortedColumn<K> {
  key: K
  direction: SortDirection
}

interface TableProps<K extends string> {
  rows: {
    id?: string
    content: Row<K>
    details?: ReactNode
  }[]
  columns: Column<K>[]
  hiddenColumns?: K[]
  handleSort?: (config: TableSortedColumn<K>) => void
  customRow?: {
    idx: number
    content: ReactNode
  }
  onRowHover?: (address?: string) => void
  highlightedRow?: string
  isLoading?: boolean
  skeletonLines?: number
  skeletonStyles?: CSSProperties
}

export function Table<K extends string>({
  rows,
  columns,
  hiddenColumns,
  handleSort,
  customRow,
  onRowHover,
  highlightedRow,
  isLoading,
  skeletonLines = 10,
  skeletonStyles,
}: TableProps<K>): React.ReactNode {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<K> | null>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  // removing rows without mutating rows itself
  const resolvedRows = rows.map((row) => ({
    ...row,
    content: Object.keys(row.content).reduce((acc, key) => {
      if (!hiddenColumns?.includes(key as K)) {
        acc[key] = row.content[key]
      }

      return acc
    }, {}),
  }))

  // Handle sorting by column
  const handleColumnSorting = (column: K, isSortable?: boolean) => {
    if (!isSortable) {
      return
    }

    let direction = SortDirection.ASC

    if (sortConfig && sortConfig.key === column && sortConfig.direction === SortDirection.ASC) {
      direction = SortDirection.DESC
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
            {columns
              .filter((column) => !hiddenColumns?.includes(column.key))
              .map((column) => (
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
                        ...(sortConfig?.key === column.key && {
                          color: 'var(--earn-protocol-secondary-100)',
                        }),
                        // overwrite hoover if not sortable
                        ...(!column.sortable && {
                          color: 'var(--earn-protocol-secondary-40)',
                        }),
                      }}
                      onClick={() => handleColumnSorting(column.key, column.sortable)}
                    >
                      {column.title}
                      {sortConfig?.key === column.key && column.sortable ? (
                        <Icon
                          iconName={
                            sortConfig.direction === SortDirection.ASC
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
          {!isLoading &&
            resolvedRows.map((row, rowIndex) => (
              <Fragment key={rowIndex}>
                <tr
                  onMouseEnter={() => onRowHover?.(row.id)}
                  onMouseLeave={() => onRowHover?.(undefined)}
                  onClick={() => setExpandedRow(expandedRow === rowIndex ? null : rowIndex)}
                  style={{
                    cursor: row.details ? 'pointer' : 'default',
                    ...(highlightedRow &&
                      highlightedRow === row.id && {
                        background:
                          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                      }),
                  }}
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
                {customRow?.idx === rowIndex && (
                  <tr className={styles.customRow}>
                    <td colSpan={columns.length}>{customRow.content}</td>
                  </tr>
                )}
              </Fragment>
            ))}
        </tbody>
      </table>
      {isLoading && <TableSkeleton rows={skeletonLines} wrapperStyles={skeletonStyles} />}
    </div>
  )
}
