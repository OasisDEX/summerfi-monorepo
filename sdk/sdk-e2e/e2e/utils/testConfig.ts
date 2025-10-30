import { ChainIds, type AddressValue, type HexData } from '@summerfi/sdk-common'

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

export const RpcUrls = {
  Mainnet: process.env.E2E_SDK_FORK_URL_MAINNET,
  Base: process.env.E2E_SDK_FORK_URL_BASE,
  ArbitrumOne: process.env.E2E_SDK_FORK_URL_ARBITRUM,
  Sonic: process.env.E2E_SDK_FORK_URL_SONIC,
} as const

export const FleetAddresses = {
  Base: {
    ETH: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af',
    USDC: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
    EURC: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
    AcmeUSDC: '0xfb42001c8c39011c96b6181ced913aefa0d53514',
  },
  ArbitrumOne: {
    USDT: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
    TargenUSDC: '0x6e23cfe8d830488bc824c0add201a1a2e1dfdbeb',
  },
  Sonic: {
    USDC: '0x507a2d9e87dbd3076e65992049c41270b47964f8',
  },
} as const

/** TEST CONFIG */

export const SDKApiUrl = process.env.E2E_SDK_API_URL

export const SharedConfig = {
  userAddressValue: process.env.TEST_USER_ADDRESS as AddressValue,
  userPrivateKey: process.env.TEST_USER_PRIVATE_KEY as HexData,
  governorAddressValue: process.env.E2E_USER_ADDRESS as AddressValue,
  governorPrivateKey: process.env.E2E_USER_PRIVATE_KEY as HexData,
} as const

export const ChainConfigs = {
  BaseWETH: {
    rpcUrl: RpcUrls.Base,
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.ETH,
    symbol: 'ETH',
  },
  BaseUSDC: {
    rpcUrl: RpcUrls.Base,
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.USDC,
    symbol: 'USDC',
  },
  ArbitrumUSDT: {
    rpcUrl: RpcUrls.ArbitrumOne,
    chainId: ChainIds.ArbitrumOne,
    fleetAddressValue: FleetAddresses.ArbitrumOne.USDT,
    symbol: 'USDT',
  },
  SonicUSDC: {
    rpcUrl: RpcUrls.Sonic,
    chainId: ChainIds.Sonic,
    fleetAddressValue: FleetAddresses.Sonic.USDC,
    symbol: 'USDC',
  },
}

/** INSTI CONFIG */
export enum ClientIds {
  'ACME' = 'ACME',
  'Targen' = 'Targen',
}

export const InstiChainConfigs = {
  [ClientIds.ACME]: {
    rpcUrl: RpcUrls.Base,
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.AcmeUSDC,
    aqAddressValue: '0xaae3f78433a13e3c2aa440600cbd22081b579d15',
    userAddressValue: SharedConfig.userAddressValue,
    symbol: 'ETH',
  },
  [ClientIds.Targen]: {
    rpcUrl: RpcUrls.ArbitrumOne,
    chainId: ChainIds.ArbitrumOne,
    fleetAddressValue: FleetAddresses.ArbitrumOne.TargenUSDC,
    aqAddressValue: '0x43d2c9786e8f5a960e75d6141e44411d065a4615',
    userAddressValue: '0x43d2c9786e8f5a960e75d6141e44411d065a4615',
    symbol: 'USDT',
  },
}
