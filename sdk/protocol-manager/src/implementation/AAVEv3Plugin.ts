import { Position, AddressValue, Percentage, TokenAmount, TokenSymbol, Price, CurrencySymbol, RiskRatio } from "@summerfi/sdk-common/common"
import type { AaveV3PoolId } from "@summerfi/sdk-common/protocols"
import { PoolType, ProtocolName, EmodeType } from "@summerfi/sdk-common/protocols"
import { BigNumber } from 'bignumber.js'
import { z } from 'zod'
import {
    AaveV3LendingPool,
    AaveV3PoolCollateralConfig, AaveV3PoolDebtConfig,
    ChainId,
    IPositionId,
    ProtocolManagerContext,
    ProtocolPlugin
} from "../interfaces";
import { AaveV3LikePluginBuilder, filterAssetsListByEMode } from "./AAVEv3LikeBuilder";
import { UNCAPPED_SUPPLY, PRECISION_BI } from "./constants";

export class AaveV3Plugin implements ProtocolPlugin<AaveV3PoolId> {
    public readonly protocol = ProtocolName.AAVEv3;
    supportedChains = [ChainId.Mainnet, ChainId.Arbitrum, ChainId.Optimism]
    async getPool(aaveV3PoolId: unknown, ctx: ProtocolManagerContext): Promise<AaveV3LendingPool> {
        this.isPoolId(aaveV3PoolId)
        const emode = aaveV3EmodeCategoryMap[aaveV3PoolId.emodeType]

        const chainId = ctx.provider.chain?.id
        if (!chainId) throw new Error('ctx.provider.chain.id undefined')

        if (!this.supportedChains.includes(chainId)) {
            throw new Error(`Chain ID ${chainId} is not supported`);
        }

        const builder = await (new AaveV3LikePluginBuilder(ctx, aaveV3PoolId.protocol.name)).init();
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

        const collaterals: Record<AddressValue, AaveV3PoolCollateralConfig> = {}
        for (const asset of filteredAssetsList) {
            const { token: collateralToken, config: { usageAsCollateralEnabled, ltv, liquidationThreshold, liquidationBonus }, caps: { supplyCap }, data: { totalAToken } } = asset;

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
                    tokensLocked: TokenAmount.createFromBaseUnit({token: collateralToken, amount: totalAToken.toString()}),
                    maxSupply: TokenAmount.createFrom({token: collateralToken, amount: supplyCap === 0n ? UNCAPPED_SUPPLY : supplyCap.toString() }),
                    liquidationPenalty: Percentage.createFrom({ percentage: Number((liquidationBonus / LTV_TO_PERCENTAGE_DIVISOR).toString()) }),
                    apy: Percentage.createFrom({ percentage: 0 }),
                    usageAsCollateralEnabled,
                }
            } catch (e) {
                console.log("error in collateral loop", e)
                throw new Error(`error in collateral loop ${e}`)
            }
        }

        const debts: Record<AddressValue, AaveV3PoolDebtConfig> = {}
        for (const asset of filteredAssetsList) {
            const { token: quoteToken, config: { borrowingEnabled, reserveFactor }, caps: { borrowCap }, data: { totalVariableDebt, totalStableDebt, variableBorrowRate } } = asset;
            if (quoteToken.symbol === TokenSymbol.WETH) {
                // WETH can be used as collateral on AaveV3 but not borrowed.
                continue;
            }

            try {
                const RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR = 10000n
                const PRECISION_PRESERVING_OFFSET = 1000000n
                const RATE_DIVISOR_TO_GET_PERCENTAGE = Number((PRECISION_PRESERVING_OFFSET - 100n).toString())

                const rate = Number(((variableBorrowRate * PRECISION_PRESERVING_OFFSET) / PRECISION_BI.RAY).toString()) / RATE_DIVISOR_TO_GET_PERCENTAGE
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
                    totalBorrowed: TokenAmount.createFromBaseUnit({token: quoteToken, amount: totalBorrowed.toString() }),
                    debtCeiling: TokenAmount.createFrom({token: quoteToken, amount: borrowCap === 0n ? UNCAPPED_SUPPLY : borrowCap.toString() }),
                    debtAvailable: TokenAmount.createFromBaseUnit({token: quoteToken, amount: borrowCap === 0n ? UNCAPPED_SUPPLY : (borrowCap - totalBorrowed).toString() }),
                    dustLimit: TokenAmount.createFromBaseUnit({token: quoteToken, amount: '0' }),
                    originationFee: Percentage.createFrom({ percentage: Number((reserveFactor / RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR).toString()) }),
                    borrowingEnabled
                }
            } catch (e) {
                console.log("error in debt loop", e)
                throw new Error(`error in debt loop ${e}`)
            }
        }

        return {
            type: PoolType.Lending,
            poolId: aaveV3PoolId,
            protocol: aaveV3PoolId.protocol,
            baseCurrency: CurrencySymbol.USD,
            collaterals,
            debts
        }
    }

    getPositionId(positionId: string): IPositionId {
        throw new Error(`getPositionId not implemented ${positionId}`)
    }

    async getPosition(positionId: IPositionId): Promise<Position> {
        throw new Error(`getPosition not implemented ${positionId}`)
    }

    schema: z.Schema<AaveV3PoolId> = z.object({
        protocol: z.object({
            name: z.literal(ProtocolName.AAVEv3),
            chainInfo: z.object({
                name: z.string(),
                chainId: z.custom<ChainId>((value) => this.supportedChains.includes(value as ChainId), "Chain ID not supported")
            })
        }),
        emodeType: z.nativeEnum(EmodeType)
    })

    isPoolId(candidate: unknown): asserts candidate is AaveV3PoolId {
        const parseResult = this.schema.safeParse(candidate);
        if (!parseResult.success) {
            const errorDetails = parseResult.error.errors.map(error => `${error.path.join('.')} - ${error.message}`).join(', ');
            throw new Error(`Candidate is not correct AaveV3PoolId: ${errorDetails}`);
        }
    }
}

const aaveV3EmodeCategoryMap: Record<EmodeType, bigint> = Object.keys(EmodeType).reduce<Record<EmodeType, bigint>>((accumulator, key, index) => {
    accumulator[EmodeType[key as keyof typeof EmodeType]] = BigInt(index);
    return accumulator;
}, {} as Record<EmodeType, bigint>);

export const aaveV3Plugin = new AaveV3Plugin();