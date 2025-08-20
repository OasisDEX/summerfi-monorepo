import { Address, ChainFamilyMap, type AddressValue } from '@summerfi/sdk-common'

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

/** TEST CONFIG */
export const SDKApiUrl = process.env.E2E_SDK_API_URL,
  signerAddress = process.env.E2E_USER_ADDRESS as AddressValue,
  signerPrivateKey = process.env.E2E_USER_PRIVATE_KEY as AddressValue,
  testWalletAddress = Address.createFromEthereum({
    value: process.env.E2E_USER_ADDRESS as AddressValue,
  }),
  privWalletAddress = Address.createFromEthereum({
    value: process.env.TEST_USER_ADDRESS as AddressValue,
  })

export const testConfig = [
  {
    chainInfo: ChainFamilyMap.Base.Base,
    symbol: 'ETH',
    swapSymbol: 'USDC',
    fleetAddress: Address.createFromEthereum({
      value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
    }),
    rpcUrl: process.env.E2E_SDK_FORK_URL_BASE,
    userAddress: testWalletAddress,
  },
  // {
  //   chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
  //   symbol: 'USDC.e',
  //   fleetAddress: Address.createFromEthereum({
  //     value: '0x2653014Cd3AD332a98B0A80Ccf12473740DF81C2',
  //   }),
  //   rpcUrl: process.env.E2E_SDK_FORK_URL_ARBITRUM,
  //   userAddress,
  // },
  // {
  //   chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  //   symbol: 'USDT',
  //   swapSymbol: 'USDT',
  //   fleetAddress: Address.createFromEthereum({
  //     value: '0xd94d5f8969825c5fBCC127195f08F0762a010BA8',
  //   }),
  //   rpcUrl: process.env.E2E_SDK_FORK_URL_MAINNET,
  //   userAddress,
  // },
  // {
  //   chainInfo: ChainFamilyMap.Sonic.Sonic,
  //   symbol: 'USDC.e',
  //   swapSymbol: 'USDC.e',
  //   fleetAddress: Address.createFromEthereum({
  //     // summer
  //     value: '0x507A2D9E87DBD3076e65992049C41270b47964f8',
  //   }),
  //   rpcUrl: process.env.E2E_SDK_FORK_URL_SONIC,
  //   userAddress,
  // },
]
