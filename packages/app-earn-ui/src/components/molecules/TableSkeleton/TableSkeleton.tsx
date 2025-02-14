import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'

import styles from './TableSkeleton.module.scss'

export const TableSkeleton = () => {
  return (
    <div className={styles.tableSkeletonWrapper}>
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
      <SkeletonLine height={24} />
    </div>
  )
}
