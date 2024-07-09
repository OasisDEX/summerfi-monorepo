import { Address, ChainFamilyMap, type Maybe } from '@summerfi/sdk-common/common'

import { makeSDK, type Chain } from '@summerfi/sdk-client'
import { TransactionUtils } from './utils/TransactionUtils'

import { Token, TokenAmount } from '@summerfi/sdk-common'
import assert from 'assert'
import { Hex } from 'viem'

jest.setTimeout(300000)

const chainInfo = ChainFamilyMap.Ethereum.Mainnet

const DAI = Token.createFrom({
  chainInfo,
  address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  decimals: 18,
})

/** TEST CONFIG */
const config = {
  SDKApiUrl: 'https://72dytt1e93.execute-api.us-east-1.amazonaws.com/api/sdk',
  forkUrl: 'https://virtual.mainnet.rpc.tenderly.co/5a4e0cc3-48d2-4819-8426-068f029b23be',
  walletAddress: Address.createFromEthereum({
    value: '0x34314adbfBb5d239bb67f0265c9c45EB8b834412',
  }),
  fleetAddress: Address.createFromEthereum({
    value: '0x34314adbfBb5d239bb67f0265c9c45EB8b834412',
  }),
}

describe('Earn Protocol Deposit', () => {
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
    assert(chain.earnProtocol, 'Chain does not have Earn Protocol')

    // User
    const user = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: config.walletAddress,
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

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      rpcUrl: config.forkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
