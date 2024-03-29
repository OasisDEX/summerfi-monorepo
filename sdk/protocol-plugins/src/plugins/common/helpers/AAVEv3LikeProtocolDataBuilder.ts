import { Address, HexData, Token } from '@summerfi/sdk-common/common'
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
  fetchEmodeCategoriesForReserves,
  fetchAssetReserveData,
  fetchAssetPrices,
  fetchReservesTokens,
} from './AAVEv3LikeDataFetchers'
import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'

interface QueuedOperation<T> {
  operation: () => Promise<T>
}

export class AaveV3LikeProtocolDataBuilder<AssetListItemType> {
  private readonly ctx: IProtocolPluginContext
  private operations: QueuedOperation<void>[] = []
  private tokensUsedAsReserves: Token[] | undefined
  private reservesAssetsList: Array<WithToken<AssetListItemType>> = []
  private readonly protocolName: AllowedProtocolNames

  constructor(ctx: IProtocolPluginContext, protocolName: AllowedProtocolNames) {
    this.ctx = ctx
    this.protocolName = protocolName
  }

  async init(): Promise<AaveV3LikeProtocolDataBuilder<WithToken<AssetListItemType>>> {
    const rawTokens = await fetchReservesTokens(this.ctx, this.protocolName)
    this._validateReservesTokens(rawTokens)

    const tokensUsedAsReserves = await Promise.all(
      rawTokens.map(async (reservesToken) => {
        return await this.ctx.tokenService.getTokenByAddress(
          Address.createFromEthereum({ value: reservesToken.tokenAddress }),
        )
      }),
    )

    return Object.assign(
      new AaveV3LikeProtocolDataBuilder<WithToken<AssetListItemType>>(this.ctx, this.protocolName),
      this,
      {
        tokensUsedAsReserves,
        reservesAssetsList: tokensUsedAsReserves.map((token) => ({ token })),
      },
    )
  }

  addReservesCaps(): AaveV3LikeProtocolDataBuilder<WithReservesCaps<AssetListItemType>> {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const reservesCapsPerAsset = await fetchReservesCap(
          this.ctx,
          this.tokensUsedAsReserves!,
          this.protocolName,
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
    return this as AaveV3LikeProtocolDataBuilder<WithReservesCaps<AssetListItemType>>
  }

  addReservesConfigData(): AaveV3LikeProtocolDataBuilder<WithReservesConfig<AssetListItemType>> {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const reservesConfigDataPerAsset = await fetchAssetConfigurationData(
          this.ctx,
          this.tokensUsedAsReserves,
          this.protocolName,
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
    return this as AaveV3LikeProtocolDataBuilder<WithReservesConfig<AssetListItemType>>
  }

  addReservesData(): AaveV3LikeProtocolDataBuilder<WithReservesData<AssetListItemType>> {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const reservesDataPerAsset = await fetchAssetReserveData(
          this.ctx,
          this.tokensUsedAsReserves,
          this.protocolName,
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
    return this as AaveV3LikeProtocolDataBuilder<WithReservesData<AssetListItemType>>
  }

  addEmodeCategories(): AaveV3LikeProtocolDataBuilder<WithEmode<AssetListItemType>> {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const emodeCategoryPerAsset = await fetchEmodeCategoriesForReserves(
          this.ctx,
          this.tokensUsedAsReserves,
          this.protocolName,
        )
        this._assertMatchingArrayLengths(emodeCategoryPerAsset, this.reservesAssetsList)
        const nextReservesList = []
        for (const [index, asset] of this.reservesAssetsList.entries()) {
          const emodeCategoryForAsset = emodeCategoryPerAsset[index]
          const assetWithEmode = {
            ...asset,
            emode: emodeCategoryForAsset,
          }
          nextReservesList.push(assetWithEmode)
        }
        this.reservesAssetsList = nextReservesList
      },
    }
    this.operations.push(operation)
    return this as AaveV3LikeProtocolDataBuilder<WithEmode<AssetListItemType>>
  }

  addPrices(): AaveV3LikeProtocolDataBuilder<WithPrice<AssetListItemType>> {
    const operation: QueuedOperation<void> = {
      operation: async () => {
        this._assertIsInitialised(this.tokensUsedAsReserves)
        const [assetPrices] = await fetchAssetPrices(
          this.ctx,
          this.tokensUsedAsReserves,
          this.protocolName,
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
    return this as AaveV3LikeProtocolDataBuilder<WithPrice<AssetListItemType>>
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
  emode: bigint,
): T[] {
  // All reserves allowed for category 0n
  if (emode === 0n) {
    return assetsList
  }

  return assetsList.filter((asset) => asset.emode === emode)
}
