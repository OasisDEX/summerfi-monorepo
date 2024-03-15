import { Deployment } from '@summerfi/deployment-utils'

export function SetupDeployments(): Deployment {
  return {
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
    },
    dependencies: {},
  } as Deployment
}
