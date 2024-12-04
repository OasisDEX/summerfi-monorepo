import { Address, ChainFamilyMap, Token, TokenAmount } from '@summerfi/sdk-common'
import { ArmadaVaultId } from '../src/common/implementation/ArmadaVaultId'
import { ArmadaVaultInfo } from '../src/common/implementation/ArmadaVaultInfo'
import { ArmadaProtocol } from '../src/common/implementation/ArmadaProtocol'

describe('SDK Common | Armada | ArmadaPoolInfo', () => {
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
      })

      expect(poolInfo).toBeDefined()
      expect(poolInfo.id).toEqual(poolId)
      expect(poolInfo.depositCap).toEqual(depositCap)
      expect(poolInfo.totalDeposits).toEqual(totalDeposits)
      expect(poolInfo.totalShares).toEqual(totalShares)
    })
  })
})
