/* eslint-disable @typescript-eslint/no-unused-vars */
import { MakerContractNames } from '@summerfi/deployment-types'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  CollateralInfo,
  DebtInfo,
  Percentage,
  Price,
  RiskRatio,
  RiskRatioType,
  TokenAmount,
  Address,
  ChainFamilyName,
  CommonTokenSymbols,
  IChainInfo,
  IPositionId,
  Maybe,
  ProtocolName,
  valuesOfChainFamilyMap,
  ILendingPoolId,
  ILendingPosition,
  ILendingPositionId,
  ExternalLendingPositionType,
  IExternalLendingPosition,
  IPositionsManager,
  TransactionInfo,
  IUser,
} from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import { getContract, stringToHex } from 'viem'
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'
import { PRECISION_BI } from '../../common/constants/AaveV3LikeConstants'
import { ERC20_ABI, OSM_ABI } from '../abis/MakerABIS'
import { MakerAbiMap } from '../abis/MakerAbiMap'
import { IMakerLendingPoolId, isMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'
import { isMakerLendingPositionId } from '../interfaces/IMakerLendingPositionId'
import { MakerContractInfo } from '../types/MakerContractInfo'
import { amountFromRad, amountFromRay, amountFromWei } from '../utils/AmountUtils'
import { encodeMakerAllowThroughProxyActions } from '../utils/MakerGive'
import { MakerLendingPool } from './MakerLendingPool'
import { MakerLendingPoolId } from './MakerLendingPoolId'
import { MakerLendingPoolInfo } from './MakerLendingPoolInfo'
import { MakerLendingPositionId } from './MakerLendingPositionId'
import { MakerStepBuilders } from './MakerStepBuilders'

type ProtocolData = Awaited<ReturnType<MakerProtocolPlugin['_getProtocolData']>>

export class MakerProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName = ProtocolName.Maker
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = MakerStepBuilders

  readonly CdpManagerContractName = 'CdpManager'
  readonly DssProxyActionsContractName = 'DssProxyActions'

  /** INITIALIZATION */
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
    candidate: ILendingPoolId,
  ): asserts candidate is MakerLendingPoolId {
    if (!isMakerLendingPoolId(candidate)) {
      throw new Error(`Invalid Maker pool ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** @see BaseProtocolPlugin._validateLendingPositionId */
  protected _validateLendingPositionId(
    candidate: IPositionId,
  ): asserts candidate is MakerLendingPositionId {
    if (!isMakerLendingPositionId(candidate)) {
      throw new Error(`Invalid Maker position ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** LENDING POOLS */

  /** @see BaseProtocolPlugin._getLendingPoolImpl */
  protected async _getLendingPoolImpl(
    makerLendingPoolId: IMakerLendingPoolId,
  ): Promise<MakerLendingPool> {
    // TODO: validate pool ID collateral and debt against the ILK Type
    return MakerLendingPool.createFrom({
      id: makerLendingPoolId,
      collateralToken: makerLendingPoolId.collateralToken,
      debtToken: makerLendingPoolId.debtToken,
    })
  }

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  protected async _getLendingPoolInfoImpl(
    makerLendingPoolId: IMakerLendingPoolId,
  ): Promise<MakerLendingPoolInfo> {
    const protocolData = await this._getProtocolData(makerLendingPoolId)
    const [collateralInfo, debtInfo] = await Promise.all([
      this._getCollateralInfo(protocolData),
      this._getDebtInfo(protocolData),
    ])

    return MakerLendingPoolInfo.createFrom({
      id: makerLendingPoolId,
      collateral: collateralInfo,
      debt: debtInfo,
    })
  }

  /** POSITIONS */

  /** @see BaseProtocolPlugin.getLendingPosition */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getLendingPosition(positionId: ILendingPositionId): Promise<ILendingPosition> {
    throw new Error('Not implemented')
  }

  /** IMPORT POSITION */

  /** @see BaseProtocolPlugin.getImportPositionTransaction */
  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    if (!isMakerLendingPoolId(params.externalPosition.pool.id)) {
      throw new Error('Invalid Maker pool ID')
    }
    if (!isMakerLendingPositionId(params.externalPosition.id.protocolId)) {
      throw new Error('Invalid Maker position ID')
    }

    if (params.externalPosition.id.externalType !== ExternalLendingPositionType.DS_PROXY) {
      throw new Error(
        `External position (${params.externalPosition.id.externalType}) type not supported`,
      )
    }

    const [cdpManagerAddress, dssProxyActionsAddress] = await Promise.all([
      this._getContractAddress({
        chainInfo: params.user.chainInfo,
        contractName: this.CdpManagerContractName,
      }),
      this._getContractAddress({
        chainInfo: params.user.chainInfo,
        contractName: this.DssProxyActionsContractName,
      }),
    ])

    const result = encodeMakerAllowThroughProxyActions({
      cdpManagerAddress: cdpManagerAddress.value,
      makerProxyActionsAddress: dssProxyActionsAddress.value,
      allowAddress: params.positionsManager.address.value,
      cdpId: params.externalPosition.id.protocolId.vaultId,
    })

    return {
      description: 'Import Maker position',
      transaction: {
        calldata: result.transactionCalldata,
        target: params.externalPosition.id.address,
        value: '0',
      },
    }
  }

  /** PRIVATE */

  private async _getContractDef<ContractName extends MakerContractNames>(params: {
    chainInfo: IChainInfo
    contractName: ContractName
  }): Promise<MakerContractInfo<ContractName>> {
    const contractAddress = await this._getContractAddress(params)

    return {
      address: contractAddress.value,
      abi: MakerAbiMap[params.contractName],
    }
  }

  private async _getCollateralInfo(protocolData: ProtocolData) {
    const { osmData, joinGemBalance, collateralToken, quoteToken, dogRes, spotRes } = protocolData

    const collateralPriceUSD = await this.context.oracleManager.getSpotPrice({
      baseToken: collateralToken,
    })

    return CollateralInfo.createFrom({
      token: collateralToken,
      price: Price.createFrom({
        value: osmData.currentPrice,
        base: collateralToken,
        quote: quoteToken,
      }),
      priceUSD: collateralPriceUSD.price,
      liquidationThreshold: RiskRatio.createFrom({
        value: Percentage.createFrom({
          value: spotRes.liquidationRatio.times(100).toNumber(),
        }),
        type: RiskRatioType.CollateralizationRatio,
      }),

      tokensLocked: TokenAmount.createFromBaseUnit({
        token: collateralToken,
        amount: joinGemBalance.toString(),
      }),
      maxSupply: TokenAmount.createFrom({
        token: collateralToken,
        amount: Number.MAX_SAFE_INTEGER.toString(),
      }),
      liquidationPenalty: Percentage.createFrom({
        value: dogRes.liquidationPenalty.toNumber() * 100,
      }),
    })
  }

  private async _getDebtInfo(protocolData: ProtocolData) {
    const { quoteToken, stabilityFee, vatRes } = protocolData

    const priceUSD = await this.context.oracleManager.getSpotPrice({
      baseToken: quoteToken,
    })
    return DebtInfo.createFrom({
      token: quoteToken,
      price: priceUSD.price,
      priceUSD: priceUSD.price,
      interestRate: Percentage.createFrom({ value: stabilityFee.times(100).toNumber() }),
      totalBorrowed: TokenAmount.createFrom({
        token: quoteToken,
        amount: vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor).toString(),
      }),
      debtCeiling: TokenAmount.createFrom({
        token: quoteToken,
        amount: vatRes.debtCeiling.toString(),
      }),
      debtAvailable: TokenAmount.createFrom({
        token: quoteToken,
        amount: vatRes.debtCeiling
          .minus(vatRes.normalizedIlkDebt.times(vatRes.debtScalingFactor))
          .toString(),
      }),
      dustLimit: TokenAmount.createFrom({
        token: quoteToken,
        amount: vatRes.debtFloor.toString(),
      }),
      originationFee: Percentage.createFrom({ value: 0 }),
    })
  }

  private async _getProtocolData(makerLendingPoolId: IMakerLendingPoolId) {
    const ilk = makerLendingPoolId.ilkType
    const ilkInHex = stringToHex(ilk, { size: 32 })
    const { osm, vatRes, jugRes, dogRes, spotRes, erc20, ilkRegistryRes } =
      await this._getIlkProtocolData({ chainInfo: makerLendingPoolId.protocol.chainInfo, ilkInHex })

    const DAI = await this.context.tokensManager.getTokenBySymbol({
      chainInfo: makerLendingPoolId.protocol.chainInfo,
      symbol: CommonTokenSymbols.DAI,
    })
    if (!DAI) {
      throw new Error(`DAI token not found for chain: ${makerLendingPoolId.protocol.chainInfo}`)
    }

    const ilkGemToken = await this.context.tokensManager.getTokenByAddress({
      chainInfo: makerLendingPoolId.protocol.chainInfo,
      address: Address.createFromEthereum({ value: ilkRegistryRes.gem }),
    })
    if (!ilkGemToken) {
      throw new Error(
        `Collateral token not found for chain: ${makerLendingPoolId.protocol.chainInfo}`,
      )
    }

    const makerSpotDef = await this._getContractDef({
      chainInfo: makerLendingPoolId.protocol.chainInfo,
      contractName: 'Spot',
    })
    const [
      [peek],
      [peep],
      zzz,
      hop,
      joinGemBalance,
      collateralToken,
      quoteToken,
      poolBaseCurrencyToken,
    ] = await Promise.all([
      osm.read.peek({ account: makerSpotDef.address }),
      osm.read.peep({ account: makerSpotDef.address }),
      osm.read.zzz({ account: makerSpotDef.address }),
      osm.read.hop({ account: makerSpotDef.address }),
      erc20.read.balanceOf([ilkRegistryRes.join]),
      ilkGemToken,
      DAI,
      DAI,
    ])

    const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
    BigNumber.config({ POW_PRECISION: 100 })

    const stabilityFee = jugRes.rawFee.pow(SECONDS_PER_YEAR).minus(1)

    const osmData = {
      currentPrice: new BigNumber(peek)
        .shiftedBy(-18)
        .toPrecision(collateralToken.decimals, BigNumber.ROUND_DOWN)
        .toString(),
      nextPrice: new BigNumber(peep)
        .shiftedBy(-18)
        .toPrecision(collateralToken.decimals, BigNumber.ROUND_DOWN)
        .toString(),
      currentPriceUpdate: new Date(Number(zzz) * 1000),
      nextPriceUpdate: new Date((Number(zzz) + hop) * 1000),
    }

    return {
      osmData,
      joinGemBalance,
      stabilityFee,
      collateralToken,
      quoteToken,
      dogRes,
      spotRes,
      vatRes,
    }
  }

  private async _getIlkProtocolData(params: { chainInfo: IChainInfo; ilkInHex: `0x${string}` }) {
    const [makerDogDef, makerVatDef, makerSpotDef, makerJugDef, makerIlkRegistryDef] =
      await Promise.all([
        this._getContractDef({
          chainInfo: params.chainInfo,
          contractName: 'Dog',
        }),
        this._getContractDef({
          chainInfo: params.chainInfo,
          contractName: 'Vat',
        }),
        this._getContractDef({
          chainInfo: params.chainInfo,
          contractName: 'Spot',
        }),
        this._getContractDef({
          chainInfo: params.chainInfo,
          contractName: 'McdJug',
        }),
        this._getContractDef({
          chainInfo: params.chainInfo,
          contractName: 'IlkRegistry',
        }),
      ])

    const [
      {
        0: art, // Total Normalised Debt     [wad] needs to be multiplied by rate to get actual debt
        // https://docs.makerdao.com/smart-contract-modules/rates-module
        1: rate, // Accumulated Rates         [ray]
        2: spot, // Price with Safety Margin  [ray]
        3: line, // Debt Ceiling              [rad] - max total debt
        4: dust, // Urn Debt Floor            [rad] - minimum debt
      },
      {
        0: _, // Price feed address
        1: mat, // Liquidation ratio [ray]
      },
      {
        0: rawFee, // Collateral-specific, per-second stability fee contribution [ray]
        1: feeLastLevied, // Time of last drip [unix epoch time]
      },
      {
        0: clip, // Liquidator
        1: chop, // Liquidation Penalty
        2: hole, // Max DAI needed to cover debt+fees of active auctions per ilk [rad]
        3: dirt, // Total DAI needed to cover debt+fees of active auctions [rad]
      },
      {
        0: pos, // Index in ilks array
        1: join, // DSS GemJoin adapter
        2: gem, // The collateral token contract
        3: dec, // Collateral token decimals
        4: _class, // Classification code (1 - clip, 2 - flip, 3+ - other)
        5: pip, // Token price oracle address
        6: xlip, // Auction contract
        7: name, // Token name
        8: symbol, // Token symbol
      },
    ] = await this.context.provider.multicall({
      contracts: [
        {
          abi: makerVatDef.abi,
          address: makerVatDef.address,
          functionName: 'ilks',
          args: [params.ilkInHex],
        },
        {
          abi: makerSpotDef.abi,
          address: makerSpotDef.address,
          functionName: 'ilks' as const,
          args: [params.ilkInHex],
        },
        {
          abi: makerJugDef.abi,
          address: makerJugDef.address,
          functionName: 'ilks' as const,
          args: [params.ilkInHex],
        },
        {
          abi: makerDogDef.abi,
          address: makerDogDef.address,
          functionName: 'ilks' as const,
          args: [params.ilkInHex],
        },
        {
          abi: makerIlkRegistryDef.abi,
          address: makerIlkRegistryDef.address,
          functionName: 'ilkData' as const,
          args: [params.ilkInHex],
        },
      ],
      allowFailure: false,
    })

    const vatRes = {
      normalizedIlkDebt: amountFromWei(art),
      debtScalingFactor: amountFromRay(rate),
      maxDebtPerUnitCollateral: amountFromRay(spot),
      debtCeiling: amountFromRad(line),
      debtFloor: amountFromRad(dust),
    }

    const spotRes = {
      priceFeedAddress: Address.createFromEthereum({ value: pip }),
      liquidationRatio: amountFromRay(mat),
    }

    const jugRes = {
      rawFee: amountFromRay(rawFee),
      feeLastLevied: new BigNumber(feeLastLevied.toString()).times(1000),
    }

    const dogRes = {
      clipperAddress: Address.createFromEthereum({ value: clip }),
      // EG 1.13 not 0.13
      liquidationPenalty: amountFromWei(chop - PRECISION_BI.WAD),
    }

    const osm = getContract({
      abi: OSM_ABI,
      address: spotRes.priceFeedAddress.value,
      client: this.context.provider,
    })

    const erc20 = getContract({
      abi: ERC20_ABI,
      address: gem,
      client: this.context.provider,
    })

    const ilkRegistryRes = {
      join,
      gem,
      pip,
    }

    return {
      vatRes,
      spotRes,
      jugRes,
      dogRes,
      osm,
      erc20,
      ilkRegistryRes,
    }
  }
}
