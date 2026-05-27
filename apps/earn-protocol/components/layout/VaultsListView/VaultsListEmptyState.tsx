'use client'

import { Card, Text } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { formatAddress, sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import vaultsListViewStyles from './VaultsListView.module.css'

type VaultsListEmptyStateProps = {
  isPermissionedRwaTab: boolean
  filterVaults: string[]
  filterNetworks: string[]
  filterAssets: string[]
  filterWallet: string
}

export const VaultsListEmptyState = ({
  isPermissionedRwaTab,
  filterVaults,
  filterNetworks,
  filterAssets,
  filterWallet,
}: VaultsListEmptyStateProps) => {
  return (
    <div
      className={vaultsListViewStyles.noVaultsWrapper}
      style={{
        textAlign: 'center',
      }}
    >
      <Card
        style={{
          margin: '0 auto 30px auto',
        }}
      >
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            margin: '30px auto 30px auto',
          }}
        >
          {`No ${
            isPermissionedRwaTab
              ? 'Permissioned RWA '
              : filterVaults.includes('dao-risk-managed')
                ? 'DAO Risk Managed '
                : ''
          }vaults available`}
          {filterNetworks.length
            ? ` on ${filterNetworks.map((network) => capitalize(sdkNetworkToHumanNetwork(network as SupportedSDKNetworks))).join(' and ')}`
            : ''}
          {filterAssets.length
            ? ` with ${filterAssets.join(' and ')} token${filterAssets.length > 1 ? 's' : ''}`
            : ''}
          {filterWallet.length ? ` for assets from ${formatAddress(filterWallet)} wallet` : ''}.
        </Text>
      </Card>
      <Text as="p" variant="p1semiColorful" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        You might like these:
      </Text>
    </div>
  )
}
