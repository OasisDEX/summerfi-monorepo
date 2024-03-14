import { Percentage, TokenAmount, TokenSymbol, Price, RiskRatio } from "@summerfi/sdk-common/common";
import type { MakerLendingPool, MakerPoolCollateralConfig, MakerPoolDebtConfig, MakerPoolId } from "@summerfi/sdk-common/protocols";
import { PoolType, ProtocolName, ILKType } from "@summerfi/sdk-common/protocols";
import { Address, Position } from "@summerfi/sdk-common/common";
import { stringToHex, getContract } from "viem";
import { BigNumber } from 'bignumber.js';
import { z } from 'zod';
import {
    OSM_ABI,
    ERC20_ABI
} from "../interfaces/abis";
import { PRECISION_BI, PRECISION } from "./constants";
import { ProtocolManagerContext, ProtocolPlugin, ChainId, IPositionId } from "../interfaces/ProtocolPlugin";

class MakerPlugin implements ProtocolPlugin<MakerPoolId> {
    public readonly protocol = ProtocolName.Maker;
    public supportedChains = [ChainId.Mainnet]

    async getPool(makerPoolId: unknown, ctx: ProtocolManagerContext): Promise<MakerLendingPool> {
        this.isPoolId(makerPoolId);
        const ilk = makerPoolId.ilkType;
        const ilkInHex = stringToHex(ilk, { size: 32 });

        const chainId = ctx.provider.chain?.id;
        if (!chainId) throw new Error('ctx.provider.chain.id undefined');

        if (!this.supportedChains.includes(chainId)) {
            throw new Error(`Chain ID ${chainId} is not supported`);
        }

        const makerDogDef = ctx.contractProvider.getContractDef('Dog', makerPoolId.protocol.name)
        const makerVatDef = ctx.contractProvider.getContractDef('Vat', makerPoolId.protocol.name)
        const makerSpotDef = ctx.contractProvider.getContractDef('Spot', makerPoolId.protocol.name)
        const makerJugDef = ctx.contractProvider.getContractDef('McdJug', makerPoolId.protocol.name)
        const makerIlkRegistryDef = ctx.contractProvider.getContractDef('IlkRegistry', makerPoolId.protocol.name)

        const [
            { 0: art, // Total Normalised Debt     [wad] needs to be multiplied by rate to get actual debt 
                // https://docs.makerdao.com/smart-contract-modules/rates-module
                1: rate, // Accumulated Rates         [ray]
                2: spot, // Price with Safety Margin  [ray]
                3: line, // Debt Ceiling              [rad] - max total debt
                4: dust // Urn Debt Floor            [rad] - minimum debt
            }, { 0: _, // Price feed address
                1: mat // Liquidation ratio [ray]
            }, { 0: rawFee, // Collateral-specific, per-second stability fee contribution [ray]
                1: feeLastLevied // Time of last drip [unix epoch time]
            }, { 0: clip, // Liquidator
                1: chop, // Liquidation Penalty 
                2: hole, // Max DAI needed to cover debt+fees of active auctions per ilk [rad]
                3: dirt // Total DAI needed to cover debt+fees of active auctions [rad]
            }, { 0: pos, // Index in ilks array
                1: join, // DSS GemJoin adapter
                2: gem, // The collateral token contract
                3: dec, // Collateral token decimals
                4: _class, // Classification code (1 - clip, 2 - flip, 3+ - other)
                5: pip, // Token price oracle address
                6: xlip, // Auction contract
                7: name, // Token name
                8: symbol // Token symbol
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
        });

        const vatRes = {
            normalizedIlkDebt: amountFromWei(art),
            debtScalingFactor: amountFromRay(rate),
            maxDebtPerUnitCollateral: amountFromRay(spot),
            debtCeiling: amountFromRad(line),
            debtFloor: amountFromRad(dust),
        };

        const spotRes = {
            priceFeedAddress: Address.createFrom({ value: pip }),
            liquidationRatio: amountFromRay(mat),
        };

        const jugRes = {
            rawFee: amountFromRay(rawFee),
            feeLastLevied: new BigNumber(feeLastLevied.toString()).times(1000),
        };

        const dogRes = {
            clipperAddress: Address.createFrom({ value: clip }),
            // EG 1.13 not 0.13
            liquidationPenalty: amountFromWei(chop - PRECISION_BI.WAD),
        };

        const osm = getContract({
            abi: OSM_ABI,
            address: spotRes.priceFeedAddress.value,
            client: ctx.provider
        });

        const erc20 = getContract({
            abi: ERC20_ABI,
            address: gem,
            client: ctx.provider
        });

        const [[peek], [peep], zzz, hop, joinGemBalance, collateralToken, quoteToken, poolBaseCurrencyToken] = await Promise.all([
            osm.read.peek({ account: makerSpotDef.address }),
            osm.read.peep({ account: makerSpotDef.address }),
            osm.read.zzz({ account: makerSpotDef.address }),
            osm.read.hop({ account: makerSpotDef.address }),
            erc20.read.balanceOf([join]),
            ctx.tokenService.getTokenByAddress(Address.createFrom({ value: gem })),
            ctx.tokenService.getTokenBySymbol(TokenSymbol.DAI),
            ctx.tokenService.getTokenBySymbol(TokenSymbol.DAI)
        ]);

        const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;
        BigNumber.config({ POW_PRECISION: 100 });
        const stabilityFee = jugRes.rawFee.pow(SECONDS_PER_YEAR).minus(1);
        
        const osmData = {
            currentPrice: new BigNumber(peek).shiftedBy(-18).toPrecision(collateralToken.decimals, BigNumber.ROUND_DOWN).toString(),
            nextPrice: new BigNumber(peep).shiftedBy(-18).toPrecision(collateralToken.decimals, BigNumber.ROUND_DOWN).toString(),
            currentPriceUpdate: new Date(Number(zzz) * 1000),
            nextPriceUpdate: new Date((Number(zzz) + hop) * 1000),
        }

        const collaterals: Record<string, MakerPoolCollateralConfig> = {
            [collateralToken.address.value]: {
                token: collateralToken,
                price: Price.createFrom({ value: osmData.currentPrice, baseToken: collateralToken, quoteToken: quoteToken }),
                nextPrice: Price.createFrom({ value:  osmData.nextPrice, baseToken: collateralToken, quoteToken: quoteToken }),
                priceUSD: await ctx.priceService.getPriceUSD(collateralToken),
                lastPriceUpdate: osmData.currentPriceUpdate,
                nextPriceUpdate: osmData.nextPriceUpdate,

                liquidationThreshold: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: spotRes.liquidationRatio.times(100).toNumber() }), type: RiskRatio.type.CollateralizationRatio }),

                tokensLocked: TokenAmount.createFromBaseUnit({ token: collateralToken, amount: joinGemBalance.toString() }),
                maxSupply: TokenAmount.createFrom({ token: collateralToken, amount: Number.MAX_SAFE_INTEGER.toString() }),
                liquidationPenalty: Percentage.createFrom({ percentage: dogRes.liquidationPenalty.toNumber() * 100 }),
            }
        };

        const debts: Record<string, MakerPoolDebtConfig> = {
            [quoteToken.address.value]: {
                token: quoteToken,
                price: await ctx.priceService.getPrice({ baseToken: quoteToken, quoteToken: collateralToken }),
                priceUSD: await ctx.priceService.getPriceUSD(quoteToken),
                rate: Percentage.createFrom({ percentage: stabilityFee.times(100).toNumber() }),
                totalBorrowed: TokenAmount.createFrom({ token: quoteToken, amount: vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor).toString() }),
                debtCeiling: TokenAmount.createFrom({ token: quoteToken, amount: vatRes.debtCeiling.toString() }),
                debtAvailable: TokenAmount.createFrom({ token: quoteToken, amount: vatRes.debtCeiling.minus(vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor)).toString() }),
                dustLimit: TokenAmount.createFrom({ token: quoteToken, amount: vatRes.debtFloor.toString() }),
                originationFee: Percentage.createFrom({ percentage: 0 })
            }
        };

        return {
            type: PoolType.Lending,
            poolId: makerPoolId,
            protocol: makerPoolId.protocol,
            baseCurrency: poolBaseCurrencyToken,
            collaterals,
            debts
        };
    }

    getPositionId(positionId: string): IPositionId {
        throw new Error("Not implemented");
    }

    async getPosition (positionId: IPositionId): Promise<Position> {
        throw new Error("Not implemented");
    }

    // @ts-ignore -- need to resolve this fully
    schema: z.Schema<MakerPoolId> = z.object({
        protocol: z.object({
            name: z.literal(ProtocolName.Maker),
            chainInfo: z.object({
                name: z.string(),
                chainId: z.custom((value) => this.supportedChains.includes(value as ChainId), "Chain ID not supported", true)
            })
        }),
        ilkType: z.nativeEnum(ILKType)
    })

    isPoolId(candidate: unknown): asserts candidate is MakerPoolId {
        const parseResult = this.schema.safeParse(candidate);
        if (!parseResult.success) {
            const errorDetails = parseResult.error.errors.map(error => `${error.path.join('.')} - ${error.message}`).join(', ');
            throw new Error(`Candidate is not correct MakerPoolId: ${errorDetails}`);
        }
    }
}

export function amountFromWei(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRECISION.WAD))
}

export function amountFromRay(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRECISION.RAY))
}

export function amountFromRad(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRECISION.RAD))
}

export const makerPlugin = new MakerPlugin()
