import { Address, ChainIds, type AddressValue } from '@summerfi/sdk-common'

type SupportedChainId = typeof ChainIds.Base

type DeployedContractsConfig = {
  admiralsQuarters: Record<SupportedChainId, AddressValue>
  protocolAccessManager: Record<SupportedChainId, AddressValue>
  tipJar: Record<SupportedChainId, AddressValue>
  raft: Record<SupportedChainId, AddressValue>
  configurationManager: Record<SupportedChainId, AddressValue>
  harborCommand: Record<SupportedChainId, AddressValue>
}

export type IntegratorConfig = {
  deployedContracts: DeployedContractsConfig
}

export const getDeployedContractAddress = (
  config: DeployedContractsConfig,
  contractName: keyof DeployedContractsConfig,
  chainId: SupportedChainId,
): Address => {
  const address = config[contractName][chainId]
  if (!address) {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`)
  }
  return Address.createFromEthereum({
    value: address,
  })
}

export async function fetchIntegratorConfig(
  clientId: string,
): Promise<IntegratorConfig | undefined> {
  // Simulate fetching the integrator config from a database or external service
  // In a real implementation, this would involve an actual data fetch
  if (clientId === 'test-client') {
    return Promise.resolve({
      deployedContracts: {
        admiralsQuarters: {
          [ChainIds.Base]: '0x1234567890abcdef1234567890abcdef12345678',
          [ChainIds.ArbitrumOne]: '',
          [ChainIds.Mainnet]: '',
          [ChainIds.Sonic]: '',
        },
        protocolAccessManager: {
          [ChainIds.Base]: '0x2D2824B0f437e72B9c9194b798DecA125ccCFFeB',
          [ChainIds.ArbitrumOne]: '',
          [ChainIds.Mainnet]: '',
          [ChainIds.Sonic]: '',
        },
        tipJar: {
          [ChainIds.Base]: '0xD0F16e3A7c5629c6146E7172e3e9382A82cf0B43',
          [ChainIds.ArbitrumOne]: '',
          [ChainIds.Mainnet]: '',
          [ChainIds.Sonic]: '',
        },
        raft: {
          [ChainIds.Base]: '0x4a7fDf2bd6CCafB306b5aBD734231bE0Ca688d2f',
          [ChainIds.ArbitrumOne]: '',
          [ChainIds.Mainnet]: '',
          [ChainIds.Sonic]: '',
        },
        configurationManager: {
          [ChainIds.Base]: '0x085b78235e991D751Bd0f569b7c195EC53C52A90',
          [ChainIds.ArbitrumOne]: '',
          [ChainIds.Mainnet]: '',
          [ChainIds.Sonic]: '',
        },
        harborCommand: {
          [ChainIds.Base]: '0x831BE0EB9a37AC39347Ced1Be6da402268E66831',
          [ChainIds.ArbitrumOne]: '',
          [ChainIds.Mainnet]: '',
          [ChainIds.Sonic]: '',
        },
      },
    })
  }
  return Promise.reject('Integrator config not found for client ID: ' + clientId)
}
