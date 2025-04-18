import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  ChainFamilyMap,
  FiatCurrency,
  OracleProviderType,
  Percentage,
  PoolType,
  Price,
  RiskRatio,
  TokenAmount,
} from '@summerfi/sdk-common'
import { OracleManagerMock } from '@summerfi/testing-utils'
import { isMorphoLendingPool, isMorphoLendingPoolId } from '../../src'
import { MorphoProtocolPlugin } from '../../src/plugins/morphoblue/implementation/MorphoProtocolPlugin'
import { morphoPoolIdMock, morphoPoolMarketParams } from '../mocks/MorphoPoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'

describe('Protocol Plugin | Integration | Morpho', () => {
  let ctx: IProtocolPluginContext
  let morphoProtocolPlugin: MorphoProtocolPlugin

  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    morphoProtocolPlugin = new MorphoProtocolPlugin()
    morphoProtocolPlugin.initialize({
      context: ctx,
    })
  })

  it('should retrieve the correct pool from the protocol', async () => {
    const pool = await morphoProtocolPlugin.getLendingPool(morphoPoolIdMock)

    expect(pool).toBeDefined()

    if (!isMorphoLendingPool(pool)) {
      fail('Expected pool to be a Morpho lending pool')
    }

    if (!isMorphoLendingPoolId(pool.id)) {
      fail('Expected pool id to be a Morpho lending pool id')
    }

    expect(pool.type).toBe(PoolType.Lending)
    expect(pool.id).toMatchObject(morphoPoolIdMock)
    expect(pool.collateralToken).toEqual(morphoPoolMarketParams.collateralToken)
    expect(pool.debtToken).toEqual(morphoPoolMarketParams.debtToken)
    expect(pool.oracle).toEqual(morphoPoolMarketParams.oracle)
    expect(pool.irm).toEqual(morphoPoolMarketParams.irm)
    expect(pool.lltv).toEqual(morphoPoolMarketParams.lltv)
  })

  it('should retrieve the correct pool collateral information from the protocol', async () => {
    ;(ctx.oracleManager as OracleManagerMock).setSpotPrice({
      provider: OracleProviderType.OneInch,
      token: morphoPoolMarketParams.collateralToken,
      price: Price.createFrom({
        value: '10.5',
        base: morphoPoolMarketParams.collateralToken,
        quote: FiatCurrency.USD,
      }),
    })
    const pool = await morphoProtocolPlugin.getLendingPool(morphoPoolIdMock)
    const morphoPoolInfo = await morphoProtocolPlugin.getLendingPoolInfo(pool.id)

    const morphoPoolCollateralInfo = morphoPoolInfo.collateral
    expect(morphoPoolCollateralInfo).toBeDefined()
    expect(morphoPoolCollateralInfo).toMatchObject({
      token: expect.objectContaining(pool.collateralToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      liquidationThreshold: expect.anything(),
      tokensLocked: expect.anything(),
      maxSupply: expect.anything(),
      liquidationPenalty: expect.anything(),
    })

    const price = morphoPoolCollateralInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = morphoPoolCollateralInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const liquidationThreshold = morphoPoolCollateralInfo!.liquidationThreshold
    expect(liquidationThreshold).toBeInstanceOf(RiskRatio)
    expect(liquidationThreshold.toLTV().value).toBeGreaterThan(0)
    expect(liquidationThreshold.toLTV().value).toBeLessThan(100)

    const tokensLocked = morphoPoolCollateralInfo!.tokensLocked
    expect(tokensLocked).toBeInstanceOf(TokenAmount)
    expect(Number(tokensLocked.amount)).toBeGreaterThan(0)

    const maxSupply = morphoPoolCollateralInfo!.maxSupply
    expect(maxSupply).toBeInstanceOf(TokenAmount)
    expect(Number(maxSupply.amount)).toBeGreaterThan(0)

    const liquidationPenalty = morphoPoolCollateralInfo!.liquidationPenalty
    expect(liquidationPenalty).toBeInstanceOf(Percentage)
    expect(Number(liquidationPenalty.value)).toBeGreaterThan(0)
  })

  it('should retrieve the correct pool debt information from the protocol', async () => {
    const pool = await morphoProtocolPlugin.getLendingPool(morphoPoolIdMock)

    const morphoPoolInfo = await morphoProtocolPlugin.getLendingPoolInfo(pool.id)

    const morphoPoolDebtInfo = morphoPoolInfo.debt

    expect(morphoPoolDebtInfo).toBeDefined()
    expect(morphoPoolDebtInfo).toMatchObject({
      token: expect.objectContaining(pool.debtToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      totalBorrowed: expect.anything(),
      debtCeiling: expect.anything(),
      debtAvailable: expect.anything(),
      dustLimit: expect.anything(),
      originationFee: expect.anything(),
    })

    const price = morphoPoolDebtInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = morphoPoolDebtInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const totalBorrowed = morphoPoolDebtInfo!.totalBorrowed
    expect(totalBorrowed).toBeInstanceOf(TokenAmount)
    expect(Number(totalBorrowed.amount)).toBeGreaterThan(0)

    const debtCeiling = morphoPoolDebtInfo!.debtCeiling
    expect(debtCeiling).toBeInstanceOf(TokenAmount)
    expect(Number(debtCeiling.amount)).toBeGreaterThan(0)

    const debtAvailable = morphoPoolDebtInfo!.debtAvailable
    expect(debtAvailable).toBeInstanceOf(TokenAmount)
    expect(Number(debtAvailable.amount)).toBeGreaterThan(0)

    const dustLimit = morphoPoolDebtInfo!.dustLimit
    expect(dustLimit).toBeInstanceOf(TokenAmount)
    expect(Number(dustLimit.amount)).toBe(0)

    const originationFee = morphoPoolDebtInfo!.originationFee
    expect(originationFee).toBeInstanceOf(Percentage)
  })
})
