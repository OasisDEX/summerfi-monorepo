import { AddressValue, Percentage, TokenAmount, TokenSymbol, Price, CurrencySymbol, RiskRatio } from "@summerfi/sdk-common/common"
import type { SparkLendingPool, SparkPoolDebtConfig, SparkPoolCollateralConfig, SparkPoolId } from "@summerfi/sdk-common/protocols"
import { PoolType, ProtocolName, EmodeType } from "@summerfi/sdk-common/protocols"
import { Position, Token } from "@summerfi/sdk-common/common"
import { BigNumber } from 'bignumber.js'
import { z } from 'zod'
import { ChainId, CreateProtocolPlugin, IPositionId, ProtocolManagerContext, ProtocolPlugin } from "../interfaces";
import { filterAssetsListByEMode, SparkPluginBuilder } from "./sparkPluginBuilder";
import { UNCAPPED_SUPPLY, PRESISION_BI } from "./constants";

function tokenAmountFromBaseUnit({amount, token}: {amount: string, token: Token}): TokenAmount {
    return TokenAmount.createFromBaseUnit({token, amount})
}

/*
    We need some kind of address provider or contract provider that will
    return the address of the contract together with abi

    contractProvider.getContract(MakerContracts.VAT)

*/
export const SparkContracts = {
    ORACLE: "0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9",
    LENDING_POOL: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
    POOL_DATA_PROVIDER: "0xFc21d6d146E6086B8359705C8b28512a983db0cb",
} as const

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
                            value: new BigNumber(asset.price.toString()).toString(),
                        }),
                        priceUSD: Price.createFrom({
                            baseToken: collateralToken,
                            quoteToken: CurrencySymbol.USD,
                            value: new BigNumber(asset.price.toString()).toString(),
                        }),
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