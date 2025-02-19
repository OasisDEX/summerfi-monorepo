import { type AddressValue, ChainFamilyMap } from '@summerfi/sdk-common'
// a tokens taken from: https://aave.com/docs/resources/addresses
export const aaveV3AddressesByChainId: Record<number, Record<string, AddressValue>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    weth: '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7',
    cbeth: '0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad',
    usdbc: '0x0a1d576f3eFeF75b330424287a95A366e8281D54',
    wstETH: '0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D',
    usdc: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB',
    weETH: '0x7C307e128efA31F540F2E2d976C995E0B65F51F6',
    cbBTC: '0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6',
    ezETH: '0xDD5745756C2de109183c6B5bB886F9207bEF114D',
  },
  [ChainFamilyMap.Ethereum.Mainnet.chainId]: {},
  [ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]: {},
}
