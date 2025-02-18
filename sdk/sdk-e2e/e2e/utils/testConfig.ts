import { Address, ChainFamilyMap } from '@summerfi/sdk-common'

if (!process.env.E2E_SDK_API_URL) {
  throw new Error('Missing E2E_SDK_API_URL')
}
if (!process.env.E2E_USER_ADDRESS!) {
  throw new Error('Missing E2E_USER_ADDRESS')
}
if (!process.env.E2E_USER_PRIVATE_KEY) {
  throw new Error('Missing E2E_USER_PRIVATE_KEY')
}

/** TEST CONFIG */
export const SDKApiUrl = process.env.E2E_SDK_API_URL,
  signerAddress = process.env.E2E_USER_ADDRESS,
  signerPrivateKey = process.env.E2E_USER_PRIVATE_KEY,
  fleetOnBase = Address.createFromEthereum({
    value: '0x0b81750655493eee7a4c1f4e7e4fdb9536041720',
  }),
  fleetOnArb = Address.createFromEthereum({
    value: '0x2653014Cd3AD332a98B0A80Ccf12473740DF81C2',
  }),
  fleetOnMainnet = Address.createFromEthereum({
    value: '0xd94d5f8969825c5fBCC127195f08F0762a010BA8',
  }),
  userOnBase = Address.createFromEthereum({
    value: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  }),
  userOnArb = Address.createFromEthereum({
    value: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  }),
  userOnMainnet = Address.createFromEthereum({
    value: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  }),
  forkOnBase = process.env.E2E_SDK_FORK_URL_BASE,
  forkOnArb = process.env.E2E_SDK_FORK_URL_ARBITRUM,
  forkOnMainnet = process.env.E2E_SDK_FORK_URL_MAINNET

export const testConfig = [
  {
    chainInfo: ChainFamilyMap.Base.Base,
    symbol: 'USDC',
    swapSymbol: 'DAI',
    fleetAddress: fleetOnBase,
    rpcUrl: forkOnBase,
    userAddress: userOnBase,
  },
  // {
  //   chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
  //   symbol: 'USDC.e',
  //   fleetAddress: fleetOnArb,
  //   rpcUrl: forkOnArb,
  //   userAddress: userOnArb,
  // },
  // {
  //   chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  //   symbol: 'USDT',
  //   swapSymbol: 'USDT',
  //   fleetAddress: fleetOnMainnet,
  //   rpcUrl: forkOnMainnet,
  //   userAddress: userOnMainnet,
  // },
]
