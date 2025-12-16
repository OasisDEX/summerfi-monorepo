import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
} from '@summerfi/sdk-common'

import assert from 'assert'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import { FleetAddresses } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Cross Chain Deposit', () => {
  const scenarios: {
    fromChainId: typeof ChainIds.Base
    fromSymbol: string
    toChainId: typeof ChainIds.ArbitrumOne
    toFleetAddress: string
    toSymbol: string
    depositAmount: string
  }[] = [
    // {
    //   fromChainId: ChainIds.Base,
    //   fromSymbol: 'USDT',
    //   toChainId: ChainIds.ArbitrumOne,
    //   toFleetAddress: FleetAddresses.ArbitrumOne.USDT,
    //   toSymbol: 'USDT',
    //   depositAmount: '20',
    // },
    {
      fromChainId: ChainIds.Base,
      fromSymbol: 'USDC',
      toChainId: ChainIds.ArbitrumOne,
      toFleetAddress: FleetAddresses.ArbitrumOne.TargenUSDC,
      toSymbol: 'USDC',
      depositAmount: '10',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { fromChainId, fromSymbol, toChainId, toFleetAddress, toSymbol, depositAmount } = scenario

    it('should get cross-chain deposit transaction', async () => {
      const setup = createSdkTestSetup('BaseUSDC')
      const { sdk, userAddress, userSendTxTool } = setup

      console.log(
        `[Cross-Chain Deposit] ${fromSymbol} on Chain ${fromChainId} => ${toSymbol} on Chain ${toChainId}\n` +
          `User: ${userAddress.value}`,
      )

      // Get source token
      const fromToken = await sdk.tokens.getTokenBySymbol({
        chainId: fromChainId,
        symbol: fromSymbol,
      })

      // Create amount to deposit
      const amount = TokenAmount.createFrom({
        amount: depositAmount,
        token: fromToken,
      })

      // Create user
      const user = User.createFromEthereum(fromChainId, userAddress.value)

      // Create vault ID on destination chain
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo: getChainInfoByChainId(toChainId),
        fleetAddress: Address.createFromEthereum({ value: toFleetAddress }),
      })

      // Get cross-chain deposit transaction
      const transactions = await sdk.armada.users.getCrossChainDepositTx({
        fromChainId,
        vaultId,
        user,
        amount,
        slippage: Percentage.createFrom({
          value: DEFAULT_SLIPPAGE_PERCENTAGE,
        }),
      })

      // Validate transactions
      assert(transactions, 'Transactions should be defined')
      assert(transactions.length > 0, 'Should have at least one transaction')
      console.log(`Generated ${transactions.length} transaction(s) for cross-chain deposit`)

      // Send transactions using the user send tx tool
      console.log('\nSending transactions...')
      const results = await userSendTxTool(transactions)

      // Verify all transactions succeeded
      results.forEach((status) => {
        expect(status).toBe('success')
      })

      console.log('\n✓ Cross-chain deposit completed successfully')
    })
  })
})
