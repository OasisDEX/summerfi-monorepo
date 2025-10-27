import { ArmadaVault } from '../src/common/implementation/ArmadaVault'
import { ArmadaVaultId } from '../src/common/implementation/ArmadaVaultId'
import { ArmadaPosition } from '../src/common/implementation/ArmadaPosition'
import { ArmadaPositionId } from '../src/common/implementation/ArmadaPositionId'
import {
  Address,
  ChainFamilyMap,
  FiatCurrency,
  FiatCurrencyAmount,
  Token,
  TokenAmount,
  User,
  Wallet,
} from '../src'

describe('SDK Common | Armada | ArmadaPosition', () => {
  const chainInfo = ChainFamilyMap.Base.Base

  const userAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  const user = User.createFrom({
    chainInfo,
    wallet: Wallet.createFrom({
      address: userAddress,
    }),
  })

  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  const poolId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  const pool = ArmadaVault.createFrom({
    id: poolId,
  })

  const positionId = ArmadaPositionId.createFrom({
    id: 'Test',
    user: user,
  })

  const token = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({
      value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    }),
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  })

  const share = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({
      value: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    }),
    name: 'Armada USDC Pool',
    symbol: 'ARM-USDC',
    decimals: 18,
  })

  const tokenAmount = TokenAmount.createFrom({
    token,
    amount: '123.45',
  })

  const sharesAmount = TokenAmount.createFrom({
    token: share,
    amount: '45.98',
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const position = ArmadaPosition.createFrom({
        id: positionId,
        amount: tokenAmount,
        assets: tokenAmount,
        assetPriceUSD: FiatCurrencyAmount.createFrom({
          amount: '1.23',
          fiat: FiatCurrency.USD,
        }),
        assetsUSD: FiatCurrencyAmount.createFrom({
          amount: '151.84',
          fiat: FiatCurrency.USD,
        }),
        shares: sharesAmount,
        pool: pool,
        depositsAmount: tokenAmount,
        withdrawalsAmount: tokenAmount,
        depositsAmountUSD: FiatCurrencyAmount.createFrom({
          amount: '34.56',
          fiat: FiatCurrency.USD,
        }),
        withdrawalsAmountUSD: FiatCurrencyAmount.createFrom({
          amount: '90.12',
          fiat: FiatCurrency.USD,
        }),
        deposits: [],
        withdrawals: [],
        claimableSummerToken: tokenAmount,
        claimedSummerToken: tokenAmount,
        rewards: [],
        earnings: tokenAmount,
        earningsUSD: FiatCurrencyAmount.createFrom({
          amount: '78.90',
          fiat: FiatCurrency.USD,
        }),
        netDeposits: tokenAmount,
        netDepositsUSD: FiatCurrencyAmount.createFrom({
          amount: '12.34',
          fiat: FiatCurrency.USD,
        }),
      })

      expect(position).toBeDefined()
      expect(position.id).toEqual(positionId)
      expect(position.amount).toEqual(tokenAmount)
      expect(position.pool).toEqual(pool)
    })
  })
})
