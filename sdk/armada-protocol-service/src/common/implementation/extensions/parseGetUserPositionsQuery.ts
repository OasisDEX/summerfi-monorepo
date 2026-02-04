import {
  type AddressValue,
  type ChainId,
  type IArmadaPosition,
  type IChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'
import type { GetUserPositionsQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'
import type { IArmadaManagerMerklRewards } from '@summerfi/armada-protocol-common'

export const parseGetUserPositionsQuery = async ({
  user,
  query,
  summerToken,
  getTokenBySymbol,
  getUserMerklRewards,
  getProtocolUsageRewards,
}: {
  user: IUser
  query: GetUserPositionsQuery
  summerToken: IToken
  getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
  getUserMerklRewards: (
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
  ) => ReturnType<IArmadaManagerMerklRewards['getUserMerklRewards']>
  getProtocolUsageRewards: (params: {
    userAddressValue: AddressValue
    chainId: ChainId
  }) => Promise<{
    total: bigint
    perFleet: Record<string, bigint>
  }>
}): Promise<IArmadaPosition[]> => {
  const merklSummerRewards = await getUserMerklRewards({
    address: user.wallet.address.value,
    chainIds: [user.chainInfo.chainId],
  })

  const protocolUsageRewards = await getProtocolUsageRewards({
    userAddressValue: user.wallet.address.value,
    chainId: user.chainInfo.chainId,
  })

  return query.positions.map(
    mapGraphDataToArmadaPosition({
      user,
      summerToken,
      getTokenBySymbol,
      merklSummerRewards,
      protocolUsageRewards,
    }),
  )
}
