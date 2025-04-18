import { Address, ChainFamilyMap, Token, AddressType } from '@summerfi/sdk-common'

export const chainInfo = ChainFamilyMap.Ethereum.Mainnet

// Tokens
export const WETH = Token.createFrom({
  chainInfo,
  address: Address.createFrom({
    value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    type: AddressType.Ethereum,
  }),
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
})

export const WSTETH = Token.createFrom({
  chainInfo,
  address: Address.createFrom({
    value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    type: AddressType.Ethereum,
  }),
  symbol: 'WSTETH',
  name: 'Wrapped Staked Ether',
  decimals: 18,
})

export const DAI = Token.createFrom({
  chainInfo,
  address: Address.createFrom({
    value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    type: AddressType.Ethereum,
  }),
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  decimals: 18,
})
