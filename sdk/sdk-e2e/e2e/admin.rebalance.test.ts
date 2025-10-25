import { Address, ArmadaVaultId, getChainInfoByChainId, TokenAmount } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'
import type { RebalanceScenario } from './utils/types'

jest.setTimeout(5 * 60 * 1000) // 5 minutes

/**
 * @group e2e
 */
describe('Armada Protocol - Admin Rebalance E2E Tests', () => {
  const { sdk, chainId, fleetAddress, governorSendTxTool } = createAdminSdkTestSetup()

  const chainInfo = getChainInfoByChainId(chainId)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  const bufferArk = Address.createFromEthereum({
    value: '0x04acEf9ca748ABD2c2053beD4a7b6dbF8BdCCc31',
  })
  const aaveArk = Address.createFromEthereum({
    value: '0xC01348b33Dd2431980688DBd0D1956BA1e642172',
  })

  const rebalanceScenarios: RebalanceScenario[] = [
    {
      description: 'Buffer ark to Aave ark',
      fromArk: bufferArk,
      toArk: aaveArk,
      amount: '0.5',
      tokenSymbol: 'USDC',
    },
  ]

  describe('rebalance - transferring funds between arks', () => {
    test.each(rebalanceScenarios)(
      'should rebalance funds from $description',
      async ({ description, fromArk, toArk, amount: amountValue, tokenSymbol }) => {
        console.log(`\n=== Starting rebalance scenario: ${description} ===`)

        const usdc = await sdk.tokens.getTokenBySymbol({
          chainId,
          symbol: tokenSymbol,
        })

        const amount = TokenAmount.createFrom({
          amount: amountValue,
          token: usdc,
        })

        console.log(
          `Rebalancing ${amountValue} ${tokenSymbol} from ${fromArk.value} to ${toArk.value}`,
        )

        // Validate and configure fromArk (source)
        console.log('\n--- Validating source ark configuration ---')
        const fromArkConfig = await sdk.armada.admin.arkConfig({
          chainId,
          arkAddressValue: fromArk.toSolidityValue(),
        })
        console.log(`Source ark (${fromArk.value}) config:`, {
          maxRebalanceOutflow: fromArkConfig.maxRebalanceOutflow,
          depositCap: fromArkConfig.depositCap,
        })

        if (BigInt(fromArkConfig.maxRebalanceOutflow) < amount.toSolidityValue()) {
          console.log(
            `Source ark maxRebalanceOutflow (${fromArkConfig.maxRebalanceOutflow}) is below required amount (${amount.toSolidityValue()}), updating...`,
          )

          const setMaxRebalanceOutflowTxInfo = await sdk.armada.admin.setArkMaxRebalanceOutflow({
            vaultId,
            ark: fromArk,
            maxRebalanceOutflow: amount,
          })
          expect(setMaxRebalanceOutflowTxInfo).toBeDefined()

          const setMaxRebalanceOutflowStatus = await governorSendTxTool(
            setMaxRebalanceOutflowTxInfo,
          )
          expect(setMaxRebalanceOutflowStatus).toBe('success')
          console.log('✓ Updated source ark maxRebalanceOutflow')
        } else {
          console.log('✓ Source ark maxRebalanceOutflow is sufficient')
        }

        // Validate and configure toArk (destination)
        console.log('\n--- Validating destination ark configuration ---')
        const toArkConfig = await sdk.armada.admin.arkConfig({
          chainId,
          arkAddressValue: toArk.toSolidityValue(),
        })
        console.log(`Destination ark (${toArk.value}) config:`, {
          depositCap: toArkConfig.depositCap,
          maxRebalanceInflow: toArkConfig.maxRebalanceInflow,
        })

        if (BigInt(toArkConfig.depositCap) < amount.toSolidityValue()) {
          console.log(
            `Destination ark depositCap (${toArkConfig.depositCap}) is below required amount (${amount.toSolidityValue()}), updating...`,
          )

          const setDepositCapTxInfo = await sdk.armada.admin.setArkDepositCap({
            vaultId,
            ark: toArk,
            cap: amount,
          })
          expect(setDepositCapTxInfo).toBeDefined()

          const setDepositCapStatus = await governorSendTxTool(setDepositCapTxInfo)
          expect(setDepositCapStatus).toBe('success')
          console.log('✓ Updated destination ark depositCap')
        } else {
          console.log('✓ Destination ark depositCap is sufficient')
        }

        if (BigInt(toArkConfig.maxRebalanceInflow) < amount.toSolidityValue()) {
          console.log(
            `Destination ark maxRebalanceInflow (${toArkConfig.maxRebalanceInflow}) is below required amount (${amount.toSolidityValue()}), updating...`,
          )

          const setMaxRebalanceInflowTxInfo = await sdk.armada.admin.setArkMaxRebalanceInflow({
            vaultId,
            ark: toArk,
            maxRebalanceInflow: amount,
          })
          expect(setMaxRebalanceInflowTxInfo).toBeDefined()

          const setMaxRebalanceInflowStatus = await governorSendTxTool(setMaxRebalanceInflowTxInfo)
          expect(setMaxRebalanceInflowStatus).toBe('success')
          console.log('✓ Updated destination ark maxRebalanceInflow')
        } else {
          console.log('✓ Destination ark maxRebalanceInflow is sufficient')
        }

        // Execute rebalance
        console.log('\n--- Executing rebalance ---')
        const rebalance = await sdk.armada.admin.rebalance({
          vaultId,
          rebalanceData: [
            {
              fromArk,
              toArk,
              amount,
            },
          ],
        })

        expect(rebalance).toBeDefined()
        console.log('Rebalance transaction prepared')

        const rebalanceStatus = await governorSendTxTool(rebalance)
        expect(rebalanceStatus).toBe('success')
        console.log(`✓ Rebalance successful for ${description}\n`)
      },
    )
  })
})
