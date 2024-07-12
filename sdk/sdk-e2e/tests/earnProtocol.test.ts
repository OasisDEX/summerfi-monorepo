import assert from 'assert'
import { isAddress } from 'viem/utils'

import { makeSDK, type Chain, type UserClient } from '@summerfi/sdk-client'
import { TokenAmount, Address, ChainFamilyMap } from '@summerfi/sdk-common'

import { USDC, DAI } from './utils/TokenMockBase'
import { sendAndLogTransactions } from './utils/sendAndLogTransactions'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKApiUrl: process.env.SDK_API_URL,
  walletAddress: process.env.WALLET_ADDRESS,
  privateKey: process.env.DEPLOYER_PRIVATE_KEY,
  fleetAddress: Address.createFromEthereum({
    value: '0xa09e82322f351154a155f9e0f9e6ddbc8791c794',
  }),
}

describe.only('Earn Protocol Deposit', () => {
  // SDK
  if (!config.SDKApiUrl) {
    throw new Error('Invalid SDK_API_URL')
  }
  const sdk = makeSDK({
    apiURL: config.SDKApiUrl,
  })
  const chainInfo = ChainFamilyMap.Base.Mainnet
  let chain: Chain
  let user: UserClient

  beforeEach(async () => {
    // Chain
    const maybeChain = await sdk.chains.getChain({
      chainInfo,
    })
    assert(maybeChain, 'Chain not found')
    expect(maybeChain.chainInfo.chainId).toEqual(chainInfo.chainId)
    chain = maybeChain

    if (!isAddress(config.walletAddress!)) {
      throw new Error('Invalid WALLET_ADDRESS')
    }

    // User
    user = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: Address.createFromEthereum({ value: config.walletAddress }),
    })
    expect(user).toBeDefined()
    expect(user.wallet.address.value).toEqual(config.walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)
  })

  it('should deposit correct token', async () => {
    const depositToken = USDC

    const fleet = chain.earnProtocol.getFleet({
      address: config.fleetAddress,
    })
    assert(fleet, 'Fleet not found')

    const transactions = await fleet.deposit({
      user: getUserWorkaround(user),
      amount: TokenAmount.createFrom({
        amount: '1',
        token: depositToken,
      }),
    })

    await sendAndLogTransactions(transactions)
  })

  it.skip('should fail deposit with incorrect token with appropriate error', async () => {
    const depositToken = DAI

    const fleet = chain.earnProtocol.getFleet({
      address: config.fleetAddress,
    })
    assert(fleet, 'Fleet not found')

    const transactions = await fleet.deposit({
      user: getUserWorkaround(user),
      amount: TokenAmount.createFrom({
        amount: '1',
        token: depositToken,
      }),
    })

    await sendAndLogTransactions(transactions)
  })
})

function getUserWorkaround(user: UserClient) {
  // workaround for User serialization to work
  return {
    wallet: user.wallet,
    chainInfo: user.chainInfo,
  }
}
