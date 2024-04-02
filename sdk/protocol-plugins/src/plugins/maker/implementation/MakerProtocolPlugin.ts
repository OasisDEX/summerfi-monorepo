/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Percentage,
  TokenAmount,
  TokenSymbol,
  Price,
  RiskRatio,
  Address,
  Position,
  ChainId,
  ChainFamilyName,
  valuesOfChainFamilyMap,
} from '@summerfi/sdk-common/common'
import { ILKType, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import type { MakerPoolId } from '@summerfi/sdk-common/protocols'
import { stringToHex, getContract } from 'viem'
import { BigNumber } from 'bignumber.js'
import { z } from 'zod'
import { MakerPaybackWithdrawActionBuilder } from '../builders/MakerPaybackWithdrawActionBuilder'
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'
import { PRECISION_BI } from '../../common/constants/AaveV3LikeConstants'
import {
  DOG_ABI,
  ERC20_ABI,
  ILK_REGISTRY_ABI,
  JUG_ABI,
  OSM_ABI,
  SPOT_ABI,
  VAT_ABI,
} from '../abis/MakerABIS'
import { MakerCollateralConfigMap, MakerCollateralConfigRecord } from './MakerCollateralConfigMap'
import { MakerDebtConfigMap, MakerDebtConfigRecord } from './MakerDebtConfigMap'
import { MakerLendingPool } from './MakerLendingPool'
import { amountFromRad, amountFromRay, amountFromWei } from '../utils/AmountUtils'
import { MakerAddressAbiMap } from '../types/MakerAddressAbiMap'
import {
  ActionBuildersMap,
  IPositionId,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'

export class MakerProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName = ProtocolName.Maker
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly makerPoolIdSchema = z.object({
    protocol: z.object({
      name: z.literal(ProtocolName.Maker),
      chainInfo: z.object({
        name: z.string(),
        chainId: z.custom<ChainId>(
          (chainId) => this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId),
          'Chain ID not supported',
          true,
        ),
      }),
    }),
    ilkType: z.nativeEnum(ILKType),
    vaultId: z.string(),
  })
  readonly stepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: MakerPaybackWithdrawActionBuilder,
  }

  constructor(params: { context: IProtocolPluginContext }) {
    super(params)
  }

  isPoolId(candidate: unknown): candidate is MakerPoolId {
    return this._isPoolId(candidate, this.makerPoolIdSchema)
  }

  validatePoolId(candidate: unknown): asserts candidate is MakerPoolId {
    if (!this.isPoolId(candidate)) {
      throw new Error(`Invalid Maker pool ID: ${JSON.stringify(candidate)}`)
    }
  }

  async getPool(makerPoolId: unknown): Promise<MakerLendingPool> {
    this.validatePoolId(makerPoolId)

    const ilk = makerPoolId.ilkType
    const ilkInHex = stringToHex(ilk, { size: 32 })

    const ctx = this.ctx
    const chainId = ctx.provider.chain?.id
    if (!chainId) throw new Error('ctx.provider.chain.id undefined')

    if (!this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported`)
    }

    const { osm, vatRes, jugRes, dogRes, spotRes, erc20, ilkRegistryRes } =
      await this.getIlkProtocolData(ilkInHex, makerPoolId)

    const makerSpotDef = this.getContractDef('Spot')
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
      ctx.tokenService.getTokenByAddress(Address.createFromEthereum({ value: ilkRegistryRes.gem })),
      ctx.tokenService.getTokenBySymbol(TokenSymbol.DAI),
      ctx.tokenService.getTokenBySymbol(TokenSymbol.DAI),
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

    const collaterals: MakerCollateralConfigRecord = {
      [collateralToken.address.value]: {
        token: collateralToken,
        price: Price.createFrom({
          value: osmData.currentPrice,
          baseToken: collateralToken,
          quoteToken: quoteToken,
        }),
        nextPrice: Price.createFrom({
          value: osmData.nextPrice,
          baseToken: collateralToken,
          quoteToken: quoteToken,
        }),
        priceUSD: await ctx.priceService.getPriceUSD(collateralToken),
        lastPriceUpdate: osmData.currentPriceUpdate,
        nextPriceUpdate: osmData.nextPriceUpdate,

        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({
            value: spotRes.liquidationRatio.times(100).toNumber(),
          }),
          type: RiskRatio.type.CollateralizationRatio,
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
      },
    }

    const debts: MakerDebtConfigRecord = {
      [quoteToken.address.value]: {
        token: quoteToken,
        price: await ctx.priceService.getPriceUSD(quoteToken),
        priceUSD: await ctx.priceService.getPriceUSD(quoteToken),
        rate: Percentage.createFrom({ value: stabilityFee.times(100).toNumber() }),
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
      },
    }

    return MakerLendingPool.createFrom({
      type: PoolType.Lending,
      poolId: makerPoolId,
      protocol: makerPoolId.protocol,
      baseCurrency: poolBaseCurrencyToken,
      collaterals: MakerCollateralConfigMap.createFrom({ record: collaterals }),
      debts: MakerDebtConfigMap.createFrom({ record: debts }),
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPosition(positionId: IPositionId): Promise<Position> {
    throw new Error('Not implemented')
  }

  private getContractDef<K extends keyof MakerAddressAbiMap>(
    contractName: K,
  ): MakerAddressAbiMap[K] {
    const map: MakerAddressAbiMap = {
      Dog: {
        address: '0x135954d155898d42c90d2a57824c690e0c7bef1b',
        abi: DOG_ABI,
      },
      Vat: {
        address: '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b',
        abi: VAT_ABI,
      },
      McdJug: {
        address: '0x19c0976f590d67707e62397c87829d896dc0f1f1',
        abi: JUG_ABI,
      },
      Spot: {
        address: '0x65c79fcb50ca1594b025960e539ed7a9a6d434a3',
        abi: SPOT_ABI,
      },
      IlkRegistry: {
        address: '0x5a464C28D19848f44199D003BeF5ecc87d090F87',
        abi: ILK_REGISTRY_ABI,
      },
      Chainlog: {
        address: '0x',
        abi: null,
      },
      CdpManager: {
        address: '0x',
        abi: null,
      },
      GetCdps: {
        address: '0x',
        abi: null,
      },
      Pot: {
        address: '0x',
        abi: null,
      },
      End: {
        address: '0x',
        abi: null,
      },
      McdGov: {
        address: '0x',
        abi: null,
      },
      FlashMintModule: {
        address: '0x',
        abi: null,
      },
    }
    return map[contractName]
  }

  private async getIlkProtocolData(ilkInHex: `0x${string}`, makerPoolId: MakerPoolId) {
    const ctx = this.ctx
    const makerDogDef = this.getContractDef('Dog')
    const makerVatDef = this.getContractDef('Vat')
    const makerSpotDef = this.getContractDef('Spot')
    const makerJugDef = this.getContractDef('McdJug')
    const makerIlkRegistryDef = this.getContractDef('IlkRegistry')

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
    ] = await ctx.provider.multicall({
      contracts: [
        {
          abi: makerVatDef.abi,
          address: makerVatDef.address,
          functionName: 'ilks',
          args: [ilkInHex],
        },
        {
          abi: makerSpotDef.abi,
          address: makerSpotDef.address,
          functionName: 'ilks' as const,
          args: [ilkInHex],
        },
        {
          abi: makerJugDef.abi,
          address: makerJugDef.address,
          functionName: 'ilks' as const,
          args: [ilkInHex],
        },
        {
          abi: makerDogDef.abi,
          address: makerDogDef.address,
          functionName: 'ilks' as const,
          args: [ilkInHex],
        },
        {
          abi: makerIlkRegistryDef.abi,
          address: makerIlkRegistryDef.address,
          functionName: 'ilkData' as const,
          args: [ilkInHex],
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
      client: ctx.provider,
    })

    const erc20 = getContract({
      abi: ERC20_ABI,
      address: gem,
      client: ctx.provider,
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
