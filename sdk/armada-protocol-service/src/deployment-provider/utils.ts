import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { getDeploymentsJsonConfig } from '@summerfi/armada-protocol-common'
import type { DeploymentProviderConfig } from './DeploymentProviderConfig'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'

const chainIdToNetwork = {
  [ChainIds.Base]: 'base',
  [ChainIds.ArbitrumOne]: 'arbitrum',
  [ChainIds.Mainnet]: 'mainnet',
  [ChainIds.Sonic]: 'sonic',
} as const

export async function fetchInstiDeploymentProviderConfig(
  subgraphManager: IArmadaSubgraphManager,
  instiChainIds: ChainId[],
  clientId: string,
): Promise<DeploymentProviderConfig[]> {
  const deploymentProviderConfigs: DeploymentProviderConfig[] = []

  for (const chainId of instiChainIds) {
    const institutionsData = await subgraphManager.getInstitutionById({ chainId, id: clientId })
    const institution = institutionsData.institution
    if (!institution) {
      throw new Error(`No institution found for clientId ${clientId} on chainId ${chainId}`)
    }
    deploymentProviderConfigs.push({
      chainId,
      active: institution.active ?? false,
      contracts: {
        harborCommand: institution.harborCommand as AddressValue,
        admiralsQuarters: institution.admiralsQuarters as AddressValue,
        configurationManager: institution.configurationManager as AddressValue,
        protocolAccessManager: institution.protocolAccessManager as AddressValue,
      },
    })
  }

  return deploymentProviderConfigs
}

export const fetchPublicDeploymentProviderConfig = (
  deployedChainIds: ChainId[],
): DeploymentProviderConfig[] => {
  const jsonConfig = getDeploymentsJsonConfig()
  if (!jsonConfig) {
    throw new Error('Deployment config not found')
  }

  const config: DeploymentProviderConfig[] = deployedChainIds.map((chainId) => {
    return {
      chainId,
      active: true,
      contracts: {
        harborCommand: jsonConfig[chainIdToNetwork[chainId]].deployedContracts.core.harborCommand
          .address as AddressValue,
        admiralsQuarters: jsonConfig[chainIdToNetwork[chainId]].deployedContracts.core
          .admiralsQuarters.address as AddressValue,
        configurationManager: jsonConfig[chainIdToNetwork[chainId]].deployedContracts.core
          .configurationManager.address as AddressValue,
        protocolAccessManager: jsonConfig[chainIdToNetwork[chainId]].deployedContracts.gov
          .protocolAccessManager.address as AddressValue,
      },
    }
  })

  return config
}
