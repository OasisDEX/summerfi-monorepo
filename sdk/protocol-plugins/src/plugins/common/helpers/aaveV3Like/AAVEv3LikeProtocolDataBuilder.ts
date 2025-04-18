import { Address, HexData, Token, IAddress, IChainInfo } from '@summerfi/sdk-common'
import {
  AllowedProtocolNames,
  WithToken,
  WithReservesCaps,
  WithEmode,
  WithPrice,
  WithReservesConfig,
  WithReservesData,
  EmodeCategory,
} from './AAVEv3LikeBuilderTypes'
import {
  fetchReservesCap,
  fetchAssetConfigurationData,
  // fetchEmodeCategoriesForReserves,
  fetchAssetReserveData,
  fetchAssetPrices,
  fetchReservesTokens,
} from './AAVEv3LikeDataFetchers'
import { ChainContractsProvider, GenericAbiMap } from '../../../utils/ChainContractProvider'
import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { Abi } from 'viem'

interface QueuedOperation<T> {
  operation: () => Promise<T>
}

export class AaveV3LikeProtocolDataBuilder<
  AssetListItemType,
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
> {
  private readonly context: IProtocolPluginContext
  private operations: QueuedOperation<void>[] = []
  private tokensUsedAsReserves: Token[] | undefined
  private reservesAssetsList: Array<WithToken<AssetListItemType>> = []
  private dataProviderContractAbi: Abi = []
  private dataProviderContractAddress: IAddress = Address.ZeroAddressEthereum
  private oracleContractAbi: Abi = []
  private oracleContractAddress: IAddress = Address.ZeroAddressEthereum

  private readonly protocolName: AllowedProtocolNames
  private readonly chainInfo: IChainInfo
  private readonly chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>
  private readonly dataProviderContractName: ContractNames
  private readonly oracleContractName: ContractNames

  constructor(
    ctx: IProtocolPluginContext,
    protocolName: AllowedProtocolNames,
    chainInfo: IChainInfo,
    chainContractsProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>,
    dataProviderContractName: ContractNames,
    oracleContractName: ContractNames,
  ) {
    this.context = ctx
    this.protocolName = protocolName
    this.chainInfo = chainInfo
    this.chainContractsProvider = chainContractsProvider
    this.dataProviderContractName = dataProviderContractName
    this.oracleContractName = oracleContractName
  }

  async init(): Promise<
    AaveV3LikeProtocolDataBuilder<WithToken<AssetListItemType>, ContractNames, ContractsAbiMap>
  > {
    // Data provider
    const dataProviderContractAbi = this.chainContractsProvider.getContractAbi(
      this.dataProviderContractName,
    )
    if (!dataProviderContractAbi) {
      throw new Error(`${this.dataProviderContractName} ABI not found`)
    }
    this.dataProviderContractAbi = dataProviderContractAbi

    const dataProviderContractAddress = await this.context.addressBookManager.getAddressByName({
      chainInfo: this.chainInfo,
      name: this.dataProviderContractName,
    })
    if (!dataProviderContractAddress) {
      throw new Error(
        `${this.dataProviderContractName} address not found in address book for chain ${this.chainInfo}`,
      )
    }
    this.dataProviderContractAddress = dataProviderContractAddress

    // Oracle
    const oracleContractAbi = this.chainContractsProvider.getContractAbi(this.oracleContractName)
    if (!oracleContractAbi) {
      throw new Error(`${this.oracleContractName} ABI not found`)
    }
    this.oracleContractAbi = oracleContractAbi

    const oracleContractAddress = await this.context.addressBookManager.getAddressByName({
      chainInfo: this.chainInfo,
      name: this.oracleContractName,
    })
    if (!oracleContractAddress) {
      throw new Error(
        `${this.oracleContractName} address not found in address book for chain ${this.chainInfo}`,
      )
    }
    this.oracleContractAddress = oracleContractAddress

    const rawTokens = await fetchReservesTokens(
      this.context,
      this.dataProviderContractAbi,
      this.dataProviderContractAddress,
    )
    this._validateReservesTokens(rawTokens)

    const tokensUsedAsReservesWithUndefined = await Promise.all(
      rawTokens.map(async (reservesToken) => {
        const token = await this.context.tokensManager.getTokenByAddress({
          chainInfo: this.chainInfo,
          address: Address.createFromEthereum({ value: reservesToken.tokenAddress }),
        })
        if (!token) {
          console.error(
            `Protocol token not found in SDK token list for address ${reservesToken.tokenAddress} while processing AaveLike protocol data`,
          )
        }
        return token
      }),
    )

    const tokensUsedAsReserves = tokensUsedAsReservesWithUndefined.filter(
      (token): token is Token => token !== undefined,
    )

    return Object.assign(
      new AaveV3LikeProtocolDataBuilder<
        WithToken<AssetListItemType>,
        ContractNames,
        ContractsAbiMap
      >(
        this.context,
        this.protocolName,
        this.chainInfo,
        this.chainContractsProvider,
        this.dataProviderContractName,
        this.oracleContractName,
      ),
      this,
      {
        tokensUsedAsReserves,
        reservesAssetsList: tokensUsedAsReserves.map((token) => ({ token })),
      },
    )
  }

  async buildAll(): Promise<AssetListItemType[]> {
    return await this.addReservesCaps()
      .addReservesConfigData()
      .addReservesData()
      .addEmodeCategories()
      .addPrices()
      .build()
  }

  addReservesCaps(): AaveV3LikeProtocolDataBuilder<
    WithReservesCaps<AssetListItemType>,
    ContractNames,
    ContractsAbiMap
  > {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const reservesCapsPerAsset = await fetchReservesCap(
          this.context,
          this.tokensUsedAsReserves!,
          this.dataProviderContractAbi,
          this.dataProviderContractAddress,
        )
        this._assertMatchingArrayLengths(reservesCapsPerAsset, this.reservesAssetsList)
        const nextReservesList = []
        for (const [index, asset] of this.reservesAssetsList.entries()) {
          const reservesCapForAsset = reservesCapsPerAsset[index]
          const [borrowCap, supplyCap] = reservesCapForAsset as [bigint, bigint]
          const assetWithReserveCaps = {
            ...asset,
            caps: {
              borrowCap,
              supplyCap,
            },
          }
          nextReservesList.push(assetWithReserveCaps)
        }
        this.reservesAssetsList = nextReservesList
      },
    }
    this.operations.push(operation)
    return this as AaveV3LikeProtocolDataBuilder<
      WithReservesCaps<AssetListItemType>,
      ContractNames,
      ContractsAbiMap
    >
  }

  addReservesConfigData(): AaveV3LikeProtocolDataBuilder<
    WithReservesConfig<AssetListItemType>,
    ContractNames,
    ContractsAbiMap
  > {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const reservesConfigDataPerAsset = await fetchAssetConfigurationData(
          this.context,
          this.tokensUsedAsReserves,
          this.dataProviderContractAbi,
          this.dataProviderContractAddress,
        )
        this._assertMatchingArrayLengths(reservesConfigDataPerAsset, this.reservesAssetsList)
        const nextReservesList = []
        for (const [index, asset] of this.reservesAssetsList.entries()) {
          const configDataForAsset = reservesConfigDataPerAsset[index]
          const [
            decimals,
            ltv,
            liquidationThreshold,
            liquidationBonus,
            reserveFactor,
            usageAsCollateralEnabled,
            borrowingEnabled /*stableBorrowRateEnabled*/,
            ,
            isActive,
            isFrozen,
          ] = configDataForAsset as [
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
          ]
          const assetWithConfigurationData = {
            ...asset,
            config: {
              decimals,
              ltv,
              liquidationThreshold,
              liquidationBonus,
              reserveFactor,
              usageAsCollateralEnabled,
              borrowingEnabled,
              isActive,
              isFrozen,
            },
          }
          nextReservesList.push(assetWithConfigurationData)
        }
        this.reservesAssetsList = nextReservesList
      },
    }
    this.operations.push(operation)
    return this as AaveV3LikeProtocolDataBuilder<
      WithReservesConfig<AssetListItemType>,
      ContractNames,
      ContractsAbiMap
    >
  }

  addReservesData(): AaveV3LikeProtocolDataBuilder<
    WithReservesData<AssetListItemType>,
    ContractNames,
    ContractsAbiMap
  > {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const reservesDataPerAsset = await fetchAssetReserveData(
          this.context,
          this.tokensUsedAsReserves,
          this.dataProviderContractAbi,
          this.dataProviderContractAddress,
        )
        this._assertMatchingArrayLengths(reservesDataPerAsset, this.reservesAssetsList)
        const nextReservesList = []
        for (const [index, asset] of this.reservesAssetsList.entries()) {
          const reservesDataForAsset = reservesDataPerAsset[index]
          const [
            unbacked,
            accruedToTreasuryScaled,
            totalAToken,
            totalStableDebt,
            totalVariableDebt,
            liquidityRate,
            variableBorrowRate,
            stableBorrowRate,
            averageStableBorrowRate,
            liquidityIndex,
            variableBorrowIndex,
            lastUpdateTimestamp,
          ] = reservesDataForAsset as [
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
          ]
          const assetWithReservesData = {
            ...asset,
            data: {
              unbacked,
              accruedToTreasuryScaled,
              totalAToken,
              totalStableDebt,
              totalVariableDebt,
              liquidityRate,
              variableBorrowRate,
              stableBorrowRate,
              averageStableBorrowRate,
              liquidityIndex,
              variableBorrowIndex,
              lastUpdateTimestamp,
            },
          }
          nextReservesList.push(assetWithReservesData)
        }
        this.reservesAssetsList = nextReservesList
      },
    }
    this.operations.push(operation)
    return this as AaveV3LikeProtocolDataBuilder<
      WithReservesData<AssetListItemType>,
      ContractNames,
      ContractsAbiMap
    >
  }

  addEmodeCategories(): AaveV3LikeProtocolDataBuilder<
    WithEmode<AssetListItemType>,
    ContractNames,
    ContractsAbiMap
  > {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        // const emodeCategoryPerAsset = await fetchEmodeCategoriesForReserves(
        //   this.context,
        //   this.tokensUsedAsReserves,
        //   this.dataProviderContractAbi,
        //   this.dataProviderContractAddress,
        // )
        // this._assertMatchingArrayLengths(emodeCategoryPerAsset, this.reservesAssetsList)
        const nextReservesList = []
        for (const [, asset] of this.reservesAssetsList.entries()) {
          // const emodeCategoryForAsset = emodeCategoryPerAsset[index]
          const assetWithEmode = {
            ...asset,
            emode: 0, // hardcoded for now as we need to figure out
            // how the new aave emode should work now
          }
          nextReservesList.push(assetWithEmode)
        }
        this.reservesAssetsList = nextReservesList
      },
    }
    this.operations.push(operation)
    return this as AaveV3LikeProtocolDataBuilder<
      WithEmode<AssetListItemType>,
      ContractNames,
      ContractsAbiMap
    >
  }

  addPrices(): AaveV3LikeProtocolDataBuilder<
    WithPrice<AssetListItemType>,
    ContractNames,
    ContractsAbiMap
  > {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const [assetPrices] = await fetchAssetPrices(
          this.context,
          this.tokensUsedAsReserves,
          this.oracleContractAbi,
          this.oracleContractAddress,
        )
        this._assertMatchingArrayLengths(assetPrices as unknown[], this.reservesAssetsList)
        const nextReservesList = []
        for (const [index, asset] of this.reservesAssetsList.entries()) {
          const oraclePriceForAsset = (assetPrices as unknown[])[index]
          const assetWithPrice = {
            ...asset,
            price: oraclePriceForAsset,
          }
          nextReservesList.push(assetWithPrice)
        }

        this.reservesAssetsList = nextReservesList
      },
    }
    this.operations.push(operation)
    return this as AaveV3LikeProtocolDataBuilder<
      WithPrice<AssetListItemType>,
      ContractNames,
      ContractsAbiMap
    >
  }

  async build(): Promise<AssetListItemType[]> {
    try {
      for (const op of this.operations) {
        await op.operation()
      }
      return this.reservesAssetsList
    } catch (error) {
      console.error('An error occurred during reserves data processing:', error)
      throw new Error(`An error occurred during reserves data processing: ${JSON.stringify(error)}`)
    }
  }

  private _assertIsInitialised(
    tokensUsedAsReserves: Token[] | undefined,
  ): asserts tokensUsedAsReserves is Token[] {
    if (!tokensUsedAsReserves) {
      throw new Error('AaveV3LikePluginBuilder not initialised with tokensUsedAsReserves')
    }
  }

  private _validateReservesTokens(
    rawTokens: unknown,
  ): asserts rawTokens is { tokenAddress: HexData }[] {
    if (!Array.isArray(rawTokens)) {
      throw new Error('Invalid token address list')
    }

    for (const tokenItem of rawTokens) {
      if (
        typeof tokenItem !== 'object' ||
        tokenItem === null ||
        typeof tokenItem.tokenAddress !== 'string' ||
        !Address.isValid(tokenItem.tokenAddress)
      ) {
        throw new Error(
          `Invalid token item or tokenAddress not found: ${JSON.stringify(tokenItem)}`,
        )
      }
    }
  }

  private _assertMatchingArrayLengths(
    dataArray1: readonly unknown[],
    dataArray2: readonly unknown[],
  ) {
    if (dataArray1.length !== dataArray2.length) {
      throw new Error('Arrays must be of identical length')
    }
  }
}

// FILTERS
export function filterAssetsListByEMode<T extends { emode: EmodeCategory }>(
  assetsList: T[],
  emode: number,
): T[] {
  // All reserves allowed for category 0n
  if (emode === 0) {
    return assetsList
  }

  return assetsList.filter((asset) => Number(asset.emode) === emode)
}

export function filterAssetsListByToken<T extends { token: Token }>(
  assetsList: T[],
  token: Token,
): T[] {
  return assetsList.filter((asset) => asset.token.equals(token))
}
