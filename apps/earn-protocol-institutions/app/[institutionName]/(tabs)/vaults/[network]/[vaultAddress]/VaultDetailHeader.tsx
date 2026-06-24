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
  getCachedInstitutionVaultFleetFees,
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
  const [institutionVaults, institutionVault] = await Promise.all([
    getCachedInstitutionVaults({ institutionName }),
    getCachedInstitutionVault({ institutionName, network: parsedNetwork, vaultAddress }),
  ])

  if (!institutionVaults || !institutionVault?.vault) {
    return null
  }

  const { vault } = institutionVault
  const isRwa = !!vault.isRwaVault

  // RWA fees come from the FleetCommander (tipRate); standard vaults use the v1 fee-revenue config.
  const [feeRevenueConfig, fleetFees] = await Promise.all([
    isRwa
      ? Promise.resolve(null)
      : getCachedInstitutionVaultFeeRevenueConfig({
          institutionName,
          network: parsedNetwork,
          vaultAddress,
        }),
    isRwa
      ? getCachedInstitutionVaultFleetFees({
          institutionName,
          network: parsedNetwork,
          vaultAddress,
        })
      : Promise.resolve(null),
  ])

  const inception = Number(Number(vault.createdTimestamp) * 1000)
  const aum = new BigNumber(vault.inputTokenBalance.toString())
    .div(ten.pow(vault.inputToken.decimals))
    .toNumber()
  const vaultSelector = `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`

  const { vaultApyMap, vaultSharePriceMap } = institutionVaults.vaultsAdditionalInfo
  // Index access hides `undefined` from the type, but the selector can genuinely be absent at
  // runtime; the `in` guard makes `apyEntry` `... | undefined` so the optional access is real.
  const apyEntry = vaultSelector in vaultApyMap ? vaultApyMap[vaultSelector] : undefined
  const sharePrice = vaultSharePriceMap[vaultSelector]

  // For RWA, the meaningful "APY" is the NAV-derived 30d figure (decimal fraction); standard vaults
  // use the generic live APY (a percent number, normalised here).
  const liveApy = isRwa
    ? (vault.navApy30d ?? undefined)
    : apyEntry?.apyLive
      ? apyEntry.apyLive / 100
      : undefined

  const fee = isRwa
    ? (fleetFees?.managementFee ?? 0)
    : (feeRevenueConfig?.vaultFeeAmount.value.valueOf() ?? 0) / 100

  return (
    <DashboardVaultHeader
      vaultName={getInstiVaultNiceName({
        symbol: vault.inputToken.symbol,
        network: vault.protocol.network,
        institutionName,
        customName: vault.customFields?.name,
      })}
      liveApy={liveApy}
      nav={sharePrice ? formatCryptoBalance(sharePrice) : 'n/a'}
      aum={aum}
      fee={fee}
      inception={inception}
    />
  )
}
