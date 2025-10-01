/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  signerPrivateKey,
  SDKApiUrl,
  testWalletAddress,
  FleetAddresses,
  RpcUrls,
} from './utils/testConfig'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)

const simulateOnly = false

describe('Armada Protocol Deposit', () => {
  it('should make deposits to fleet', async () => {
    const rpcUrl = RpcUrls.ArbitrumOne
    const chainId = ChainIds.ArbitrumOne
    const fleetAddress = FleetAddresses.ArbitrumOne.usdt
    const userAddress = testWalletAddress
    const amountValue = '1'
    const symbol = 'USD₮0'
    const swapToSymbol = undefined

    await runTests({
      rpcUrl,
      chainId,
      fleetAddress,
      userAddress,
      symbol,
      amountValue,
      swapToSymbol,
      stake: true,
    })
  })
})

async function runTests({
  chainId,
  swapToSymbol,
  fleetAddress,
  rpcUrl,
  symbol,
  amountValue,
  userAddress,
  stake,
  referralCode,
}: {
  chainId: ChainId
  swapToSymbol: string | undefined
  fleetAddress: string
  rpcUrl: string | undefined
  symbol: string
  amountValue: string
  userAddress: Address
  stake?: boolean
  referralCode?: string
}) {
  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
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
    fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
  })

  const vaultInfo = await sdk.armada.users.getVaultInfo({
    vaultId,
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
    token: swapToken || token,
  })

  console.log(
    `deposit ${amountValue.toString()} to fleet at ${fleetAddress} ${stake ? 'with staking' : 'without staking'} ${swapToken ? ', swapping to ' + swapToken.symbol : ''} ${referralCode ? 'with referral code ' + referralCode : ''}`,
  )

  assert(
    vaultInfo.depositCap.toSolidityValue() >=
      vaultInfo.totalDeposits.toSolidityValue() + amount.toSolidityValue(),
    `Deposit cap is not enough: ${vaultInfo.depositCap.toString()} < ${vaultInfo.totalDeposits.toString()} + ${amount.toString()}`,
  )

  const transactions = await sdk.armada.users.getNewDepositTx({
    vaultId,
    user,
    amount,
    slippage: Percentage.createFrom({
      value: DEFAULT_SLIPPAGE_PERCENTAGE,
    }),
    shouldStake: stake,
    referralCode,
  })

  const { statuses } = await sendAndLogTransactions({
    chainInfo,
    transactions,
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
