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
  type ChainId,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, testWalletAddress } from './utils/testConfig'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)
const simulateOnly = false

const ethFleet = Address.createFromEthereum({ value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af' })
const usdcFleet = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleet = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const selfManagedFleet = Address.createFromEthereum({
  value: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198',
})

describe('Armada Protocol Withdraw', () => {
  it('should withdraw from fleet', async () => {
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    const chainId = ChainIds.Base
    const fleetAddress = ethFleet
    const userAddress = testWalletAddress
    const amountValue = '0.001'
    const symbol = 'ETH'
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
    fleetAddress: Address
    rpcUrl: string | undefined
    amountValue: string
    userAddress: Address
  }) {
    const sdk: SDKManager = makeSDK({
      apiDomainUrl: SDKApiUrl,
    })
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
      fleetAddress,
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

    const amount = TokenAmount.createFrom({
      amount: amountValue,
      token: token,
    })
    console.log(`withdraw ${amount.toString()} assets back from fleet at ${fleetAddress.value}`)

    const totalAssetsBefore = fleetAmountBefore.assets.add(stakedAmountBefore.assets)
    assert(
      totalAssetsBefore.toSolidityValue() >= amount.toSolidityValue(),
      `Fleet balance is not enough: ${totalAssetsBefore.toString()} < ${amount.toString()}`,
    )

    console.log(
      'assets before:',
      '\n - wallet',
      fleetAmountBefore.assets.toSolidityValue(),
      '\n - staked',
      stakedAmountBefore.assets.toSolidityValue(),
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
