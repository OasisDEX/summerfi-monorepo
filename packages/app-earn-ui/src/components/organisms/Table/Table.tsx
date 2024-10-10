'use client'
import { Fragment, type ReactNode, useState } from 'react'

import styles from './Table.module.scss'

interface Column<K> {
  title: ReactNode
  key: K
  sortable?: boolean
}

type Row<K extends string> = {
  [key in K]: ReactNode
}

export function Table<K extends string>({
  rows,
  columns,
}: {
  rows: {
    content: Row<K>
    details?: ReactNode
  }[]
  columns: Column<K>[]
}) {
  // const [sortConfig, setSortConfig] = useState<{ key: K; direction: string } | null>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  // Handle sorting by column
  const handleSort = (_: K) => {
    // let direction = 'ascending'
    //
    // if (sortConfig && sortConfig.key === column && sortConfig.direction === 'ascending') {
    //   direction = 'descending'
    // }
    // setSortConfig({ key: column, direction })
  }

  // Sort the data based on the sortConfig
  // const sortedData = useMemo(() => {
  //   if (!sortConfig) return data.rows
  //
  //   return [...data.rows].sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === 'ascending' ? -1 : 1
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === 'ascending' ? 1 : -1
  //     }
  //
  //     return 0
  //   })
  // }, [data, sortConfig])

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => handleSort(column.key)}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-space-x-small)',
                  }}
                >
                  {column.title}
                  {/* {sortConfig?.key === column.key ? (*/}
                  {/*  sortConfig.direction === 'ascending' ? (*/}
                  {/*    <Icon iconName="chevron_up" size={10} color="rgba(119, 117, 118, 1)" />*/}
                  {/*  ) : (*/}
                  {/*    <Icon iconName="chevron_down" size={10} color="rgba(119, 117, 118, 1)" />*/}
                  {/*  )*/}
                  {/* ) : null}*/}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              <tr onClick={() => setExpandedRow(expandedRow === rowIndex ? null : rowIndex)}>
                {Object.values(row.content).map((item, idx) => (
                  <td key={idx}>{item as ReactNode}</td>
                ))}
              </tr>
              {expandedRow === rowIndex && (
                <tr className={styles.expandedRow}>
                  <td colSpan={columns.length}>
                    <div className={styles.details}>
                      <p>
                        <strong>Dummy Details:</strong>
                      </p>
                      <p>- dummy</p>
                      <p>- details</p>
                      <p>- bro</p>
                    </div>
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
