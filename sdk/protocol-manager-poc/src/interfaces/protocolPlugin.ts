import { AddressValue, HexData, Percentage, TokenAmount, TokenSymbol, Price, CurrencySymbol, RiskRatio } from "@summerfi/sdk-common/common"
import type {SparkPoolCollateralConfig, SparkPoolDebtConfig} from "@summerfi/sdk-common/protocols";
import { IPool, SparkLendingPool, MakerLendingPool, PoolType, ProtocolName, /* IPoolId */ } from "@summerfi/sdk-common/protocols"
import { /* PositionId, */ Address, ChainInfo, Position, Token } from "@summerfi/sdk-common/common"
import {PublicClient, stringToHex} from "viem"
import { BigNumber } from 'bignumber.js'
import {
    VAT_ABI,
    SPOT_ABI,
    JUG_ABI,
    DOG_ABI,
    ILK_REGISTRY,
    ORACLE_ABI,
    LENDING_POOL_ABI,
    POOL_DATA_PROVIDER
} from "./abis"

export type IPoolId = string & { __poolId: never }
export type IPositionId = string & { __positionID: never }

export interface ITokenService {
    getTokenByAddress: (address: Address) => Promise<Token>
    getTokenBySymbol: (symbol: TokenSymbol) => Promise<Token>
}

export interface IPriceService {
    getPrice: (args: {baseToken: Token, quoteToken: Token | CurrencySymbol}) => Promise<Price>
    getPriceUSD: (token: Token) => Promise<Price>
}

function tokenAmountFromBaseUnit({amount, token}: {amount: string, token: Token}): TokenAmount {
    return TokenAmount.createFromBaseUnit({token, amount})
}

export interface ProtocolManagerContext {
    provider: PublicClient,
    tokenService: ITokenService,
    priceService: IPriceService

}

export interface CreateProtocolPlugin {
    (ctx: ProtocolManagerContext): ProtocolPlugin
}

export enum ChainId {
    Mainnet = 1,
    Optimism = 10,
    Arbitrum = 42161,
    Sepolia = 31337,
}

export interface ProtocolPlugin {
    supportedChains: ChainId[]
    getPoolId: (poolId: string) => IPoolId
    getPool: (poolId: IPoolId) => Promise<IPool>
    getPositionId: (positionId: string) => IPositionId
    getPosition: (positionId: IPositionId) => Promise<Position>
}

/*
    We need some kind of address provider or contract provider that will 
    return the address of the contract together with abi

    contractProvider.getContract(MakerContracts.VAT)

*/

export const MakerContracts = {
    VAT: "0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b",
    SPOT: "0x65c79fcb50ca1594b025960e539ed7a9a6d434a3",
    JUG: "0x19c0976f590d67707e62397c87829d896dc0f1f1",
    DOG: "0x135954d155898d42c90d2a57824c690e0c7bef1b",
    ILK_REGISTRY: "0x5a464C28D19848f44199D003BeF5ecc87d090F87",
} as const

export const SparkContracts = {
    ORACLE: "0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9",
    LENDING_POOL: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
    POOL_DATA_PROVIDER: "0xFc21d6d146E6086B8359705C8b28512a983db0cb",
} as const

const PRESISION = {
    WAD: 18,
    RAY: 27,
    RAD: 45,
}

const PRESISION_BI = {
    WAD: 10n ** 18n,
    RAY: 10n ** 27n,
    RAD: 10n ** 45n,
}

const UNCAPPED_SUPPLY = Number.MAX_SAFE_INTEGER.toString()

function amountFromWei(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.WAD))
}

function amountFromRay(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAY))
}

function amountFromRad(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAD))
}

export const createMakerPlugin: CreateProtocolPlugin = (ctx: ProtocolManagerContext): ProtocolPlugin => {
    const plugin = {
        supportedChains: [ChainId.Mainnet],
        getPoolId: (poolId: string): IPoolId => {
            return poolId as IPoolId
        },
        getPool: async (poolId: IPoolId): Promise<MakerLendingPool> => {
            const ilkInHex = stringToHex(poolId, { size: 32 })
            const chainId = ctx.provider.chain?.id
            if (!chainId) throw new Error('ctx.provider.chain.id undefined')

            if (!plugin.supportedChains.includes(chainId)) {
                throw new Error(`Chain ID ${chainId} is not supported`);
            }

            const [
                {   0: art,         // Total Normalised Debt     [wad] needs to be multiplied by rate to get actual debt 
                                    // https://docs.makerdao.com/smart-contract-modules/rates-module
                    1: rate,        // Accumulated Rates         [ray]
                    2: spot,        // Price with Safety Margin  [ray]
                    3: line,        // Debt Ceiling              [rad] - max total debt
                    4: dust         // Urn Debt Floor            [rad] - minimum debt
                },
                {   0: _,           // Price feed address
                    1: mat          // Liquidation ratio [ray]
                },
                {   0: rawFee,      // Collateral-specific, per-second stability fee contribution [ray]
                    1: feeLastLevied// Time of last drip [unix epoch time]
                },
                {   0: clip,        // Liquidator
                    1: chop,        // Liquidation Penalty 
                    2: hole,        // Max DAI needed to cover debt+fees of active auctions per ilk [rad]
                    3: dirt         // Total DAI needed to cover debt+fees of active auctions [rad]
                },
                {   0: pos,         // Index in ilks array
                    1: join,        // DSS GemJoin adapter
                    2: gem,         // The collateral token contract
                    3: dec,         // Collateral token decimals
                    4: _class,      // Classification code (1 - clip, 2 - flip, 3+ - other)
                    5: pip,         // Token price oracle address
                    6: xlip,        // Auction contract
                    7: name,        // Token name
                    8: symbol       // Token symbol
                }
            ] = await ctx.provider.multicall({
                contracts: [
                    {
                        abi: VAT_ABI,
                        address: MakerContracts.VAT,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: SPOT_ABI,
                        address: MakerContracts.SPOT,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: JUG_ABI,
                        address: MakerContracts.JUG,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: DOG_ABI,
                        address: MakerContracts.DOG,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: ILK_REGISTRY,
                        address: MakerContracts.ILK_REGISTRY,
                        functionName: "ilkData",
                        args: [ilkInHex]
                    }
                ],
                allowFailure: false
            })

            const vatRes = {
                normalizedIlkDebt: amountFromWei(art),
                debtScalingFactor: amountFromRay(rate),
                maxDebtPerUnitCollateral: amountFromRay(spot),
                debtCeiling: amountFromRad(line),
                debtFloor: amountFromRad(dust),
            }

            const spotRes = {
                priceFeedAddress: Address.createFrom({ value: pip }),
                liquidationRatio: amountFromRay(mat),
            }

            const jugRes = { 
                rawFee: amountFromRay(rawFee),
                feeLastLevied: new BigNumber(feeLastLevied.toString()).times(1000),
            }

            const dogRes = {
                clipperAddress: Address.createFrom({ value: clip }),
                // EG 1.13 not 0.13
                liquidationPenalty: amountFromWei(chop - PRESISION_BI.WAD),
            }

            const collateralToken = await ctx.tokenService.getTokenByAddress(Address.createFrom({ value: gem }))
            const quoteToken = await ctx.tokenService.getTokenBySymbol(TokenSymbol.DAI)
            const poolBaseCurrencyToken = await ctx.tokenService.getTokenBySymbol(TokenSymbol.DAI)

            const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
            BigNumber.config({ POW_PRECISION: 100 })
            const stabilityFee = jugRes.rawFee.pow(SECONDS_PER_YEAR).minus(1)

            const collaterals =  {
                    [collateralToken.address.value]: {
                        token: collateralToken,
                        // TODO: quote the OSM, we need to trick the contract that is SPOT that is doing the query (from in tx is SPOT)
                        price: await ctx.priceService.getPrice({baseToken: collateralToken, quoteToken }),
                        // TODO
                        nextPrice: Price.createFrom({ value: spotRes.liquidationRatio.toString(), baseToken: collateralToken, quoteToken: quoteToken }), // TODO
                        priceUSD: await ctx.priceService.getPriceUSD(collateralToken),

                        // For Maker these fields are the same
                        liquidationThreshold: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: spotRes.liquidationRatio.times(100).toNumber() }), type: RiskRatio.type.CollateralizationRatio }),
                        maxLtv: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: spotRes.liquidationRatio.times(100).toNumber() }), type: RiskRatio.type.CollateralizationRatio }),

                        tokensLocked: tokenAmountFromBaseUnit({token: collateralToken, amount: '0'}), // TODO check the gem balance of join adapter
                        maxSupply: tokenAmountFromBaseUnit({token: collateralToken, amount: Number.MAX_SAFE_INTEGER.toString()}),
                        liquidationPenalty: Percentage.createFrom({ percentage: dogRes.liquidationPenalty.toNumber() }),
                        // apy: Percentage.createFrom({ percentage: 0 }),
                    }
                }
            console.log("stabilityFee", stabilityFee)
            console.log("stabilityFee.toNumber()", stabilityFee.toNumber())

            const debts = {
                [quoteToken.address.value]: {
                    token: quoteToken,
                    price: await ctx.priceService.getPrice({baseToken: quoteToken, quoteToken: collateralToken }),
                    priceUSD: await ctx.priceService.getPriceUSD(quoteToken),
                    rate: Percentage.createFrom({ percentage: stabilityFee.toNumber() }),
                    totalBorrowed: tokenAmountFromBaseUnit({token: quoteToken, amount: vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor).toString()}),
                    debtCeiling: tokenAmountFromBaseUnit({token: quoteToken, amount: vatRes.debtCeiling.toString()}),
                    debtAvailable: tokenAmountFromBaseUnit({token: quoteToken, amount:  vatRes.debtCeiling.minus(vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor)).toString()}),
                    dustLimit: tokenAmountFromBaseUnit({token: quoteToken, amount: vatRes.debtFloor.toString()}),
                    originationFee: Percentage.createFrom({ percentage: 0 })
                }
            }

            return {
                type: PoolType.Lending,
                poolId: {
                    id: poolId as string
                },
                // TODO: Get protocol by proper means
                protocol: {
                    name: ProtocolName.Maker,
                    chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
                },
                baseCurrency: poolBaseCurrencyToken,
                collaterals,
                debts
            }
        },
        getPositionId: (positionId: string): IPositionId => {
            return positionId as IPositionId
        },
        getPosition: async (positionId: IPositionId): Promise<Position> => {
            throw new Error("Not implemented")
        }
    }

    return plugin
}

export const createSparkPlugin: CreateProtocolPlugin = (ctx: ProtocolManagerContext): ProtocolPlugin => {
    const plugin = {
        supportedChains: [ChainId.Mainnet],
        getPoolId: (poolId: string): IPoolId => {
            return poolId as IPoolId
        },
        getPool: async (poolId: IPoolId): Promise<SparkLendingPool> => {
            const emode = BigInt(poolId)
            const chainId = ctx.provider.chain?.id
            if (!chainId) throw new Error('ctx.provider.chain.id undefined')

            if (!plugin.supportedChains.includes(chainId)) {
                throw new Error(`Chain ID ${chainId} is not supported`);
            }

            const reservesAssetsList = await gatherReservesAssetList(ctx, emode)

            // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
            const poolBaseCurrencyToken = CurrencySymbol.USD

            const collaterals: Record<AddressValue, SparkPoolCollateralConfig> = {}
            for (const asset of reservesAssetsList) {
                const { token: collateralToken, config: { usageAsCollateralEnabled, ltv, liquidationThreshold, liquidationBonus }, caps: { supplyCap }, data: { totalAToken } } = asset;
                // TODO: Remove Try/Catch once PriceService updated to use protocol oracle

                const LTV_TO_PERCENTAGE_DIVISOR = 100n

                try {
                    collaterals[collateralToken.address.value] = {
                        token: collateralToken,
                        // TODO: need to update price service to use protocol oracle
                        maxLtv: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: Number((ltv / LTV_TO_PERCENTAGE_DIVISOR).toString()) }), type: RiskRatio.type.LTV }),
                        price: await ctx.priceService.getPrice({baseToken: collateralToken, quoteToken: poolBaseCurrencyToken }),
                        priceUSD: await ctx.priceService.getPriceUSD(collateralToken),
                        liquidationThreshold: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: Number((liquidationThreshold / LTV_TO_PERCENTAGE_DIVISOR).toString()) }), type: RiskRatio.type.LTV }),
                        tokensLocked: tokenAmountFromBaseUnit({token: collateralToken, amount: totalAToken.toString()}),
                        maxSupply: TokenAmount.createFrom({token: collateralToken, amount: supplyCap === 0n ? UNCAPPED_SUPPLY : supplyCap.toString() }),
                        liquidationPenalty: Percentage.createFrom({ percentage: Number((liquidationBonus / LTV_TO_PERCENTAGE_DIVISOR).toString()) }),
                        usageAsCollateralEnabled,
                    }
                } catch (e) {
                    console.log("error in collateral loop", e)
                    continue;
                }
            }

            const debts: Record<AddressValue, SparkPoolDebtConfig> = {}
            for (const asset of reservesAssetsList) {
                const { token: quoteToken, config: { borrowingEnabled, reserveFactor }, caps: { borrowCap }, data: { totalVariableDebt, totalStableDebt, variableBorrowRate } } = asset;
                // TODO: Remove Try/Catch once PriceService updated to use protocol oracle
                if (quoteToken.symbol === TokenSymbol.WETH) {
                    // WETH can be used as collateral on Spark but not borrowed.
                    continue;
                }

                try {
                    const RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR = 10000n

                    const PRECISION_PRESERVING_OFFSET = 1000000n
                    const RATE_DIVISOR_TO_GET_PERCENTAGE = Number((PRECISION_PRESERVING_OFFSET - 100n).toString())
                    const rate = Number(((variableBorrowRate * PRECISION_PRESERVING_OFFSET) / PRESISION_BI.RAY).toString()) / RATE_DIVISOR_TO_GET_PERCENTAGE
                    const totalBorrowed = totalVariableDebt - totalStableDebt
                    debts[quoteToken.address.value] = {
                        token: quoteToken,
                        price: await ctx.priceService.getPrice({baseToken: quoteToken, quoteToken: poolBaseCurrencyToken }),
                        priceUSD: await ctx.priceService.getPriceUSD(quoteToken),
                        rate: Percentage.createFrom({ percentage: rate }),
                        totalBorrowed: tokenAmountFromBaseUnit({token: quoteToken, amount: totalBorrowed.toString() }),
                        debtCeiling: TokenAmount.createFrom({token: quoteToken, amount: borrowCap === 0n ? UNCAPPED_SUPPLY : borrowCap.toString() }),
                        debtAvailable: tokenAmountFromBaseUnit({token: quoteToken, amount: borrowCap === 0n ? UNCAPPED_SUPPLY : (borrowCap - totalBorrowed).toString() }),
                        dustLimit: tokenAmountFromBaseUnit({token: quoteToken, amount: '0' }),
                        originationFee: Percentage.createFrom({ percentage: Number((reserveFactor / RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR).toString()) }),
                        borrowingEnabled
                    }
                } catch (e) {
                    console.log("error in debt loop", e)
                    continue;
                }
            }

            // TODO: Resolve in a proper manner
            const chainInfo = ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })

            return {
                type: PoolType.Lending,
                poolId: {
                    id: poolId as string
                },
                // TODO: Get protocol by proper means
                protocol: {
                    name: ProtocolName.Maker,
                    chainInfo,
                },
                baseCurrency: CurrencySymbol.USD,
                collaterals,
                debts
            }
        },
        getPositionId: (positionId: string): IPositionId => {
            return positionId as IPositionId
        },
        getPosition: async (positionId: IPositionId): Promise<Position> => {
            throw new Error("Not implemented")
        }
    }

    return plugin
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
async function gatherReservesAssetList(ctx: ProtocolManagerContext, emode: bigint) {
    try {
        // Fetch and process the initial list of reserves tokens.
        // This involves validating the raw reserves tokens and converting them into a more usable form.
        const tokensList = await fetchAndProcessReservesTokens(ctx);

        // Enrich the tokens list with additional data such as reserve configuration details and caps.
        // This step adds more information to each token, making them ready for final processing.
        const enrichedAssetsList = await enrichAssetsList(ctx, tokensList);

        // Finalise the tokens list by filtering each based on eMode categories.
        const finalAssetsList = await finaliseReservesList(ctx, enrichedAssetsList, emode);

        console.log('Processed assets:', finalAssetsList);
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
async function finaliseReservesList(ctx: ProtocolManagerContext, assetsList: {token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData}[], emode: bigint): Promise<{token: Token, config: ReservesConfigData, caps: ReservesCap, data: ReservesData}[]> {
    const emodeCategories = await fetchEmodeCategoriesForReserves(ctx, assetsList);
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
async function fetchEmodeCategoriesForReserves(ctx: ProtocolManagerContext, reservesTokenList: {token: Token, config: ReservesConfigData, caps: ReservesCap}[]) {
    const contractCalls = []
    for (const {token} of reservesTokenList) {
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
function addReservesCapsToList(ReservesCap: RawAssetCaps[], assetsList: {token: Token, config: ReservesConfigData }[]): { token: Token, config: ReservesConfigData, caps: ReservesCap}[] {
    if (ReservesCap.length !== assetsList.length) {
        // Order is assumed to be preserved
        throw new Error("Arrays must be of identical length")
    }
    const assetsListWithReserveCaps: { token: Token, config: ReservesConfigData, caps: ReservesCap }[] = []
    for (const [index, asset] of assetsList.entries()) {
        const reservesCapForToken = ReservesCap[index]
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

/*
In order to get pool from protocol we need to know:

    Maker:
    ilk (ETH-A, WBTC-A, etc)

    Aave | Spark:
    eMode (0 - none, 1 - eth corelated, 2 - usd corelated) 

    in aave in general we have just one big pool, however we came to the conculsion
    that enabling eMode changes bahavior of a pool siginificantly, (avaialble assets, max ltvs are different)
    so we can assume that eMode category can be assigned as a pool id. Having that
    we will return all prices for all assets, rates for all debt tokens, 
    and ltv for collaterals in that pool regardless of the position debt and collateral.
    In my opinion such approuch best describes the reality of the protocol and matches our
    needs.

    Ajna
    poolId (pool address)

    Morpho
    marketId (market hex)

    Questions:

    - How to distinguish if we want to get lending or supply pool?

Getting pos

*/