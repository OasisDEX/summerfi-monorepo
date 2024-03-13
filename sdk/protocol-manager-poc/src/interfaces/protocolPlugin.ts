import { AddressValue, Percentage, TokenAmount, TokenSymbol, Price, CurrencySymbol, RiskRatio } from "@summerfi/sdk-common/common"
import type { SparkLendingPool, SparkPoolDebtConfig, SparkPoolCollateralConfig, SparkPoolId, LendingPool } from "@summerfi/sdk-common/protocols"
import { IPool, PoolType, ProtocolName, IPoolId, EmodeType } from "@summerfi/sdk-common/protocols"
import { /* PositionId, */ Address, Position, Token } from "@summerfi/sdk-common/common"
import {PublicClient} from "viem"
import { BigNumber } from 'bignumber.js'
import {
    filterAssetsListByEMode,
    SparkPluginBuilder
} from "./sparkPluginBuilder";
import { z } from 'zod'

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

export interface CreateProtocolPlugin<GenericPoolId extends IPoolId> {
    (ctx: ProtocolManagerContext): ProtocolPlugin<GenericPoolId>
}

export enum ChainId {
    Mainnet = 1,
    Optimism = 10,
    Arbitrum = 42161,
    Sepolia = 31337,
}

export interface ProtocolPlugin<GenericPoolId extends IPoolId> {
    supportedChains: ChainId[]
    getPool: (poolId: GenericPoolId) => Promise<LendingPool>
    getPositionId: (positionId: string) => IPositionId
    getPosition: (positionId: IPositionId) => Promise<Position>
    _validate: (candidate: unknown) => asserts candidate is GenericPoolId
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

export const PRESISION_BI = {
    WAD: 10n ** 18n,
    RAY: 10n ** 27n,
    RAD: 10n ** 45n,
}

const UNCAPPED_SUPPLY = Number.MAX_SAFE_INTEGER.toString()

export function amountFromWei(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.WAD))
}

export function amountFromRay(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAY))
}

export function amountFromRad(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAD))
}

export const createSparkPlugin: CreateProtocolPlugin<SparkPoolId> = (ctx: ProtocolManagerContext): ProtocolPlugin<SparkPoolId> => {
    const plugin: ProtocolPlugin<SparkPoolId> = {
        supportedChains: [ChainId.Mainnet],
        getPool: async (sparkPoolId: unknown): Promise<SparkLendingPool> => {
            plugin._validate(sparkPoolId)
            const emode = sparkEmodeCategoryMap[sparkPoolId.emodeType]
            if (!emode && emode !== 0n) throw new Error('emode on poolId not recognised')

            const chainId = ctx.provider.chain?.id
            if (!chainId) throw new Error('ctx.provider.chain.id undefined')

            if (!plugin.supportedChains.includes(chainId)) {
                throw new Error(`Chain ID ${chainId} is not supported`);
            }

            const builder = await (new SparkPluginBuilder(ctx)).init();
            const reservesAssetsList = await builder
                .addPrices()
                .addReservesCaps()
                .addReservesConfigData()
                .addReservesData()
                .addEmodeCategories()
                .build()

            const filteredAssetsList = filterAssetsListByEMode(reservesAssetsList, emode)

            // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
            const poolBaseCurrencyToken = CurrencySymbol.USD

            const collaterals: Record<AddressValue, SparkPoolCollateralConfig> = {}
            for (const asset of filteredAssetsList) {
                const { token: collateralToken, config: { usageAsCollateralEnabled, ltv, liquidationThreshold, liquidationBonus }, caps: { supplyCap }, data: { totalAToken } } = asset;
                // TODO: Remove Try/Catch once PriceService updated to use protocol oracle

                const LTV_TO_PERCENTAGE_DIVISOR = 100n

                try {
                    collaterals[collateralToken.address.value] = {
                        token: collateralToken,
                        price: Price.createFrom({
                            baseToken: collateralToken,
                            quoteToken: poolBaseCurrencyToken,
                            value: asset.price.toString(),
                        }),
                        priceUSD: Price.createFrom({
                            baseToken: collateralToken,
                            quoteToken: CurrencySymbol.USD,
                            value: asset.price.toString(),
                        }),
                        maxLtv: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: Number((ltv / LTV_TO_PERCENTAGE_DIVISOR).toString()) }), type: RiskRatio.type.LTV }),
                        liquidationThreshold: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: Number((liquidationThreshold / LTV_TO_PERCENTAGE_DIVISOR).toString()) }), type: RiskRatio.type.LTV }),
                        tokensLocked: tokenAmountFromBaseUnit({token: collateralToken, amount: totalAToken.toString()}),
                        maxSupply: TokenAmount.createFrom({token: collateralToken, amount: supplyCap === 0n ? UNCAPPED_SUPPLY : supplyCap.toString() }),
                        liquidationPenalty: Percentage.createFrom({ percentage: Number((liquidationBonus / LTV_TO_PERCENTAGE_DIVISOR).toString()) }),
                        apy: Percentage.createFrom({ percentage: 0 }),
                        usageAsCollateralEnabled,
                    }
                } catch (e) {
                    console.log("error in collateral loop", e)
                    continue;
                }
            }

            const debts: Record<AddressValue, SparkPoolDebtConfig> = {}
            for (const asset of filteredAssetsList) {
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
                    const totalBorrowed = totalVariableDebt + totalStableDebt
                    debts[quoteToken.address.value] = {
                        token: quoteToken,
                        // TODO: If we further restricted pools we could have token pair prices
                        price: Price.createFrom({
                            baseToken: quoteToken,
                            quoteToken: poolBaseCurrencyToken,
                            value: new BigNumber(asset.price.toString()).toString(),
                        }),
                        priceUSD: Price.createFrom({
                            baseToken: quoteToken,
                            quoteToken: CurrencySymbol.USD,
                            value: new BigNumber(asset.price.toString()).toString(),
                        }),
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

            return {
                type: PoolType.Lending,
                poolId: sparkPoolId,
                protocol: sparkPoolId.protocol,
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
        },
        _validate: function (candidate: unknown): asserts candidate is SparkPoolId {
            const ProtocolNameEnum = z.nativeEnum(ProtocolName);
            const EmodeTypeEnum = z.nativeEnum(EmodeType);
            const ChainInfoType = z.object({
                name: z.string(),
                chainId: z.number()
            })

            const SparkPoolIdSchema = z.object({
                protocol: z.object({
                    name: ProtocolNameEnum,
                    chainInfo: ChainInfoType
                }),
                emodeType: EmodeTypeEnum
            });

            const parseResult = SparkPoolIdSchema.safeParse(candidate);
            if (!parseResult.success) {
                const errorDetails = parseResult.error.errors.map(error => `${error.path.join('.')} - ${error.message}`).join(', ');
                throw new Error(`Candidate is not the correct shape: ${errorDetails}`);
            }
        }
    }

    return plugin
}

const sparkEmodeCategoryMap: Record<EmodeType, bigint> = Object.keys(EmodeType).reduce<Record<EmodeType, bigint>>((accumulator, key, index) => {
    accumulator[EmodeType[key as keyof typeof EmodeType]] = BigInt(index);
    return accumulator;
}, {} as Record<EmodeType, bigint>);

/*
In order to get pool from protocol we need to know:

    Maker:
    ilk (ETH-A, WBTC-A, etc)

    Aave | Spark:
    eMode (0 - none, 1 - eth correlated, 2 - usd correlated)

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