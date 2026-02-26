import { ChainIds, type AddressValue, type ChainId, type HexData } from '@summerfi/sdk-common'

if (!process.env.E2E_SDK_API_URL) {
  throw new Error('Missing E2E_SDK_API_URL')
}
if (!process.env.E2E_USER_ADDRESS!) {
  throw new Error('Missing E2E_USER_ADDRESS')
}
if (!process.env.E2E_USER_PRIVATE_KEY) {
  throw new Error('Missing E2E_USER_PRIVATE_KEY')
}
if (!process.env.TEST_USER_ADDRESS) {
  throw new Error('Missing TEST_USER_ADDRESS')
}
if (!process.env.TEST_USER_PRIVATE_KEY) {
  throw new Error('Missing TEST_USER_PRIVATE_KEY')
}
if (!process.env.E2E_SDK_FORK_URL_MAINNET) {
  throw new Error('Missing E2E_SDK_FORK_URL_MAINNET')
}
if (!process.env.E2E_SDK_FORK_URL_BASE) {
  throw new Error('Missing E2E_SDK_FORK_URL_BASE')
}
if (!process.env.E2E_SDK_FORK_URL_ARBITRUM) {
  throw new Error('Missing E2E_SDK_FORK_URL_ARBITRUM')
}
if (!process.env.E2E_SDK_FORK_URL_SONIC) {
  throw new Error('Missing E2E_SDK_FORK_URL_SONIC')
}
if (!process.env.E2E_SDK_FORK_URL_HYPERLIQUID) {
  throw new Error('Missing E2E_SDK_FORK_URL_HYPERLIQUID')
}

export const RpcUrls = {
  [ChainIds.Mainnet]: process.env.E2E_SDK_FORK_URL_MAINNET,
  [ChainIds.Base]: process.env.E2E_SDK_FORK_URL_BASE,
  [ChainIds.ArbitrumOne]: process.env.E2E_SDK_FORK_URL_ARBITRUM,
  [ChainIds.Sonic]: process.env.E2E_SDK_FORK_URL_SONIC,
  [ChainIds.Hyperliquid]: process.env.E2E_SDK_FORK_URL_HYPERLIQUID,
} as const

export const FleetAddresses = {
  Base: {
    ETH: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af',
    USDC: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
    EURC: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
    AcmeUSDC: '0x1db644c6077912cf5dab0b5a7f2d8efb5b61df5c',
  },
  ArbitrumOne: {
    USDT: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
    TargenUSDC: '0x6e23cfe8d830488bc824c0add201a1a2e1dfdbeb',
  },
  Mainnet: {
    USDCHighRisk: '0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06',
    USDCLowRisk: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
    ETHHighRisk: '0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10',
  },
  Sonic: {
    USDC: '0x507a2d9e87dbd3076e65992049c41270b47964f8',
  },
  Hyperliquid: {
    USDC: '0x252e5aa42c1804b85b2ce6712cd418a0561232ba',
    USDT: '0x2cc190fb654141dfbeac4c0f718f4d511674d346',
  },
} as const

/** TEST CONFIG */

export const SDKApiUrl = process.env.E2E_SDK_API_URL

export const SharedConfig = {
  testUserAddressValue: process.env.TEST_USER_ADDRESS as AddressValue,
  testUserPrivateKey: process.env.TEST_USER_PRIVATE_KEY as HexData,
  e2eUserAddressValue: process.env.E2E_USER_ADDRESS as AddressValue,
  e2eUserPrivateKey: process.env.E2E_USER_PRIVATE_KEY as HexData,
} as const

export type ChainConfig = {
  rpcUrl: string
  chainId: ChainId
  fleetAddressValue: AddressValue
  symbol: string
}

export const TestConfigs = {
  BaseWETH: {
    rpcUrl: RpcUrls[ChainIds.Base],
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.ETH,
    symbol: 'ETH',
  },
  BaseUSDC: {
    rpcUrl: RpcUrls[ChainIds.Base],
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.USDC,
    symbol: 'USDC',
  },
  ArbitrumUSDT: {
    rpcUrl: RpcUrls[ChainIds.ArbitrumOne],
    chainId: ChainIds.ArbitrumOne,
    fleetAddressValue: FleetAddresses.ArbitrumOne.USDT,
    symbol: 'USDT',
  },
  MainnetUSDCLowRisk: {
    rpcUrl: RpcUrls[ChainIds.Mainnet],
    chainId: ChainIds.Mainnet,
    fleetAddressValue: FleetAddresses.Mainnet.USDCLowRisk,
    symbol: 'USDC',
  },
  SonicUSDC: {
    rpcUrl: RpcUrls[ChainIds.Sonic],
    chainId: ChainIds.Sonic,
    fleetAddressValue: FleetAddresses.Sonic.USDC,
    symbol: 'USDC',
  },
  HyperliquidUSDC: {
    rpcUrl: RpcUrls[ChainIds.Hyperliquid],
    chainId: ChainIds.Hyperliquid,
    fleetAddressValue: FleetAddresses.Hyperliquid.USDC,
    symbol: 'USDC',
  },
  HyperliquidUSDT: {
    rpcUrl: RpcUrls[ChainIds.Hyperliquid],
    chainId: ChainIds.Hyperliquid,
    fleetAddressValue: FleetAddresses.Hyperliquid.USDT,
    symbol: 'USDT',
  },
} satisfies Record<string, ChainConfig>

export type TestConfigKey = keyof typeof TestConfigs
export const TestConfigKeys: TestConfigKey[] = Object.keys(TestConfigs) as TestConfigKey[]

/** INSTI CONFIG */
export enum TestClientIds {
  'ACME' = 'ExtDemoCorp',
  'Targen' = 'Targen',
}

export const InstiTestConfigs = {
  [TestClientIds.ACME]: {
    rpcUrl: RpcUrls[ChainIds.Base],
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.AcmeUSDC,
    aqAddressValue: '0x477285d524628faa3ed62d8086be56810a34795e',
    userAddressValue: SharedConfig.testUserAddressValue,
    symbol: 'ETH',
  },
  [TestClientIds.Targen]: {
    rpcUrl: RpcUrls[ChainIds.ArbitrumOne],
    chainId: ChainIds.ArbitrumOne,
    fleetAddressValue: FleetAddresses.ArbitrumOne.TargenUSDC,
    aqAddressValue: '0x43d2c9786e8f5a960e75d6141e44411d065a4615',
    userAddressValue: '0x43d2c9786e8f5a960e75d6141e44411d065a4615',
    symbol: 'USDT',
  },
} satisfies Record<
  TestClientIds,
  ChainConfig & { aqAddressValue: AddressValue; userAddressValue: AddressValue }
>
