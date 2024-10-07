import { NetworkNames, type Risk, type TokenSymbolsList } from '@summerfi/app-types'

export const strategiesList = [
  {
    id: '123',
    symbol: 'USDT' as TokenSymbolsList,
    network: NetworkNames.ethereumMainnet,
    apy: '3.2',
    tokenBonus: '1.1%',
    bestFor: 'Higher yields',
    risk: 'high' as Risk,
    totalAssets: '800,130,321',
  },
  {
    id: '234',
    symbol: 'USDC' as TokenSymbolsList,
    network: NetworkNames.ethereumMainnet,
    apy: '7.2',
    tokenBonus: '2.1%',
    bestFor: 'Lending only exposure',
    risk: 'low' as Risk,
    totalAssets: '800,130,321',
  },
  {
    id: '345',
    symbol: 'ETH' as TokenSymbolsList,
    network: NetworkNames.ethereumMainnet,
    apy: '2.1',
    tokenBonus: '2.1%',
    bestFor: 'Higher yields',
    risk: 'high' as Risk,
    totalAssets: '800,130,321',
  },
]
