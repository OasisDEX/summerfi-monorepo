import {
  ChainInfo,
  Token,
  Address,
  Price,
  RiskRatio,
  TokenAmount,
  Percentage,
} from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import {
  AaveV3ProtocolPlugin,
  defaultAddressAbiMapsByProtocol,
  IProtocolPluginContext,
  MockContractProvider,
} from '../../src'
import { aaveV3PoolIdMock as validAaveV3PoolId } from '../mocks/AAVEv3PoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'

describe('AAVEv3 Protocol Plugin (Integration)', () => {
  let ctx: IProtocolPluginContext
  let aaveV3ProtocolPlugin: AaveV3ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    aaveV3ProtocolPlugin = new AaveV3ProtocolPlugin()
    aaveV3ProtocolPlugin.init(ctx)
  })

  it('should throw an error when protocol data reads fail', async () => {
    const wrongCtx = await createProtocolPluginContext({
      contractProvider: new MockContractProvider({
        ...defaultAddressAbiMapsByProtocol,
        [ProtocolName.AAVEv3]: {
          ...defaultAddressAbiMapsByProtocol[ProtocolName.AAVEv3],
          PoolDataProvider: {
            ...defaultAddressAbiMapsByProtocol[ProtocolName.AAVEv3].PoolDataProvider,
            address: '0xWrong',
          },
        },
      }),
    })
    const aaveV3ProtocolPluginWithWrongCtx = new AaveV3ProtocolPlugin()
    aaveV3ProtocolPluginWithWrongCtx.init(wrongCtx)

    await expect(aaveV3ProtocolPluginWithWrongCtx.getPool(validAaveV3PoolId)).rejects.toThrow(
      `Could not fetch/build assets list for AAVEv3`,
    )
  })

  it('correctly populates collateral configuration from blockchain data', async () => {
    const pool = await aaveV3ProtocolPlugin.getPool(validAaveV3PoolId)
    const mockCollateralToken = Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    })

    expect(pool.collaterals[mockCollateralToken.address.value]).toMatchObject({
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

    const { price } = pool.collaterals[mockCollateralToken.address.value]
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const { priceUSD } = pool.collaterals[mockCollateralToken.address.value]
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const { maxLtv } = pool.collaterals[mockCollateralToken.address.value]
    expect(maxLtv).toBeInstanceOf(RiskRatio)
    expect(maxLtv.ltv.value).toBeGreaterThan(0)
    expect(maxLtv.ltv.value).toBeLessThan(100)

    const { liquidationThreshold } = pool.collaterals[mockCollateralToken.address.value]
    expect(liquidationThreshold).toBeInstanceOf(RiskRatio)
    expect(liquidationThreshold.ltv.value).toBeGreaterThan(0)
    expect(liquidationThreshold.ltv.value).toBeLessThan(100)

    const { tokensLocked } = pool.collaterals[mockCollateralToken.address.value]
    expect(tokensLocked).toBeInstanceOf(TokenAmount)
    expect(Number(tokensLocked.amount)).toBeGreaterThan(0)

    const { maxSupply } = pool.collaterals[mockCollateralToken.address.value]
    expect(maxSupply).toBeInstanceOf(TokenAmount)
    expect(Number(maxSupply.amount)).toBeGreaterThan(0)

    const { liquidationPenalty } = pool.collaterals[mockCollateralToken.address.value]
    expect(liquidationPenalty).toBeInstanceOf(Percentage)
    expect(Number(liquidationPenalty.value)).toBeGreaterThan(100)
  })

  it('correctly populates debt configuration from blockchain data', async () => {
    const pool = await aaveV3ProtocolPlugin.getPool(validAaveV3PoolId)

    const mockDebtToken = Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    })

    expect(pool.debts[mockDebtToken.address.value]).toMatchObject({
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

    const { price } = pool.debts[mockDebtToken.address.value]
    expect(price).toBeInstanceOf(Price)
    expect(Number(price.value)).toBeGreaterThan(0)

    const { priceUSD } = pool.debts[mockDebtToken.address.value]
    expect(priceUSD).toBeInstanceOf(Price)
    expect(Number(priceUSD.value)).toBeGreaterThan(0)

    const { rate } = pool.debts[mockDebtToken.address.value]
    expect(rate).toBeInstanceOf(Percentage)
    expect(rate.value).toBeGreaterThan(0)
    expect(rate.value).toBeLessThan(100)

    const { totalBorrowed } = pool.debts[mockDebtToken.address.value]
    expect(totalBorrowed).toBeInstanceOf(TokenAmount)
    expect(Number(totalBorrowed.amount)).toBeGreaterThan(0)

    const { debtCeiling } = pool.debts[mockDebtToken.address.value]
    expect(debtCeiling).toBeInstanceOf(TokenAmount)
    expect(Number(debtCeiling.amount)).toBeGreaterThan(0)

    const { debtAvailable } = pool.debts[mockDebtToken.address.value]
    expect(debtAvailable).toBeInstanceOf(TokenAmount)
    expect(Number(debtAvailable.amount)).toBeGreaterThan(0)

    const { dustLimit } = pool.debts[mockDebtToken.address.value]
    expect(dustLimit).toBeInstanceOf(TokenAmount)
    expect(Number(dustLimit.amount)).toBe(0)

    const { originationFee } = pool.debts[mockDebtToken.address.value]
    expect(originationFee).toBeInstanceOf(Percentage)
  })
})
