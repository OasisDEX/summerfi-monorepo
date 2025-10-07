/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, TestConfigs } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)

const simulateOnly = false

describe('Armada Protocol Deposit', () => {
  it('should make deposits to fleet', async () => {
    const {
      rpcUrl,
      chainId,
      fleetAddressValue: fleetAddress,
      userAddressValue: userAddress,
      symbol,
    } = TestConfigs.SelfManaged

    const amountValue = '1'
    const swapToSymbol = undefined
    const stake = false

    await runTests({
      rpcUrl,
      chainId,
      fleetAddress,
      userAddress,
      symbol,
      amountValue,
      swapToSymbol,
      stake,
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
  rpcUrl: string
  symbol: string
  amountValue: string
  userAddress: AddressValue
  stake?: boolean
  referralCode?: string
}) {
  const sdk = createTestSDK()

  const chainInfo = getChainInfoByChainId(chainId)

  const user = User.createFromEthereum(chainId, userAddress)

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
    token: swapToken || token,
  })

  console.log(
    `deposit ${amountValue.toString()} to fleet at ${fleetAddress} ${stake ? 'with staking' : 'without staking'} ${swapToken ? ', swapping to ' + swapToken.symbol : ''} ${referralCode ? 'with referral code ' + referralCode : ''}`,
  )

  // check deposit cap
  // const vaultInfo = await sdk.armada.users.getVaultInfo({
  //   vaultId,
  // })
  // assert(
  //   vaultInfo.depositCap.toSolidityValue() >=
  //     vaultInfo.totalDeposits.toSolidityValue() + amount.toSolidityValue(),
  //   `Deposit cap is not enough: ${vaultInfo.depositCap.toString()} < ${vaultInfo.totalDeposits.toString()} + ${amount.toString()}`,
  // )

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
    rpcUrl,
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
