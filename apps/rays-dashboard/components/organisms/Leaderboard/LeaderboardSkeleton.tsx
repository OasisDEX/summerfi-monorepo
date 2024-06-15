import { SkeletonLine } from '@summerfi/app-ui'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

export const LeaderboardSkeleton = () => {
  return (
    <div className={classNames.leaderboardSkeletonWrapper}>
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
    </div>
  )
}
