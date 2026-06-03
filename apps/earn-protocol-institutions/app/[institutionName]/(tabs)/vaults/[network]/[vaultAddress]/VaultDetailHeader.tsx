import {
  formatCryptoBalance,
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import {
  getCachedInstitutionVault,
  getCachedInstitutionVaultFeeRevenueConfig,
  getCachedInstitutionVaults,
} from '@/app/server-handlers/institution/institution-vaults'
import { DashboardVaultHeader } from '@/features/dashboard/components/DashboardVaultHeader/DashboardVaultHeader'
import { getInstiVaultNiceName } from '@/helpers/get-insti-vault-nice-name'

// Streamed inside the vault-detail layout (its own Suspense boundary). Holds the header data fetch
// that previously blocked the whole layout.
export const VaultDetailHeader = async ({
  institutionName,
  network,
  vaultAddress,
}: {
  institutionName: string
  network: string
  vaultAddress: string
}) => {
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const [institutionVaults, institutionVault, institutionVaultFeeRevenueConfig] = await Promise.all(
    [
      getCachedInstitutionVaults({ institutionName }),
      getCachedInstitutionVault({ institutionName, network: parsedNetwork, vaultAddress }),
      getCachedInstitutionVaultFeeRevenueConfig({
        institutionName,
        network: parsedNetwork,
        vaultAddress,
      }),
    ],
  )

  if (!institutionVaults || !institutionVault?.vault) {
    return null
  }

  const inception = Number(Number(institutionVault.vault.createdTimestamp) * 1000)
  const aum = new BigNumber(institutionVault.vault.inputTokenBalance.toString())
    .div(ten.pow(institutionVault.vault.inputToken.decimals))
    .toNumber()
  const vaultSelector = `${institutionVault.vault.id}-${subgraphNetworkToId(supportedSDKNetwork(institutionVault.vault.protocol.network))}`

  const { vaultApyMap, vaultSharePriceMap } = institutionVaults.vaultsAdditionalInfo
  // Index access hides `undefined` from the type, but the selector can genuinely be absent at
  // runtime; the `in` guard makes `apyEntry` `... | undefined` so the optional access is real.
  const apyEntry = vaultSelector in vaultApyMap ? vaultApyMap[vaultSelector] : undefined
  const liveApy = apyEntry?.apyLive ? apyEntry.apyLive / 100 : undefined
  const sharePrice = vaultSharePriceMap[vaultSelector]

  return (
    <DashboardVaultHeader
      vaultName={getInstiVaultNiceName({
        symbol: institutionVault.vault.inputToken.symbol,
        network: institutionVault.vault.protocol.network,
        institutionName,
      })}
      liveApy={liveApy}
      nav={sharePrice ? formatCryptoBalance(sharePrice) : 'n/a'}
      aum={aum}
      fee={(institutionVaultFeeRevenueConfig?.vaultFeeAmount.value.valueOf() ?? 0) / 100}
      inception={inception}
    />
  )
}
