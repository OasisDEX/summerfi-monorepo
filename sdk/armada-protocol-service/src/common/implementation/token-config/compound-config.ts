import { ChainFamilyMap, type AddressValue } from '@summerfi/sdk-common'
// c tokens taken from: https://docs.compound.finance/#networks
export const compoundAddressesByChainId: Record<number, Record<string, AddressValue>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    usdc: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
    usdbc: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
    weth: '0x46e6b214b524310239732D51387075E0e70970bf',
    aero: '0x784efeB622244d2348d4F2522f8860B96fbEcE89',
  },
  [ChainFamilyMap.Ethereum.Mainnet.chainId]: {},
  [ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]: {},
}
