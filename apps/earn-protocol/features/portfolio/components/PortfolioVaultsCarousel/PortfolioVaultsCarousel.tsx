import { type CSSProperties, type FC } from 'react'
import {
  getVaultUrl,
  Icon,
  SlideCarousel,
  SliderCarouselDotsPosition,
  Text,
  useLocalConfig,
  useMobileCheck,
  VaultCard,
} from '@summerfi/app-earn-ui'
import { type GetVaultsApyResponse, type SDKVaultsListType } from '@summerfi/app-types'
import { slugifyVault, subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import { useRouter } from 'next/navigation'

import { useHandleButtonClickEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

interface PortfolioVaultsCarouselProps {
  style?: CSSProperties
  className?: string
  vaultsList: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  carouselId: string
  sumrPriceUsd: number
}

export const PortfolioVaultsCarousel: FC<PortfolioVaultsCarouselProps> = ({
  style,
  className,
  vaultsList,
  vaultsApyByNetworkMap,
  carouselId,
  sumrPriceUsd,
}) => {
  const { push } = useRouter()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()

  const { isMobile } = useMobileCheck()

  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()

  const vaultOnClick = (vault: SDKVaultsListType[number]) => () => {
    buttonClickEventHandler(`${carouselId}-vault-${slugifyVault(vault)}-click`)
    push(getVaultUrl(vault))
  }

  return (
    <div style={{ width: '100%', ...style }} className={className}>
      <SlideCarousel
        withDots={isMobile}
        dotsPosition={SliderCarouselDotsPosition.BOTTOM}
        slides={vaultsList.map((vault) => (
          <VaultCard
            key={vault.id}
            {...vault}
            withHover
            showCombinedBonus
            onClick={vaultOnClick(vault)}
            withTokenBonus={sumrNetApyConfig.withSumr}
            sumrPrice={sumrPriceUsd}
            tooltipName={carouselId}
            onTooltipOpen={tooltipEventHandler}
            vaultApyData={
              vaultsApyByNetworkMap[
                `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
              ]
            }
          />
        ))}
        carouselId={carouselId}
        handleButtonClick={buttonClickEventHandler}
        options={{ slidesToScroll: 'auto' }}
        title={
          <div style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}>
            <Icon iconName="stars" variant="s" color="rgba(255, 251, 253, 1)" />
            <Text as="p" variant="p3semi">
              You might like
            </Text>
          </div>
        }
        withAutoPlay={isMobile}
      />
    </div>
  )
}
