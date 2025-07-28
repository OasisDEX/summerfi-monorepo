import { type CSSProperties, type FC } from 'react'
import {
  getVaultUrl,
  Icon,
  SlideCarousel,
  SliderCarouselDotsPosition,
  SUMR_CAP,
  Text,
  useLocalConfig,
  useMobileCheck,
  VaultCard,
} from '@summerfi/app-earn-ui'
import { type GetVaultsApyResponse, type SDKVaultsListType } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import { useRouter } from 'next/navigation'

interface PortfolioVaultsCarouselProps {
  style?: CSSProperties
  className?: string
  vaultsList: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

export const PortfolioVaultsCarousel: FC<PortfolioVaultsCarouselProps> = ({
  style,
  className,
  vaultsList,
  vaultsApyByNetworkMap,
}) => {
  const { push } = useRouter()

  const { isMobile } = useMobileCheck()

  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

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
            onClick={() => push(getVaultUrl(vault))}
            withTokenBonus={sumrNetApyConfig.withSumr}
            sumrPrice={estimatedSumrPrice}
            vaultApyData={
              vaultsApyByNetworkMap[
                `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
              ]
            }
          />
        ))}
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
