import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { Price, RiskRatio, TokenAmount, Percentage } from '@summerfi/sdk-common'
import { AaveV3ProtocolPlugin } from '../../src/plugins/aave-v3/implementation/AAVEv3ProtocolPlugin'
import { getAaveV3PoolIdMock } from '../mocks/AAVEv3PoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'
import { IAaveV3LendingPoolId } from '../../src/plugins/aave-v3/interfaces/IAaveV3LendingPoolId'
import { ChainFamilyMap } from '@summerfi/sdk-common'

describe('AAVEv3 Protocol Plugin (Integration)', () => {
  let ctx: IProtocolPluginContext
  let validAaveV3PoolId: IAaveV3LendingPoolId
  let aaveV3ProtocolPlugin: AaveV3ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    validAaveV3PoolId = await getAaveV3PoolIdMock()
    aaveV3ProtocolPlugin = new AaveV3ProtocolPlugin()
    aaveV3ProtocolPlugin.initialize({
      context: ctx,
    })
  })
  // added skip since Aave adds new tokens which doesn't affect us, but which causing to this test to fail
  // (aggread with team as temporary solution)
  it.skip('correctly populates collateral configuration from blockchain data', async () => {
    const pool = await aaveV3ProtocolPlugin.getLendingPool(validAaveV3PoolId)
    const aaveV3PoolInfo = await aaveV3ProtocolPlugin.getLendingPoolInfo(pool.id)

    const aaveV3PoolCollateralInfo = aaveV3PoolInfo.collateral

    expect(aaveV3PoolCollateralInfo).toBeDefined()
    expect(aaveV3PoolCollateralInfo).toMatchObject({
      token: expect.objectContaining(pool.collateralToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      liquidationThreshold: expect.anything(),
      tokensLocked: expect.anything(),
      maxSupply: expect.anything(),
      liquidationPenalty: expect.anything(),
    })

    const price = aaveV3PoolCollateralInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = aaveV3PoolCollateralInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const liquidationThreshold = aaveV3PoolCollateralInfo!.liquidationThreshold
    expect(liquidationThreshold).toBeInstanceOf(RiskRatio)
    expect(liquidationThreshold.toLTV().value).toBeGreaterThan(0)
    expect(liquidationThreshold.toLTV().value).toBeLessThan(100)

    const tokensLocked = aaveV3PoolCollateralInfo!.tokensLocked
    expect(tokensLocked).toBeInstanceOf(TokenAmount)
    expect(Number(tokensLocked.amount)).toBeGreaterThan(0)

    const maxSupply = aaveV3PoolCollateralInfo!.maxSupply
    expect(maxSupply).toBeInstanceOf(TokenAmount)
    expect(Number(maxSupply.amount)).toBeGreaterThan(0)

    const liquidationPenalty = aaveV3PoolCollateralInfo!.liquidationPenalty
    expect(liquidationPenalty).toBeInstanceOf(Percentage)
    expect(Number(liquidationPenalty.value)).toBeGreaterThan(100)
  })

  it('correctly populates debt configuration from blockchain data', async () => {
    const pool = await aaveV3ProtocolPlugin.getLendingPool(validAaveV3PoolId)
    const aaveV3PoolInfo = await aaveV3ProtocolPlugin.getLendingPoolInfo(pool.id)

    const aaveV3PoolDebtInfo = aaveV3PoolInfo.debt

    expect(aaveV3PoolDebtInfo).toBeDefined()
    expect(aaveV3PoolDebtInfo).toMatchObject({
      token: expect.objectContaining(pool.debtToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      interestRate: expect.anything(),
      totalBorrowed: expect.anything(),
      debtCeiling: expect.anything(),
      debtAvailable: expect.anything(),
      dustLimit: expect.anything(),
      originationFee: expect.anything(),
    })

    const price = aaveV3PoolDebtInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = aaveV3PoolDebtInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const totalBorrowed = aaveV3PoolDebtInfo!.totalBorrowed
    expect(totalBorrowed).toBeInstanceOf(TokenAmount)
    expect(Number(totalBorrowed.amount)).toBeGreaterThan(0)

    const debtCeiling = aaveV3PoolDebtInfo!.debtCeiling
    expect(debtCeiling).toBeInstanceOf(TokenAmount)
    expect(Number(debtCeiling.amount)).toBeGreaterThan(0)

    const debtAvailable = aaveV3PoolDebtInfo!.debtAvailable
    expect(debtAvailable).toBeInstanceOf(TokenAmount)
    expect(Number(debtAvailable.amount)).toBeGreaterThan(0)

    const dustLimit = aaveV3PoolDebtInfo!.dustLimit
    expect(dustLimit).toBeInstanceOf(TokenAmount)
    expect(Number(dustLimit.amount)).toBe(0)

    const originationFee = aaveV3PoolDebtInfo!.originationFee
    expect(originationFee).toBeInstanceOf(Percentage)
  })
})
