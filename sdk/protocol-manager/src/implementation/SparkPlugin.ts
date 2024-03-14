import { AddressValue, Percentage, TokenAmount, TokenSymbol, Price, CurrencySymbol, RiskRatio } from "@summerfi/sdk-common/common";
import type { SparkLendingPool, SparkPoolDebtConfig, SparkPoolCollateralConfig, SparkPoolId } from "@summerfi/sdk-common/protocols";
import { PoolType, ProtocolName, EmodeType } from "@summerfi/sdk-common/protocols";
import { Position } from "@summerfi/sdk-common/common";
import { BigNumber } from 'bignumber.js';
import { z } from 'zod';
import { ProtocolPlugin, ChainId, ProtocolManagerContext, IPositionId } from "../interfaces/ProtocolPlugin";
import {AaveV3LikePluginBuilder, filterAssetsListByEMode} from "./AAVEv3LikeBuilder";
import {UNCAPPED_SUPPLY, PRECISION_BI} from "./constants";

class SparkPlugin implements ProtocolPlugin<SparkPoolId> {
    public readonly protocol = ProtocolName.Spark;
    public supportedChains = [ChainId.Mainnet];
    async getPool(poolId: unknown, ctx: ProtocolManagerContext): Promise<SparkLendingPool> {
        this.isPoolId(poolId);
        const emode = sparkEmodeCategoryMap[poolId.emodeType];

        const chainId = ctx.provider.chain?.id;
        if (!chainId) throw new Error('ctx.provider.chain.id undefined');

        if (!this.supportedChains.includes(chainId)) {
            throw new Error(`Chain ID ${chainId} is not supported`);
        }

        const builder = await (new AaveV3LikePluginBuilder(ctx, this.protocol)).init();
        const reservesAssetsList = await builder
            .addPrices()
            .addReservesCaps()
            .addReservesConfigData()
            .addReservesData()
            .addEmodeCategories()
            .build();

        const filteredAssetsList = filterAssetsListByEMode(reservesAssetsList, emode);

        // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
        const poolBaseCurrencyToken = CurrencySymbol.USD;

        const collaterals: Record<AddressValue, SparkPoolCollateralConfig> = {};
        for (const asset of filteredAssetsList) {
            const { token: collateralToken, config: { usageAsCollateralEnabled, ltv, liquidationThreshold, liquidationBonus }, caps: { supplyCap }, data: { totalAToken } } = asset;
            const LTV_TO_PERCENTAGE_DIVISOR = 100n;

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
                    tokensLocked: TokenAmount.createFromBaseUnit({token: collateralToken, amount: totalAToken.toString()}),
                    maxSupply: TokenAmount.createFrom({ token: collateralToken, amount: supplyCap === 0n ? UNCAPPED_SUPPLY : supplyCap.toString() }),
                    liquidationPenalty: Percentage.createFrom({ percentage: Number((liquidationBonus / LTV_TO_PERCENTAGE_DIVISOR).toString()) }),
                    apy: Percentage.createFrom({ percentage: 0 }),
                    usageAsCollateralEnabled,
                };
            } catch (e) {
                console.log("error in collateral loop", e)
                throw new Error(`error in collateral loop ${e}`)
            }
        }

        const debts: Record<AddressValue, SparkPoolDebtConfig> = {};
        for (const asset of filteredAssetsList) {
            const { token: quoteToken, config: { borrowingEnabled, reserveFactor }, caps: { borrowCap }, data: { totalVariableDebt, totalStableDebt, variableBorrowRate } } = asset;
            if (quoteToken.symbol === TokenSymbol.WETH) {
                // WETH can be used as collateral on Spark but not borrowed.
                continue;
            }

            try {
                const RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR = 10000n;
                const PRECISION_PRESERVING_OFFSET = 1000000n;
                const RATE_DIVISOR_TO_GET_PERCENTAGE = Number((PRECISION_PRESERVING_OFFSET - 100n).toString());

                const rate = Number(((variableBorrowRate * PRECISION_PRESERVING_OFFSET) / PRECISION_BI.RAY).toString()) / RATE_DIVISOR_TO_GET_PERCENTAGE;
                const totalBorrowed = totalVariableDebt + totalStableDebt;
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
                    totalBorrowed: TokenAmount.createFromBaseUnit({token: quoteToken, amount: totalBorrowed.toString() }),
                    debtCeiling: TokenAmount.createFrom({ token: quoteToken, amount: borrowCap === 0n ? UNCAPPED_SUPPLY : borrowCap.toString() }),
                    debtAvailable: TokenAmount.createFromBaseUnit({token: quoteToken, amount: borrowCap === 0n ? UNCAPPED_SUPPLY : (borrowCap - totalBorrowed).toString() }),
                    dustLimit: TokenAmount.createFromBaseUnit({token: quoteToken, amount: '0' }),
                    originationFee: Percentage.createFrom({ percentage: Number((reserveFactor / RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR).toString()) }),
                    borrowingEnabled
                };
            } catch (e) {
                console.log("error in debt loop", e)
                throw new Error(`error in debt loop ${e}`)
            }
        }

        return {
            type: PoolType.Lending,
            poolId: poolId,
            protocol: poolId.protocol,
            baseCurrency: CurrencySymbol.USD,
            collaterals,
            debts
        };
    }

    getPositionId(positionId: string): IPositionId {
        throw new Error(`Not implemented ${positionId}`)
    }

    async getPosition(positionId: IPositionId, ctx: ProtocolManagerContext): Promise<Position> {
        throw new Error(`Not implemented ${positionId}`)
    }

    isPoolId(candidate: unknown): asserts candidate is SparkPoolId {
        const ProtocolNameEnum = z.literal(ProtocolName.Spark);
        const EmodeTypeEnum = z.nativeEnum(EmodeType);
        const ChainInfoType = z.object({
            name: z.string(),
            chainId: z.number()
        });

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
            throw new Error(`Candidate is not correct SparkPoolId: ${errorDetails}`);
        }
    }
}

const sparkEmodeCategoryMap: Record<EmodeType, bigint> = Object.keys(EmodeType).reduce<Record<EmodeType, bigint>>((accumulator, key, index) => {
    accumulator[EmodeType[key as keyof typeof EmodeType]] = BigInt(index);
    return accumulator;
}, {} as Record<EmodeType, bigint>);

export const sparkPlugin = new SparkPlugin();