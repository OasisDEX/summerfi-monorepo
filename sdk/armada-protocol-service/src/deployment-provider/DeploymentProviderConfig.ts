import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { getDeploymentsJsonConfig } from '@summerfi/armada-protocol-common'
import { testClientConfig } from './testClientConfig'
import { clientIds } from './clientIds'

export type SupportedChainId = typeof ChainIds.Base

export type DeploymentProviderConfig = {
  deployedContracts: DeploymentProviderDeployedContracts
}

export type DeploymentProviderDeployedContracts = {
  admiralsQuarters: Record<ChainId, AddressValue>
  protocolAccessManager: Record<ChainId, AddressValue>
  tipJar: Record<ChainId, AddressValue>
  raft: Record<ChainId, AddressValue>
  configurationManager: Record<ChainId, AddressValue>
  harborCommand: Record<ChainId, AddressValue>
}

export async function fetchDeploymentProviderConfig(
  clientId: string,
): Promise<DeploymentProviderConfig> {
  // Simulate fetching the deployment provider config from a database or external service
  // In a real implementation, this would involve an actual data fetch
  if (clientIds.includes(clientId)) {
    return Promise.resolve(testClientConfig)
  }
  return Promise.reject('Integrator config not found for clientId: ' + clientId)
}

export const readDeploymentProviderConfig = (): DeploymentProviderConfig => {
  const jsonConfig = getDeploymentsJsonConfig()
  if (!jsonConfig) {
    throw new Error('Deployment config not found')
  }

  const config: DeploymentProviderConfig = {
    deployedContracts: {
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
      tipJar: {
        [ChainIds.Base]: jsonConfig.base.deployedContracts.core.tipJar.address as AddressValue,
        [ChainIds.ArbitrumOne]: jsonConfig.arbitrum.deployedContracts.core.tipJar
          .address as AddressValue,
        [ChainIds.Mainnet]: jsonConfig.mainnet.deployedContracts.core.tipJar
          .address as AddressValue,
        [ChainIds.Sonic]: jsonConfig.sonic.deployedContracts.core.tipJar.address as AddressValue,
      },
      raft: {
        [ChainIds.Base]: jsonConfig.base.deployedContracts.core.raft.address as AddressValue,
        [ChainIds.ArbitrumOne]: jsonConfig.arbitrum.deployedContracts.core.raft
          .address as AddressValue,
        [ChainIds.Mainnet]: jsonConfig.mainnet.deployedContracts.core.raft.address as AddressValue,
        [ChainIds.Sonic]: jsonConfig.sonic.deployedContracts.core.raft.address as AddressValue,
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
    },
  }
  return config
}
