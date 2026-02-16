import { type SDKVaultishType } from '@summerfi/app-types'

const testVaultId = '0x218f3255fa97a60bf99f175c9c5c56fdf06b15fc'

export const getTestVaultData: () => SDKVaultishType = () => {
  const testData = {
    protocol: {
      network: 'MAINNET' as const,
    },
    id: testVaultId,
    name: 'LazyVault_LowerRisk_USDT',
    rewardsManager: {
      id: '0x8dca3e548c8b80c93ee8404cfc3ca46010c81679',
    },
    rewardTokens: [
      {
        id: '0x194f360d130f2393a5e9f3117a6a1b78abea1624',
        token: {
          id: '0x194f360d130f2393a5e9f3117a6a1b78abea1624',
          symbol: 'SUMR',
          decimals: 18,
        },
      },
    ],
    rewardTokenEmissionsAmount: [],
    rewardTokenEmissionsFinish: [],
    rewardTokenEmissionsUSD: [],
    rebalanceCount: 0n,
    pricePerShare: '1.052219406411465274339427243359416',
    arks: [
      {
        id: '0x0f9da4b515fdab1aec67cfa6a66c24625543f495',
        productId:
          'Syrup-0xdac17f958d2ee523a2206206994597c13d831ec7-0x356b8d89c1e1239cbbb9de4815c39a1474d5ba7d-1',
        name: 'Syrup-usdt-1',
        details:
          '{"protocol":"Syrup","type":"Syrup","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x356B8d89c1e1239Cbbb9dE4815c39A1474d5BA7D","chainId":1}',
        depositLimit: 31000000000000n,
        depositCap: 31000000000000n,
        cumulativeEarnings: 68983601518n,
        inputTokenBalance: 583521026932n,
        maxDepositPercentageOfTVL: 30000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1748950055n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x268ef3412e70a7c1acd594fc72013385fa3cec2c',
        productId:
          'Morpho_V2-0xdac17f958d2ee523a2206206994597c13d831ec7-0xbeef003c68896c7d2c3c60d363e8d71a49ab2bf9-1',
        name: 'ERC4626-Morpho_V2_Steakhouse_Prime_Instant-usdt-1',
        details:
          '{"protocol":"Morpho_V2","type":"ERC4626","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0xbeef003C68896c7D2c3c60d363e8d71a49Ab2bf9","chainId":1,"vaultName":"Morpho_V2_Steakhouse_Prime_Instant"}',
        depositLimit: 13900000000000n,
        depositCap: 13900000000000n,
        cumulativeEarnings: 6705970n,
        inputTokenBalance: 80694264076n,
        maxDepositPercentageOfTVL: 36000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1770330599n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x26c50781f592cf4c7389615a38dc927c81f8a0a4',
        productId:
          'Morpho-0xdac17f958d2ee523a2206206994597c13d831ec7-0xbeef047a543e45807105e51a8bbefcc5950fcfba-1',
        name: 'MorphoVault-usdt-Steakhouse_USDT-1',
        details:
          '{"protocol":"Morpho","type":"Vault","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0xbEef047a543E45807105E51A8BBEFCc5950fcfBa","chainId":1,"vaultName":"Steakhouse_USDT"}',
        depositLimit: 34000000000000n,
        depositCap: 34000000000000n,
        cumulativeEarnings: 55671970538n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 34000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946807n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x2d0afbf4f6bb188638e281c430eded5610f0af14',
        productId:
          'Euler-0xdac17f958d2ee523a2206206994597c13d831ec7-0x313603fa690301b0caeef8069c065862f9162162-1',
        name: 'ERC4626-Euler_Prime-usdt-1',
        details:
          '{"protocol":"Euler","type":"ERC4626","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x313603FA690301b0CaeEf8069c065862f9162162","chainId":1,"vaultName":"Euler_Prime"}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 12659810287n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946723n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x4b7752b3ee55c792784b5431c98d4bdb25d49728',
        productId:
          'Gearbox-0xdac17f958d2ee523a2206206994597c13d831ec7-0x05a811275fe9b4de503b3311f51edf6a856d936e-1',
        name: 'ERC4626-Gearbox-usdt-1',
        details:
          '{"protocol":"Gearbox","type":"ERC4626","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x05a811275fe9b4de503b3311f51edf6a856d936e","chainId":1,"vaultName":"Gearbox"}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 15360501905n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946699n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x593f7246c38a6f1ad34add932d6274b846f367e6',
        productId:
          'CompoundV3-0xdac17f958d2ee523a2206206994597c13d831ec7-0x3afdc9bca9213a35503b077a6072f3d0d5ab0840-1',
        name: 'CompoundV3-usdt-1',
        details:
          '{"protocol":"CompoundV3","type":"Lending","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x3Afdc9BCA9213A35503b077a6072F3D0d5AB0840","chainId":1}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 16877065514n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946651n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x5da1c579175dd284106ccac84d0f4e614a93cb66',
        productId:
          'Euler-0xdac17f958d2ee523a2206206994597c13d831ec7-0x7c280dbdef569e96c7919251bd2b0edf0734c5a8-1',
        name: 'ERC4626-Euler_Yield-usdt-1',
        details:
          '{"protocol":"Euler","type":"ERC4626","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x7c280DBDEf569e96c7919251bD2B0edF0734C5A8","chainId":1,"vaultName":"Euler_Yield"}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 0n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946759n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x650012ba5369d051e381435e8161454c1a0fcbdc',
        productId:
          'Morpho-0xdac17f958d2ee523a2206206994597c13d831ec7-0xa0804346780b4c2e3be118ac957d1db82f9d7484-1',
        name: 'MorphoVault-usdt-Smokehouse_USDT-1',
        details:
          '{"protocol":"Morpho","type":"Vault","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0xA0804346780b4c2e3bE118ac957D1DB82F9d7484","chainId":1,"vaultName":"Smokehouse_USDT"}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 64340247169n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738940279n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x66d635171b5760fd28e41a2f8e4b926c64720542',
        productId:
          'Morpho-0xdac17f958d2ee523a2206206994597c13d831ec7-0x2c25f6c25770ffec5959d34b94bf898865e5d6b1-1',
        name: 'MorphoVault-usdt-Flagship_USDT-1',
        details:
          '{"protocol":"Morpho","type":"Vault","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x2C25f6C25770fFEC5959D34B94Bf898865e5D6b1","chainId":1,"vaultName":"Flagship_USDT"}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 1068843683n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946783n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x6a60336bc45ae0c9aabae13acc4bcc0cbd962e44',
        productId:
          'Fluid-0xdac17f958d2ee523a2206206994597c13d831ec7-0x5c20b550819128074fd538edf79791733ccedd18-1',
        name: 'ERC4626-Fluid-usdt-1',
        details:
          '{"protocol":"Fluid","type":"ERC4626","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x5C20B550819128074FD538Edf79791733ccEdd18","chainId":1,"vaultName":"Fluid"}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 18948142559n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946675n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x8b43a590cc7f0ffd3593131920b226112d329b0e',
        productId: '',
        name: 'BufferArk',
        details: 'BufferArk details',
        depositLimit:
          115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        depositCap: 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        cumulativeEarnings: 26815772n,
        inputTokenBalance: 35719740n,
        maxDepositPercentageOfTVL: 100000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738939139n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0x9bd1564739bf9cb5ae1a639b59240fe3c5a089b6',
        productId:
          'Fluid-0xdac17f958d2ee523a2206206994597c13d831ec7-0x5c20b550819128074fd538edf79791733ccedd18-1',
        name: 'FluidFToken-usdt-1',
        details:
          '{"protocol":"Fluid","type":"FluidFToken","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x5C20B550819128074FD538Edf79791733ccEdd18","chainId":1,"vaultName":"usdt"}',
        depositLimit: 9700000000000n,
        depositCap: 9700000000000n,
        cumulativeEarnings: 2572444018n,
        inputTokenBalance: 609618n,
        maxDepositPercentageOfTVL: 28000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1762098851n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0xa4a6bd19fff5d7b9772e1967b2f53f94924e6c1c',
        productId:
          'AaveV3-0xdac17f958d2ee523a2206206994597c13d831ec7-0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2-1',
        name: 'AaveV3-usdt-1',
        details:
          '{"protocol":"AaveV3","type":"Lending","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2","chainId":1}',
        depositLimit: 2000000000000000n,
        depositCap: 2000000000000000n,
        cumulativeEarnings: 24666358618n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 100000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946627n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0xf2425751c945c3ac0fcde9e638ed5a30829c9294',
        productId:
          'Morpho-0xdac17f958d2ee523a2206206994597c13d831ec7-0x95eef579155cd2c5510f312c8fa39208c3be01a8-1',
        name: 'MorphoVault-usdt-RE7_USDT-1',
        details:
          '{"protocol":"Morpho","type":"Vault","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x95EeF579155cd2C5510F312c8fA39208c3Be01a8","chainId":1,"vaultName":"RE7_USDT"}',
        depositLimit: 0n,
        depositCap: 0n,
        cumulativeEarnings: 0n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 0n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946855n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0xf28b3262e2bb0f11ed25a4c4dc87f7f33dd1b5c5',
        productId:
          'Spark-0xdac17f958d2ee523a2206206994597c13d831ec7-0xc13e21b648a5ee794902342038ff3adab66be987-1',
        name: 'Spark-usdt-1',
        details:
          '{"protocol":"Spark","type":"Lending","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0xC13e21B648A5Ee794902342038FF3aDAB66BE987","chainId":1}',
        depositLimit: 184000000000000n,
        depositCap: 184000000000000n,
        cumulativeEarnings: 828021262n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 45000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946879n,
        lastUpdateTimestamp: 1771254287n,
      },
      {
        id: '0xfa1f432b93b71a8c3cdc0ac32d18f64c80d0f882',
        productId:
          'Morpho-0xdac17f958d2ee523a2206206994597c13d831ec7-0x8cb3649114051ca5119141a34c200d65dc0faa73-1',
        name: 'MorphoVault-usdt-Gauntlet_USDT_Prime-1',
        details:
          '{"protocol":"Morpho","type":"Vault","asset":"0xdac17f958d2ee523a2206206994597c13d831ec7","marketAsset":"0xdac17f958d2ee523a2206206994597c13d831ec7","pool":"0x8CB3649114051cA5119141a34C200D65dc0Faa73","chainId":1,"vaultName":"Gauntlet_USDT_Prime"}',
        depositLimit: 1050000000000n,
        depositCap: 1050000000000n,
        cumulativeEarnings: 12297218538n,
        inputTokenBalance: 0n,
        maxDepositPercentageOfTVL: 35000000000000000000n,
        inputToken: {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
        },
        createdTimestamp: 1738946831n,
        lastUpdateTimestamp: 1771254287n,
      },
    ],
    inputToken: {
      id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
    },
    outputToken: {
      id: testVaultId,
      name: 'LazyVault_LowerRisk_USDT',
      symbol: 'LVUSDT',
      decimals: 6,
    },
    outputTokenSupply: 631286228251n,
    inputTokenBalance: 664251620366n,
    inputTokenPriceUSD: '0.99939646',
    outputTokenPriceUSD: '1.051584349910919698587752425440959',
    depositLimit: 100000000n,
    depositCap: 22500000000000n,
    minimumBufferBalance: 1000000000n,
    createdTimestamp: 1738939139n,
    totalValueLockedUSD: '663850.71794304430436',
    cumulativeTotalRevenueUSD: '0',
    cumulativeSupplySideRevenueUSD: '0',
    cumulativeProtocolSideRevenueUSD: '0',
    lastUpdateTimestamp: 1771254287n,
    withdrawableTotalAssets: 36329358n,
    withdrawableTotalAssetsUSD: '36.30743177927268',
  }

  return testData as unknown as SDKVaultishType
}
