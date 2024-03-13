import { BigNumber } from "bignumber.js";
import { stringToHex } from "viem";
import { z } from "zod";
import {
    ChainId,
    CreateProtocolPlugin,
    IPositionId, MakerContracts,
    ProtocolManagerContext,
    ProtocolPlugin
} from "../interfaces";
import { Percentage, TokenAmount, TokenSymbol, Price, RiskRatio } from "@summerfi/sdk-common/common"
import type { MakerLendingPool, MakerPoolId } from "@summerfi/sdk-common/protocols"
import { PoolType, ProtocolName, ILKType } from "@summerfi/sdk-common/protocols"
import { Address, Position } from "@summerfi/sdk-common/common"
import { PRESISION_BI , PRESISION } from './constants'

function amountFromWei(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.WAD))
}

function amountFromRay(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAY))
}

function amountFromRad(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAD))
}

export const createMakerPlugin: CreateProtocolPlugin<MakerPoolId> = (ctx: ProtocolManagerContext): ProtocolPlugin<MakerPoolId> => {
    const plugin: ProtocolPlugin<MakerPoolId> = {
        supportedChains: [ChainId.Mainnet],
        getPool: async (makerPoolId: unknown): Promise<MakerLendingPool> => {
            plugin._validate(makerPoolId)
            const ilk = makerPoolId.ilkType
            if (!ilk) throw new Error('Ilk type on poolId not recognised')
            const ilkInHex = stringToHex(ilk, { size: 32 })

            const chainId = ctx.provider.chain?.id
            if (!chainId) throw new Error('ctx.provider.chain.id undefined')

            if (!plugin.supportedChains.includes(chainId)) {
                throw new Error(`Chain ID ${chainId} is not supported`);
            }

            const makerDogDef = ctx.contractProvider.getContractDef(MakerContracts.DOG, makerPoolId.protocol.name)
            const makerVatDef = ctx.contractProvider.getContractDef(MakerContracts.VAT, makerPoolId.protocol.name)
            const makerSpotDef = ctx.contractProvider.getContractDef(MakerContracts.SPOT, makerPoolId.protocol.name)
            const makerJugDef = ctx.contractProvider.getContractDef(MakerContracts.JUG, makerPoolId.protocol.name)
            const makerIlkRegistryDef = ctx.contractProvider.getContractDef(MakerContracts.ILK_REGISTRY, makerPoolId.protocol.name)

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
                        abi: makerVatDef.abi,
                        address: makerVatDef.address,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: makerSpotDef.abi,
                        address: makerSpotDef.address,
                        functionName: "ilks" as const,
                        args: [ilkInHex]
                    },
                    {
                        abi: makerJugDef.abi,
                        address: makerJugDef.address,
                        functionName: "ilks" as const,
                        args: [ilkInHex]
                    },
                    {
                        abi: makerDogDef.abi,
                        address: makerDogDef.address,
                        functionName: "ilks" as const,
                        args: [ilkInHex]
                    },
                    {
                        abi: makerIlkRegistryDef.abi,
                        address: makerIlkRegistryDef.address,
                        functionName: "ilkData" as const,
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
                    nextPrice: Price.createFrom({ value: spotRes.liquidationRatio.toString(), baseToken: collateralToken, quoteToken: quoteToken }), // TODO
                    priceUSD: await ctx.priceService.getPriceUSD(collateralToken),

                    // For Maker these fields are the same
                    liquidationThreshold: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: spotRes.liquidationRatio.times(100).toNumber() }), type: RiskRatio.type.CollateralizationRatio }),
                    maxLtv: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: spotRes.liquidationRatio.times(100).toNumber() }), type: RiskRatio.type.CollateralizationRatio }),

                    tokensLocked: TokenAmount.createFrom({token: collateralToken, amount: '0'}), // TODO check the gem balance of join adapter
                    maxSupply: TokenAmount.createFrom({token: collateralToken, amount: Number.MAX_SAFE_INTEGER.toString()}),
                    liquidationPenalty: Percentage.createFrom({ percentage: dogRes.liquidationPenalty.toNumber() }),
                    // apy: Percentage.createFrom({ percentage: 0 }),
                }
            }

            const debts = {
                [quoteToken.address.value]: {
                    token: quoteToken,
                    price: await ctx.priceService.getPrice({baseToken: quoteToken, quoteToken: collateralToken }),
                    priceUSD: await ctx.priceService.getPriceUSD(quoteToken),
                    rate: Percentage.createFrom({ percentage: stabilityFee.times(100).toNumber() }),
                    totalBorrowed: TokenAmount.createFrom({token: quoteToken, amount: vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor).toString()}),
                    debtCeiling: TokenAmount.createFrom({token: quoteToken, amount: vatRes.debtCeiling.toString()}),
                    debtAvailable: TokenAmount.createFrom({token: quoteToken, amount:  vatRes.debtCeiling.minus(vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor)).toString()}),
                    dustLimit: TokenAmount.createFrom({token: quoteToken, amount: vatRes.debtFloor.toString()}),
                    originationFee: Percentage.createFrom({ percentage: 0 })
                }
            }

            return {
                type: PoolType.Lending,
                poolId: makerPoolId,
                protocol: makerPoolId.protocol,
                baseCurrency: poolBaseCurrencyToken,
                collaterals,
                debts
            }
        },
        getPositionId: (positionId: string): IPositionId => {
            return positionId as IPositionId
        },
        getPosition: async (positionId: IPositionId): Promise<Position> => {
            throw new Error(`Not implemented ${positionId}`)
        },
        _validate: function (candidate: unknown): asserts candidate is MakerPoolId {
            const ProtocolNameEnum = z.nativeEnum(ProtocolName);
            const IlkTypeEnum = z.nativeEnum(ILKType);
            const ChainInfoType = z.object({
                name: z.string(),
                chainId: z.number()
            })

            const SparkPoolIdSchema = z.object({
                protocol: z.object({
                    name: ProtocolNameEnum,
                    chainInfo: ChainInfoType
                }),
                ilkType: IlkTypeEnum
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