import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  type AddressValue,
  type ChainId,
  type HexData,
} from '@summerfi/sdk-common'

import { createSendTransactionTool } from '@summerfi/testing-utils'
import { createTestSDK } from './utils/sdkInstance'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'
import { SharedConfig, FleetAddresses, RpcUrls } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Switch', () => {
  const sdk = createTestSDK()

  // Configure test scenarios here
  const switchScenarios: {
    chainId: ChainId
    sourceFleetAddress: AddressValue
    destinationFleetAddress: AddressValue
    rpcUrl: string
    amountValue?: string
    shouldStake?: boolean
    signerAddressValue?: AddressValue
    signerPrivateKey?: HexData
    simulateOnly: boolean
  }[] = [
    {
      chainId: ChainIds.Mainnet,
      rpcUrl: RpcUrls.Mainnet,
      sourceFleetAddress: FleetAddresses.Mainnet.ETHHighRisk,
      destinationFleetAddress: FleetAddresses.Mainnet.USDCHighRisk,
      signerAddressValue: SharedConfig.testUserAddressValue,
      signerPrivateKey: SharedConfig.testUserPrivateKey,
      simulateOnly: true,
    },
    // {
    //   chainId: ChainIds.Base,
    //   sourceFleetAddress: FleetAddresses.Base.EURC,
    //   destinationFleetAddress: FleetAddresses.Base.USDC,
    //   rpcUrl: RpcUrls.Base,
    //   signerAddressValue: SharedConfig.testUserAddressValue,
    //   signerPrivateKey: SharedConfig.testUserPrivateKey,
    //   simulateOnly: true,
    // },
    // {
    //   chainId: ChainIds.Base,
    //   sourceFleetAddress: FleetAddresses.Base.USDC,
    //   destinationFleetAddress: FleetAddresses.Base.ETH,
    //   rpcUrl: RpcUrls.Base,
    //   signerAddressValue: SharedConfig.testUserAddressValue,
    //   signerPrivateKey: SharedConfig.testUserPrivateKey,
    //   simulateOnly: true,
    // },
  ]

  describe('getVaultSwitchTx - switch between vaults', () => {
    test.each(switchScenarios)(
      'should switch position between vaults',
      async ({
        chainId,
        sourceFleetAddress,
        destinationFleetAddress,
        rpcUrl,
        amountValue,
        shouldStake = false,
        signerAddressValue = SharedConfig.testUserAddressValue,
        signerPrivateKey = SharedConfig.testUserPrivateKey,
        simulateOnly = true,
      }) => {
        const chainInfo = getChainInfoByChainId(chainId)
        const user = User.createFromEthereum(chainId, signerAddressValue)
        const userSendTxTool = createSendTransactionTool({
          chainId,
          rpcUrl,
          signerPrivateKey,
          simulateOnly,
        })

        const sourceVaultId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: sourceFleetAddress }),
        })
        const destinationVaultId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: destinationFleetAddress }),
        })
        const slippage = Percentage.createFrom({
          value: DEFAULT_SLIPPAGE_PERCENTAGE,
        })

        // Get source position
        const sourcePositionBefore = await sdk.armada.users.getUserPosition({
          user,
          fleetAddress: Address.createFromEthereum({ value: sourceFleetAddress }),
        })

        assert(
          sourcePositionBefore !== undefined,
          `Source position should be defined for ${sourceFleetAddress}`,
        )
        assert(
          sourcePositionBefore.amount.toSolidityValue() > 0,
          `Source position value should be greater than 0 for ${sourceFleetAddress}`,
        )

        // Get balances before switch
        const sourceFleetAmountBefore = await sdk.armada.users.getFleetBalance({
          user,
          vaultId: sourceVaultId,
        })
        const sourceStakedAmountBefore = await sdk.armada.users.getStakedBalance({
          user,
          vaultId: sourceVaultId,
        })

        const destinationFleetAmountBefore = await sdk.armada.users.getFleetBalance({
          user,
          vaultId: destinationVaultId,
        })
        const destinationStakedAmountBefore = await sdk.armada.users.getStakedBalance({
          user,
          vaultId: destinationVaultId,
        })

        console.log(
          'Source balance before:',
          '\n - Wallet:',
          sourceFleetAmountBefore.assets.toSolidityValue(),
          '\n - Staked:',
          sourceStakedAmountBefore.assets.toSolidityValue(),
        )
        console.log(
          'Destination balance before:',
          '\n - Wallet:',
          destinationFleetAmountBefore.assets.toSolidityValue(),
          '\n - Staked:',
          destinationStakedAmountBefore.assets.toSolidityValue(),
        )

        const switchAmount = TokenAmount.createFrom({
          amount: amountValue ?? sourcePositionBefore.amount.amount,
          token: sourcePositionBefore.amount.token,
        })

        console.log(
          `switch position: ${switchAmount.toString()} from ${sourceFleetAddress} to ${destinationFleetAddress}${shouldStake ? ' with staking' : ''}`,
        )

        // Get switch transaction
        const transactions = await sdk.armada.users.getVaultSwitchTx({
          sourceVaultId,
          destinationVaultId,
          amount: switchAmount,
          user,
          slippage,
          shouldStake,
        })

        expect(transactions).toBeDefined()
        expect(transactions.length).toBeGreaterThan(0)

        // Send transactions
        const txStatus = await userSendTxTool(transactions)

        // Verify balances after switch (only if not simulating)
        if (!simulateOnly) {
          expect(txStatus.every((status) => status === 'success')).toBe(true)

          const destinationPositionAfter = await sdk.armada.users.getUserPosition({
            user,
            fleetAddress: Address.createFromEthereum({ value: destinationFleetAddress }),
          })
          assert(
            destinationPositionAfter !== undefined,
            `Destination position should be defined for ${destinationFleetAddress}`,
          )

          const sourceFleetAmountAfter = await sdk.armada.users.getFleetBalance({
            user,
            vaultId: sourceVaultId,
          })
          const sourceStakedAmountAfter = await sdk.armada.users.getStakedBalance({
            user,
            vaultId: sourceVaultId,
          })

          const destinationFleetAmountAfter = await sdk.armada.users.getFleetBalance({
            user,
            vaultId: destinationVaultId,
          })
          const destinationStakedAmountAfter = await sdk.armada.users.getStakedBalance({
            user,
            vaultId: destinationVaultId,
          })

          console.log(
            'Source balance after:',
            '\n - Wallet:',
            sourceFleetAmountAfter.assets.toSolidityValue(),
            '\n - Staked:',
            sourceStakedAmountAfter.assets.toSolidityValue(),
          )
          console.log(
            'Destination balance after:',
            '\n - Wallet:',
            destinationFleetAmountAfter.assets.toSolidityValue(),
            '\n - Staked:',
            destinationStakedAmountAfter.assets.toSolidityValue(),
          )

          console.log(
            'Source balance difference:',
            '\n - Wallet:',
            sourceFleetAmountAfter.assets.subtract(sourceFleetAmountBefore.assets).toString(),
            '\n - Staked:',
            sourceStakedAmountAfter.assets.subtract(sourceStakedAmountBefore.assets).toString(),
          )
          console.log(
            'Destination balance difference:',
            '\n - Wallet:',
            destinationFleetAmountAfter.assets
              .subtract(destinationFleetAmountBefore.assets)
              .toString(),
            '\n - Staked:',
            destinationStakedAmountAfter.assets
              .subtract(destinationStakedAmountBefore.assets)
              .toString(),
          )

          // Verify that destination balance increased
          const destinationTotalBefore =
            destinationFleetAmountBefore.assets.toSolidityValue() +
            destinationStakedAmountBefore.assets.toSolidityValue()
          const destinationTotalAfter =
            destinationFleetAmountAfter.assets.toSolidityValue() +
            destinationStakedAmountAfter.assets.toSolidityValue()

          expect(destinationTotalAfter).toBeGreaterThan(destinationTotalBefore)
        }
      },
    )
  })
})
