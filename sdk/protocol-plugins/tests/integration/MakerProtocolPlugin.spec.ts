import {
  ChainInfo,
  Token,
  Address,
  Price,
  RiskRatio,
  TokenAmount,
  Percentage,
} from '@summerfi/sdk-common/common'
import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { MakerProtocolPlugin } from '../../src/plugins/maker'
import { makerPoolIdMock as validMakerPoolId } from '../mocks/MakerPoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'

describe('Maker Protocol Plugin (Integration)', () => {
  let ctx: IProtocolPluginContext
  let makerProtocolPlugin: MakerProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    makerProtocolPlugin = new MakerProtocolPlugin({
      context: ctx,
    })
  })

  it('correctly populates collateral configuration from blockchain data', async () => {
    const pool = await makerProtocolPlugin.getLendingPool(validMakerPoolId)
    const makerPoolInfo = await makerProtocolPlugin.getLendingPoolInfo(pool.id)

    const makerPoolCollateralInfo = makerPoolInfo.collateral

    expect(makerPoolCollateralInfo).toBeDefined()
    expect(makerPoolCollateralInfo).toMatchObject({
      token: expect.objectContaining(pool.id.collateralToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      liquidationThreshold: expect.anything(),
      maxSupply: expect.anything(),
      tokensLocked: expect.anything(),
      liquidationPenalty: expect.anything(),
    })

    const price = makerPoolCollateralInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = makerPoolCollateralInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)
  })

  it('correctly populates debt configuration from blockchain data', async () => {
    const pool = await makerProtocolPlugin.getLendingPool(validMakerPoolId)

    const mockDebtToken = Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    })

    const makerPoolInfo = await makerProtocolPlugin.getLendingPoolInfo(pool.id)

    const makerPoolDebtInfo = makerPoolInfo.debt

    expect(makerPoolDebtInfo).toBeDefined()
    expect(makerPoolDebtInfo).toMatchObject({
      token: expect.objectContaining(pool.id.debtToken),
      price: expect.anything(),
      priceUSD: expect.anything(),
      interestRate: expect.anything(),
      totalBorrowed: expect.anything(),
      debtCeiling: expect.anything(),
      debtAvailable: expect.anything(),
      dustLimit: expect.anything(),
      originationFee: expect.anything(),
    })

    const price = makerPoolDebtInfo!.price
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const priceUSD = makerPoolDebtInfo!.priceUSD
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const totalBorrowed = makerPoolDebtInfo!.totalBorrowed
    expect(totalBorrowed).toBeInstanceOf(TokenAmount)
    expect(Number(totalBorrowed.amount)).toBeGreaterThan(0)

    const debtCeiling = makerPoolDebtInfo!.debtCeiling
    expect(debtCeiling).toBeInstanceOf(TokenAmount)
    expect(Number(debtCeiling.amount)).toBeGreaterThan(0)

    const debtAvailable = makerPoolDebtInfo!.debtAvailable
    expect(debtAvailable).toBeInstanceOf(TokenAmount)
    expect(Number(debtAvailable.amount)).toBeGreaterThan(0)

    const dustLimit = makerPoolDebtInfo!.dustLimit
    expect(dustLimit).toBeInstanceOf(TokenAmount)
    expect(Number(dustLimit.amount)).toBeGreaterThan(0)

    const originationFee = makerPoolDebtInfo!.originationFee
    expect(originationFee).toBeInstanceOf(Percentage)
  })
})
