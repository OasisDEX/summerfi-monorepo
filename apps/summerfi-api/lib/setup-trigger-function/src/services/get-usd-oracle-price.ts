import { Price, Token } from '~types'
import { Addresses } from './get-addresses'
import { PublicClient } from 'viem'
import { aaveOracleAbi } from '~abi'

export const getUsdOraclePrice = async (
  token: Token,
  addresses: Addresses,
  publicClient: PublicClient,
): Promise<Price> => {
  const price = await publicClient.readContract({
    abi: aaveOracleAbi,
    address: addresses.AaveOracle,
    functionName: 'getAssetPrice',
    args: [token.address],
  })

  return price as Price // AAVE Oracle has the same decimals as the token price (see: PRICE_DECIMALS)
}
