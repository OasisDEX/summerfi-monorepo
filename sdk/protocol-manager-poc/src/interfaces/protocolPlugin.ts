import { Percentage, TokenAmount, TokenSymbol, Price, CurrencySymbol, RiskRatio } from "@summerfi/sdk-common/common"
import { IPool, LendingPool, PoolType, ProtocolName, /* IPoolId */ } from "@summerfi/sdk-common/protocols"
import { /* PositionId, */ Address, ChainInfo, Position, Token } from "@summerfi/sdk-common/common"
import { PublicClient, stringToHex } from "viem"
import { BigNumber } from 'bignumber.js'
import { VAT_ABI, SPOT_ABI, JUG_ABI, DOG_ABI, ILK_REGISTRY } from "./abis"

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
    return {
        supportedChains: [ChainId.Mainnet],
        getPoolId: (poolId: string): IPoolId => {
            return poolId as IPoolId
        },
        getPool: async (poolId: IPoolId): Promise<LendingPool> => {
            const ilkInHex = stringToHex(poolId, { size: 32 })

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
                liquidationPenalty: amountFromWei(chop - PRESISION_BI.WAD),
            }

            const collateralToken = await ctx.tokenService.getTokenByAddress(Address.createFrom({ value: gem }))
            const debtToken = await ctx.tokenService.getTokenBySymbol(TokenSymbol.DAI)

            const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
            BigNumber.config({ POW_PRECISION: 100 })
            const stabilityFee = jugRes.rawFee.pow(SECONDS_PER_YEAR).minus(1)

            return {
                type: PoolType.Lending,
                poolId: {
                    id: poolId as string
                },
                protocol: ProtocolName.Maker,
                collaterals: [
                    {
                        token: collateralToken,

                        price: Price.createFrom({ value: '0', baseToken: collateralToken, quoteToken: debtToken }), // TODO quote the OSM, we need to trick the contract that is is SPOT that is doing the query (from in tx is SPOT)
                        nextPrice: Price.createFrom({ value: spotRes.liquidationRatio.toString(), baseToken: collateralToken, quoteToken: debtToken }), // TODO
                        priceUSD: await ctx.priceService.getPriceUSD(collateralToken),

                        liquidationTreshold: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: 0 }), type: RiskRatio.type.CollateralizationRatio }),
                        tokensLocked: tokenAmountFromBaseUnit({token: collateralToken, amount: '0'}), // TODO chack the gem balance of join adapter
                        maxSupply: tokenAmountFromBaseUnit({token: collateralToken, amount: Number.MAX_SAFE_INTEGER.toString()}), // TODO in case of maker it is infinite 
                        liquidationPenalty: Percentage.createFrom({ percentage: dogRes.liquidationPenalty.toNumber() }),
                        apy: Percentage.createFrom({ percentage: 0 }),
                    }
                ], 
                debts: [
                    {
                        token: debtToken,

                        price: Price.createFrom({ value: '0', baseToken: debtToken, quoteToken: collateralToken }), // TODO
                        priceUSD: await ctx.priceService.getPriceUSD(debtToken),
                        rate: Percentage.createFrom({ percentage: stabilityFee.toNumber() }), 
                        totalBorrowed: tokenAmountFromBaseUnit({token: debtToken, amount: vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor).toString()}),
                        debtCeiling: tokenAmountFromBaseUnit({token: debtToken, amount: vatRes.debtCeiling.toString()}),
                        debtAvailable: tokenAmountFromBaseUnit({token: debtToken, amount:  vatRes.debtCeiling.minus(vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor)).toString()}),
                        dustLimit: tokenAmountFromBaseUnit({token: debtToken, amount: vatRes.debtFloor.toString()}),
                        originationFee: Percentage.createFrom({ percentage: 0 }),
                        variableRate: false,
                    }
                ],
                
                /*
                poolBaseCurrency: Currency [ETH, USD, DAI etc] DAI for Maker
                {
                    collaterals: {
                        [collateralTokenAddress]: {
                            lockedAmount: TokenAmount
                            price: Price
                            nextPrice: Price // only maker has this
                            priceUSD: Price
                            liquidationTreshold: Percentage
                            tokensLocked: TokenAmount
                            maxSupply: TokenAmount
                            liquidationPenalty: Percentage
                            apy: Percentage
                        }
                    }
                    debts: {
                        [debtTokenAddress]: {
                            borrowedAmount: TokenAmount
                            price: Price
                            priceUSD: Price
                            rate: Percentage
                            totalBorrowed: TokenAmount
                            debtCeiling: TokenAmount
                            debtAvailable: TokenAmount
                            dustLimit: TokenAmount
                            originationFee: Percentage
                            variableRate: boolean
                        }
                    }
                }
                */
            }
        },
        getPositionId: (positionId: string): IPositionId => {
            return positionId as IPositionId
        },
        getPosition: async (positionId: IPositionId): Promise<Position> => {
            throw new Error("Not implemented")
        }
    }
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