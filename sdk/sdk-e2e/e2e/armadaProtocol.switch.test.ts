import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  User,
  Wallet,
  type ChainInfo,
  type IArmadaVaultId,
  type IUser,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, userAddress } from './utils/testConfig'
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

describe('Armada Protocol Switch', () => {
  const main = async () => {
    const chainInfo = getChainInfoByChainId(chainId)
    await runTests({
      chainInfo,
      sourceFleetAddress: usdcFleet,
      destinationFleetAddress: ethFleet,
      rpcUrl,
    })
    await runTests({
      chainInfo,
      sourceFleetAddress: ethFleet,
      destinationFleetAddress: eurcFleet,
      rpcUrl,
    })
    await runTests({
      chainInfo,
      sourceFleetAddress: eurcFleet,
      destinationFleetAddress: usdcFleet,
      rpcUrl,
    })
  }
  main()

  async function runTests({
    chainInfo,
    sourceFleetAddress,
    destinationFleetAddress,
    rpcUrl,
  }: {
    chainInfo: ChainInfo
    sourceFleetAddress: Address
    destinationFleetAddress: Address
    rpcUrl: string | undefined
  }) {
    const sdk: SDKManager = makeSDK({
      apiURL: SDKApiUrl,
    })

    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }

    let user: IUser
    let sourceVaultId: IArmadaVaultId
    let destinationVaultId: IArmadaVaultId
    let slippage: Percentage

    beforeEach(async () => {
      console.log(`Preparation for ${chainInfo.name}`)
      user = User.createFrom({
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
        chainInfo,
      })
      sourceVaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: sourceFleetAddress,
      })
      destinationVaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: destinationFleetAddress,
      })
      slippage = Percentage.createFrom({
        value: 1,
      })
    })

    it(`should switch position from ${sourceFleetAddress.value}`, async () => {
      const sourcePositionBefore = await sdk.armada.users.getUserPosition({
        user,
        fleetAddress: sourceFleetAddress,
      })
      const destinationPositionBefore = await sdk.armada.users.getUserPosition({
        user,
        fleetAddress: destinationFleetAddress,
      })

      assert(
        sourcePositionBefore !== undefined,
        `Source position should be defined for ${sourceFleetAddress.value}`,
      )

      console.log(
        'positions before',
        sourcePositionBefore.amount.toString(),
        destinationPositionBefore?.amount.toString(),
      )

      const transactions = await sdk.armada.users.getVaultSwitchTx({
        sourceVaultId,
        destinationVaultId,
        amount: sourcePositionBefore.amount,
        user,
        slippage,
        shouldStake: true,
      })

      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions,
        rpcUrl: rpcUrl,
        privateKey: signerPrivateKey,
      })
      statuses.forEach((status) => {
        expect(status).toBe('success')
      })

      const sourcePositionAfter = await sdk.armada.users.getUserPosition({
        user,
        fleetAddress: sourceFleetAddress,
      })
      const destinationPositionAfter = await sdk.armada.users.getUserPosition({
        user,
        fleetAddress: destinationFleetAddress,
      })
      assert(
        destinationPositionAfter !== undefined,
        `Destination position should be defined for ${destinationFleetAddress.value}`,
      )

      console.log(
        'positions after',
        sourcePositionAfter?.amount.toString(),
        destinationPositionAfter.amount.toString(),
      )
    })
  }
})
