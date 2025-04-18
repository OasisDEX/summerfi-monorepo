import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  ChainInfo,
  Token,
  Address,
  Price,
  RiskRatio,
  TokenAmount,
  Percentage,
  ChainFamilyMap,
} from '@summerfi/sdk-common'
import { SparkProtocolPlugin } from '../../src/plugins/spark/implementation/SparkProtocolPlugin'
import { ISparkLendingPoolId } from '../../src/plugins/spark/interfaces/ISparkLendingPoolId'
import { getSparkPoolIdMock } from '../mocks/SparkPoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'

describe('Spark Protocol Plugin (Integration)', () => {
  let ctx: IProtocolPluginContext
  let validSparkPoolId: ISparkLendingPoolId
  let sparkProtocolPlugin: SparkProtocolPlugin

  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    validSparkPoolId = await getSparkPoolIdMock()
    sparkProtocolPlugin = new SparkProtocolPlugin()
    sparkProtocolPlugin.initialize({
      context: ctx,
    })
  })

  it('correctly populates collateral configuration from blockchain data', async () => {
    const pool = await sparkProtocolPlugin.getLendingPool(validSparkPoolId)
    const mockCollateralToken = Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    })

    const sparkPoolInfo = await sparkProtocolPlugin.getLendingPoolInfo(pool.id)

    const sparkPoolCollateralInfo = sparkPoolInfo.collateral
    expect(sparkPoolCollateralInfo).toBeDefined()
    expect(sparkPoolCollateralInfo).toMatchObject({
      token: expect.objectContaining(pool.collateralToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      liquidationThreshold: expect.anything(),
      tokensLocked: expect.anything(),
      maxSupply: expect.anything(),
      liquidationPenalty: expect.anything(),
    })

    const price = sparkPoolCollateralInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = sparkPoolCollateralInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const liquidationThreshold = sparkPoolCollateralInfo!.liquidationThreshold
    expect(liquidationThreshold).toBeInstanceOf(RiskRatio)
    expect(liquidationThreshold.toLTV().value).toBeGreaterThanOrEqual(0)
    expect(liquidationThreshold.toLTV().value).toBeLessThan(100)

    const tokensLocked = sparkPoolCollateralInfo!.tokensLocked
    expect(tokensLocked).toBeInstanceOf(TokenAmount)
    expect(Number(tokensLocked.amount)).toBeGreaterThan(0)

    const maxSupply = sparkPoolCollateralInfo!.maxSupply
    expect(maxSupply).toBeInstanceOf(TokenAmount)
    expect(Number(maxSupply.amount)).toBeGreaterThan(0)

    const liquidationPenalty = sparkPoolCollateralInfo!.liquidationPenalty
    expect(liquidationPenalty).toBeInstanceOf(Percentage)
    expect(Number(liquidationPenalty.value)).toBeGreaterThan(100)
  })

  it('correctly populates debt configuration from blockchain data', async () => {
    const pool = await sparkProtocolPlugin.getLendingPool(validSparkPoolId)

    const sparkPoolInfo = await sparkProtocolPlugin.getLendingPoolInfo(pool.id)

    const sparkPoolDebtInfo = sparkPoolInfo.debt

    expect(sparkPoolDebtInfo).toBeDefined()
    expect(sparkPoolDebtInfo).toMatchObject({
      token: expect.objectContaining(pool.debtToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      totalBorrowed: expect.anything(),
      debtCeiling: expect.anything(),
      debtAvailable: expect.anything(),
      dustLimit: expect.anything(),
      originationFee: expect.anything(),
    })

    const price = sparkPoolDebtInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = sparkPoolDebtInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const totalBorrowed = sparkPoolDebtInfo!.totalBorrowed
    expect(totalBorrowed).toBeInstanceOf(TokenAmount)
    expect(Number(totalBorrowed.amount)).toBeGreaterThan(0)

    const debtCeiling = sparkPoolDebtInfo!.debtCeiling
    expect(debtCeiling).toBeInstanceOf(TokenAmount)
    expect(Number(debtCeiling.amount)).toBeGreaterThan(0)

    const debtAvailable = sparkPoolDebtInfo!.debtAvailable
    expect(debtAvailable).toBeInstanceOf(TokenAmount)
    expect(Number(debtAvailable.amount)).toBeGreaterThan(0)

    const dustLimit = sparkPoolDebtInfo!.dustLimit
    expect(dustLimit).toBeInstanceOf(TokenAmount)
    expect(Number(dustLimit.amount)).toBe(0)

    const originationFee = sparkPoolDebtInfo!.originationFee
    expect(originationFee).toBeInstanceOf(Percentage)
  })
})
