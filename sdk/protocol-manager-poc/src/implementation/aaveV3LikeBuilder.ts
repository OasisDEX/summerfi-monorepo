import {ProtocolManagerContext, SparkContracts} from "./protocolPlugin";
import { HexData } from "@summerfi/sdk-common/common"
import { Address, Token } from "@summerfi/sdk-common/common"
import {
    ORACLE_ABI,
    POOL_DATA_PROVIDER
} from "./abis"

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

interface QueuedOperation<T> {
    operation: () => Promise<T>;
    typeMarker?: T;
}

export class SparkPluginBuilder<T>  {
    private readonly ctx: ProtocolManagerContext;
    private operations: QueuedOperation<void>[] = [];
    private tokensUsedAsReserves: Token[] | undefined
    private reservesAssetsList: Array<T & { token: Token}> = []

    constructor(ctx: ProtocolManagerContext) {
        this.ctx = ctx;
    }

    async init(): Promise<SparkPluginBuilder<T & { token: Token }>> {
        const rawTokens = await fetchReservesTokens(this.ctx);
        this._validateReservesTokens(rawTokens);

        const tokensUsedAsReserves = await Promise.all(rawTokens.map(async (reservesToken) => {
            const token = await this.ctx.tokenService.getTokenByAddress(Address.createFrom({ value: reservesToken.tokenAddress }));
            return token;
        }));

        return Object.assign(new SparkPluginBuilder<T & { token: Token }>(this.ctx), this, {
            tokensUsedAsReserves,
            reservesAssetsList: tokensUsedAsReserves.map(token => ({token})),
        });
    }

    addReservesCaps(): SparkPluginBuilder<T & { caps: ReservesCap }> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const reservesCapsPerAsset = await fetchReservesCap(this.ctx, this.tokensUsedAsReserves!)
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
        return this as SparkPluginBuilder<T & { caps: ReservesCap }>;
    }

    addReservesConfigData(): SparkPluginBuilder<T & { config: ReservesConfigData }> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const reservesConfigDataPerAsset = await fetchAssetConfigurationData(this.ctx, this.tokensUsedAsReserves)
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
        return this as SparkPluginBuilder<T & { config: ReservesConfigData }>;
    }

    addReservesData(): SparkPluginBuilder<T & { data: ReservesData }> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const reservesDataPerAsset = await fetchAssetReserveData(this.ctx, this.tokensUsedAsReserves)
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
        return this as SparkPluginBuilder<T & { data: ReservesData }>;
    }

    addEmodeCategories(): SparkPluginBuilder<T & { emode: EmodeCategory }> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const emodeCategoryPerAsset = await fetchEmodeCategoriesForReserves(this.ctx, this.tokensUsedAsReserves)
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
        return this as SparkPluginBuilder<T & { emode: EmodeCategory }>;
    }

    addPrices(): SparkPluginBuilder<T & { price: OraclePrice }> {
        const operation: QueuedOperation<void> = {
            operation: async () => {
                this._assertIsInitialised(this.tokensUsedAsReserves);
                const [assetPrices] = await fetchAssetPrices(this.ctx, this.tokensUsedAsReserves)
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
        return this as SparkPluginBuilder<T & { price: OraclePrice }>;
    }

    async build(): Promise<T[]> {
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
            throw new Error("SparkPluginBuilder not initialised with tokensUsedAsReserves");
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
async function fetchReservesTokens(ctx: ProtocolManagerContext) {
    const [
        rawReservesTokenList
    ] = await ctx.provider.multicall({
        contracts: [
            // TODO: move to PriceService
            // {
            //     abi: ORACLE_ABI,
            //     address: SparkContracts.ORACLE,
            //     functionName: "ilks",
            //     args: [ilkInHex]
            // },
            {
                abi: POOL_DATA_PROVIDER,
                address: SparkContracts.POOL_DATA_PROVIDER,
                functionName: "getAllReservesTokens",
                args: []
            },
        ],
        allowFailure: false
    })

    return rawReservesTokenList
}
async function fetchEmodeCategoriesForReserves(ctx: ProtocolManagerContext, tokensList: Token[]) {
    const contractCalls = tokensList.map(token => ({
        abi: POOL_DATA_PROVIDER,
        address: SparkContracts.POOL_DATA_PROVIDER,
        functionName: "getReserveEModeCategory" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchAssetConfigurationData(ctx: ProtocolManagerContext, tokensList: Token[]) {
    const contractCalls = tokensList.map(token => ({
        abi: POOL_DATA_PROVIDER,
        address: SparkContracts.POOL_DATA_PROVIDER,
        functionName: "getReserveConfigurationData" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchReservesCap(ctx: ProtocolManagerContext, tokensList: Token[]) {
    const contractCalls = tokensList.map(token => ({
        abi: POOL_DATA_PROVIDER,
        address: SparkContracts.POOL_DATA_PROVIDER,
        functionName: "getReserveCaps" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchAssetReserveData(ctx: ProtocolManagerContext, tokensList: Token[]) {
    const contractCalls = tokensList.map(token => ({
        abi: POOL_DATA_PROVIDER,
        address: SparkContracts.POOL_DATA_PROVIDER,
        functionName: "getReserveData" as const,
        args: [token.address.value]
    }))

    return await ctx.provider.multicall({
        contracts: contractCalls,
        allowFailure: false
    })
}
async function fetchAssetPrices(ctx: ProtocolManagerContext, tokensList: Token[]) {
    const contractCalls = [
        {
            abi: ORACLE_ABI,
            address: SparkContracts.ORACLE,
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

