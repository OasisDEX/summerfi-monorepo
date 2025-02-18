import { type FC, type ReactNode } from 'react'
import { getPositionValues } from '@summerfi/app-earn-ui'

import { type PortfolioPositionsList } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader/PortfolioHeader'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'

import classNames from './PortfolioPageView.module.scss'

interface PortfolioPageViewProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  positions: PortfolioPositionsList[]
  tabs: ReactNode
  children?: ReactNode
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  positions,
  tabs,
  children,
}) => {
  const overallSumr = calculateOverallSumr(rewardsData)

  const totalWalletValue =
    positions.reduce(
      (acc, position) =>
        acc +
        getPositionValues({
          positionData: position.positionData,
          vaultData: position.vaultData,
        }).netEarningsUSD.toNumber(),

      0,
    ) + walletData.totalAssetsUsdValue

  return (
    <div className={classNames.portfolioPageViewWrapper}>
      <PortfolioHeader
        walletAddress={walletAddress}
        totalSumr={overallSumr}
        totalWalletValue={totalWalletValue}
      />
      {tabs}
      {children}
    </div>
  )
}
