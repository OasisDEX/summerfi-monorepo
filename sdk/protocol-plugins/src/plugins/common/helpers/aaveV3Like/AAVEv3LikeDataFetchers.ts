import { Token } from '@summerfi/sdk-common/common'
import { IChainInfo } from '@summerfi/sdk-common'
import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { ChainContractsProvider, GenericAbiMap } from '../../../utils/ChainContractProvider'
import { Abi } from 'viem'

export async function fetchReservesTokens<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
>(
  ctx: IProtocolPluginContext,
  chainInfo: IChainInfo,
  chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>,
) {
  const contractAbi = chainContractsProvider.getContractAbi('PoolDataProvider' as ContractNames)
  if (!contractAbi) {
    throw new Error('PoolDataProvider ABI not found')
  }

  const contractAddress = await ctx.addressBookManager.getAddressByName({
    chainInfo,
    name: 'PoolDataProvider',
  })
  if (!contractAddress) {
    throw new Error(`PoolDataProvider address not found in address book for chain ${chainInfo}`)
  }

  const [rawReservesTokenList] = await ctx.provider.multicall({
    contracts: [
      {
        abi: contractAbi as Abi,
        address: contractAddress.value,
        functionName: 'getAllReservesTokens',
        args: [],
      },
    ],
    allowFailure: false,
  })

  return rawReservesTokenList
}
export async function fetchEmodeCategoriesForReserves<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
>(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  chainInfo: IChainInfo,
  chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>,
) {
  const contractAbi = chainContractsProvider.getContractAbi('PoolDataProvider' as ContractNames)
  if (!contractAbi) {
    throw new Error('PoolDataProvider ABI not found')
  }

  const contractAddress = await ctx.addressBookManager.getAddressByName({
    chainInfo,
    name: 'PoolDataProvider',
  })
  if (!contractAddress) {
    throw new Error(`PoolDataProvider address not found in address book for chain ${chainInfo}`)
  }

  const contractCalls = tokensList.map((token) => ({
    abi: contractAbi as Abi,
    address: contractAddress.value,
    functionName: 'getReserveEModeCategory' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}
export async function fetchAssetConfigurationData<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
>(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  chainInfo: IChainInfo,
  chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>,
) {
  const contractAbi = chainContractsProvider.getContractAbi('PoolDataProvider' as ContractNames)
  if (!contractAbi) {
    throw new Error('PoolDataProvider ABI not found')
  }

  const contractAddress = await ctx.addressBookManager.getAddressByName({
    chainInfo,
    name: 'PoolDataProvider',
  })
  if (!contractAddress) {
    throw new Error(`PoolDataProvider address not found in address book for chain ${chainInfo}`)
  }

  const contractCalls = tokensList.map((token) => ({
    abi: contractAbi as Abi,
    address: contractAddress.value,
    functionName: 'getReserveConfigurationData' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}

export async function fetchReservesCap<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
>(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  chainInfo: IChainInfo,
  chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>,
) {
  const contractAbi = chainContractsProvider.getContractAbi('PoolDataProvider' as ContractNames)
  if (!contractAbi) {
    throw new Error('PoolDataProvider ABI not found')
  }

  const contractAddress = await ctx.addressBookManager.getAddressByName({
    chainInfo,
    name: 'PoolDataProvider',
  })
  if (!contractAddress) {
    throw new Error(`PoolDataProvider address not found in address book for chain ${chainInfo}`)
  }

  const contractCalls = tokensList.map((token) => ({
    abi: contractAbi as Abi,
    address: contractAddress.value,
    functionName: 'getReserveCaps' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}
export async function fetchAssetReserveData<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
>(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  chainInfo: IChainInfo,
  chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>,
) {
  const contractAbi = chainContractsProvider.getContractAbi('PoolDataProvider' as ContractNames)
  if (!contractAbi) {
    throw new Error('PoolDataProvider ABI not found')
  }

  const contractAddress = await ctx.addressBookManager.getAddressByName({
    chainInfo,
    name: 'PoolDataProvider',
  })
  if (!contractAddress) {
    throw new Error(`PoolDataProvider address not found in address book for chain ${chainInfo}`)
  }

  const contractCalls = tokensList.map((token) => ({
    abi: contractAbi as Abi,
    address: contractAddress.value,
    functionName: 'getReserveData' as const,
    args: [token.address.value],
  }))

  return await ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}

export async function fetchAssetPrices<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
>(
  ctx: IProtocolPluginContext,
  tokensList: Token[],
  chainInfo: IChainInfo,
  chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>,
) {
  const contractAbi = chainContractsProvider.getContractAbi('Oracle' as ContractNames)
  if (!contractAbi) {
    throw new Error('PoolDataProvider ABI not found')
  }

  const contractAddress = await ctx.addressBookManager.getAddressByName({
    chainInfo,
    name: 'Oracle',
  })
  if (!contractAddress) {
    throw new Error(`PoolDataProvider address not found in address book for chain ${chainInfo}`)
  }

  const contractCalls = [
    {
      abi: contractAbi as Abi,
      address: contractAddress.value,
      functionName: 'getAssetsPrices',
      args: [tokensList.map((token) => token.address.value)],
    },
  ] as const

  return ctx.provider.multicall({
    contracts: contractCalls,
    allowFailure: false,
  })
}
