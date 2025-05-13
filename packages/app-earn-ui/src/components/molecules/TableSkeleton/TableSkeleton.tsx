import { type CSSProperties, type FC } from 'react'

import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'

import styles from './TableSkeleton.module.css'

interface TableSkeletonProps {
  rows: number
  wrapperStyles?: CSSProperties
}

export const TableSkeleton: FC<TableSkeletonProps> = ({ rows, wrapperStyles }) => {
  return (
    <div className={styles.tableSkeleton} style={wrapperStyles}>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonLine key={index} width="100%" height="20px" />
      ))}
    </div>
  )
}
