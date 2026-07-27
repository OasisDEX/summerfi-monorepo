import {
  getVaultDetailsUrl,
  useEarnProtocolWallet,
  useMobileCheck,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import {
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type SupportedSDKNetworks,
  type VaultApyData,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'

import { ArbitrumNoticeBanner } from '@/components/layout/ArbitrumNoticeBanner/ArbitrumNoticeBanner'
import { RebalancingNoticeBanner } from '@/components/layout/RebalancingNoticeBanner/RebalancingNoticeBanner'
import { useVaultOpenDetailsQuery } from '@/components/layout/VaultOpenView/useVaultOpenQuery'
import { VaultsListSidebar } from '@/components/layout/VaultsListView/VaultsListSidebar'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  useHandleButtonClickEvent,
  useHandleDropdownChangeEvent,
  useHandleTooltipOpenEvent,
} from '@/hooks/use-mixpanel-event'
import { usePosition } from '@/hooks/use-position'
import { useRedirectToPositionView } from '@/hooks/use-redirect-to-position'
import { useRevalidatePositionData } from '@/hooks/use-revalidate'

import { VaultOpenDetailsLoading } from './VaultOpenDetailsLoading'
import { VaultOpenViewDetails } from './VaultOpenViewDetails'

type VaultOpenViewComponentProps = {
  network: SupportedSDKNetworks
  vaultId: string
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  medianDefiYield?: number
  vaultApyData: VaultApyData
  referralCode?: string
  rewardTokenPrices: RewardTokenPrices
}

export const VaultOpenViewComponent = ({
  network,
  vaultId,
  vault,
  vaultInfo,
  vaults,
  medianDefiYield,
  vaultApyData,
  rewardTokenPrices,
}: VaultOpenViewComponentProps) => {
  // Below-the-fold details stream in independently: hydrated on first render, or fetched via the
  // API route fallback (showing VaultOpenDetailsLoading) if the prefetch failed to dehydrate.
  const { data: details } = useVaultOpenDetailsQuery(network, vaultId)

  const { deviceType } = useDeviceType()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const dropdownChangeHandler = useHandleDropdownChangeEvent()
  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const revalidatePositionData = useRevalidatePositionData()

  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))

  const { position } = usePosition({
    chainId: vaultChainId,
    vaultId: vault.id,
  })

  useRedirectToPositionView({ vault, position })

  return (
    <>
      <RebalancingNoticeBanner vault={vault} />
      <ArbitrumNoticeBanner vault={vault} />
      <VaultOpenGrid
        isMobileOrTablet={isMobileOrTablet}
        vault={vault}
        vaultInfo={vaultInfo}
        rewardTokenPrices={rewardTokenPrices}
        vaults={vaults}
        medianDefiYield={medianDefiYield}
        onRefresh={revalidatePositionData}
        vaultApyData={vaultApyData}
        tooltipEventHandler={tooltipEventHandler}
        buttonClickEventHandler={buttonClickEventHandler}
        dropdownChangeHandler={dropdownChangeHandler}
        simulationGraph={null}
        detailsContent={
          details ? (
            <VaultOpenViewDetails
              vault={vault}
              latestActivity={details.latestActivity}
              topDepositors={details.topDepositors}
              rebalanceActivity={details.rebalanceActivity}
              curationEvents={details.curationEvents}
              arksHistoricalChartData={details.arksHistoricalChartData}
              arksInterestRates={details.arksInterestRates}
              vaultApyData={vaultApyData}
              isDaoManaged={vault.isDaoManaged}
            />
          ) : (
            <VaultOpenDetailsLoading vault={vault} isDaoManaged={vault.isDaoManaged} />
          )
        }
        sidebarContent={
          <VaultsListSidebar
            activeVaultData={vault}
            positionExists={Boolean(position)}
            userWalletAddress={userWalletAddress}
            onButtonClick={buttonClickEventHandler}
            strategyLink={{ label: 'View details', href: getVaultDetailsUrl(vault) }}
          />
        }
      />
    </>
  )
}
