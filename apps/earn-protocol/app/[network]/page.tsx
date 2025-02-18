import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, parseServerResponseToClient } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

type EarnNetworkVaultsPageProps = {
  params: Promise<{
    network: SDKNetwork | 'all-networks'
  }>
}

const EarnNetworkVaultsPage = async ({ params }: EarnNetworkVaultsPageProps) => {
  const { network } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const [{ vaults }, configRaw] = await Promise.all([
    unstableCache(getVaultsList, [network], {
      tags: [REVALIDATION_TAGS.VAULTS_LIST, `Vaults_list_${network}`],
      revalidate: REVALIDATION_TIMES.VAULTS_LIST,
    })(),
    systemConfigHandler(),
  ])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)
  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  return <VaultListViewComponent vaultsList={vaultsDecorated} selectedNetwork={parsedNetwork} />
}

export default EarnNetworkVaultsPage
