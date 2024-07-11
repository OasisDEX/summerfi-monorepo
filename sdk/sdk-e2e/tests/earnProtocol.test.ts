import { Address, ChainFamilyMap, type Maybe } from '@summerfi/sdk-common/common'

import { makeSDK, type Chain } from '@summerfi/sdk-client'
import { TransactionUtils } from './utils/TransactionUtils'

import { Token, TokenAmount } from '@summerfi/sdk-common'
import assert from 'assert'
import { base } from 'viem/chains'
import { isAddress, isHex } from 'viem/utils'

jest.setTimeout(300000)

const chainInfo = ChainFamilyMap.Base.Mainnet

const DAI = Token.createFrom({
  chainInfo,
  address: Address.createFromEthereum({ value: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' }),
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  decimals: 18,
})

/** TEST CONFIG */
const config = {
  SDKApiUrl: 'https://h6bwee4lvb.execute-api.us-east-1.amazonaws.com/api/sdk',
  forkUrl: 'https://virtual.base.rpc.tenderly.co/2916e1c7-7ddd-4cd2-b926-449ce4eb2f44',
  walletAddress: process.env.WALLET_ADDRESS,
  privateKey: process.env.DEPLOYER_PRIVATE_KEY,
  fleetAddress: Address.createFromEthereum({
    value: '0xa09e82322f351154a155f9e0f9e6ddbc8791c794',
  }),
}

describe.skip('Earn Protocol Deposit', () => {
  it('should deposit', async () => {
    // SDK
    const sdk = makeSDK({
      apiURL: config.SDKApiUrl,
    })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo,
    })

    assert(chain, 'Chain not found')
    expect(chain.chainInfo.chainId).toEqual(chainInfo.chainId)

    if (!isHex(config.privateKey!)) {
      throw new Error('Invalid DEPLOYER_PRIVATE_KEY')
    }
    if (!isAddress(config.walletAddress!)) {
      throw new Error('Invalid WALLET_ADDRESS')
    }

    // User
    const user = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: Address.createFromEthereum({ value: config.walletAddress }),
    })

    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(config.walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Earn Protocol Manager

    const fleet = chain.earnProtocol.getFleet({
      address: config.fleetAddress,
    })

    assert(fleet, 'Fleet not found')

    const transactions = await fleet.deposit({
      // workaround for User serialization to work
      user: {
        wallet: user.wallet,
        chainInfo: user.chainInfo,
      },
      amount: TokenAmount.createFrom({
        amount: '1',
        token: DAI,
      }),
    })

    // Send transaction
    console.log('transactions', transactions)
    console.log('Sending transaction...', transactions[0].transaction)

    const transactionUtils = new TransactionUtils({
      rpcUrl: config.forkUrl,
      walletPrivateKey: config.privateKey,
      chain: base,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
