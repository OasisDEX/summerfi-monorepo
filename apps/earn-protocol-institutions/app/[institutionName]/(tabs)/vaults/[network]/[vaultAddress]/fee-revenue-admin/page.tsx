import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionVault,
  getCachedInstitutionVaultFeeRevenueConfig,
  getCachedInstitutionVaultFleetFees,
} from '@/app/server-handlers/institution/institution-vaults'
import { PanelFeeRevenueAdmin } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin'
import { getRwaClientIdForVault } from '@/helpers/rwa'
import { type InstitutionVaultFeeRevenueItem } from '@/types/institution-data'

export default async function InstitutionVaultFeeRevenueAdminPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(network)

  const config = await getCachedConfig()
  const isRwa = !!getRwaClientIdForVault({
    systemConfig: config,
    networkId: subgraphNetworkToId(parsedNetwork),
    vaultAddress,
  })

  // RWA fees aren't surfaced by the v1 `getFeeRevenueConfig`, so RWA vaults read the management
  // (tipRate) and performance (performanceFeeRate) fees on-chain; standard vaults keep the v1 config.
  const [institutionVault, fleetFees, feeRevenueConfig] = await Promise.all([
    getCachedInstitutionVault({
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
    isRwa
      ? Promise.resolve(null)
      : getCachedInstitutionVaultFeeRevenueConfig({
          institutionName,
          network: parsedNetwork,
          vaultAddress,
        }),
  ])

  if (!institutionVault?.vault) {
    return <div>Vault not found</div>
  }

  const feeRevenue: InstitutionVaultFeeRevenueItem[] = isRwa
    ? [
        { name: 'Management Fee', aumFee: fleetFees?.managementFee ?? null },
        { name: 'Performance Fee', aumFee: fleetFees?.performanceFee ?? null },
      ]
    : [
        {
          name: 'Vault AUM Fee',
          // Pass null (→ "n/a") when there's genuinely no fee config; a present 0 stays a real 0.00%.
          aumFee:
            feeRevenueConfig != null
              ? Number(feeRevenueConfig.vaultFeeAmount.value.toString()) / 100
              : null,
        },
      ]

  return <PanelFeeRevenueAdmin feeRevenue={feeRevenue} />
}
