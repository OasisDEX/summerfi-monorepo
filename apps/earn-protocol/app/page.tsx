import { getVaultsProtocolsList } from '@summerfi/app-earn-ui'
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
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      vaultsList={vaultsWithConfig}
    />
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const [{ vaults }, headersList, params] = await Promise.all([
    getVaultsList(),
    headers(),
    searchParams,
  ])
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const tvl = formatCryptoBalance(
    vaults.reduce((acc, vault) => acc.plus(vault.totalValueLockedUSD), zero),
  )
  const protocolsSupported = getVaultsProtocolsList(vaults)

  let ogImageUrl = `${baseUrl}earn/api/og/vaults-list?tvl=${tvl}&protocols=${protocolsSupported.length}`

  if (typeof params.game !== 'undefined') {
    ogImageUrl += `${baseUrl}earn/api/og/game`
  }

  return {
    title: `Lazy Summer Protocol - $${tvl} TVL with ${protocolsSupported.length} protocols supported`,
    description:
      "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.",
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
  }
}

export default EarnAllVaultsPage
