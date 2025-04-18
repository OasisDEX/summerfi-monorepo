import {
  ChainFamilyName,
  Maybe,
  ProtocolName,
  valuesOfChainFamilyMap,
  Address,
  DebtInfo,
  IPercentage,
  IPrice,
  Percentage,
  Price,
  RiskRatio,
  RiskRatioType,
  TokenAmount,
  CollateralInfo,
  ILendingPoolIdData,
  ILendingPosition,
  ILendingPositionIdData,
  IExternalLendingPosition,
  IPositionsManager,
  TransactionInfo,
  IUser,
} from '@summerfi/sdk-common'

import { morphoBlueAbi, morphoBlueOracleAbi } from '@summerfi/abis'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { BigNumber } from 'bignumber.js'
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'
import { MorphoStepBuilders } from '../builders/MorphoStepBuilders'
import { MorphoLLTVPrecision, MorphoOraclePricePrecision } from '../constants/MorphoConstants'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import {
  IMorphoLendingPositionIdData,
  isMorphoLendingPositionId,
} from '../interfaces/IMorphoLendingPositionId'
import {
  IMorphoLendingPoolId,
  IMorphoLendingPoolIdData,
  isMorphoLendingPoolId,
} from '../interfaces/IMorphoLendingPoolId'
import { MorphoMarketParameters } from '../types/MorphoMarketParameters'
import { MorphoMarketInfo } from '../types/MorphoMarketInfo'
import { MorphoLendingPool } from './MorphoLendingPool'
import { MorphoLendingPoolInfo } from './MorphoLendingPoolInfo'

/**
 * @class MorphoProtocolPlugin
 * @description Protocol plugin for the Morpho protocol
 * @see BaseProtocolPlugin
 */
export class MorphoProtocolPlugin extends BaseProtocolPlugin {
  static readonly MorphoBlueContractName = 'MorphoBlue'

  readonly protocolName: ProtocolName.MorphoBlue = ProtocolName.MorphoBlue
  readonly supportedChains = valuesOfChainFamilyMap([
    ChainFamilyName.Ethereum,
    ChainFamilyName.Base,
  ])
  readonly stepBuilders: Partial<ActionBuildersMap> = MorphoStepBuilders

  initialize(params: { context: IProtocolPluginContext }) {
    super.initialize(params)

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

  /** @see BaseProtocolPlugin._validateLendingPositionId */
  protected _validateLendingPositionId(
    candidate: ILendingPositionIdData,
  ): asserts candidate is IMorphoLendingPositionIdData {
    if (!isMorphoLendingPositionId(candidate)) {
      throw new Error(`Invalid Morpho position ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** LENDING POOLS */

  /** @see BaseProtocolPlugin._getLendingPoolImpl */
  protected async _getLendingPoolImpl(
    morphoLendingPoolId: IMorphoLendingPoolId,
  ): Promise<MorphoLendingPool> {
    const marketParams = await this._getMarketParams(morphoLendingPoolId)

    return MorphoLendingPool.createFrom({
      id: morphoLendingPoolId,
      collateralToken: marketParams.collateralToken,
      debtToken: marketParams.debtToken,
      oracle: marketParams.oracle,
      irm: marketParams.irm,
      lltv: marketParams.lltv,
    })
  }

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  protected async _getLendingPoolInfoImpl(
    morphoLendingPoolId: IMorphoLendingPoolId,
  ): Promise<MorphoLendingPoolInfo> {
    const morphoLendingPool = await this._getLendingPoolImpl(morphoLendingPoolId)
    const [marketInfo, marketCollateralPriceInDebt] = await Promise.all([
      this._getMarketInfo(morphoLendingPool),
      this._getMarketOraclePrice(morphoLendingPool),
    ])

    const [collateralInfo, debtInfo] = await Promise.all([
      this._getCollateralInfo({
        morphoLendingPool,
        marketInfo,
        marketCollateralPriceInDebt,
      }),
      this._getDebtInfo({
        morphoLendingPool,
        marketInfo,
        marketCollateralPriceInDebt,
      }),
    ])

    return MorphoLendingPoolInfo.createFrom({
      id: morphoLendingPoolId,
      collateral: collateralInfo,
      debt: debtInfo,
    })
  }

  /** POSITIONS */

  /** @see BaseProtocolPlugin.getLendingPosition */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getLendingPosition(positionId: IMorphoLendingPositionIdData): Promise<ILendingPosition> {
    this._validateLendingPositionId(positionId)

    throw new Error(`Not implemented ${positionId}`)
  }

  /** IMPORT POSITIONS */

  /** @see BaseProtocolPlugin.getImportPositionTransaction */
  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
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
    morphoLendingPool: IMorphoLendingPool
    marketInfo: MorphoMarketInfo
    marketCollateralPriceInDebt: IPrice
  }): Promise<CollateralInfo> {
    const { morphoLendingPool, marketInfo, marketCollateralPriceInDebt } = params

    const collateralToken = morphoLendingPool.collateralToken
    const liquidationPenalty = this._getLiquidationPenalty(morphoLendingPool)

    const collateralPriceUSD = await this.context.oracleManager.getSpotPrice({
      baseToken: collateralToken,
    })

    return CollateralInfo.createFrom({
      token: collateralToken,
      price: marketCollateralPriceInDebt,
      priceUSD: collateralPriceUSD.price,
      liquidationThreshold: morphoLendingPool.lltv,
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
    morphoLendingPool: IMorphoLendingPool
    marketInfo: MorphoMarketInfo
    marketCollateralPriceInDebt: IPrice
  }) {
    const { morphoLendingPool, marketInfo, marketCollateralPriceInDebt } = params

    const debtToken = morphoLendingPool.debtToken
    const priceUSD = await this.context.oracleManager.getSpotPrice({
      baseToken: debtToken,
    })

    const debtCeiling = marketCollateralPriceInDebt
      .multiply(marketInfo.totalSupplyAssets)
      .multiply(morphoLendingPool.lltv.toLTV())

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
  private async _getMarketOraclePrice(morphoLendingPool: IMorphoLendingPool): Promise<IPrice> {
    const [price] = await this.context.provider.multicall({
      contracts: [
        {
          abi: morphoBlueOracleAbi,
          address: morphoLendingPool.oracle.value,
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
      base: morphoLendingPool.collateralToken,
      quote: morphoLendingPool.debtToken,
    })
  }

  /**
   * @name _getMarketInfo
   * @description Get the market info for the given morpho lending pool ID
   * @param morphoLendingPoolId The lending pool ID
   * @returns The market info
   */
  private async _getMarketInfo(morphoLendingPool: IMorphoLendingPool): Promise<MorphoMarketInfo> {
    const morphoBlueAddress = await this._getContractAddress({
      chainInfo: morphoLendingPool.id.protocol.chainInfo,
      contractName: MorphoProtocolPlugin.MorphoBlueContractName,
    })
    const marketParamsId = morphoLendingPool.id.marketId

    const [marketInfo] = await this.context.provider.multicall({
      contracts: [
        {
          abi: morphoBlueAbi,
          address: morphoBlueAddress.value,
          functionName: 'market',
          args: [marketParamsId],
        },
      ],
      allowFailure: false,
    })

    return {
      totalSupplyAssets: TokenAmount.createFromBaseUnit({
        token: morphoLendingPool.collateralToken,
        amount: marketInfo[0].toString(),
      }),
      totalSupplyShares: marketInfo[1],
      totalBorrowAssets: TokenAmount.createFromBaseUnit({
        token: morphoLendingPool.debtToken,
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
   * @name _getMarketParams
   * @description Get the market parameters from the market ID
   * @param morphoLendingPoolId The lending pool ID
   * @returns The market parameters
   */
  private async _getMarketParams(
    morphoLendingPoolId: IMorphoLendingPoolId,
  ): Promise<MorphoMarketParameters> {
    const morphoBlueAddress = await this._getContractAddress({
      chainInfo: morphoLendingPoolId.protocol.chainInfo,
      contractName: MorphoProtocolPlugin.MorphoBlueContractName,
    })
    const marketParamsId = morphoLendingPoolId.marketId

    const [marketParameters] = await this.context.provider.multicall({
      contracts: [
        {
          abi: morphoBlueAbi,
          address: morphoBlueAddress.value,
          functionName: 'idToMarketParams',
          args: [marketParamsId],
        },
      ],
      allowFailure: false,
    })

    const debtToken = await this.context.tokensManager.getTokenByAddress({
      address: Address.createFromEthereum({ value: marketParameters[0] }),
      chainInfo: morphoLendingPoolId.protocol.chainInfo,
    })

    if (!debtToken) {
      throw new Error(
        `Invalid debt token address: ${marketParameters[0]} for chain ${morphoLendingPoolId.protocol.chainInfo}`,
      )
    }

    const collateralToken = await this.context.tokensManager.getTokenByAddress({
      address: Address.createFromEthereum({ value: marketParameters[1] }),
      chainInfo: morphoLendingPoolId.protocol.chainInfo,
    })

    if (!collateralToken) {
      throw new Error(
        `Invalid collateral token address: ${marketParameters[1]} for chain ${morphoLendingPoolId.protocol.chainInfo.name}`,
      )
    }

    const lltv = new BigNumber(String(marketParameters[4]))
      .div(new BigNumber(10).pow(MorphoLLTVPrecision))
      .multipliedBy(100)
      .toNumber()

    return {
      debtToken,
      collateralToken,
      oracle: Address.createFromEthereum({ value: marketParameters[2] }),
      irm: Address.createFromEthereum({ value: marketParameters[3] }),
      lltv: RiskRatio.createFrom({
        type: RiskRatioType.LTV,
        value: Percentage.createFrom({ value: lltv }),
      }),
    }
  }
  /**
   * @name _getLiquidationPenalty
   * @description Get the liquidation incentive factor for the given morpho lending pool ID
   * @param morphoLendingPoolId
   * @returns The liquidation incentive factor
   */
  private _getLiquidationPenalty(morphoLendingPool: IMorphoLendingPool): IPercentage {
    const ONE = new BigNumber(1)
    const MAX_LIF = new BigNumber(1.15)
    const BETA = new BigNumber(0.3)

    const lltv = morphoLendingPool.lltv

    const LIF = BigNumber.min(
      MAX_LIF,
      ONE.div(BETA.times(lltv.toLTV().toProportion()).plus(ONE.minus(BETA))),
    )
      .minus(ONE)
      .multipliedBy(100)

    return Percentage.createFrom({ value: LIF.toNumber() })
  }
}
