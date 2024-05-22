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

const PROTOCOLS: Record<Protocol, null> = {
  aave_v2: null,
  aave_v3: null,
  ajna: null,
  erc4626: null,
  maker: null,
  morphoblue: null,
  spark: null,
}

const keys = Object.keys(PROTOCOLS)

export const positionIdResolver = (positionId: string): PositionId => {
  const elements = positionId.split('-')
  const network = elements[0]
  // const userAddress = elements[1]
  const address = elements[2]
  const protocol = elements[3]
  const marketId = elements[4]
  const positionType = elements[5]
  // check if protocol is of type of Protocol
  const isValidProtocol = keys.includes(protocol as Protocol)

  if (!isValidProtocol) {
    throw new Error(`Invalid protocol: ${protocol}`)
  }

  const chainId = ChainIDByNetwork[network.split(':')[0] as Network]
  if (!chainId) {
    throw new Error(`Invalid network: ${network}`)
  }

  return {
    chainId: chainId,
    positionType: positionType as PositionType,
    protocol: protocol as Protocol,
    marketId,
    address,
  }
}
