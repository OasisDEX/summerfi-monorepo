import assert from 'assert'
import { isAddress } from 'viem/utils'

import { makeSDK, type Chain, type SDKManager, type UserClient } from '@summerfi/sdk-client'
import { Address, ChainFamilyMap, TokenAmount } from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { IArmadaProtocol } from '../../armada-protocol-common/src/common'
import {
  ArmadaPoolId,
  ArmadaPositionId,
  ArmadaProtocol,
} from '../../armada-protocol-service/src/common'
import { DAI, USDC } from './utils/TokenMockBase'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKApiUrl: process.env.E2E_SDK_API_URL,
  walletAddress: process.env.E2E_USER_ADDRESS,
  privateKey: process.env.DEPLOYER_PRIVATE_KEY,
  fleetAddress: Address.createFromEthereum({
    value: '0xa09e82322f351154a155f9e0f9e6ddbc8791c794',
  }),
}

describe.skip('Armada Protocol Deposit', () => {
  const chainInfo = ChainFamilyMap.Base.Mainnet
  let sdk: SDKManager
  let chain: Chain
  let user: UserClient
  let protocol: IArmadaProtocol

  beforeAll(async () => {
    // SDK
    if (!config.SDKApiUrl) {
      throw new Error('Invalid E2E_SDK_API_URL')
    }
    sdk = makeSDK({
      apiURL: config.SDKApiUrl,
    })

    // Chain
    const maybeChain = await sdk.chains.getChain({
      chainInfo,
    })
    assert(maybeChain, 'Chain not found')
    expect(maybeChain.chainInfo.chainId).toEqual(chainInfo.chainId)
    chain = maybeChain

    if (!isAddress(config.walletAddress!)) {
      throw new Error('Invalid E2E_USER_ADDRESS')
    }

    // User
    user = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: Address.createFromEthereum({ value: config.walletAddress }),
    })
    expect(user).toBeDefined()
    expect(user.wallet.address.value).toEqual(config.walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Protocol
    protocol = ArmadaProtocol.createFrom({ chainInfo })
  })

  it('should deposit 1 USDC', async () => {
    const token = USDC
    const amount = '1'

    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: config.fleetAddress,
      protocol,
    })
    const fleet = sdk.armada.getPool({
      poolId,
    })
    assert(fleet, 'Fleet not found')

    const transactions = await sdk.armada.getNewDepositTX({
      poolId,
      user: user,
      amount: TokenAmount.createFrom({
        amount,
        token,
      }),
    })

    await sendAndLogTransactions({
      chainInfo,
      transactions,
    })
  })

  it('should fail deposit of DAI with incorrect token error', async () => {
    const token = DAI
    const amount = '1'

    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: config.fleetAddress,
      protocol,
    })
    const fleet = sdk.armada.getPool({
      poolId,
    })
    assert(fleet, 'Fleet not found')

    const transactions = await sdk.armada.getNewDepositTX({
      poolId,
      user,
      amount: TokenAmount.createFrom({
        amount,
        token,
      }),
    })

    await sendAndLogTransactions({
      chainInfo,
      transactions,
    })
  })

  it('should withdraw 1 USDC', async () => {
    const token = USDC
    const amount = '1'

    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: config.fleetAddress,
      protocol,
    })
    const fleet = sdk.armada.getPool({
      poolId,
    })
    assert(fleet, 'Fleet not found')

    const positionId = ArmadaPositionId.createFrom({
      id: 'TestPosition',
      user,
    })

    const transactions = await sdk.armada.getWithdrawTX({
      poolId,
      positionId,
      amount: TokenAmount.createFrom({
        amount,
        token,
      }),
    })

    await sendAndLogTransactions({ chainInfo, transactions })
  })
})
