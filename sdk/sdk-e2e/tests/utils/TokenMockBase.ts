import { Address, ChainFamilyMap, Token } from '@summerfi/sdk-common'

const chainInfo = ChainFamilyMap.Base.Base

export const DAI = Token.createFrom({
  chainInfo,
  address: Address.createFromEthereum({ value: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' }),
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  decimals: 18,
})
export const USDC = Token.createFrom({
  chainInfo,
  address: Address.createFromEthereum({ value: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' }),
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
})
