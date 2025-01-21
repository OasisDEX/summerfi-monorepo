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
    value: '0xEb201f4915b6CbFf5a01aBd866Fe6c6A026F224d',
  }),
  fleetOnArb = Address.createFromEthereum({
    value: '0x2653014Cd3AD332a98B0A80Ccf12473740DF81C2',
  }),
  fleetOnMainnet = Address.createFromEthereum({
    value: '0x5c442EA2a29c0A595F017E1b2bEad568d9AA77Da',
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
  //   symbol: 'USDC',
  //   fleetAddress: fleetOnMainnet,
  //   rpcUrl: forkOnMainnet,
  //   userAddress: userOnMainnet,
  // },
]
