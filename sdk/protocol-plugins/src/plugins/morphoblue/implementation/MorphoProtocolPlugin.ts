import {
  Position,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  Maybe,
  IPositionIdData,
} from '@summerfi/sdk-common/common'
import {
  CollateralInfo,
  ILendingPoolIdData,
  PoolType,
  ProtocolName,
} from '@summerfi/sdk-common/protocols'
import { MorphoLendingPool } from './MorphoLendingPool'
import { MorphoBlueContractNames } from '@summerfi/deployment-types'
import { morphoBlueAbi, morphoBlueOracleAbi } from '@summerfi/abis'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { MorphoAddressAbiMap } from '../types/MorphoAddressAbiMap'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import {
  IMorphoLendingPoolId,
  IMorphoLendingPoolIdData,
  isMorphoLendingPoolId,
} from '../interfaces/IMorphoLendingPoolId'
import { MorphoStepBuilders } from '../builders/MorphoStepBuilders'
import { IMorphoPositionIdData, isMorphoPositionId } from '../interfaces'
import { MorphoLendingPoolInfo } from './MorphoLendingPoolInfo'
import {
  DebtInfo,
  IPercentage,
  IPrice,
  IRiskRatio,
  Percentage,
  Price,
  RiskRatio,
  RiskRatioType,
  TokenAmount,
} from '@summerfi/sdk-common'
import { BaseProtocolPlugin } from '../../../implementation'
import { Hex, encodeAbiParameters, keccak256, parseAbiParameters } from 'viem'
import { MorphoLLTVPrecision, MorphoOraclePricePrecision } from '../constants/MorphoConstants'
import { MorphoMarketInfo } from '../types/MorphoMarketInfo'
import { BigNumber } from 'bignumber.js'

/**
 * @class MorphoProtocolPlugin
 * @description Protocol plugin for the Morpho protocol
 * @see BaseProtocolPlugin
 */
export class MorphoProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName: ProtocolName.Morpho = ProtocolName.Morpho
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = MorphoStepBuilders

  constructor(params: { context: IProtocolPluginContext; deploymentConfigTag?: string }) {
    super(params)

    if (
      !this.supportedChains.some(
        (chainInfo) => chainInfo.chainId === this.context.provider.chain?.id,
      )
    ) {
      throw new Error(`Chain ID ${this.context.provider.chain?.id} is not supported`)
    }
  }

  /** VALIDATORS */

  /** @see BaseProtocolPlugin._validateLendingPoolId */
  protected _validateLendingPoolId(
    candidate: ILendingPoolIdData,
  ): asserts candidate is IMorphoLendingPoolIdData {
    if (!isMorphoLendingPoolId(candidate)) {
      throw new Error(`Invalid Morpho pool ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** @see BaseProtocolPlugin._validatePositionId */
  protected _validatePositionId(
    candidate: IPositionIdData,
  ): asserts candidate is IMorphoPositionIdData {
    if (!isMorphoPositionId(candidate)) {
      throw new Error(`Invalid Morpho position ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** LENDING POOLS */

  /** @see BaseProtocolPlugin._getLendingPoolImpl */
  protected async _getLendingPoolImpl(
    poolId: IMorphoLendingPoolIdData,
  ): Promise<MorphoLendingPool> {
    return MorphoLendingPool.createFrom({
      type: PoolType.Lending,
      id: poolId,
    })
  }

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  protected async _getLendingPoolInfoImpl(
    morphoLendingPoolId: IMorphoLendingPoolId,
  ): Promise<MorphoLendingPoolInfo> {
    const marketInfo = await this._getMarketInfo(morphoLendingPoolId)
    const marketCollateralPriceInDebt = await this._getMarketOraclePrice(morphoLendingPoolId)

    const collateralInfo = await this._getCollateralInfo({
      morphoLendingPoolId,
      marketInfo,
      marketCollateralPriceInDebt,
    })

    const debtInfo = await this._getDebtInfo({
      morphoLendingPoolId,
      marketInfo,
      marketCollateralPriceInDebt,
    })

    return MorphoLendingPoolInfo.createFrom({
      type: PoolType.Lending,
      id: morphoLendingPoolId,
      collateral: collateralInfo,
      debt: debtInfo,
    })
  }

  /** POSITIONS */

  /** @see BaseProtocolPlugin.getPosition */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPosition(positionId: IMorphoPositionIdData): Promise<Position> {
    this._validatePositionId(positionId)

    throw new Error(`Not implemented ${positionId}`)
  }

  /** IMPORT POSITIONS */

  /** @see BaseProtocolPlugin.getImportPositionTransaction */
  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    throw new Error(`Not implemented ${params}`)
  }

  /** PRIVATE */

  /**
   * @name _getCollateralInfo
   * @description Get the collateral info for the given morpho lending pool ID
   * @param params The parameters
   * @returns The collateral info
   */
  private async _getCollateralInfo(params: {
    morphoLendingPoolId: IMorphoLendingPoolId
    marketInfo: MorphoMarketInfo
    marketCollateralPriceInDebt: IPrice
  }): Promise<CollateralInfo> {
    const { morphoLendingPoolId, marketInfo, marketCollateralPriceInDebt } = params

    const collateralToken = morphoLendingPoolId.collateralToken
    const liquidationPenalty = this._getLiquidationPenalty(morphoLendingPoolId)
    const liquidationThreshold = this._getLiquidationThreshold(
      marketInfo,
      marketCollateralPriceInDebt,
    )

    const collateralPriceUSD = await this.ctx.oracleManager.getSpotPrice({
      baseToken: collateralToken,
    })
    console.log('collateralPriceUSD', collateralPriceUSD)

    return CollateralInfo.createFrom({
      token: collateralToken,
      price: marketCollateralPriceInDebt,
      priceUSD: collateralPriceUSD.price,
      liquidationThreshold: liquidationThreshold,
      tokensLocked: marketInfo.totalSupplyAssets,
      maxSupply: TokenAmount.createFrom({
        token: collateralToken,
        amount: Number.MAX_SAFE_INTEGER.toString(),
      }),
      liquidationPenalty: liquidationPenalty,
    })
  }

  /**
   * @name _getDebtInfo
   * @description Get the debt info for the given morpho lending pool ID
   * @param morphoLendingPoolId The lending pool ID
   * @param marketInfo The market info
   * @param marketCollateralPriceInDebt The market collateral price in debt
   * @returns The debt info
   */
  private async _getDebtInfo(params: {
    morphoLendingPoolId: IMorphoLendingPoolId
    marketInfo: MorphoMarketInfo
    marketCollateralPriceInDebt: IPrice
  }) {
    const { morphoLendingPoolId, marketInfo, marketCollateralPriceInDebt } = params

    const debtToken = morphoLendingPoolId.debtToken
    const priceUSD = await this.ctx.oracleManager.getSpotPrice({
      baseToken: debtToken,
    })

    const debtCeiling = marketCollateralPriceInDebt
      .multiply(marketInfo.totalSupplyAssets)
      .multiply(morphoLendingPoolId.lltv)

    const debtAvailable = debtCeiling.subtract(marketInfo.totalBorrowAssets)

    return DebtInfo.createFrom({
      token: debtToken,
      price: marketCollateralPriceInDebt.invert(),
      priceUSD: priceUSD.price,
      interestRate: marketInfo.fee,
      totalBorrowed: marketInfo.totalBorrowAssets,
      debtCeiling: debtCeiling,
      debtAvailable: debtAvailable,
      dustLimit: TokenAmount.createFrom({
        token: debtToken,
        amount: '0',
      }),
      originationFee: Percentage.createFrom({ value: 0 }),
    })
  }

  /**
   * @name _getMarketOraclePrice
   * @description Get the market oracle price for the given morpho lending pool ID
   * @param morphoLendingPoolId The lending pool ID
   * @returns The market oracle price
   */
  private async _getMarketOraclePrice(morphoLendingPoolId: IMorphoLendingPoolId): Promise<IPrice> {
    const [price] = await this.ctx.provider.multicall({
      contracts: [
        {
          abi: morphoBlueOracleAbi,
          address: morphoLendingPoolId.oracle.value,
          functionName: 'price',
          args: [],
        },
      ],
      allowFailure: false,
    })

    const descaledPrice = new BigNumber(price.toString())
      .div(new BigNumber(10).pow(MorphoOraclePricePrecision))
      .toString()

    return Price.createFrom({
      value: descaledPrice,
      base: morphoLendingPoolId.collateralToken,
      quote: morphoLendingPoolId.debtToken,
    })
  }

  /**
   * @name _getMarketInfo
   * @description Get the market info for the given morpho lending pool ID
   * @param morphoLendingPoolId The lending pool ID
   * @returns The market info
   */
  private async _getMarketInfo(
    morphoLendingPoolId: IMorphoLendingPoolId,
  ): Promise<MorphoMarketInfo> {
    const morphoBlueProviderDef = this._getContractDef('MorphoBlue')
    const marketParamsId = this._getMarketParamsId(morphoLendingPoolId)

    console.log('marketParamsId', marketParamsId)

    const [marketInfo] = await this.ctx.provider.multicall({
      contracts: [
        {
          abi: morphoBlueProviderDef.abi,
          address: morphoBlueProviderDef.address,
          functionName: 'market',
          args: [marketParamsId],
        },
      ],
      allowFailure: false,
    })

    return {
      totalSupplyAssets: TokenAmount.createFromBaseUnit({
        token: morphoLendingPoolId.collateralToken,
        amount: marketInfo[0].toString(),
      }),
      totalSupplyShares: marketInfo[1],
      totalBorrowAssets: TokenAmount.createFromBaseUnit({
        token: morphoLendingPoolId.debtToken,
        amount: marketInfo[2].toString(),
      }),
      totalBorrowShares: marketInfo[3],
      lastUpdated: marketInfo[4],
      fee: Percentage.createFrom({
        value: Number(marketInfo[5]),
      }),
    }
  }

  /**
   * @name _getLiquidationThreshold
   * @description Get the liquidation threshold for the given morpho lending pool ID
   * @param marketInfo The market info
   * @param marketCollateralPriceInDebt The market collateral price in debt
   * @returns The liquidation threshold
   */
  private _getLiquidationThreshold(
    marketInfo: MorphoMarketInfo,
    marketCollateralPriceInDebt: IPrice,
  ): IRiskRatio {
    const riskRatioValue = marketInfo.totalBorrowAssets
      .toBN()
      .div(marketCollateralPriceInDebt.toBN().multipliedBy(marketInfo.totalSupplyAssets.toBN()))
      .multipliedBy(100)

    return RiskRatio.createFrom({
      ratio: Percentage.createFrom({
        value: riskRatioValue.toNumber(),
      }),
      type: RiskRatioType.LTV,
    })
  }

  /**
   * @name _getLiquidationPenalty
   * @description Get the liquidation incentive factor for the given morpho lending pool ID
   * @param morphoLendingPoolId
   * @returns The liquidation incentive factor
   */
  private _getLiquidationPenalty(morphoLendingPoolId: IMorphoLendingPoolId): IPercentage {
    const ONE = new BigNumber(1)
    const MAX_LIF = new BigNumber(1.15)
    const BETA = new BigNumber(0.3)

    const lltv = morphoLendingPoolId.lltv

    const LIF = BigNumber.min(
      MAX_LIF,
      ONE.div(BETA.times(lltv.toProportion()).plus(ONE.minus(BETA))),
    )
      .minus(ONE)
      .multipliedBy(100)

    return Percentage.createFrom({ value: LIF.toNumber() })
  }

  /**
   * @name _getMarketParamsId
   * @description Get the market params ID by hashing the market params
   * @param morphoLendingPoolId
   * @returns
   */
  private _getMarketParamsId(morphoLendingPoolId: IMorphoLendingPoolId): Hex {
    const abiParametersFormat = parseAbiParameters([
      'MarketParams params',
      'struct MarketParams { address debtToken; address collateralToken; address oracle; address irm; uint256 lltv; }',
    ])

    const abiParameters = encodeAbiParameters(abiParametersFormat, [
      {
        debtToken: morphoLendingPoolId.debtToken.address.value,
        collateralToken: morphoLendingPoolId.collateralToken.address.value,
        oracle: morphoLendingPoolId.oracle.value,
        irm: morphoLendingPoolId.irm.value,
        lltv: BigInt(morphoLendingPoolId.lltv.toBaseUnit({ decimals: MorphoLLTVPrecision })),
      },
    ])

    return keccak256(abiParameters)
  }
  /**
   * @name _getContractDef
   * @description Get the contract abi and address for the given contract name
   * @param contractName The contract name
   * @returns The contract address and the abi
   */
  private _getContractDef<ContractName extends MorphoBlueContractNames>(
    contractName: ContractName,
  ): MorphoAddressAbiMap[ContractName] {
    const map: MorphoAddressAbiMap = {
      MorphoBlue: {
        address: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
        abi: morphoBlueAbi,
      },
      AdaptiveCurveIrm: {
        address: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC',
        abi: undefined,
      },
    }

    return map[contractName]
  }
}
