import { type CSSProperties, type FC, type ReactNode } from 'react'

import classNames from './TableCellNodes.module.css'

interface TableCellNodesProps {
  children: ReactNode
  gap?: 'small' | 'medium'
  className?: string
  style?: CSSProperties
}

export const TableCellNodes: FC<TableCellNodesProps> = ({
  children,
  gap = 'small',
  className = '',
  style = {},
}) => (
  <div className={`${classNames.wrapper} ${classNames[gap]} ${className}`} style={style}>
    {children}
  </div>
)
