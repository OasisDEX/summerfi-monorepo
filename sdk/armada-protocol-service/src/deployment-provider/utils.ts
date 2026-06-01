import { chainIdToGraphChain, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { getDeploymentsJsonConfig } from '@summerfi/armada-protocol-common'
import type {
  DeploymentProviderConfigInsti,
  DeploymentProviderConfigPublic,
} from './DeploymentProviderConfig'

/**
 * Minimal structural shape required to source institution wiring. Both IArmadaSubgraphManager
 * (institutions subgraph) and IRwaSubgraphManager (institutions-v2 / RWA subgraph) satisfy this, so
 * the same config builder works for both the v1 (insti) and v2 (RWA) deployment paths.
 */
export interface IInstitutionByIdProvider {
  getInstitutionById(params: { chainId: ChainId; id: string }): Promise<{
    institution?: {
      active: boolean
      harborCommand: string
      admiralsQuarters: string
      configurationManager: string
      protocolAccessManager: string
    } | null
  }>
}

export async function fetchInstiDeploymentProviderConfig(
  subgraphManager: IInstitutionByIdProvider,
  instiChainIds: ChainId[],
  clientId: string,
): Promise<DeploymentProviderConfigInsti[]> {
  const deploymentProviderConfigs: DeploymentProviderConfigInsti[] = []

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
): DeploymentProviderConfigPublic[] => {
  const jsonConfig = getDeploymentsJsonConfig()
  if (!jsonConfig) {
    throw new Error('Deployment config not found')
  }

  const config: DeploymentProviderConfigPublic[] = deployedChainIds.map((chainId) => {
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
        dcaStrategyManager:
          'dcaStrategyManager' in jsonConfig[jsonConfigKey].deployedContracts.core
            ? (
                jsonConfig[jsonConfigKey].deployedContracts.core.dcaStrategyManager as {
                  address: AddressValue
                }
              ).address
            : undefined,
      },
    }
  })

  return config
}
