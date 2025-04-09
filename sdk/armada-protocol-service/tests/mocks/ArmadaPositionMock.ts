import {
  Address,
  ArmadaPosition,
  ArmadaPositionId,
  ArmadaVault,
  ArmadaVaultId,
  ChainFamilyMap,
  Token,
  TokenAmount,
  User,
  Wallet,
} from '@summerfi/sdk-common'

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

export const ArmadaPositionMock = ArmadaPosition.createFrom({
  id: positionId,
  amount: tokenAmount,
  shares: sharesAmount,
  pool: pool,
  deposits: [],
  withdrawals: [],
  claimedSummerToken: tokenAmount,
  claimableSummerToken: tokenAmount,
  rewards: [],
})
