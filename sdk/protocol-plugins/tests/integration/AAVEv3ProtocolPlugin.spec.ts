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

    // TODO: re-enable when pool info is implemented
    // const config = pool.collaterals.get({ token: mockCollateralToken })
    // expect(config).toBeDefined()
    // expect(config).toMatchObject({
    //   token: expect.objectContaining({
    //     symbol: mockCollateralToken.symbol,
    //     address: mockCollateralToken.address,
    //     decimals: mockCollateralToken.decimals,
    //     name: mockCollateralToken.name,
    //   }),
    //   price: expect.anything(),
    //   priceUSD: expect.anything(),
    //   maxLtv: expect.anything(),
    //   liquidationThreshold: expect.anything(),
    //   tokensLocked: expect.anything(),
    //   maxSupply: expect.anything(),
    //   liquidationPenalty: expect.anything(),
    //   apy: expect.anything(),
    //   usageAsCollateralEnabled: expect.any(Boolean),
    // })

    // const price = config!.price
    // expect(price).toBeInstanceOf(Price)
    // expect(Number(price.value)).toBeGreaterThan(0)

    // const priceUSD = config!.priceUSD
    // expect(priceUSD).toBeInstanceOf(Price)
    // expect(Number(priceUSD.value)).toBeGreaterThan(0)

    // const maxLtv = config!.maxLtv
    // expect(maxLtv).toBeInstanceOf(RiskRatio)
    // expect(maxLtv.ratio.value).toBeGreaterThan(0)
    // expect(maxLtv.ratio.value).toBeLessThan(100)

    // const liquidationThreshold = config!.liquidationThreshold
    // expect(liquidationThreshold).toBeInstanceOf(RiskRatio)
    // expect(liquidationThreshold.ratio.value).toBeGreaterThan(0)
    // expect(liquidationThreshold.ratio.value).toBeLessThan(100)

    // const tokensLocked = config!.tokensLocked
    // expect(tokensLocked).toBeInstanceOf(TokenAmount)
    // expect(Number(tokensLocked.amount)).toBeGreaterThan(0)

    // const maxSupply = config!.maxSupply
    // expect(maxSupply).toBeInstanceOf(TokenAmount)
    // expect(Number(maxSupply.amount)).toBeGreaterThan(0)

    // const liquidationPenalty = config!.liquidationPenalty
    // expect(liquidationPenalty).toBeInstanceOf(Percentage)
    // expect(Number(liquidationPenalty.value)).toBeGreaterThan(100)
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

    // TODO: re-enable when pool info is implemented
    // const config = pool.debts.get({ token: mockDebtToken })
    // expect(config).toBeDefined()
    // expect(config).toMatchObject({
    //   token: expect.objectContaining({
    //     symbol: mockDebtToken.symbol,
    //     address: mockDebtToken.address,
    //     decimals: mockDebtToken.decimals,
    //     name: mockDebtToken.name,
    //   }),
    //   price: expect.anything(),
    //   priceUSD: expect.anything(),
    //   rate: expect.anything(),
    //   totalBorrowed: expect.anything(),
    //   debtCeiling: expect.anything(),
    //   debtAvailable: expect.anything(),
    //   dustLimit: expect.anything(),
    //   originationFee: expect.anything(),
    //   borrowingEnabled: expect.any(Boolean),
    // })

    // const price = config!.price
    // expect(price).toBeInstanceOf(Price)
    // expect(Number(price.value)).toBeGreaterThan(0)

    // const priceUSD = config!.priceUSD
    // expect(priceUSD).toBeInstanceOf(Price)
    // expect(Number(priceUSD.value)).toBeGreaterThan(0)

    // const rate = config!.rate
    // expect(rate).toBeInstanceOf(Percentage)
    // expect(rate.value).toBeGreaterThan(0)
    // expect(rate.value).toBeLessThan(100)

    // const totalBorrowed = config!.totalBorrowed
    // expect(totalBorrowed).toBeInstanceOf(TokenAmount)
    // expect(Number(totalBorrowed.amount)).toBeGreaterThan(0)

    // const debtCeiling = config!.debtCeiling
    // expect(debtCeiling).toBeInstanceOf(TokenAmount)
    // expect(Number(debtCeiling.amount)).toBeGreaterThan(0)

    // const debtAvailable = config!.debtAvailable
    // expect(debtAvailable).toBeInstanceOf(TokenAmount)
    // expect(Number(debtAvailable.amount)).toBeGreaterThan(0)

    // const dustLimit = config!.dustLimit
    // expect(dustLimit).toBeInstanceOf(TokenAmount)
    // expect(Number(dustLimit.amount)).toBe(0)

    // const originationFee = config!.originationFee
    // expect(originationFee).toBeInstanceOf(Percentage)
  })
})
