import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getMedianDefiYield } from '@/app/server-handlers/defillama/get-median-defi-yield'
import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getUserActivity } from '@/app/server-handlers/sdk/get-user-activity'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { isFullyLaunched } from '@/constants/is-fully-launched'
import {
  decorateCustomVaultFields,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultOpenPageProps = {
  params: {
    vaultId: string // could be vault address or the vault name
    network: SDKNetwork
  }
}

export const revalidate = 60

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!isFullyLaunched) {
    return redirect('/sumr')
  }
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(params.vaultId)
    ? params.vaultId
    : getVaultIdByVaultCustomName(params.vaultId, String(parsedNetworkId), systemConfig)

  const [vault, { vaults }, { userActivity, topDepositors }, medianDefiYield] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    getUserActivity({ vaultAddress: parsedVaultId, network: parsedNetwork }),
    getMedianDefiYield(),
  ])

  const interestRates = vault?.arks
    ? await getInterestRates({
        network: parsedNetwork,
        arksList: vault.arks,
      })
    : {}

  const [vaultDecorated] = vault
    ? decorateCustomVaultFields({
        vaults: [vault],
        systemConfig,
        decorators: {
          arkInterestRatesMap: interestRates,
        },
      })
    : []
  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  return (
    <VaultOpenView
      vault={vaultDecorated}
      vaults={vaultsDecorated}
      userActivity={userActivity}
      topDepositors={topDepositors}
      medianDefiYield={medianDefiYield}
    />
  )
}

export default EarnVaultOpenPage
