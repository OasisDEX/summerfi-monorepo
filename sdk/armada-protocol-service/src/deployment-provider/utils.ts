import { chainIdToGraphChain, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { getDeploymentsJsonConfig } from '@summerfi/armada-protocol-common'
import type { DeploymentProviderConfig } from './DeploymentProviderConfig'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'

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
      continue
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
    const jsonConfigKey = chainIdToGraphChain(chainId)

    return {
      chainId,
      active: true,
      contracts: {
        harborCommand: jsonConfig[jsonConfigKey].deployedContracts.core.harborCommand
          .address as AddressValue,
        admiralsQuarters: jsonConfig[jsonConfigKey].deployedContracts.core.admiralsQuarters
          .address as AddressValue,
        configurationManager: jsonConfig[jsonConfigKey].deployedContracts.core.configurationManager
          .address as AddressValue,
        protocolAccessManager: jsonConfig[jsonConfigKey].deployedContracts.gov.protocolAccessManager
          .address as AddressValue,
      },
    }
  })

  return config
}
