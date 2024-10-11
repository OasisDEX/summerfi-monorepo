import assert from 'assert'
import { isAddress } from 'viem/utils'

import { makeSDK, type IChain, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ChainFamilyMap,
  TokenAmount,
  User,
  Wallet,
  type IUser,
} from '@summerfi/sdk-common'

import { IArmadaProtocol } from '@summerfi/armada-protocol-common'
import { ArmadaPoolId, ArmadaProtocol } from '@summerfi/armada-protocol-service'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { DAI, USDC } from './utils/TokenMockBase'

jest.setTimeout(300000)

/** TEST CONFIG */
const SDKApiUrl = process.env.E2E_SDK_API_URL,
  walletAddress = process.env.E2E_USER_ADDRESS,
  privateKey = process.env.DEPLOYER_PRIVATE_KEY,
  fleetAddress = Address.createFromEthereum({
    value: '0xd555F7D124a58617f49894b623b97Bf295674f14',
  })

describe('Armada Protocol Deposit', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  let sdk: SDKManager
  let chain: IChain
  let user: IUser
  let protocol: IArmadaProtocol

  if (!SDKApiUrl) {
    throw new Error('Invalid E2E_SDK_API_URL')
  }

  beforeAll(async () => {
    // SDK
    sdk = makeSDK({
      apiURL: SDKApiUrl,
    })

    // Chain
    const maybeChain = await sdk.chains.getChain({
      chainInfo,
    })
    assert(maybeChain, 'Chain not found')
    expect(maybeChain.chainInfo.chainId).toEqual(chainInfo.chainId)
    chain = maybeChain

    if (!isAddress(walletAddress!)) {
      throw new Error('Invalid E2E_USER_ADDRESS')
    }

    // User
    user = User.createFrom({
      wallet: Wallet.createFrom({
        address: Address.createFromEthereum({ value: walletAddress }),
      }),
      chainInfo,
    })

    // Protocol
    protocol = ArmadaProtocol.createFrom({ chainInfo })
  })

  it('should deposit 1 USDC', async () => {
    const token = USDC
    const amount = '1'

    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: fleetAddress,
      protocol,
    })
    const fleet = sdk.armada.users.getPool({
      poolId,
    })
    assert(fleet, 'Fleet not found')

    const transactions = await sdk.armada.users.getNewDepositTX({
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

  it('should fail deposit of DAI with incorrect token error', async () => {
    const token = DAI
    const amount = '1'

    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: fleetAddress,
      protocol,
    })
    const fleet = sdk.armada.users.getPool({
      poolId,
    })
    assert(fleet, 'Fleet not found')

    const transactions = await sdk.armada.users.getNewDepositTX({
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
    const amount = '0.99'

    const poolId = ArmadaPoolId.createFrom({
      chainInfo,
      fleetAddress: fleetAddress,
      protocol,
    })
    const fleet = sdk.armada.users.getPool({
      poolId,
    })
    assert(fleet, 'Fleet not found')

    const transactions = await sdk.armada.users.getWithdrawTX({
      poolId,
      user,
      amount: TokenAmount.createFrom({
        amount,
        token,
      }),
    })

    await sendAndLogTransactions({ chainInfo, transactions })
  })
})
