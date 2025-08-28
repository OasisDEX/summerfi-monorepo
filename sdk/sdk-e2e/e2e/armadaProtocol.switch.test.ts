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
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, testWalletAddress } from './utils/testConfig'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)
const simulateOnly = false

const chainId = ChainIds.Base
const ethFleet = Address.createFromEthereum({ value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af' })
const usdcFleet = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleet = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE

describe('Armada Protocol Switch', () => {
  it('should switch position', async () => {
    // await runTests({
    //   chainId,
    //   sourceFleetAddress: eurcFleet,
    //   destinationFleetAddress: usdcFleet,
    //   amountValue: '1.9999',
    //   rpcUrl,
    // })
    await runTests({
      chainId,
      sourceFleetAddress: usdcFleet,
      destinationFleetAddress: eurcFleet,
      amountValue: '2',
      rpcUrl,
    })
  })

  async function runTests({
    chainId,
    sourceFleetAddress,
    destinationFleetAddress,
    rpcUrl,
    amountValue,
    stake,
  }: {
    chainId: number
    sourceFleetAddress: Address
    destinationFleetAddress: Address
    rpcUrl: string | undefined
    amountValue: string
    stake?: boolean
  }) {
    const sdk: SDKManager = makeSDK({
      apiDomainUrl: SDKApiUrl,
    })
    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }

    const chainInfo = getChainInfoByChainId(chainId)

    const user = User.createFrom({
      wallet: Wallet.createFrom({
        address: testWalletAddress,
      }),
      chainInfo,
    })
    const sourceVaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: sourceFleetAddress,
    })
    const destinationVaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: destinationFleetAddress,
    })
    const slippage = Percentage.createFrom({
      value: DEFAULT_SLIPPAGE_PERCENTAGE,
    })

    const destinationVaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId: destinationVaultId,
    })

    const sourcePositionBefore = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress: sourceFleetAddress,
    })
    const destinationPositionBefore = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress: destinationFleetAddress,
    })

    console.log(
      'positions before:',
      '\n - destination: ',
      destinationPositionBefore?.amount.toString(),
    )

    assert(
      sourcePositionBefore !== undefined,
      `Source position should be defined for ${sourceFleetAddress.value}`,
    )
    assert(
      sourcePositionBefore.amount.toSolidityValue() > 0,
      `Source position value should be greater than 0 for ${sourceFleetAddress.value}`,
    )

    const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
      user,
      vaultId: sourceVaultId,
    })
    const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
      user,
      vaultId: sourceVaultId,
    })
    console.log(
      'Source balance before',
      '\n - Wallet: ',
      fleetAmountBefore.assets.toString(),
      '\n - Staked: ',
      stakedAmountBefore.assets.toString(),
    )

    const switchAmount = TokenAmount.createFrom({
      amount: amountValue,
      token: sourcePositionBefore.amount.token,
    })

    console.log(
      `switch position from ${switchAmount.toString()} to ${destinationVaultInfo.depositCap.token.toString()}`,
    )

    const transactions = await sdk.armada.users.getVaultSwitchTx({
      sourceVaultId,
      destinationVaultId,
      amount: switchAmount,
      user,
      slippage,
      shouldStake: stake,
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

    if (simulateOnly) {
      console.log('Simulation only - skipping post-switch position checks')
      return
    }

    const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
      user,
      vaultId: sourceVaultId,
    })
    const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
      user,
      vaultId: sourceVaultId,
    })
    console.log(
      'Source balance after:',
      '\n - Wallet: ',
      fleetAmountAfter.assets.toString(),
      '\n - Staked: ',
      stakedAmountAfter.assets.toString(),
    )

    const destinationPositionAfter = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress: destinationFleetAddress,
    })
    assert(
      destinationPositionAfter !== undefined,
      `Destination position should be defined for ${destinationFleetAddress.value}`,
    )

    console.log(
      'positions after:',
      '\n - destination: ',
      destinationPositionAfter.amount.toString(),
    )
  }
})
