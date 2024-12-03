import { SumrClaimSearch } from '@/features/sumr-claim/components/SumrClaimSearch/SumrClaimSearch'

import classNames from './SumrPageView.module.scss'

export const SumrPageView = () => {
  return (
    <div className={classNames.sumrPageWrapper}>
      <SumrClaimSearch />
    </div>
  )
}
