import {
  type SDKVaultishType,
  type SDKVaultType,
  type TokenSymbolsList,
  TransactionAction,
} from '@summerfi/app-types'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { ProjectedEarnings } from '@/components/molecules/ProjectedEarnings/ProjectedEarnings'
import { ProjectedEarningsExpanded } from '@/components/molecules/ProjectedEarnings/ProjectedEarningsExpanded'
import { getDisplayToken } from '@/helpers/get-display-token'
import { type EarningsEstimationsMap } from '@/helpers/get-earnings-estimations-map'

import projectedEarningsCombinedStyles from './ProjectedEarningsCombined.module.scss'

type ProjectedEarningsCombinedProps = {
  amountDisplay: string
  estimatedEarnings: string
  forecastSummaryMap?: EarningsEstimationsMap
  isLoadingForecast: boolean
  isOpen?: boolean
  isSimulation?: boolean
  ownerView?: boolean
  transactionType?: TransactionAction
  vault: SDKVaultType | SDKVaultishType
}

export const ProjectedEarningsCombined = ({
  amountDisplay,
  estimatedEarnings,
  forecastSummaryMap,
  isLoadingForecast,
  isOpen,
  isSimulation = false,
  ownerView,
  transactionType,
  vault,
}: ProjectedEarningsCombinedProps): React.ReactNode => {
  return (
    <div className={projectedEarningsCombinedStyles.projectedEarningsWrapper}>
      <AnimateHeight id="earnings" show={isOpen && Number(estimatedEarnings) > 0}>
        <ProjectedEarnings
          earnings={estimatedEarnings}
          symbol={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList}
          isLoading={isLoadingForecast}
        />
      </AnimateHeight>
      <AnimateHeight
        id="earnings-expanded"
        show={
          amountDisplay !== '0' && !isOpen && ownerView && !isSimulation && !!forecastSummaryMap
        }
      >
        {forecastSummaryMap && (
          <ProjectedEarningsExpanded
            symbol={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList}
            forecastSummaryMap={forecastSummaryMap}
            isLoading={isLoadingForecast}
            transactionType={transactionType ?? TransactionAction.DEPOSIT}
          />
        )}
      </AnimateHeight>
    </div>
  )
}
