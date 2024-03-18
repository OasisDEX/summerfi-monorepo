import { Deployment, DeploymentIndex } from '@summerfi/deployment-utils'

export function SetupDeployments(): DeploymentIndex {
  return {
    ['Mainnet.standard']: {
      date: '2022-01-01',
      timestamp: 1640995200,
      provider: 'hardhat' as const,
      chain: 'develop' as const,
      config: 'standard',
      contracts: {
        ['Swap']: {
          address: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
          blockNumber: '22',
        },
        ['OperationExecutor']: {
          address: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
          blockNumber: '22',
        },
      },
      dependencies: {
        MCD_JOIN_DAI: {
          name: 'MCD_JOIN_DAI',
          address: '0x9759A6Ac90977b93B58547b4A71c78317f391A28',
        },
        MCD_JOIN_ETH_A: {
          name: 'MCD_JOIN_ETH_A',
          address: '0x2F0b23f53734252Bda2277357e97e1517d6B042A',
        },
      },
    } as Deployment,
  } as DeploymentIndex
}
