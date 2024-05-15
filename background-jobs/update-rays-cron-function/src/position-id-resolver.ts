// mainnet
// -0x000009818d53763c701ba86586152c667ac3acdb
// -0xdcc46571a9471dd973e4043513175712df873920
// -aave_v2
// -0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
// -Lend

import { ChainId, ChainIDByNetwork, Network } from '@summerfi/serverless-shared'
import { PositionType, Protocol } from '@summerfi/rays-db/dist/database-types'

export interface PositionId {
  chainId: ChainId
  positionType: PositionType
  protocol: Protocol
  marketId: string
  address: string
}

export const positionIdResolver = (positionId: string): PositionId => {
  const [network, marketId, userAddress, protocol, address, positionType] = positionId.split('-')

  return {
    chainId: ChainIDByNetwork[network as Network],
    positionType: positionType as PositionType,
    protocol: protocol as Protocol,
    marketId,
    address,
  }
}
