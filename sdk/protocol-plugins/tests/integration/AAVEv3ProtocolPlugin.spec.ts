import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  ChainInfo,
  Token,
  Address,
  Price,
  RiskRatio,
  TokenAmount,
  Percentage,
} from '@summerfi/sdk-common/common'
import { AaveV3ProtocolPlugin } from '../../src/plugins/aave-v3'
import { aaveV3PoolIdMock as validAaveV3PoolId } from '../mocks/AAVEv3PoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'

describe('AAVEv3 Protocol Plugin (Integration)', () => {
  let ctx: IProtocolPluginContext
  let aaveV3ProtocolPlugin: AaveV3ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    aaveV3ProtocolPlugin = new AaveV3ProtocolPlugin({
      context: ctx,
    })
  })

  it('correctly populates collateral configuration from blockchain data', async () => {
    const pool = await aaveV3ProtocolPlugin.getLendingPool(validAaveV3PoolId)
    const mockCollateralToken = Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    })

    const aaveV3PoolInfo = await aaveV3ProtocolPlugin.getLendingPoolInfo(pool.id)

    const aaveV3PoolCollateralInfo = aaveV3PoolInfo.collateral

    expect(aaveV3PoolCollateralInfo).toBeDefined()
    expect(aaveV3PoolCollateralInfo).toMatchObject({
      token: expect.objectContaining({
        symbol: mockCollateralToken.symbol,
        address: mockCollateralToken.address,
        decimals: mockCollateralToken.decimals,
        name: mockCollateralToken.name,
      }),
      price: expect.anything(),
      priceUSD: expect.anything(),
      maxLtv: expect.anything(),
      liquidationThreshold: expect.anything(),
      tokensLocked: expect.anything(),
      maxSupply: expect.anything(),
      liquidationPenalty: expect.anything(),
      apy: expect.anything(),
      usageAsCollateralEnabled: expect.any(Boolean),
    })

    const price = aaveV3PoolCollateralInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = aaveV3PoolCollateralInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const liquidationThreshold = aaveV3PoolCollateralInfo!.liquidationThreshold
    expect(liquidationThreshold).toBeInstanceOf(RiskRatio)
    expect(liquidationThreshold.ratio.value).toBeGreaterThan(0)
    expect(liquidationThreshold.ratio.value).toBeLessThan(100)

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

    const mockDebtToken = Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    })

    const aaveV3PoolInfo = await aaveV3ProtocolPlugin.getLendingPoolInfo(pool.id)

    const aaveV3PoolDebtInfo = aaveV3PoolInfo.debt

    expect(aaveV3PoolDebtInfo).toBeDefined()
    expect(aaveV3PoolDebtInfo).toMatchObject({
      token: expect.objectContaining({
        symbol: mockDebtToken.symbol,
        address: mockDebtToken.address,
        decimals: mockDebtToken.decimals,
        name: mockDebtToken.name,
      }),
      price: expect.anything(),
      priceUSD: expect.anything(),
      rate: expect.anything(),
      totalBorrowed: expect.anything(),
      debtCeiling: expect.anything(),
      debtAvailable: expect.anything(),
      dustLimit: expect.anything(),
      originationFee: expect.anything(),
      borrowingEnabled: expect.any(Boolean),
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
