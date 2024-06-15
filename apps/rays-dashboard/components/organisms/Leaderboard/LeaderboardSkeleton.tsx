import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'
import { SkeletonLine } from '@summerfi/app-ui'

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
