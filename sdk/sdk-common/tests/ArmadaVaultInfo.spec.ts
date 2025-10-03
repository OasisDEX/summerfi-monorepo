import { ChainFamilyMap, Address, Token, TokenAmount, Percentage, Price } from '../src'
import { ArmadaVaultId } from '../src/common/implementation/ArmadaVaultId'
import { ArmadaVaultInfo } from '../src/common/implementation/ArmadaVaultInfo'

describe('SDK Common | Armada | ArmadaVaultInfo', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })
  const poolId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  const underlyingAsset = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({
      value: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    }),
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  })

  const sharesAsset = Token.createFrom({
    chainInfo,
    address: fleetAddress,
    name: 'Armada Shares',
    symbol: 'ASH',
    decimals: 18,
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const depositCap = TokenAmount.createFrom({
        token: underlyingAsset,
        amount: '1000000',
      })
      const totalDeposits = TokenAmount.createFrom({
        token: underlyingAsset,
        amount: '100000',
      })

      const totalShares = TokenAmount.createFrom({
        token: sharesAsset,
        amount: '100000',
      })

      const poolInfo = ArmadaVaultInfo.createFrom({
        id: poolId,
        depositCap,
        totalDeposits,
        totalShares,
        sharePrice: Price.createFrom({
          value: '1',
          base: sharesAsset,
          quote: underlyingAsset,
        }),
        token: sharesAsset,
        assetToken: underlyingAsset,
        apy: Percentage.createFrom({
          value: 0.05,
        }),
        apys: {
          live: Percentage.createFrom({ value: 0.05 }),
          sma24h: Percentage.createFrom({ value: 0.049 }),
          sma7day: Percentage.createFrom({ value: 0.048 }),
          sma30day: Percentage.createFrom({ value: 0.047 }),
        },
        rewardsApys: [],
        merklRewards: [],
      })

      expect(poolInfo).toBeDefined()
      expect(poolInfo.id).toEqual(poolId)
      expect(poolInfo.depositCap).toEqual(depositCap)
      expect(poolInfo.totalDeposits).toEqual(totalDeposits)
      expect(poolInfo.totalShares).toEqual(totalShares)
      expect(poolInfo.apys).toBeDefined()
      expect(poolInfo.apys.live).toBeDefined()
      expect(poolInfo.apys.sma24h).toBeDefined()
      expect(poolInfo.apys.sma7day).toBeDefined()
      expect(poolInfo.apys.sma30day).toBeDefined()
    })
  })
})
