import { ChainIds, type AddressValue } from '@summerfi/sdk-common'

if (!process.env.E2E_SDK_API_URL) {
  throw new Error('Missing E2E_SDK_API_URL')
}
if (!process.env.E2E_USER_ADDRESS!) {
  throw new Error('Missing E2E_USER_ADDRESS')
}
if (!process.env.TEST_USER_ADDRESS) {
  throw new Error('Missing TEST_USER_ADDRESS')
}
if (!process.env.E2E_USER_PRIVATE_KEY) {
  throw new Error('Missing E2E_USER_PRIVATE_KEY')
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
}

export const FleetAddresses = {
  Base: {
    eth: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af',
    usdc: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
    eurc: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
    selfManaged: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198',
  },
  ArbitrumOne: {
    usdt: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
  },
  Sonic: {
    usdc: '0x507a2d9e87dbd3076e65992049c41270b47964f8',
  },
}

/** TEST CONFIG */
export const SDKApiUrl = process.env.E2E_SDK_API_URL
export const signerAddress = process.env.TEST_USER_ADDRESS as AddressValue
export const signerPrivateKey = process.env.TEST_USER_PRIVATE_KEY as AddressValue

export const userAddress: AddressValue = process.env.TEST_USER_ADDRESS as AddressValue
// export const userAddress: AddressValue = '0x4eb7f19d6efcace59eaed70220da5002709f9b71'

export const TestConfigs = {
  Base: {
    rpcUrl: RpcUrls.Base,
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.usdc,
    symbol: 'USDC',
    userAddressValue: userAddress,
  },
  SelfManaged: {
    rpcUrl: RpcUrls.Base,
    chainId: ChainIds.Base,
    fleetAddressValue: FleetAddresses.Base.selfManaged,
    symbol: 'USDC',
    userAddressValue: userAddress,
  },
  Sonic: {
    rpcUrl: RpcUrls.Sonic,
    chainId: ChainIds.Sonic,
    fleetAddressValue: FleetAddresses.Sonic.usdc,
    symbol: 'USDC',
    userAddressValue: userAddress,
  },
}
