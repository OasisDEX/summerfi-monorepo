import { type ReactNode } from 'react'

import styles from '@/components/molecules/Table/Table.module.css'

interface Column {
  title: ReactNode
}

interface Row {
  cells: ReactNode[] | ReactNode
}

interface TableProps {
  columns: Column[]
  rows: Row[]
}

export const Table: React.FC<TableProps> = ({ columns, rows }) => {
  const middleIndex = Math.floor(columns.length / 2) - 1

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className={index < middleIndex ? styles.leftAlign : styles.rightAlign}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          if (!Array.isArray(row.cells)) {
            return (
              <tr key={rowIndex}>
                <td colSpan={columns.length} style={{ padding: 'unset' }}>
                  {row.cells}
                </td>
              </tr>
            )
          }

          return (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cellIndex < middleIndex ? styles.leftAlign : styles.rightAlign}
                >
                  {cell}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
