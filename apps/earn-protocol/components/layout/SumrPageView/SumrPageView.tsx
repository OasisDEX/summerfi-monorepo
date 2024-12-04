import { SumrClaimSearch } from '@/features/sumr-claim/components/SumrClaimSearch/SumrClaimSearch'
import { SumrTransferabilityCounter } from '@/features/sumr-claim/components/SumrTransferabilityCounter/SumrTransferabilityCounter'

import classNames from './SumrPageView.module.scss'

export const SumrPageView = () => {
  return (
    <div className={classNames.sumrPageWrapper}>
      <SumrClaimSearch />
      <SumrTransferabilityCounter />
    </div>
  )
}
