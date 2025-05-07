import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  Wallet,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, userAddress } from './utils/testConfig'
import { waitSeconds } from './utils/wait'
import { TX_CONFIRMATION_WAIT_TIME } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)

const chainId = ChainIds.Base
const ethFleet = Address.createFromEthereum({ value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af' })
const usdcFleet = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleet = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE

describe('Armada Protocol Withdraw', () => {
  it('should withdraw from fleet', async () => {
    await runTests({
      swapToSymbol: undefined,
      chainId,
      fleetAddress: usdcFleet,
      rpcUrl,
      amountValue: '0.81',
    })
  })

  async function runTests({
    swapToSymbol: swapSymbol,
    chainId,
    fleetAddress,
    rpcUrl,
    amountValue,
  }: {
    chainId: number
    swapToSymbol: string | undefined
    fleetAddress: Address
    rpcUrl: string | undefined
    amountValue: string
  }) {
    const sdk: SDKManager = makeSDK({
      apiURL: SDKApiUrl,
    })
    if (!rpcUrl) {
      throw new Error('Missing rpc url')
    }

    const chainInfo = getChainInfoByChainId(chainId)

    const user = User.createFrom({
      wallet: Wallet.createFrom({
        address: userAddress,
      }),
      chainInfo,
    })
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })

    const chain = await sdk.chains.getChain({ chainInfo })
    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    const token = vaultInfo.depositCap.token
    const swapToken = swapSymbol
      ? await chain.tokens.getTokenBySymbol({ symbol: swapSymbol })
      : undefined

    console.log(
      `withdraw ${amountValue} USDC unstaked assets back from fleet at ${fleetAddress.value}`,
    )

    const amount = TokenAmount.createFrom({
      amount: amountValue,
      token: swapToken || token,
    })

    const transactions = await sdk.armada.users.getWithdrawTx({
      vaultId: vaultId,
      user,
      amount,
      toToken: swapToken || token,
      slippage: Percentage.createFrom({
        value: 1,
      }),
    })

    const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
      vaultId,
      user,
    })
    const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
      vaultId,
      user,
    })

    console.log(
      'before',
      fleetAmountBefore.assets.toSolidityValue(),
      '/',
      stakedAmountBefore.assets.toSolidityValue(),
    )

    const totalAssetsBefore = fleetAmountBefore.assets.add(stakedAmountBefore.assets)
    assert(
      totalAssetsBefore.isGreaterOrEqualThan(amount),
      `Fleet balance is not enough: ${totalAssetsBefore.toString()} < ${amount.toString()}`,
    )

    const { statuses } = await sendAndLogTransactions({
      chainInfo,
      transactions: transactions,
      rpcUrl: rpcUrl,
      privateKey: signerPrivateKey,
    })
    statuses.forEach((status) => {
      expect(status).toBe('success')
    })

    await waitSeconds(TX_CONFIRMATION_WAIT_TIME)

    const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
      vaultId,
      user,
    })
    const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
      vaultId,
      user,
    })
    console.log(
      'after',
      fleetAmountAfter.assets.toSolidityValue(),
      '/',
      stakedAmountAfter.assets.toSolidityValue(),
    )
    console.log(
      'difference',
      fleetAmountBefore.assets.subtract(fleetAmountAfter.assets).toString(),
      '/',
      stakedAmountBefore.assets.subtract(stakedAmountAfter.assets).toString(),
    )
  }
})
