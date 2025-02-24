import { ChainFamilyMap } from '@summerfi/sdk-common'
import type { ArmadaMigrationConfig } from './types'

// a tokens taken from: https://aave.com/docs/resources/addresses
export const aaveV3ConfigsByChainId: Record<number, Record<string, ArmadaMigrationConfig>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    weth: {
      sourceContract: '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7',
      underlyingToken: '0x4200000000000000000000000000000000000006',
    },
    cbeth: {
      sourceContract: '0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad',
      underlyingToken: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
    },
    usdbc: {
      sourceContract: '0x0a1d576f3eFeF75b330424287a95A366e8281D54',
      underlyingToken: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
    wstETH: {
      sourceContract: '0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D',
      underlyingToken: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    },
    usdc: {
      sourceContract: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
    weETH: {
      sourceContract: '0x7C307e128efA31F540F2E2d976C995E0B65F51F6',
      underlyingToken: '0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A',
    },
    cbBTC: {
      sourceContract: '0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6',
      underlyingToken: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
    },
    ezETH: {
      sourceContract: '0xDD5745756C2de109183c6B5bB886F9207bEF114D',
      underlyingToken: '0x2416092f143378750bb29b79eD961ab195CcEea5',
    },
  },
  [ChainFamilyMap.Ethereum.Mainnet.chainId]: {},
  [ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]: {},
}
