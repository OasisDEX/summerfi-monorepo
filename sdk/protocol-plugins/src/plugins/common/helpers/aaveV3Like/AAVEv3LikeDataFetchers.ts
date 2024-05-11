import { Token } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import {
  AllowedProtocolNames,
  IProtocolPluginContextWithContractDef,
} from './AAVEv3LikeBuilderTypes'
import { IChainInfo } from '@summerfi/sdk-common'

export async function fetchReservesTokens(
  ctx: IProtocolPluginContextWithContractDef,
  protocolName: AllowedProtocolNames,
  chainInfo: IChainInfo,
) {
  switch (protocolName) {
    case ProtocolName.AAVEv3: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const [rawReservesTokenList] = await ctx.provider.multicall({
        contracts: [
          {
            abi: poolDataProviderDef.abi,
            address: poolDataProviderDef.address,
            functionName: 'getAllReservesTokens',
            args: [],
          },
        ],
        allowFailure: false,
      })

      return rawReservesTokenList
    }
    case ProtocolName.Spark: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const [rawReservesTokenList] = await ctx.provider.multicall({
        contracts: [
          {
            abi: poolDataProviderDef.abi,
            address: poolDataProviderDef.address,
            functionName: 'getAllReservesTokens',
            args: [],
          },
        ],
        allowFailure: false,
      })

      return rawReservesTokenList
    }
    default:
      throw new Error(`Unsupported protocol supplied ${protocolName}`)
  }
}
export async function fetchEmodeCategoriesForReserves(
  ctx: IProtocolPluginContextWithContractDef,
  tokensList: Token[],
  protocolName: AllowedProtocolNames,
  chainInfo: IChainInfo,
) {
  switch (protocolName) {
    case ProtocolName.AAVEv3: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveEModeCategory' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    case ProtocolName.Spark: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveEModeCategory' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    default:
      throw new Error(`Unsupported protocol supplied ${protocolName}`)
  }
}
export async function fetchAssetConfigurationData(
  ctx: IProtocolPluginContextWithContractDef,
  tokensList: Token[],
  protocolName: AllowedProtocolNames,
  chainInfo: IChainInfo,
) {
  switch (protocolName) {
    case ProtocolName.AAVEv3: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveConfigurationData' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    case ProtocolName.Spark: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveConfigurationData' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    default:
      throw new Error(`Unsupported protocol supplied ${protocolName}`)
  }
}
export async function fetchReservesCap(
  ctx: IProtocolPluginContextWithContractDef,
  tokensList: Token[],
  protocolName: AllowedProtocolNames,
  chainInfo: IChainInfo,
) {
  switch (protocolName) {
    case ProtocolName.AAVEv3: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveCaps' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    case ProtocolName.Spark: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveCaps' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    default:
      throw new Error(`Unsupported protocol supplied ${protocolName}`)
  }
}
export async function fetchAssetReserveData(
  ctx: IProtocolPluginContextWithContractDef,
  tokensList: Token[],
  protocolName: AllowedProtocolNames,
  chainInfo: IChainInfo,
) {
  switch (protocolName) {
    case ProtocolName.AAVEv3: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveData' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    case ProtocolName.Spark: {
      const poolDataProviderDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'PoolDataProvider',
      })
      const contractCalls = tokensList.map((token) => ({
        abi: poolDataProviderDef.abi,
        address: poolDataProviderDef.address,
        functionName: 'getReserveData' as const,
        args: [token.address.value],
      }))

      return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false,
      })
    }
    default:
      throw new Error(`Unsupported protocol supplied ${protocolName}`)
  }
}
export async function fetchAssetPrices(
  ctx: IProtocolPluginContextWithContractDef,
  tokensList: Token[],
  protocolName: AllowedProtocolNames,
  chainInfo: IChainInfo,
) {
  let oracleDef = null
  switch (protocolName) {
    case ProtocolName.AAVEv3:
      oracleDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'Oracle',
      })
      break
    case ProtocolName.Spark:
      oracleDef = await ctx.getContractDef({
        chainInfo: chainInfo,
        contractName: 'Oracle',
      })
      break
    default:
      throw new Error(`Unsupported protocol supplied ${protocolName}`)
  }
  const contractCalls = [
    {
      abi: oracleDef.abi,
      address: oracleDef.address,
      functionName: 'getAssetsPrices',
      args: [tokensList.map((token) => token.address.value)],
    },
  ] as const

  return ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}
