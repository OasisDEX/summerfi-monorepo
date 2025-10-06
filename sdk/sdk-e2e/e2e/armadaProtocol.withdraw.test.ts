import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  Wallet,
  type ChainId,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, e2eWalletAddress, FleetAddresses, RpcUrls } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)

const simulateOnly = true

describe('Armada Protocol Withdraw', () => {
  it('should withdraw from fleet', async () => {
    const rpcUrl = RpcUrls.Base
    const chainId = ChainIds.Base
    const fleetAddress = FleetAddresses.Base.selfManaged
    const userAddress = e2eWalletAddress
    const amountValue = '0.1'
    const symbol = 'USDC'
    const swapToSymbol = undefined

    await runTests({
      rpcUrl,
      chainId,
      fleetAddress,
      userAddress,
      amountValue,
      symbol,
      swapToSymbol,
    })
  })

  async function runTests({
    chainId,
    symbol,
    swapToSymbol,
    fleetAddress,
    rpcUrl,
    amountValue,
    userAddress,
  }: {
    chainId: ChainId
    symbol: string
    swapToSymbol: string | undefined
    fleetAddress: string
    rpcUrl: string | undefined
    amountValue: string
    userAddress: Address
  }) {
    const sdk = createTestSDK()
    if (!rpcUrl) {
      throw new Error('Missing rpc url')
    }

    const chainInfo = getChainInfoByChainId(chainId)

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address: userAddress,
      }),
    })
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })

    const token = await sdk.tokens.getTokenBySymbol({ chainId, symbol })
    const swapToken = swapToSymbol
      ? await sdk.tokens.getTokenBySymbol({ chainId, symbol: swapToSymbol })
      : undefined

    const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
      vaultId,
      user,
    })
    const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
      vaultId,
      user,
    })

    console.log(
      'assets before:',
      '\n - wallet',
      fleetAmountBefore.assets.toSolidityValue(),
      '\n - staked',
      stakedAmountBefore.assets.toSolidityValue(),
    )

    const amount = TokenAmount.createFrom({
      amount: amountValue,
      token: token,
    })

    console.log(`withdraw ${amount.toString()} assets back from fleet at ${fleetAddress}`)

    const totalAssetsBefore = fleetAmountBefore.assets.add(stakedAmountBefore.assets)
    assert(
      totalAssetsBefore.toSolidityValue() >= amount.toSolidityValue(),
      `Fleet balance is not enough: ${totalAssetsBefore.toString()} < ${amount.toString()}`,
    )

    const transactions = await sdk.armada.users.getWithdrawTx({
      vaultId,
      user,
      amount,
      toToken: swapToken || token,
      slippage: Percentage.createFrom({
        value: DEFAULT_SLIPPAGE_PERCENTAGE,
      }),
    })

    const { statuses } = await sendAndLogTransactions({
      chainInfo,
      transactions: transactions,
      rpcUrl: rpcUrl,
      privateKey: signerPrivateKey,
      simulateOnly,
    })
    statuses.forEach((status) => {
      expect(status).toBe('success')
    })

    if (!simulateOnly) {
      const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
        vaultId,
        user,
      })
      const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
        vaultId,
        user,
      })
      console.log(
        'assets after:',
        '\n - wallet',
        fleetAmountAfter.assets.toSolidityValue(),
        '\n - staked',
        stakedAmountAfter.assets.toSolidityValue(),
      )
      console.log(
        'assets difference:',
        '\n - wallet',
        fleetAmountAfter.assets.subtract(fleetAmountBefore.assets).toString(),
        '\n - staked',
        stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).toString(),
      )
    }
  }
})
