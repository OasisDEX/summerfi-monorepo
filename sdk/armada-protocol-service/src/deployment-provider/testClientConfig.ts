import { ChainIds } from '@summerfi/sdk-common'
import type { DeploymentProviderConfig } from './DeploymentProviderConfig'

export const testClientConfig: DeploymentProviderConfig = {
  deployedContracts: {
    admiralsQuarters: {
      [ChainIds.Base]: '0x4e92071F9BC94011419Dc03fEaCA32D11241313a',
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
}
