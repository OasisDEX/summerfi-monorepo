import {
  formatCryptoBalance,
  parseServerResponseToClient,
  subgraphNetworkToId,
  zero,
} from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { headers } from 'next/headers'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'
import { getVaultsProtocolsList } from '@/helpers/vaults-protocols-list'

const EarnAllVaultsPage = async () => {
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(network),
    })),
  })

  return (
    <VaultListViewComponent
      vaultsList={vaultsWithConfig}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
    />
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [{ vaults }] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const tvl = formatCryptoBalance(
    vaults.reduce((acc, vault) => acc.plus(vault.totalValueLockedUSD), zero),
  )
  const protocolsSupported = getVaultsProtocolsList(vaults)
  const prodHost = (await headers()).get('host')

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? new URL(`http://localhost:${process.env.PORT ?? 3002}`)
      : new URL(`https://${prodHost}`)

  return {
    title: `Lazy Summer Protocol - $${tvl} TVL with ${protocolsSupported.length} protocols supported`,
    description:
      "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.'",
    openGraph: {
      images: `${baseUrl}/earn/api/og/vaults-list?tvl=${tvl}&protocols=${protocolsSupported.length}`,
    },
  }
}

export default EarnAllVaultsPage
