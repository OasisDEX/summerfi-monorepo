import {Address, HexData, Token} from "@summerfi/sdk-common/common"
import {ProtocolManagerContext} from '../interfaces'
import { AllowedProtocolNames, WithToken, WithReservesCaps, WithEmode, WithPrice, WithReservesConfig, WithReservesData, EmodeCategory } from "./AAVEv3LikeBuilderTypes";
import { fetchReservesCap, fetchAssetConfigurationData, fetchEmodeCategoriesForReserves, fetchAssetReserveData, fetchAssetPrices, fetchReservesTokens } from './AAVEv3LikeDataFetchers'

interface QueuedOperation<T> {
    operation: () => Promise<T>;
}

export class AaveV3LikePluginBuilder<AssetListItemType>  {
    private readonly ctx: ProtocolManagerContext;
    private operations: QueuedOperation<void>[] = [];
    private tokensUsedAsReserves: Token[] | undefined
    private reservesAssetsList: Array<WithToken<AssetListItemType>> = []
    private readonly protocolName: AllowedProtocolNames

    constructor(ctx: ProtocolManagerContext, protocolName: AllowedProtocolNames) {
        this.ctx = ctx;
        this.protocolName = protocolName
    }

    async init(): Promise<AaveV3LikePluginBuilder<WithToken<AssetListItemType>>> {
        const rawTokens = await fetchReservesTokens(this.ctx, this.protocolName);
        this._validateReservesTokens(rawTokens);

        const tokensUsedAsReserves = await Promise.all(rawTokens.map(async (reservesToken) => {
            return await this.ctx.tokenService.getTokenByAddress(Address.createFrom({ value: reservesToken.tokenAddress }));
        }));

        return Object.assign(new AaveV3LikePluginBuilder<WithToken<AssetListItemType>>(this.ctx, this.protocolName), this, {
            tokensUsedAsReserves,
            reservesAssetsList: tokensUsedAsReserves.map(token => ({ token })),
        });
    }

    addReservesCaps(): AaveV3LikePluginBuilder<WithReservesCaps<AssetListItemType>> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const reservesCapsPerAsset = await fetchReservesCap(this.ctx, this.tokensUsedAsReserves!, this.protocolName)
                this._assertMatchingArrayLengths(reservesCapsPerAsset, this.reservesAssetsList)
                const nextReservesList = []
                for (const [index, asset] of this.reservesAssetsList.entries()) {
                    const reservesCapForAsset = reservesCapsPerAsset[index]
                    const [borrowCap, supplyCap] = reservesCapForAsset
                    const assetWithReserveCaps = {
                        ...asset,
                        caps: {
                            borrowCap,
                            supplyCap
                        }
                    }
                    nextReservesList.push(assetWithReserveCaps)
                }
                this.reservesAssetsList = nextReservesList
            },
        };
        this.operations.push(operation);
        return this as AaveV3LikePluginBuilder<WithReservesCaps<AssetListItemType>>;
    }

    addReservesConfigData(): AaveV3LikePluginBuilder<WithReservesConfig<AssetListItemType>> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const reservesConfigDataPerAsset = await fetchAssetConfigurationData(this.ctx, this.tokensUsedAsReserves, this.protocolName)
                this._assertMatchingArrayLengths(reservesConfigDataPerAsset, this.reservesAssetsList)
                const nextReservesList = []
                for (const [index, asset] of this.reservesAssetsList.entries()) {
                    const configDataForAsset = reservesConfigDataPerAsset[index]
                    const [decimals, ltv, liquidationThreshold, liquidationBonus, reserveFactor, usageAsCollateralEnabled, borrowingEnabled, /*stableBorrowRateEnabled*/, isActive, isFrozen] = configDataForAsset
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
                            isFrozen
                        }
                    }
                    nextReservesList.push(assetWithConfigurationData)
                }
                this.reservesAssetsList = nextReservesList
            },
        };
        this.operations.push(operation);
        return this as AaveV3LikePluginBuilder<WithReservesConfig<AssetListItemType>>;
    }

    addReservesData(): AaveV3LikePluginBuilder<WithReservesData<AssetListItemType>> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const reservesDataPerAsset = await fetchAssetReserveData(this.ctx, this.tokensUsedAsReserves, this.protocolName)
                this._assertMatchingArrayLengths(reservesDataPerAsset, this.reservesAssetsList)
                const nextReservesList = []
                for (const [index, asset] of this.reservesAssetsList.entries()) {
                    const reservesDataForAsset = reservesDataPerAsset[index]
                    const [unbacked,
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
                        lastUpdateTimestamp] = reservesDataForAsset
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
                            lastUpdateTimestamp
                        }
                    }
                    nextReservesList.push(assetWithReservesData)
                }
                this.reservesAssetsList = nextReservesList
            },
        };
        this.operations.push(operation);
        return this as AaveV3LikePluginBuilder<WithReservesData<AssetListItemType>>;
    }

    addEmodeCategories(): AaveV3LikePluginBuilder<WithEmode<AssetListItemType>> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const emodeCategoryPerAsset = await fetchEmodeCategoriesForReserves(this.ctx, this.tokensUsedAsReserves, this.protocolName)
                this._assertMatchingArrayLengths(emodeCategoryPerAsset, this.reservesAssetsList)
                const nextReservesList = []
                for (const [index, asset] of this.reservesAssetsList.entries()) {
                    const emodeCategoryForAsset = emodeCategoryPerAsset[index]
                    const assetWithEmode = {
                        ...asset,
                        emode: emodeCategoryForAsset
                    }
                    nextReservesList.push(assetWithEmode)
                }
                this.reservesAssetsList = nextReservesList
            },
        };
        this.operations.push(operation);
        return this as AaveV3LikePluginBuilder<WithEmode<AssetListItemType>>;
    }

    addPrices(): AaveV3LikePluginBuilder<WithPrice<AssetListItemType>> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const [assetPrices] = await fetchAssetPrices(this.ctx, this.tokensUsedAsReserves, this.protocolName)
                this._assertMatchingArrayLengths(assetPrices, this.reservesAssetsList)
                const nextReservesList = []
                for (const [index, asset] of this.reservesAssetsList.entries()) {
                    const oraclePriceForAsset = assetPrices[index]
                    const assetWithPrice = {
                        ...asset,
                        price: oraclePriceForAsset
                    }
                    nextReservesList.push(assetWithPrice)
                }

                this.reservesAssetsList = nextReservesList
            },
        };
        this.operations.push(operation);
        return this as AaveV3LikePluginBuilder<WithPrice<AssetListItemType>>;
    }

    async build(): Promise<AssetListItemType[]> {
        try {
            for (const op of this.operations) {
                await op.operation();
            }
            return this.reservesAssetsList
        } catch (error) {
            console.error('An error occurred during reserves data processing:', error);
            throw new Error(`An error occurred during reserves data processing: ${JSON.stringify(error)}`)
        }
    }

    private _assertIsInitialised(tokensUsedAsReserves: Token[] | undefined): asserts tokensUsedAsReserves is Token[] {
        if (!tokensUsedAsReserves) {
            throw new Error("AaveV3LikePluginBuilder not initialised with tokensUsedAsReserves");
        }
    }

    private _validateReservesTokens(rawTokens: unknown): asserts rawTokens is { tokenAddress: HexData }[] {
        if (!Array.isArray(rawTokens)) {
            throw new Error("Invalid token address list");
        }

        for (const tokenItem of rawTokens) {
            if (typeof tokenItem !== 'object' || tokenItem === null || typeof tokenItem.tokenAddress !== 'string' || !Address.isValid(tokenItem.tokenAddress)) {
                throw new Error(`Invalid token item or tokenAddress not found: ${JSON.stringify(tokenItem)}`);
            }
        }
    }

    private _assertMatchingArrayLengths(dataArray1: readonly unknown[], dataArray2: readonly unknown[]) {
        if (dataArray1.length !== dataArray2.length) {
            throw new Error("Arrays must be of identical length")
        }
    }
}

// FILTERS
export function filterAssetsListByEMode<T extends { emode: EmodeCategory }>(assetsList: T[], emode: bigint): T[] {
    // All reserves allowed for category 0n
    if (emode === 0n) {
        return assetsList
    }

    return assetsList.filter(asset => asset.emode === emode)
}