import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { getDeploymentsJsonConfig } from '@summerfi/armada-protocol-common'
import type { DeploymentProviderConfig } from './DeploymentProviderConfig'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'

export async function fetchInstiDeploymentProviderConfig(
  subgraphProvider: IArmadaSubgraphManager,
  chainId: ChainId,
  clientId: string,
): Promise<DeploymentProviderConfig[]> {
  const institutionsData = await subgraphProvider.getInstitutions({chainId})

export const fetchPublicDeploymentProviderConfig = (
  deployedChainIds: ChainId[],
): DeploymentProviderConfig[] => {
  const jsonConfig = getDeploymentsJsonConfig()
  if (!jsonConfig) {
    throw new Error('Deployment config not found')
  }

  const config: DeploymentProviderConfig[] = deployedChainIds.map((chainId) => ({
    chainId,
    active: true,
    contracts: {
      harborCommand: {
        [ChainIds.Base]: jsonConfig.base.deployedContracts.core.harborCommand
          .address as AddressValue,
        [ChainIds.ArbitrumOne]: jsonConfig.arbitrum.deployedContracts.core.harborCommand
          .address as AddressValue,
        [ChainIds.Mainnet]: jsonConfig.mainnet.deployedContracts.core.harborCommand
          .address as AddressValue,
        [ChainIds.Sonic]: jsonConfig.sonic.deployedContracts.core.harborCommand
          .address as AddressValue,
      },
      admiralsQuarters: {
        [ChainIds.Base]: jsonConfig.base.deployedContracts.core.admiralsQuarters
          .address as AddressValue,
        [ChainIds.ArbitrumOne]: jsonConfig.arbitrum.deployedContracts.core.admiralsQuarters
          .address as AddressValue,
        [ChainIds.Mainnet]: jsonConfig.mainnet.deployedContracts.core.admiralsQuarters
          .address as AddressValue,
        [ChainIds.Sonic]: jsonConfig.sonic.deployedContracts.core.admiralsQuarters
          .address as AddressValue,
      },
      configurationManager: {
        [ChainIds.Base]: jsonConfig.base.deployedContracts.core.configurationManager
          .address as AddressValue,
        [ChainIds.ArbitrumOne]: jsonConfig.arbitrum.deployedContracts.core.configurationManager
          .address as AddressValue,
        [ChainIds.Mainnet]: jsonConfig.mainnet.deployedContracts.core.configurationManager
          .address as AddressValue,
        [ChainIds.Sonic]: jsonConfig.sonic.deployedContracts.core.configurationManager
          .address as AddressValue,
      },
      protocolAccessManager: {
        [ChainIds.Base]: jsonConfig.base.deployedContracts.gov.protocolAccessManager
          .address as AddressValue,
        [ChainIds.ArbitrumOne]: jsonConfig.arbitrum.deployedContracts.gov.protocolAccessManager
          .address as AddressValue,
        [ChainIds.Mainnet]: jsonConfig.mainnet.deployedContracts.gov.protocolAccessManager
          .address as AddressValue,
        [ChainIds.Sonic]: jsonConfig.sonic.deployedContracts.gov.protocolAccessManager
          .address as AddressValue,
      },
    },
  }))

  return config
}
