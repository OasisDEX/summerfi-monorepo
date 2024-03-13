import {
    AaveV3LikeContracts,
    ProtocolManagerContext,
} from '../interfaces'
import { HexData } from "@summerfi/sdk-common/common"
import { Address, Token } from "@summerfi/sdk-common/common"
import { ProtocolName } from "@summerfi/sdk-common/protocols"

type ReservesConfigData = {
    decimals: bigint
    ltv: bigint
    liquidationThreshold: bigint
    liquidationBonus: bigint
    reserveFactor: bigint
    usageAsCollateralEnabled: boolean
    borrowingEnabled: boolean
    isActive: boolean
    isFrozen: boolean
}
type ReservesCap = {
    borrowCap: bigint
    supplyCap: bigint
}
type ReservesData = {
    unbacked: bigint
    accruedToTreasuryScaled: bigint
    totalAToken: bigint
    totalStableDebt: bigint
    totalVariableDebt: bigint
    liquidityRate: bigint
    variableBorrowRate: bigint
    stableBorrowRate: bigint
    averageStableBorrowRate: bigint
    liquidityIndex: bigint
    variableBorrowIndex: bigint
    lastUpdateTimestamp: bigint
}
type EmodeCategory = bigint
type OraclePrice = bigint

type AllowedProtocolNames = ProtocolName.Spark | ProtocolName.AAVEv3

interface QueuedOperation<T> {
    operation: () => Promise<T>;
    typeMarker?: T;
}

export class AaveV3LikePluginBuilder<AssetListType>  {
    private readonly ctx: ProtocolManagerContext;
    private operations: QueuedOperation<void>[] = [];
    private tokensUsedAsReserves: Token[] | undefined
    private reservesAssetsList: Array<AssetListType & { token: Token}> = []

    constructor(ctx: ProtocolManagerContext, private readonly protocolName: AllowedProtocolNames) {
        this.ctx = ctx;
    }

    async init(): Promise<AaveV3LikePluginBuilder<AssetListType & { token: Token }>> {
        const rawTokens = await fetchReservesTokens(this.ctx, this.protocolName);
        this._validateReservesTokens(rawTokens);

        const tokensUsedAsReserves = await Promise.all(rawTokens.map(async (reservesToken) => {
            return await this.ctx.tokenService.getTokenByAddress(Address.createFrom({ value: reservesToken.tokenAddress }));
        }));

        return Object.assign(new AaveV3LikePluginBuilder<AssetListType & { token: Token }>(this.ctx, this.protocolName), this, {
            tokensUsedAsReserves,
            reservesAssetsList: tokensUsedAsReserves.map(token => ({token})),
        });
    }

    addReservesCaps(): AaveV3LikePluginBuilder<AssetListType & { caps: ReservesCap }> {
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
        return this as AaveV3LikePluginBuilder<AssetListType & { caps: ReservesCap }>;
    }

    addReservesConfigData(): AaveV3LikePluginBuilder<AssetListType & { config: ReservesConfigData }> {
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
        return this as AaveV3LikePluginBuilder<AssetListType & { config: ReservesConfigData }>;
    }

    addReservesData(): AaveV3LikePluginBuilder<AssetListType & { data: ReservesData }> {
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
        return this as AaveV3LikePluginBuilder<AssetListType & { data: ReservesData }>;
    }

    addEmodeCategories(): AaveV3LikePluginBuilder<AssetListType & { emode: EmodeCategory }> {
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
        return this as AaveV3LikePluginBuilder<AssetListType & { emode: EmodeCategory }>;
    }

    addPrices(): AaveV3LikePluginBuilder<AssetListType & { price: OraclePrice }> {
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
        return this as AaveV3LikePluginBuilder<AssetListType & { price: OraclePrice }>;
    }

    async build(): Promise<AssetListType[]> {
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

// EXTRACTORS
async function fetchReservesTokens(ctx: ProtocolManagerContext, protocolName: AllowedProtocolNames) {
    const aaveV3LikePoolDataProviderDef = ctx.contractProvider.getContractDef(AaveV3LikeContracts.POOL_DATA_PROVIDER, protocolName)
    const [
        rawReservesTokenList
    ] = await ctx.provider.multicall({
        contracts: [
            {
                abi: aaveV3LikePoolDataProviderDef.abi,
                address: aaveV3LikePoolDataProviderDef.address,
                functionName: "getAllReservesTokens",
                args: []
            },
        ],
        allowFailure: false
    })

    return rawReservesTokenList
}
async function fetchEmodeCategoriesForReserves(ctx: ProtocolManagerContext, tokensList: Token[], protocolName: AllowedProtocolNames) {
    const aaveV3LikePoolDataProviderDef = ctx.contractProvider.getContractDef(AaveV3LikeContracts.POOL_DATA_PROVIDER, protocolName)
    const contractCalls = tokensList.map(token => ({
        abi: aaveV3LikePoolDataProviderDef.abi,
        address: aaveV3LikePoolDataProviderDef.address,
        functionName: "getReserveEModeCategory" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchAssetConfigurationData(ctx: ProtocolManagerContext, tokensList: Token[], protocolName: AllowedProtocolNames) {
    const aaveV3LikePoolDataProviderDef = ctx.contractProvider.getContractDef(AaveV3LikeContracts.POOL_DATA_PROVIDER, protocolName)
    const contractCalls = tokensList.map(token => ({
        abi: aaveV3LikePoolDataProviderDef.abi,
        address: aaveV3LikePoolDataProviderDef.address,
        functionName: "getReserveConfigurationData" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchReservesCap(ctx: ProtocolManagerContext, tokensList: Token[], protocolName: AllowedProtocolNames) {
    const aaveV3LikePoolDataProviderDef = ctx.contractProvider.getContractDef(AaveV3LikeContracts.POOL_DATA_PROVIDER, protocolName)
    const contractCalls = tokensList.map(token => ({
        abi: aaveV3LikePoolDataProviderDef.abi,
        address: aaveV3LikePoolDataProviderDef.address,
        functionName: "getReserveCaps" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchAssetReserveData(ctx: ProtocolManagerContext, tokensList: Token[], protocolName: AllowedProtocolNames) {
    const aaveV3LikePoolDataProviderDef = ctx.contractProvider.getContractDef(AaveV3LikeContracts.POOL_DATA_PROVIDER, protocolName)
    const contractCalls = tokensList.map(token => ({
        abi: aaveV3LikePoolDataProviderDef.abi,
        address: aaveV3LikePoolDataProviderDef.address,
        functionName: "getReserveData" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchAssetPrices(ctx: ProtocolManagerContext, tokensList: Token[], protocolName: AllowedProtocolNames) {
    const aaveV3LikeOracleDef = ctx.contractProvider.getContractDef(AaveV3LikeContracts.ORACLE, protocolName)
    const contractCalls = [
        {
            abi: aaveV3LikeOracleDef.abi,
            address: aaveV3LikeOracleDef.address,
            functionName: "getAssetsPrices",
            args: [tokensList.map(token => token.address.value)]
        }
    ] as const

    return ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}

// FILTERS
export function filterAssetsListByEMode<T extends { emode: EmodeCategory }>(assetsList: T[], emode: bigint): T[] {
    // All reserves allowed for category 0n
    if (emode === 0n) {
        return assetsList
    }

    return assetsList.filter(asset => asset.emode === emode)
}