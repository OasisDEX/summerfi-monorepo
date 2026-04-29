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
} from '@summerfi/sdk-common'

import assert from 'assert'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import { FleetAddresses, RpcUrls, SDKApiUrl, SharedConfig } from './utils/testConfig'
import { makeSDK } from '@summerfi/sdk-client'
import { createSendTransactionTool } from '@summerfi/testing-utils'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Switch Enso', () => {
  const scenarios: {
    chainId: ChainId
    sourceFleetAddress: AddressValue
    destinationFleetAddress: AddressValue
    simulateOnly: boolean
    amountValue?: string
  }[] = [
    {
      amountValue: '0.0005',
      chainId: ChainIds.Mainnet,
      sourceFleetAddress: FleetAddresses.Mainnet.ETHHighRisk,
      destinationFleetAddress: FleetAddresses.Mainnet.ETHDao,
      simulateOnly: true,
    },
    // {
    //   chainId: ChainIds.Base,
    //   sourceFleetAddress: FleetAddresses.Base.USDC,
    //   destinationFleetAddress: FleetAddresses.Base.ETH,
    //   simulateOnly: true,
    // },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, sourceFleetAddress, destinationFleetAddress, simulateOnly, amountValue } =
      scenario

    it('should get vault switch transaction via Enso', async () => {
      const sdk = makeSDK({
        apiDomainUrl: SDKApiUrl,
      })
      const userAddress = Address.createFromEthereum({
        value: SharedConfig.testUserAddressValue,
      })

      const userSendTxTool = createSendTransactionTool({
        chainId: chainId,
        rpcUrl: RpcUrls[chainId],
        senderAddressValue: userAddress.value,
        signerPrivateKey: SharedConfig.testUserPrivateKey,
        simulateOnly,
      })

      const chainInfo = getChainInfoByChainId(chainId)
      const user = User.createFromEthereum(chainId, SharedConfig.testUserAddressValue)

      const sourceVaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: sourceFleetAddress }),
      })
      const destinationVaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: destinationFleetAddress }),
      })

      console.log(
        `[Vault Switch Enso] ${sourceFleetAddress} => ${destinationFleetAddress} on chain ${chainId}\n` +
          `User: ${SharedConfig.testUserAddressValue}`,
      )

      // Get source position to determine switch amount
      const sourcePosition = await sdk.armada.users.getUserPosition({
        user,
        fleetAddress: Address.createFromEthereum({ value: sourceFleetAddress }),
      })

      assert(
        sourcePosition !== undefined,
        `Source position should be defined for ${sourceFleetAddress}`,
      )
      assert(
        sourcePosition.amount.toSolidityValue() > 0,
        `Source position should have a positive balance for ${sourceFleetAddress}`,
      )

      const switchAmount = TokenAmount.createFrom({
        amount: amountValue ?? sourcePosition.assets.toString(),
        token: sourcePosition.assets.token,
      })

      console.log(`Switch amount: ${switchAmount.toString()}`)

      const slippage = Percentage.createFrom({ value: DEFAULT_SLIPPAGE_PERCENTAGE })

      // Get vault switch transactions via Enso
      const transactions = await sdk.armada.users.getVaultSwitchEnsoTx({
        sourceVaultId,
        destinationVaultId,
        user,
        amount: switchAmount,
        slippage,
      })

      expect(transactions).toBeDefined()
      expect(transactions.length).toBeGreaterThan(0)

      console.log(
        `Generated ${transactions.length} transaction(s) for vault switch via Enso:\n`,
        JSON.stringify(
          transactions.map(({ type, description, metadata }) => ({
            type,
            description,
            metadata: Object.fromEntries(
              Object.entries(metadata).map(([key, value]) => {
                return [key, value.toString()]
              }),
            ),
          })),
          null,
          2,
        ),
      )

      // Send transactions
      const txStatus = await userSendTxTool(transactions)

      if (!simulateOnly) {
        expect(txStatus.every((status) => status === 'success')).toBe(true)
      }

      console.log('\nVault switch via Enso completed successfully')
    })
  })
})
