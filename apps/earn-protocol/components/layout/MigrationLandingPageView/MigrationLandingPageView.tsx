'use client'
import { type FC, useMemo, useState } from 'react'
import {
  AnimateHeight,
  Button,
  Card,
  getMigrationVaultUrl,
  getUniqueVaultId,
  Icon,
  MobileDrawer,
  Modal,
  networkNameIconNameMap,
  SlideCarousel,
  SliderCarouselDotsPosition,
  SUMR_CAP,
  Text,
  TitleWithSelect,
  useLocalConfig,
  useMobileCheck,
  useUserWallet,
  VaultCard,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type DropdownRawOption,
  type GetVaultsApyResponse,
  type IconNamesList,
  type SDKVaultsListType,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  sdkNetworkToHumanNetwork,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { MigrationLandingPageIlustration } from '@/features/migration/components/MigrationLandingPageIlustration/MigrationLandingPageIlustration'
import { MigrationLandingPagePositionCard } from '@/features/migration/components/MigrationLandingPagePositionCard/MigrationLandingPagePositionCard'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { NavConfigContent } from '@/features/nav-config/components/NavConfigContent/NavConfigContent'
import { revalidateMigrationData } from '@/helpers/revalidation-handlers'

import classNames from './MigrationLandingPageView.module.css'

const contentCards: {
  title: string
  description: string
  iconName: IconNamesList
}[] = [
  {
    title: 'Best yields',
    description:
      'Lazy Summer Protocol users earn more. Consistently outperforming benchmark DeFi yields thanks to automated, AI-powered rebalancing.',
    iconName: 'plant_colorful',
  },
  {
    title: 'Highest Quality Protocols',
    description:
      'Lazy Summer Protocol curates only the highest-quality strategies and protocols. Carefully selected for safety, reliability, and performance.',
    iconName: 'checkmark_cookie_colorful',
  },
  {
    title: 'Automated Rebalancing',
    description:
      'Take the hassle out of yield hunting by automatically rebalancing your capital across top-tier strategies and protocols - so you never miss evolving market opportunities.',
    iconName: 'migrate_colorful',
  },
]

const allNetworksOption: DropdownOption = {
  iconName: 'earn_network_all' as IconNamesList,
  label: 'All Networks',
  value: 'all-networks',
}

interface MigrationLandingPageViewProps {
  vaultsList: SDKVaultsListType
  selectedNetwork?: SupportedSDKNetworks | 'all-networks'
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  walletAddress: string
  migrationBestVaultApy: MigrationEarningsDataByChainId
}

export const MigrationLandingPageView: FC<MigrationLandingPageViewProps> = ({
  vaultsList,
  selectedNetwork = 'all-networks',
  vaultsApyByNetworkMap,
  migratablePositions,
  walletAddress,
  migrationBestVaultApy,
}) => {
  const searchParams = useSearchParams()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const [localVaultNetwork, setLocalVaultNetwork] =
    useState<MigrationLandingPageViewProps['selectedNetwork']>(selectedNetwork)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { userWalletAddress } = useUserWallet()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const positionId = searchParams.get('positionId')
  const isOwner = walletAddress.toLowerCase() === userWalletAddress?.toLowerCase()

  const [showAllPositions, setShowAllPositions] = useState(!positionId)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(positionId)

  const handleSelectPosition = (id: string) => {
    setSelectedPosition(id)
  }
  const networkFilteredVaults = useMemo(() => {
    return localVaultNetwork && localVaultNetwork !== 'all-networks'
      ? vaultsList.filter(
          ({ protocol }) => supportedSDKNetwork(protocol.network) === localVaultNetwork,
        )
      : vaultsList
  }, [localVaultNetwork, vaultsList])

  const [selectedVaultId, setSelectedVaultId] = useState<string | undefined>(undefined)

  const vaultsNetworksList = useMemo(
    () => [
      ...Array.from(
        new Set(vaultsList.map(({ protocol }) => supportedSDKNetwork(protocol.network))),
      )
        .sort() // Ensure consistent ordering to avoid hydration errors
        .map((network) => ({
          iconName: networkNameIconNameMap[network as SupportedSDKNetworks] as IconNamesList,
          value: network,
          label: capitalize(sdkNetworkToHumanNetwork(network)),
        })),
      allNetworksOption,
    ],
    [vaultsList],
  )

  const handleChangeNetwork = (selected: DropdownRawOption) => {
    setLocalVaultNetwork(selected.value as MigrationLandingPageViewProps['selectedNetwork'])
    setSelectedVaultId(undefined)
  }

  const selectedNetworkOption = useMemo(
    () =>
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? {
            iconName: networkNameIconNameMap[localVaultNetwork] as IconNamesList,
            value: localVaultNetwork,
            label: capitalize(sdkNetworkToHumanNetwork(localVaultNetwork)),
          }
        : allNetworksOption,
    [localVaultNetwork],
  )

  const handleConfigOpenClose = () => {
    setIsConfigOpen((prev) => !prev)
  }

  const handleChangeVault = (nextselectedVaultId: string) => {
    setSelectedVaultId(nextselectedVaultId)
  }

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const migrationVaultUrl = useMemo(() => {
    if (!selectedVaultId || !selectedPosition) {
      return '/migrate'
    }

    const [vaultId, vaultNetwork] = selectedVaultId.split('-')

    return getMigrationVaultUrl({
      network: vaultNetwork as SupportedSDKNetworks,
      vaultId,
      walletAddress,
      selectedPosition,
    })
  }, [selectedVaultId, walletAddress, selectedPosition])

  const selectedPositionChainId = useMemo(() => {
    return migratablePositions.find(
      (position) => position.id.toLowerCase() === selectedPosition?.toLowerCase(),
    )?.chainId
  }, [migratablePositions, selectedPosition])

  // render icon condition added to avoid issues with
  // icon rendering when animated height is closed
  const mapMigrationPositionCard = (position: MigratablePosition, renderIcon: boolean) => (
    <MigrationLandingPagePositionCard
      key={position.id}
      position={position}
      onSelectPosition={handleSelectPosition}
      isActive={selectedPosition === position.id}
      earningsData={migrationBestVaultApy[position.chainId]}
      renderIcon={renderIcon}
    />
  )

  const preselectedPosition = useMemo(() => {
    return migratablePositions.find(
      (position) => position.id.toLowerCase() === positionId?.toLowerCase(),
    )
  }, [migratablePositions, positionId])

  const filteredPositions = migratablePositions
    .filter((position) => position.id !== preselectedPosition?.id)
    .filter(
      (position) =>
        localVaultNetwork === 'all-networks' ||
        chainIdToSDKNetwork(position.chainId) === localVaultNetwork,
    )

  const withToggleButton = filteredPositions.length > 1 && !!positionId

  const handleUserRefresh = () => {
    revalidateMigrationData(walletAddress)
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  return (
    <div className={classNames.migrationLandingPageViewWrapper}>
      <div className={classNames.headerWrapper}>
        <TitleWithSelect
          title="Why Migrate?"
          options={vaultsNetworksList}
          onChangeNetwork={handleChangeNetwork}
          selected={selectedNetworkOption}
          onRefresh={handleUserRefresh}
          isRefreshing={isRefreshing}
        />
        <Link
          href="https://blog.summer.fi/migrate-to-lazy-summer-protocol"
          style={{ display: 'block', width: 'min-content', whiteSpace: 'pre' }}
          target="_blank"
        >
          <Text as="p" variant="p3semi" style={{ display: 'inline' }}>
            <WithArrow style={{ display: 'inline' }}>What is Migrate</WithArrow>
          </Text>
        </Link>
      </div>
      <div className={classNames.contentWrapper}>
        <Card variant="cardSecondary" className={classNames.cardsWrapper}>
          {isMobile ? (
            <SlideCarousel
              slidesPerPage={1}
              slides={contentCards.map((item) => (
                <MigrationLandingPageIlustration
                  key={item.title}
                  iconName={item.iconName}
                  title={item.title}
                  description={item.description}
                />
              ))}
              withDots
              dotsPosition={SliderCarouselDotsPosition.BOTTOM}
              withAutoPlay
              withButtons={false}
            />
          ) : (
            contentCards.map((item) => (
              <MigrationLandingPageIlustration
                key={item.title}
                iconName={item.iconName}
                title={item.title}
                description={item.description}
              />
            ))
          )}
        </Card>

        <Card variant="cardSecondary" className={classNames.mainContentWrapper}>
          <div className={classNames.mainContentHeader}>
            <Text as="h4" variant="h4">
              Migrate a Position
            </Text>
            <Button
              variant="secondaryLarge"
              style={{ padding: '0 var(--general-space-16)', width: '143px', minWidth: '120px' }}
              onClick={handleConfigOpenClose}
            >
              <Icon iconName="cog" size={20} />
              Net APY
            </Button>
            {isMobile ? (
              <MobileDrawer isOpen={isConfigOpen} onClose={handleConfigOpenClose} height="auto">
                <NavConfigContent handleOpenClose={handleConfigOpenClose} />
              </MobileDrawer>
            ) : (
              <Modal openModal={isConfigOpen} closeModal={handleConfigOpenClose}>
                <NavConfigContent handleOpenClose={handleConfigOpenClose} />
              </Modal>
            )}
          </div>
          <div className={classNames.positionsWrapper}>
            <div className={classNames.positionsHeader}>
              <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                1. Select a position to migrate from
              </Text>
            </div>
            <div className={classNames.positionsListWrapper}>
              {preselectedPosition &&
                [preselectedPosition].map((position) => mapMigrationPositionCard(position, true))}
              <AnimateHeight
                id="migration-positions-list"
                show={showAllPositions}
                fade={false}
                contentClassName={
                  preselectedPosition
                    ? classNames.positionListWithPadding
                    : classNames.positionsList
                }
              >
                {filteredPositions.map((position) =>
                  mapMigrationPositionCard(position, showAllPositions),
                )}
              </AnimateHeight>
              {filteredPositions.length === 0 && !preselectedPosition && (
                <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                  No positions found
                </Text>
              )}
            </div>
            {withToggleButton && (
              <div
                className={classNames.showAllPositions}
                onClick={() => setShowAllPositions((prev) => !prev)}
              >
                <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
                  {showAllPositions ? 'Hide' : 'Show'} all positions
                </Text>
              </div>
            )}
          </div>
          <div className={classNames.vaultsWrapper}>
            <div className={classNames.vaultsHeader}>
              <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                2. Select a vault to migrate to
              </Text>
            </div>
            <div className={classNames.vaultsList}>
              {isMobile ? (
                <SlideCarousel
                  slidesPerPage={1}
                  withDots
                  dotsPosition={SliderCarouselDotsPosition.BOTTOM}
                  withAutoPlay
                  withButtons={false}
                  slides={networkFilteredVaults.map((vault) => (
                    <VaultCard
                      key={getUniqueVaultId(vault)}
                      {...vault}
                      withHover
                      selected={selectedVaultId === getUniqueVaultId(vault)}
                      onClick={() => handleChangeVault(getUniqueVaultId(vault))}
                      withTokenBonus={sumrNetApyConfig.withSumr}
                      sumrPrice={estimatedSumrPrice}
                      vaultApyData={
                        vaultsApyByNetworkMap[
                          `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
                        ]
                      }
                      disabled={
                        selectedPositionChainId !==
                        subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))
                      }
                    />
                  ))}
                />
              ) : (
                networkFilteredVaults.map((vault) => (
                  <VaultCard
                    key={getUniqueVaultId(vault)}
                    {...vault}
                    withHover
                    selected={selectedVaultId === getUniqueVaultId(vault)}
                    onClick={() => handleChangeVault(getUniqueVaultId(vault))}
                    withTokenBonus={sumrNetApyConfig.withSumr}
                    sumrPrice={estimatedSumrPrice}
                    wrapperStyle={{
                      minWidth: '300px',
                    }}
                    vaultApyData={
                      vaultsApyByNetworkMap[
                        `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
                      ]
                    }
                    disabled={
                      selectedPositionChainId !==
                      subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))
                    }
                  />
                ))
              )}
            </div>
          </div>
          <div className={classNames.migrationButton}>
            <Link href={migrationVaultUrl} prefetch>
              <Button
                variant="primaryLargeColorful"
                style={{ padding: '0 var(--general-space-16)', width: '185px', minWidth: '150px' }}
                disabled={!selectedVaultId || !selectedPosition || !isOwner || isLoading}
                onClick={() => setIsLoading(true)}
              >
                <WithArrow
                  style={{ color: 'var(--earn-protocol-secondary-100)' }}
                  variant="p2semi"
                  isLoading={isLoading}
                >
                  Migrate
                </WithArrow>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
