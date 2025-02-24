import { ChainFamilyMap } from '@summerfi/sdk-common'
import type { ArmadaMigrationConfig } from './types'
// c tokens taken from: https://docs.compound.finance/#networks
export const compoundConfigsByChainId: Record<number, Record<string, ArmadaMigrationConfig>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    usdc: {
      sourceContract: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
    usdbc: {
      sourceContract: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
      underlyingToken: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
    weth: {
      sourceContract: '0x46e6b214b524310239732D51387075E0e70970bf',
      underlyingToken: '0x4200000000000000000000000000000000000006',
    },
    aero: {
      sourceContract: '0x784efeB622244d2348d4F2522f8860B96fbEcE89',
      underlyingToken: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
    },
  },
  [ChainFamilyMap.Ethereum.Mainnet.chainId]: {},
  [ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]: {},
}
