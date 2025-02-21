import { type FC } from 'react'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { PortfolioAssets } from '@/features/portfolio/components/PortfolioAssets/PortfolioAssets'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'

import classNames from './PorftolioWallet.module.scss'

interface PortfolioWalletProps {
  walletData: PortfolioAssetsResponse
  vaultsList: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

export const PortfolioWallet: FC<PortfolioWalletProps> = ({
  walletData,
  vaultsList,
  vaultsApyByNetworkMap,
}) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioAssets walletData={walletData} />
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <PortfolioVaultsCarousel
        className={classNames.vaultCarousel}
        vaultsList={vaultsList}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      />
      {/* <CryptoUtilities /> */}
    </div>
  )
}
