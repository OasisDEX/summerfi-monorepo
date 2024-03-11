import {ProtocolManagerContext, SparkContracts} from "./protocolPlugin";
import { HexData } from "@summerfi/sdk-common/common"
import { Address, Token } from "@summerfi/sdk-common/common"
import {
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
                validateReservesCaps(reservesCapsPerAsset);
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
                validateReservesConfigData(reservesConfigDataPerAsset);
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
                validateReservesData(reservesDataPerAsset);
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
                validateEmodeCategories(emodeCategoryPerAsset);
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
                console.log("emode nextReservesList", nextReservesList)
                this.reservesAssetsList = nextReservesList
            },
        };
        this.operations.push(operation);
        return this as SparkPluginBuilder<T & { emode: EmodeCategory }>;
    }

    async build(): Promise<T[]> {
        try {
            for (const op of this.operations) {
                console.log("this.reservesAssetsList", this.reservesAssetsList)
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

    private _assertMatchingArrayLengths(dataArray1: unknown[], dataArray2: unknown[]) {
        if (dataArray1.length !== dataArray2.length) {
            throw new Error("Arrays must be of identical length")
        }
    }
}

/**
 * Processes tokens for Spark Protocol given a specific eMode. This involves fetching reserves tokens,
 * enriching them with additional data like configuration and borrow/supply caps, and finally filtering
 * them based on eMode categories. If any step fails, the function will catch the error,
 * log it, and re-throw a more descriptive error.
 *
 * @param ctx The context containing services and other information needed to process tokens.
 * @param emode The eMode identifier used to filter the tokens list accordingly.
 * @returns A promise that resolves to the final list of processed tokens.
 */
export async function gatherReservesAssetList(ctx: ProtocolManagerContext, emode: bigint) {
    try {
        // Fetch and process the initial list of reserves tokens.
        // This involves validating the raw reserves tokens and converting them into a more usable form.
        const tokensList = await fetchAndProcessReservesTokens(ctx);

        // Enrich the tokens list with additional data such as reserve configuration details and caps.
        // This step adds more information to each token, making them ready for final processing.
        const enrichedAssetsList = await enrichAssetsList(ctx, tokensList);

        // Finalise the tokens list by filtering each based on eMode categories.
        const finalAssetsList = await finaliseReservesList(ctx, enrichedAssetsList, emode);

        return finalAssetsList;
    } catch (error) {
        console.error('An error occurred during token processing:', error);
        throw new Error(`An error occurred during token processing: ${JSON.stringify(error)}`)
    }
}

// PROCESSING STEPS
async function fetchAndProcessReservesTokens(ctx: ProtocolManagerContext) {
    const rawTokens = await fetchReservesTokens(ctx);
    validateReservesTokens(rawTokens);

    const tokensList = await Promise.all(rawTokens.map(async reservesToken => {
        const token = await ctx.tokenService.getTokenByAddress(Address.createFrom({ value: reservesToken.tokenAddress}));
        return token;
    }));
    return tokensList;
}
async function enrichAssetsList(ctx: ProtocolManagerContext, tokensList: Token[]): Promise<{token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData}[]> {
    const reservesConfigData = await fetchAssetConfigurationData(ctx, tokensList);
    validateReservesConfigData(reservesConfigData);

    const tokensListWithConfig = addConfigDataToList(reservesConfigData, tokensList);

    const reservesCaps = await fetchReservesCap(ctx, tokensList);
    validateReservesCaps(reservesCaps);

    const assetsListWithCaps = addReservesCapsToList(reservesCaps, tokensListWithConfig);

    const reservesData = await fetchAssetReserveData(ctx, tokensList)
    validateReservesData(reservesData);

    const assetsListWithReservesData = addReservesDataToList(reservesData, assetsListWithCaps);
    return assetsListWithReservesData;
}
export async function finaliseReservesList(ctx: ProtocolManagerContext, assetsList: {token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData}[], emode: bigint): Promise<{token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData}[]> {
    const emodeCategories = await fetchEmodeCategoriesForReserves(ctx, assetsList.map(a => a.token));
    return filterAssetsListByEMode(emodeCategories, assetsList, emode);
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
    const contractCalls = []
    for (const token of tokensList) {
        contractCalls.push({
            abi: POOL_DATA_PROVIDER,
            address: SparkContracts.POOL_DATA_PROVIDER,
            functionName: "getReserveEModeCategory",
            args: [token.address.value]
        })
    }

    return await ctx.provider.multicall({
        contracts: contractCalls as never[],
        allowFailure: false
    })
}
async function fetchAssetConfigurationData(ctx: ProtocolManagerContext, tokensList: Token[]): Promise<unknown[]> {
    const contractCalls = []
    for (const token of tokensList) {
        contractCalls.push({
            abi: POOL_DATA_PROVIDER,
            address: SparkContracts.POOL_DATA_PROVIDER,
            functionName: "getReserveConfigurationData",
            args: [token.address.value]
        })
    }

    return await ctx.provider.multicall({
        contracts: contractCalls as never[],
        allowFailure: false
    }) as unknown[]
}
async function fetchReservesCap(ctx: ProtocolManagerContext, tokensList: Token[]): Promise<unknown[]> {
    const contractCalls = []
    for (const token of tokensList) {
        contractCalls.push({
            abi: POOL_DATA_PROVIDER,
            address: SparkContracts.POOL_DATA_PROVIDER,
            functionName: "getReserveCaps",
            args: [token.address.value]
        })
    }

    return await ctx.provider.multicall({
        contracts: contractCalls as never[],
        allowFailure: false
    }) as unknown[]
}
async function fetchAssetReserveData(ctx: ProtocolManagerContext, tokensList: Token[]): Promise<unknown[]> {
    const contractCalls = []
    for (const token of tokensList) {
        contractCalls.push({
            abi: POOL_DATA_PROVIDER,
            address: SparkContracts.POOL_DATA_PROVIDER,
            functionName: "getReserveData",
            args: [token.address.value]
        })
    }

    return await ctx.provider.multicall({
        contracts: contractCalls as never[],
        allowFailure: false
    }) as unknown[]
}

// TRANSFORMERS
function addConfigDataToList(reservesConfigData: RawReservesConfigData[], tokensList: Token[]): { token: Token, config: ReservesConfigData}[] {
    if (reservesConfigData.length !== tokensList.length) {
        // Order is assumed to be preserved
        throw new Error("Arrays must be of identical length")
    }

    const assetListWithConfigurationData: { token: Token, config: ReservesConfigData }[] = []
    for (const [index, token] of tokensList.entries()) {
        const configDataForAsset = reservesConfigData[index]
        const [decimals, ltv, liquidationThreshold, liquidationBonus, reserveFactor, usageAsCollateralEnabled, borrowingEnabled, /*stableBorrowRateEnabled*/, isActive, isFrozen] = configDataForAsset
        const assetWithConfigurationData = {
            token: token,
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
        assetListWithConfigurationData.push(assetWithConfigurationData)
    }

    return assetListWithConfigurationData;
}
function addReservesCapsToList(reservesCaps: RawAssetCaps[], assetsList: {token: Token, config: ReservesConfigData }[]): { token: Token, config: ReservesConfigData, caps: ReservesCap}[] {
    if (reservesCaps.length !== assetsList.length) {
        throw new Error("Arrays must be of identical length")
    }
    const assetsListWithReserveCaps: { token: Token, config: ReservesConfigData, caps: ReservesCap }[] = []
    for (const [index, asset] of assetsList.entries()) {
        const reservesCapForToken = reservesCaps[index]
        const [borrowCap, supplyCap] = reservesCapForToken
        const assetWithReserveCaps = {
            ...asset,
            caps: {
                borrowCap,
                supplyCap
            }
        }
        assetsListWithReserveCaps.push(assetWithReserveCaps)
    }
    return assetsListWithReserveCaps;
}
function addReservesDataToList(reservesData: RawReservesData[], assetsList: {token: Token, config: ReservesConfigData, caps: ReservesCap}[]): { token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData}[] {
    if (reservesData.length !== assetsList.length) {
        // Order is assumed to be preserved
        throw new Error("Arrays must be of identical length")
    }
    const assetsListWithReservesData: { token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData }[] = []
    for (const [index, asset] of assetsList.entries()) {
        const reservesDataForAsset = reservesData[index]
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
        assetsListWithReservesData.push(assetWithReservesData)
    }

    return assetsListWithReservesData;
}
function filterAssetsListByEMode(emodeCategories: bigint[], assetsList: {token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData}[], emode: bigint): { token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData }[] {
    if (emodeCategories.length !== assetsList.length) {
        throw new Error("Cannot filter by eMode with two arrays of different length")
    }

    // All reserves allowed for category 0n
    if (emode === 0n) {
        return assetsList
    }

    return assetsList.filter((asset, idx) => {
        const emodeForAsset = emodeCategories[idx];
        return emodeForAsset === emode
    })
}

export function simpleFilterAssetsListByEMode<T extends { emode: EmodeCategory }>(assetsList: T[], emode: bigint): T[] {
    // All reserves allowed for category 0n
    if (emode === 0n) {
        return assetsList
    }

    return assetsList.filter(asset => asset.emode === emode)
}

// GUARDS
type RawReservesConfigData = [
    bigint, // decimals
    bigint, // ltv
    bigint, // liquidationThreshold
    bigint, // liquidationBonus
    bigint, // reserveFactor
    boolean, // usageAsCollateralEnabled
    boolean, // borrowingEnabled
    boolean, // stableBorrowRateEnabled
    boolean, // isActive
    boolean // isFrozen
];
type RawAssetCaps = [
    bigint, // borrowCap
    bigint, // supplyCap
]
type RawReservesData = [
    bigint, // unbacked
    bigint, // accruedToTreasuryScaled
    bigint, // totalAToken
    bigint, // totalStableDebt
    bigint, // totalVariableDebt
    bigint, // liquidityRate
    bigint, // variableBorrowRate
    bigint, // stableBorrowRate
    bigint, // averageStableBorrowRate
    bigint, // liquidityIndex
    bigint, // variableBorrowIndex
    bigint, // lastUpdateTimestamp
]
function validateReservesTokens(tokenAddressList: unknown): asserts tokenAddressList is { tokenAddress: HexData }[] {
    if (!Array.isArray(tokenAddressList)) {
        throw new Error("Invalid token address list")
    }

    for (const tokenItem of tokenAddressList) {
        // Check if tokenItem is an object and has a tokenAddress property of type string
        if (typeof tokenItem !== 'object' || tokenItem === null || typeof (tokenItem as { tokenAddress: string }).tokenAddress !== 'string') {
            throw new Error(`Invalid token item or tokenAddress not found: ${JSON.stringify(tokenItem)}`);
        }

        if (!Address.isValid(tokenItem.tokenAddress)) {
            throw new Error("TokenAddress is not valid address")
        }
    }
}
function validateReservesConfigData(rawReservesConfigData: unknown[]): asserts rawReservesConfigData is RawReservesConfigData[] {
    for (const configData of rawReservesConfigData) {
        validateConfigData(configData)
    }
}
function validateConfigData(reserveConfigData: unknown): asserts reserveConfigData is RawReservesConfigData {
    if (!Array.isArray(reserveConfigData) || reserveConfigData.length !== 10) {
        throw new Error("Reserves data invalid")
    }

    const [decimals, ltv, liquidationThreshold, liquidationBonus, reserveFactor, usageAsCollateralEnabled, borrowingEnabled, stableBorrowRateEnabled, isActive, isFrozen] = reserveConfigData;

    // Check if all numerical values are of type bigint
    const areNumericValuesCorrect = [decimals, ltv, liquidationThreshold, liquidationBonus, reserveFactor].every(item => typeof item === 'bigint');

    // Check if all boolean values are of type boolean
    const areBooleanValuesCorrect = [usageAsCollateralEnabled, borrowingEnabled, stableBorrowRateEnabled, isActive, isFrozen].every(item => typeof item === 'boolean');

    if(!(areNumericValuesCorrect && areBooleanValuesCorrect)) {
        throw new Error("Reserves data invalid")
    };
}
function validateReservesCaps(rawReservesCaps: unknown[]): asserts rawReservesCaps is RawAssetCaps[] {
    for (const assetCaps of rawReservesCaps) {
        validateAssetCaps(assetCaps)
    }
}
function validateAssetCaps(assetCaps: unknown): asserts assetCaps is RawAssetCaps {
    if (!Array.isArray(assetCaps) || assetCaps.length !== 2) {
        throw new Error("Reserves assets caps data invalid")
    }

    const [borrowCap, supplyCap] = assetCaps;
    const areNumericValuesCorrect = [borrowCap, supplyCap].every(item => typeof item === 'bigint');

    if(!(areNumericValuesCorrect)) {
        throw new Error("Reserves assets caps data invalid")
    };
}
function validateReservesData(rawReservesData: unknown[]): asserts rawReservesData is RawReservesData[] {
    for (const assetReservesData of rawReservesData) {
        validateAssetReservesData(assetReservesData)
    }
}
function validateAssetReservesData(rawAssetsReservesData: unknown): asserts rawAssetsReservesData is RawReservesData {
    if (!Array.isArray(rawAssetsReservesData) || rawAssetsReservesData.length !== 12) {
        throw new Error("Reserves data invalid")
    }

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
        lastUpdateTimestamp
    ] = rawAssetsReservesData;
    const areBigIntValuesCorrect = [
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
        variableBorrowIndex].every(item => typeof item === 'bigint');

    const areNumericValuesCorrect = [lastUpdateTimestamp].every(item => typeof item === 'number')

    if(!(areBigIntValuesCorrect && areNumericValuesCorrect)) {
        throw new Error("Reserves data invalid")
    };
}
function validateEmodeCategories(maybeCategories: unknown[]): asserts maybeCategories is bigint[]  {
    const areBigIntValuesCorrect = maybeCategories.every(item => typeof item === 'bigint');

    if(!areBigIntValuesCorrect) {
        throw new Error("Invalid emode categories")
    }
}