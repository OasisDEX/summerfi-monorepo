import { ChainFamilyMap } from '@summerfi/sdk-common'
import type { ArmadaMigrationConfig } from './types'

export const morphoBlueConfigsByChainId: Record<number, Record<string, ArmadaMigrationConfig>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    // 're7-cdxusd': {
    //   sourceContract: '0x74B6EA9BFee07C3756969b0139CFacBBa5845969',
    //   underlyingToken: zeroAddress,
    // },
    // 'moonwell-flagship-eurc': {
    //   sourceContract: '0xf24608E0CCb972b0b0f4A6446a0BBf58c701a026',
    //   underlyingToken: zeroAddress,
    // },
    // 'morpho-eusd': {
    //   sourceContract: '0xbb819D845b573B5D7C538F5b85057160cfb5f313',
    //   underlyingToken: zeroAddress,
    // },
    // 'morpho-mai': {
    //   sourceContract: '0x30B8A2c8E7Fa41e77b54b8FaF45c610e7aD909E3',
    //   underlyingToken: zeroAddress,
    // },
    // 'steakhouse-eurc': {
    //   sourceContract: '0xBeEF086b8807Dc5E5A1740C5E3a7C4c366eA6ab5',
    //   underlyingToken: zeroAddress,
    // },
    // 'moonwell-frontier-cbbtc': {
    //   sourceContract: '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796',
    //   underlyingToken: zeroAddress,
    // },
    'steakhouse-usdc': {
      positionAddress: '0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: '3ad60cb7-74db-448b-9e3b-e6af576e697f',
    },
    // 'steakhouse-usdm': {
    //   sourceContract: '0xBEef03f0BF3cb2e348393008a826538AaDD7d183',
    //   underlyingToken: zeroAddress,
    // },
    // 'steakhouse-usda': {
    //   sourceContract: '0xbEEfa1aBfEbE621DF50ceaEF9f54FdB73648c92C',
    //   underlyingToken: zeroAddress,
    // },
    'steakhouse-usdc-rwa': {
      positionAddress: '0xbEefc4aDBE58173FCa2C042097Fe33095E68C3D6',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: 'ba422094-6425-4549-b959-a4eb9afcadcb',
    },
    'ionic-ecosystem-weth': {
      positionAddress: '0x9aB2d181E4b87ba57D5eD564D3eF652C4E710707',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: 'c2cd88db-5952-4eaf-8cbd-d228afa4fd24',
    },
    're7-rwa-verusdc': {
      positionAddress: '0x6e37C95b43566E538D8C278eb69B00FC717a001b',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: '820ee325-1eb1-4184-9bb7-cc31fc228dd2',
    },
    'ionic-ecosystem-usdc': {
      positionAddress: '0xCd347c1e7d600a9A3e403497562eDd0A7Bc3Ef21',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    '9summits-weth-core': {
      positionAddress: '0xF540D790413FCFAedAC93518Ae99EdDacE82cb78',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: null,
    },
    'gauntlet-weth-core': {
      positionAddress: '0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: null,
    },
    'seamless-usdc-vault': {
      positionAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    // 'steakhouse-eura': {
    //   sourceContract: '0xBEeFA28D5e56d41D35df760AB53B94D9FfD7051F',
    //   underlyingToken: zeroAddress,
    // },
    // 'steakhouse-eth': {
    //   sourceContract: '0xbEEf050a7485865A7a8d8Ca0CC5f7536b7a3443e',
    //   underlyingToken: zeroAddress,
    // },
    // 'moonwell-flagship-eth': {
    //   sourceContract: '0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1',
    //   underlyingToken: zeroAddress,
    // },
    'gauntlet-usdc-prime': {
      positionAddress: '0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    'universal-usdc': {
      positionAddress: '0xB7890CEE6CF4792cdCC13489D36D9d42726ab863',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    'ionic-ecosystem-weth-2': {
      positionAddress: '0x5A32099837D89E3a794a44fb131CBbAD41f87a8C',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: null,
    },
    're7-weth': {
      positionAddress: '0xA2Cac0023a4797b4729Db94783405189a4203AFc',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: null,
    },
    // 'seamless-cbbtc-vault': {
    //   sourceContract: '0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7',
    //   underlyingToken: zeroAddress,
    // },
    // 'pyth-eth': {
    //   sourceContract: '0x80D9964fEb4A507dD697b4437Fc5b25b618CE446',
    //   underlyingToken: zeroAddress,
    // },
    '9summits-weth-core-1-1': {
      positionAddress: '0x5496b42ad0deCebFab0db944D83260e60D54f667',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: null,
    },
    'gauntlet-usdc-core': {
      positionAddress: '0xc0c5689e6f4D256E861F65465b691aeEcC0dEb12',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    // 'gauntlet-lbtc-core': {
    //   sourceContract: '0x0D05e6ec0A10f9fFE9229EAA785c11606a1d13Fb',
    //   underlyingToken: zeroAddress,
    // },
    'spark-usdc-vault': {
      positionAddress: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: '9f146531-9c31-46ba-8e26-6b59bdaca9ff',
    },
    'seamless-weth-vault': {
      positionAddress: '0x27D8c7273fd3fcC6956a0B370cE5Fd4A7fc65c18',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: null,
    },
    'degen-usdc': {
      positionAddress: '0xdB90A4e973B7663ce0Ccc32B6FbD37ffb19BfA83',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    // 'relend-eth': {
    //   sourceContract: '0x70F796946eD919E4Bc6cD506F8dACC45E4539771',
    //   underlyingToken: zeroAddress,
    // },
    // 'metronome-mseth-vault': {
    //   sourceContract: '0x43Cd00De63485618A5CEEBE0de364cD6cBeB26E7',
    //   underlyingToken: zeroAddress,
    // },
    // 'gauntlet-eurc-core': {
    //   sourceContract: '0x1c155be6bC51F2c37d472d4C2Eba7a637806e122',
    //   underlyingToken: zeroAddress,
    // },
    'moonwell-flagship-usdc': {
      positionAddress: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    // 'morpho-degen': {
    //   sourceContract: '0x8c3A6B12332a6354805Eb4b72ef619aEdd22BcdD',
    //   underlyingToken: zeroAddress,
    // },
    're7-usdc': {
      positionAddress: '0x12AFDeFb2237a5963e7BAb3e2D46ad0eee70406e',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    'ionic-ecosystem-usdc-2': {
      positionAddress: '0x23479229e52Ab6aaD312D0B03DF9F33B46753B5e',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
    // 'gauntlet-cbbtc-core': {
    //   sourceContract: '0x6770216aC60F634483Ec073cBABC4011c94307Cb',
    //   underlyingToken: zeroAddress,
    // },
    'pyth-usdc': {
      positionAddress: '0x0FaBfEAcedf47e890c50C8120177fff69C6a1d9B',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: null,
    },
  },
  [ChainFamilyMap.Ethereum.Mainnet.chainId]: {
    'spark-dai-vault': {
      positionAddress: '0x73e65DBD630f90604062f6E02fAb9138e713edD9',
      underlyingToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      pool: '30347261-b48b-4781-b394-081e630d49a9',
    },
  },
  [ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]: {},
}
