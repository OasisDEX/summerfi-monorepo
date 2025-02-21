'use client'
import { type FC, useMemo, useState } from 'react'
import {
  Button,
  Card,
  getUniqueVaultId,
  Icon,
  IllustrationCircle,
  MobileDrawer,
  Modal,
  SUMR_CAP,
  Text,
  TitleWithSelect,
  useLocalConfig,
  useMobileCheck,
  VaultCard,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type DropdownRawOption,
  type IconNamesList,
  type SDKNetwork,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { networkIconByNetworkName } from '@/constants/networkIcons'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { NavConfigContent } from '@/features/nav-config/components/NavConfigContent/NavConfigContent'

import classNames from './MigrateLandingPageView.module.scss'

const contentCards: {
  title: string
  description: string
  iconName: IconNamesList
}[] = [
  {
    title: 'Best yields',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vivamus cursus, elit ut auctor dignissim, justo nisi tincidunt ',
    iconName: 'plant_colorful',
  },
  {
    title: 'Highest Quality Protocols',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vivamus cursus, elit ut auctor dignissim, justo nisi tincidunt ',
    iconName: 'checkmark_cookie_colorful',
  },
  {
    title: 'Automated Rebalancing',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vivamus cursus, elit ut auctor dignissim, justo nisi tincidunt ',
    iconName: 'migrate_colorful',
  },
]

const allNetworksOption: DropdownOption = {
  iconName: 'earn_network_all' as IconNamesList,
  label: 'All Networks',
  value: 'all-networks',
}

interface MigrateLandingPageViewProps {
  vaultsList: SDKVaultsListType
  selectedNetwork?: SDKNetwork | 'all-networks'
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

export const MigrateLandingPageView: FC<MigrateLandingPageViewProps> = ({
  vaultsList,
  selectedNetwork = 'all-networks',
  vaultsApyByNetworkMap,
}: MigrateLandingPageViewProps) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const [localVaultNetwork, setLocalVaultNetwork] =
    useState<MigrateLandingPageViewProps['selectedNetwork']>(selectedNetwork)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const networkFilteredVaults = useMemo(() => {
    const properVaultsList =
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? vaultsList.filter(({ protocol }) => protocol.network === localVaultNetwork)
        : vaultsList

    return properVaultsList.sort((a, b) => {
      return Number(a.calculatedApr) > Number(b.calculatedApr) ? -1 : 1
    })
  }, [localVaultNetwork, vaultsList])

  const [selectedVaultId, setSelectedVaultId] = useState<string | undefined>(undefined)

  const vaultsNetworksList = useMemo(
    () => [
      ...Array.from(new Set(vaultsList.map(({ protocol }) => protocol.network)))
        .sort() // Ensure consistent ordering to avoid hydration errors
        .map((network) => ({
          iconName: networkIconByNetworkName[network] as IconNamesList,
          value: network,
          label: capitalize(sdkNetworkToHumanNetwork(network)),
        })),
      allNetworksOption,
    ],
    [vaultsList],
  )

  const handleChangeNetwork = (selected: DropdownRawOption) => {
    setLocalVaultNetwork(selected.value as MigrateLandingPageViewProps['selectedNetwork'])
  }

  const selectedNetworkOption = useMemo(
    () =>
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? {
            iconName: networkIconByNetworkName[localVaultNetwork] as IconNamesList,
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

  const migrateVaultUrl = useMemo(() => {
    if (!selectedVaultId) {
      return '/migrate'
    }

    const [vaultId, vaultNetwork] = selectedVaultId.split('-')

    return `/migrate/${sdkNetworkToHumanNetwork(vaultNetwork as SDKNetwork)}/position/${vaultId}`
  }, [selectedVaultId])

  return (
    <div className={classNames.migrateLandingPageViewWrapper}>
      <div className={classNames.headerWrapper}>
        <TitleWithSelect
          title="Why Migrate?"
          options={vaultsNetworksList}
          onChangeNetwork={handleChangeNetwork}
          selected={selectedNetworkOption}
        />
        <Link
          href="https://blog.summer.fi/say-hello-to-the-lazy-summer-protocol"
          style={{ display: 'block', width: 'min-content', whiteSpace: 'pre' }}
        >
          <Text as="p" variant="p3semi" style={{ display: 'inline' }}>
            <WithArrow style={{ display: 'inline' }}>What is Migrate</WithArrow>
          </Text>
        </Link>
      </div>
      <div className={classNames.contentWrapper}>
        <Card variant="cardSecondary" className={classNames.cardsWrapper}>
          {contentCards.map((item) => (
            <div key={item.title} className={classNames.card}>
              <div className={classNames.cardIconWrapper}>
                <IllustrationCircle icon={item.iconName} size="large" />
              </div>
              <div className={classNames.cardContentWrapper}>
                <Text as="p" variant="p1semi">
                  {item.title}
                </Text>
                <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                  {item.description}
                </Text>
              </div>
            </div>
          ))}
        </Card>
        <Card variant="cardSecondary">
          <div className={classNames.vaultsWrapper}>
            <div className={classNames.vaultsHeader}>
              <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                Migrate to
              </Text>
              <Button
                variant="secondarySmall"
                style={{ padding: '0 var(--general-space-16)' }}
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
                  <NavConfigContent />
                </Modal>
              )}
            </div>
            <div className={classNames.vaultsList}>
              {networkFilteredVaults.map((vault) => (
                <div key={getUniqueVaultId(vault)}>
                  <VaultCard
                    {...vault}
                    withHover
                    selected={selectedVaultId === getUniqueVaultId(vault)}
                    onClick={() => handleChangeVault(getUniqueVaultId(vault))}
                    withTokenBonus={sumrNetApyConfig.withSumr}
                    sumrPrice={estimatedSumrPrice}
                    wrapperStyle={{
                      minWidth: '300px',
                    }}
                    apy={
                      vaultsApyByNetworkMap[
                        `${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`
                      ]
                    }
                  />
                </div>
              ))}
            </div>
            <div className={classNames.buttonWrapper}>
              <Link href={migrateVaultUrl}>
                <Button variant="primaryLarge" disabled={!selectedVaultId}>
                  Migrate
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
