import { Price } from '~types'
import { Addresses } from './get-addresses'
import { PublicClient } from 'viem'
import { aaveOracleAbi } from '~abi'
import { Address } from '@summerfi/serverless-shared/domain-types'

export const getUsdAaveOraclePrice = async (
  token: Address,
  addresses: Addresses,
  publicClient: PublicClient,
): Promise<Price> => {
  const price = await publicClient.readContract({
    abi: aaveOracleAbi,
    address: addresses.AaveV3.AaveOracle,
    functionName: 'getAssetPrice',
    args: [token],
  })

  return price as Price // AAVE Oracle has the same decimals as the token price (see: PRICE_DECIMALS)
}
