'use client'

import {
  getDisplayToken,
  getVaultPositionUrl,
  getVaultUrl,
  Sidebar,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, slugifyVault, supportedSDKNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

type VaultsListSidebarProps = {
  activeVaultData: SDKVaultishType
  positionExists: boolean
  userWalletAddress?: string
  onButtonClick: (buttonId: string) => void
  // Where the "view" CTA leads; defaults to the vault open (strategy) page.
  strategyLink?: {
    label: string
    href: string
  }
}

export const VaultsListSidebar = ({
  activeVaultData,
  positionExists,
  userWalletAddress,
  onButtonClick,
  strategyLink,
}: VaultsListSidebarProps) => {
  const network = supportedSDKNetwork(activeVaultData.protocol.network)
  const resolvedStrategyLink = strategyLink ?? {
    label: 'View strategy',
    href: getVaultUrl(activeVaultData),
  }

  return (
    <div style={{ position: 'relative', width: '100%', padding: '2px' }}>
      <Sidebar
        title={`${getDisplayToken(activeVaultData.inputToken.symbol)} on ${capitalize(
          sdkNetworkToHumanNetwork(network),
        )}`}
        content={
          <Text
            as="p"
            variant="p3"
            style={{ margin: '16px 0 24px', color: 'var(--color-text-secondary)' }}
          >
            Explore the strategy details, historical performance and current allocations.
          </Text>
        }
        primaryButton={
          positionExists && userWalletAddress
            ? {
                label: 'View your position',
                url: getVaultPositionUrl({
                  network,
                  vaultId: activeVaultData.id,
                  walletAddress: userWalletAddress,
                }),
                action: () => {
                  onButtonClick(
                    `vaults-list-view-position-${slugifyVault(activeVaultData)}-${userWalletAddress}`,
                  )
                },
              }
            : {
                label: resolvedStrategyLink.label,
                url: resolvedStrategyLink.href,
                action: () => {
                  onButtonClick(`vaults-list-view-strategy-${slugifyVault(activeVaultData)}`)
                },
              }
        }
        footnote={
          positionExists && userWalletAddress ? (
            <Link
              href={resolvedStrategyLink.href}
              onClick={() =>
                onButtonClick(`vaults-list-view-strategy-${slugifyVault(activeVaultData)}`)
              }
            >
              <WithArrow variant="p3semi">{resolvedStrategyLink.label}</WithArrow>
            </Link>
          ) : undefined
        }
      />
    </div>
  )
}
