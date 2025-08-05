import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { getDeploymentsJsonConfig } from '@summerfi/armada-protocol-common'

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
  if (clientId === 'test-client') {
    return Promise.resolve({
      deployedContracts: {
        admiralsQuarters: {
          [ChainIds.Base]: '0x1234567890abcdef1234567890abcdef12345678',
          [ChainIds.ArbitrumOne]: '0x',
          [ChainIds.Mainnet]: '0x',
          [ChainIds.Sonic]: '0x',
        },
        protocolAccessManager: {
          [ChainIds.Base]: '0x2D2824B0f437e72B9c9194b798DecA125ccCFFeB',
          [ChainIds.ArbitrumOne]: '0x',
          [ChainIds.Mainnet]: '0x',
          [ChainIds.Sonic]: '0x',
        },
        tipJar: {
          [ChainIds.Base]: '0xD0F16e3A7c5629c6146E7172e3e9382A82cf0B43',
          [ChainIds.ArbitrumOne]: '0x',
          [ChainIds.Mainnet]: '0x',
          [ChainIds.Sonic]: '0x',
        },
        raft: {
          [ChainIds.Base]: '0x4a7fDf2bd6CCafB306b5aBD734231bE0Ca688d2f',
          [ChainIds.ArbitrumOne]: '0x',
          [ChainIds.Mainnet]: '0x',
          [ChainIds.Sonic]: '0x',
        },
        configurationManager: {
          [ChainIds.Base]: '0x085b78235e991D751Bd0f569b7c195EC53C52A90',
          [ChainIds.ArbitrumOne]: '0x',
          [ChainIds.Mainnet]: '0x',
          [ChainIds.Sonic]: '0x',
        },
        harborCommand: {
          [ChainIds.Base]: '0x831BE0EB9a37AC39347Ced1Be6da402268E66831',
          [ChainIds.ArbitrumOne]: '0x',
          [ChainIds.Mainnet]: '0x',
          [ChainIds.Sonic]: '0x',
        },
      },
    })
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
