import { Token, IAddress } from '@summerfi/sdk-common'
import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { Abi } from 'viem'

export async function fetchReservesTokens(
  ctx: IProtocolPluginContext,
  dataProviderContractAbi: Abi,
  dataProviderContractAddress: IAddress,
) {
  const [rawReservesTokenList] = await ctx.provider.multicall({
    contracts: [
      {
        abi: dataProviderContractAbi as Abi,
        address: dataProviderContractAddress.value,
        functionName: 'getAllReservesTokens',
        args: [],
      },
    ],
    allowFailure: false,
  })

  return rawReservesTokenList
}
export async function fetchEmodeCategoriesForReserves(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  dataProviderContractAbi: Abi,
  dataProviderContractAddress: IAddress,
) {
  const contractCalls = tokensList.map((token) => ({
    abi: dataProviderContractAbi as Abi,
    address: dataProviderContractAddress.value,
    functionName: 'getReserveEModeCategory' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}
export async function fetchAssetConfigurationData(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  dataProviderContractAbi: Abi,
  dataProviderContractAddress: IAddress,
) {
  const contractCalls = tokensList.map((token) => ({
    abi: dataProviderContractAbi as Abi,
    address: dataProviderContractAddress.value,
    functionName: 'getReserveConfigurationData' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}

export async function fetchReservesCap(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  dataProviderContractAbi: Abi,
  dataProviderContractAddress: IAddress,
) {
  const contractCalls = tokensList.map((token) => ({
    abi: dataProviderContractAbi as Abi,
    address: dataProviderContractAddress.value,
    functionName: 'getReserveCaps' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}
export async function fetchAssetReserveData(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  dataProviderContractAbi: Abi,
  dataProviderContractAddress: IAddress,
) {
  const contractCalls = tokensList.map((token) => ({
    abi: dataProviderContractAbi as Abi,
    address: dataProviderContractAddress.value,
    functionName: 'getReserveData' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}

export async function fetchAssetPrices(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  dataProviderContractAbi: Abi,
  dataProviderContractAddress: IAddress,
) {
  const contractCalls = [
    {
      abi: dataProviderContractAbi as Abi,
      address: dataProviderContractAddress.value,
      functionName: 'getAssetsPrices',
      args: [tokensList.map((token) => token.address.value)],
    },
  ] as const

  return ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}
