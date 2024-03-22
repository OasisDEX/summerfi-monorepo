import { AjnaConfig } from '@summerfi/deployment-types'

export const AjnaConfiguration: AjnaConfig = {
  dependencies: {
    AjnaPoolInfo: {
      name: 'AjnaPoolInfo',
      address: '0x30c5eF2997d6a882DE52c4ec01B6D0a5e5B4fAAE',
      addToRegistry: true,
    },
    AjnaProxyActions: {
      name: 'AjnaProxyActions',
      address: '0x3637DF43F938b05A71bb828f13D9f14498E6883c',
    },
    AjnaPoolPairs_ETHDAI: {
      name: 'AjnaPoolPairs_ETHDAI',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_ETHUSDC: {
      name: 'AjnaPoolPairs_ETHUSDC',
      address: '0xE4BfB9b344A0Ae89702184281F13A295F3D49e15',
    },
    AjnaPoolPairs_RETHDAI: {
      name: 'AjnaPoolPairs_RETHDAI',
      address: '0x9cdB48FcBd8241Bb75887AF04d3b1302c410F671',
    },
    AjnaPoolPairs_RETHETH: {
      name: 'AjnaPoolPairs_RETHETH',
      address: '0xE300B3A6b24cB3c5c87034155F7ffF7F77C862a0',
    },
    AjnaPoolPairs_RETHUSDC: {
      name: 'AjnaPoolPairs_RETHUSDC',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_USDCETH: {
      name: 'AjnaPoolPairs_USDCETH',
      address: '0x2Ceb74Bb7a92D652C850C16F48547aa49F8bca31',
    },
    AjnaPoolPairs_USDCWBTC: {
      name: 'AjnaPoolPairs_USDCWBTC',
      address: '0xE92Cd0ACF334D1133551bC4c87eA73BbC49Ce711',
    },
    AjnaPoolPairs_USDCDAI: {
      name: 'AjnaPoolPairs_USDCDAI',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_WBTCDAI: {
      name: 'AjnaPoolPairs_WBTCDAI',
      address: '0x50f1C63f3AEfD60C665eF45aA74f274dABf93405',
    },
    AjnaPoolPairs_WBTCUSDC: {
      name: 'AjnaPoolPairs_WBTCUSDC',
      address: '0x3BB7C1E268A51b2D933C0490e282e20b906f8652',
    },
    AjnaPoolPairs_WSTETHDAI: {
      name: 'AjnaPoolPairs_WSTETHDAI',
      address: '0xcD261cd365389A58e6467bb8a83A9E437864e8E5',
    },
    AjnaPoolPairs_WSTETHETH: {
      name: 'AjnaPoolPairs_WSTETHETH',
      address: '0x3BA6A019eD5541b5F5555d8593080042Cf3ae5f4',
    },
    AjnaPoolPairs_WSTETHUSDC: {
      name: 'AjnaPoolPairs_WSTETHUSDC',
      address: '0xF5B1AD7F82549c2BBf08AAa79c9eFC70C6E46b06',
    },
    AjnaPoolPairs_CBETHETH: {
      name: 'AjnaPoolPairs_CBETHETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_TBTCWBTC: {
      name: 'AjnaPoolPairs_TBTCWBTC',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_TBTCUSDC: {
      name: 'AjnaPoolPairs_TBTCUSDC',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_ETHGHO: {
      name: 'AjnaPoolPairs_ETHGHO',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_WSTETHGHO: {
      name: 'AjnaPoolPairs_WSTETHGHO',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_GHODAI: {
      name: 'AjnaPoolPairs_GHODAI',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_RETHGHO: {
      name: 'AjnaPoolPairs_RETHGHO',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_WBTCGHO: {
      name: 'AjnaPoolPairs_WBTCGHO',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_CBETHGHO: {
      name: 'AjnaPoolPairs_CBETHGHO',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_WLDUSDC: {
      name: 'AjnaPoolPairs_WLDUSDC',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_USDCWLD: {
      name: 'AjnaPoolPairs_USDCWLD',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_SDAIUSDC: {
      name: 'AjnaPoolPairs_SDAIUSDC',
      address: '0x90Ac6604aE71B5D978f3fC6074078987249119Ea',
    },
    AjnaPoolPairs_YFIDAI: {
      name: 'AjnaPoolPairs_YFIDAI',
      address: '0x66ea46C6e7F9e5BB065bd3B1090FFF229393BA51',
    },
    AjnaPoolPairs_YIELDETHETH: {
      name: 'AjnaPoolPairs_YIELDETHETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_YIELDBTCWBTC: {
      name: 'AjnaPoolPairs_YIELDBTCWBTC',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_TBTCGHO: {
      name: 'AjnaPoolPairs_TBTCGHO',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_CBETHUSDBC: {
      name: 'AjnaPoolPairs_CBETHUSDBC',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaPoolPairs_STYETHDAI: {
      name: 'AjnaPoolPairs_STYETHDAI',
      address: '0x304375e4890146dc575b894b35a42608fab823a8',
    },
    AjnaPoolPairs_RBNETH: {
      name: 'AjnaPoolPairs_RBNETH',
      address: '0xc2a03288c046c7447faa598a515e494cbc7187c3',
    },
    AjnaPoolPairs_AJNADAI: {
      name: 'AjnaPoolPairs_AJNADAI',
      address: '0x2feef99a711d684e00a017c4ac587bea31f12875',
    },
    AjnaRewardsManager: {
      name: 'AjnaRewardsManager',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaRewardsClaimer: {
      name: 'AjnaRewardsClaimer',
      address: '0x0000000000000000000000000000000000000000',
    },
    AjnaRewardsReedemer: {
      name: 'AjnaRewardsReedemer',
      address: '0xf309EE5603bF05E5614dB930E4EAB661662aCeE6',
    },
    AjnaBonusRewardsReedemer: {
      name: 'AjnaBonusRewardsReedemer',
      address: '0xEB233d4D1D756469A2C7f0b42034D0507d744542',
    },
    ERC20PoolFactory: {
      name: 'ERC20PoolFactory',
      address: '0x6146DD43C5622bB6D12A5240ab9CF4de14eDC625',
      addToRegistry: true,
    },
  },
  actions: {
    AjnaDepositBorrow: {
      name: 'AjnaDepositBorrow',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AjnaRepayWithdraw: {
      name: 'AjnaRepayWithdraw',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
  },
}
