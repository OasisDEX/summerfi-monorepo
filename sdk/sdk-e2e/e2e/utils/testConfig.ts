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
  userOnBase = Address.createFromEthereum({
    value: '0xe9c245293dac615c11a5bf26fcec91c3617645e4',
  }),
  userOnArb = Address.createFromEthereum({
    value: '0xe9c245293dac615c11a5bf26fcec91c3617645e4',
  }),
  forkOnBase = process.env.E2E_SDK_FORK_URL_BASE,
  forkOnArb = process.env.E2E_SDK_FORK_URL_ARBITRUM

export const testConfig = [
  {
    chainInfo: ChainFamilyMap.Base.Base,
    symbol: 'USDC',
    fleetAddress: fleetOnBase,
    forkUrl: forkOnBase,
    userAddress: userOnBase,
  },
  {
    chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
    symbol: 'USDC.e',
    fleetAddress: fleetOnArb,
    forkUrl: forkOnArb,
    userAddress: userOnArb,
  },
]
