import {
  Address,
  ArmadaPositionId,
  getChainInfoByChainId,
  User,
  Wallet,
} from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { TestClientIds, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Position Deposits and Withdrawals', () => {
  const scenarios: { testConfigKey?: TestConfigKey; testClientId?: TestClientIds }[] = [
    { testConfigKey: 'BaseUSDC' },
    {
      testClientId: TestClientIds.ACME,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testClientId, testConfigKey } = scenario

    describe('getDeposits', () => {
      it('should retrieve deposits for a valid position', async () => {
        // Choose SDK setup based on scenario
        const setup = testClientId
          ? createAdminSdkTestSetup(testClientId)
          : createSdkTestSetup(testConfigKey)
        const { sdk, chainId, fleetAddress, userAddress } = setup

        const sdkType = testClientId ? 'Admin SDK' : 'User SDK'
        console.log(
          `[${sdkType}] Testing deposit retrieval for ${testClientId || testConfigKey} on chain ${chainId}`,
        )

        // Setup: Create test user and position ID
        const user = User.createFromEthereum(chainId, userAddress.value)

        const positionId = ArmadaPositionId.createFrom({
          id: `${userAddress.value.toLowerCase()}-${fleetAddress.value.toLowerCase()}`,
          user,
        })

        console.log(`[${sdkType}] Position ID:`, positionId.id)

        // Execute: Call getDeposits
        const deposits = await sdk.armada.users.getDeposits({ positionId })

        // Verify: Check response structure
        expect(deposits).toBeDefined()
        expect(Array.isArray(deposits)).toBe(true)
        expect(deposits.length).toBeGreaterThanOrEqual(0)

        const deposit = deposits[0]

        expect(deposit).toHaveProperty('from')
        expect(deposit).toHaveProperty('to')
        expect(deposit).toHaveProperty('amount')
        expect(deposit).toHaveProperty('amountUsd')
        expect(deposit).toHaveProperty('timestamp')
        expect(deposit).toHaveProperty('txHash')
        expect(deposit).toHaveProperty('vaultBalance')
        expect(deposit).toHaveProperty('vaultBalanceUsd')

        expect(typeof deposit.from).toBe('string')
        expect(typeof deposit.to).toBe('string')
        expect(typeof deposit.timestamp).toBe('number')
        expect(typeof deposit.txHash).toBe('string')
        expect(deposit.amount).toBeDefined()
        expect(deposit.amountUsd).toBeDefined()
        expect(deposit.vaultBalance).toBeDefined()
        expect(deposit.vaultBalanceUsd).toBeDefined()

        console.log(`[${sdkType}] Sample deposit:`, {
          from: deposit.from,
          to: deposit.to,
          amount: deposit.amount.toString(),
          amountUsd: deposit.amountUsd.toString(),
          timestamp: new Date(deposit.timestamp * 1000).toISOString(),
          txHash: deposit.txHash,
          vaultBalance: deposit.vaultBalance.toString(),
          vaultBalanceUsd: deposit.vaultBalanceUsd.toString(),
        })

        console.log(`[${sdkType}] Retrieved ${deposits.length} deposits`)
      })

      it('should support pagination parameters', async () => {
        const setup = testClientId
          ? createAdminSdkTestSetup(testClientId)
          : createSdkTestSetup(testConfigKey)
        const { sdk, chainId, fleetAddress, userAddress } = setup

        const sdkType = testClientId ? 'Admin SDK' : 'User SDK'

        // Setup
        const user = User.createFromEthereum(chainId, userAddress.value)
        const positionId = ArmadaPositionId.createFrom({
          id: `${userAddress.value.toLowerCase()}-${fleetAddress.value.toLowerCase()}`,
          user,
        })

        // Execute: Call with pagination
        const depositsPage1 = await sdk.armada.users.getDeposits({
          positionId,
          first: 5,
          skip: 0,
        })

        // Verify
        expect(depositsPage1).toBeDefined()
        expect(Array.isArray(depositsPage1)).toBe(true)
        expect(depositsPage1.length).toBeGreaterThanOrEqual(0)
        expect(depositsPage1.length).toBeLessThanOrEqual(5)

        console.log(
          `[${sdkType}] Retrieved ${depositsPage1.length} deposits with pagination (first: 5, skip: 0)`,
        )
      })

      it('should handle non-existent position gracefully', async () => {
        const setup = testClientId
          ? createAdminSdkTestSetup(testClientId)
          : createSdkTestSetup(testConfigKey)
        const { sdk, chainId } = setup

        const sdkType = testClientId ? 'Admin SDK' : 'User SDK'

        // Setup: Create position ID for non-existent position
        const fakeWalletAddress = '0x0000000000000000000000000000000000000001'
        const fakeFleetAddress = '0x0000000000000000000000000000000000000002'

        const fakeAddress = Address.createFromEthereum({ value: fakeWalletAddress })
        const user = User.createFrom({
          chainInfo: getChainInfoByChainId(chainId),
          wallet: Wallet.createFrom({ address: fakeAddress }),
        })

        const fakePositionId = ArmadaPositionId.createFrom({
          id: `${fakeWalletAddress.toLowerCase()}-${fakeFleetAddress.toLowerCase()}`,
          user,
        })

        // Execute
        const deposits = await sdk.armada.users.getDeposits({ positionId: fakePositionId })

        // Verify: Should return empty array for non-existent position
        expect(deposits).toBeDefined()
        expect(Array.isArray(deposits)).toBe(true)
        expect(deposits.length).toBe(0)

        console.log(`[${sdkType}] Non-existent position returned empty deposits array as expected`)
      })
    })

    describe('getWithdrawals', () => {
      it('should retrieve withdrawals for a valid position', async () => {
        const setup = testClientId
          ? createAdminSdkTestSetup(testClientId)
          : createSdkTestSetup(testConfigKey)
        const { sdk, chainId, fleetAddress, userAddress } = setup

        const sdkType = testClientId ? 'Admin SDK' : 'User SDK'
        console.log(
          `[${sdkType}] Testing withdrawal retrieval for ${testClientId || testConfigKey} on chain ${chainId}`,
        )

        // Setup: Create test user and position ID
        const user = User.createFromEthereum(chainId, userAddress.value)

        const positionId = ArmadaPositionId.createFrom({
          id: `${userAddress.value.toLowerCase()}-${fleetAddress.value.toLowerCase()}`,
          user,
        })

        console.log(`[${sdkType}] Position ID:`, positionId.id)

        // Execute: Call getWithdrawals
        const withdrawals = await sdk.armada.users.getWithdrawals({ positionId })

        // Verify: Check response structure
        expect(withdrawals).toBeDefined()
        expect(Array.isArray(withdrawals)).toBe(true)
        expect(withdrawals.length).toBeGreaterThanOrEqual(0)

        // If withdrawals exist, verify structure
        const withdrawal = withdrawals[0]

        expect(withdrawal).toHaveProperty('from')
        expect(withdrawal).toHaveProperty('to')
        expect(withdrawal).toHaveProperty('amount')
        expect(withdrawal).toHaveProperty('amountUsd')
        expect(withdrawal).toHaveProperty('timestamp')
        expect(withdrawal).toHaveProperty('txHash')
        expect(withdrawal).toHaveProperty('vaultBalance')
        expect(withdrawal).toHaveProperty('vaultBalanceUsd')

        expect(typeof withdrawal.from).toBe('string')
        expect(typeof withdrawal.to).toBe('string')
        expect(typeof withdrawal.timestamp).toBe('number')
        expect(typeof withdrawal.txHash).toBe('string')
        expect(withdrawal.amount).toBeDefined()
        expect(withdrawal.amountUsd).toBeDefined()
        expect(withdrawal.vaultBalance).toBeDefined()
        expect(withdrawal.vaultBalanceUsd).toBeDefined()

        console.log(`[${sdkType}] Sample withdrawal:`, {
          from: withdrawal.from,
          to: withdrawal.to,
          amount: withdrawal.amount.toString(),
          amountUsd: withdrawal.amountUsd.toString(),
          timestamp: new Date(withdrawal.timestamp * 1000).toISOString(),
          txHash: withdrawal.txHash,
          vaultBalance: withdrawal.vaultBalance.toString(),
          vaultBalanceUsd: withdrawal.vaultBalanceUsd.toString(),
        })

        console.log(`[${sdkType}] Retrieved ${withdrawals.length} withdrawals`)
      })

      it('should support pagination parameters', async () => {
        const setup = testClientId
          ? createAdminSdkTestSetup(testClientId)
          : createSdkTestSetup(testConfigKey)
        const { sdk, chainId, fleetAddress, userAddress } = setup

        const sdkType = testClientId ? 'Admin SDK' : 'User SDK'

        // Setup
        const user = User.createFromEthereum(chainId, userAddress.value)
        const positionId = ArmadaPositionId.createFrom({
          id: `${userAddress.value.toLowerCase()}-${fleetAddress.value.toLowerCase()}`,
          user,
        })

        // Execute: Call with pagination
        const withdrawalsPage1 = await sdk.armada.users.getWithdrawals({
          positionId,
          first: 5,
          skip: 0,
        })

        // Verify
        expect(withdrawalsPage1).toBeDefined()
        expect(Array.isArray(withdrawalsPage1)).toBe(true)
        expect(withdrawalsPage1.length).toBeGreaterThanOrEqual(0)
        expect(withdrawalsPage1.length).toBeLessThanOrEqual(5)

        console.log(
          `[${sdkType}] Retrieved ${withdrawalsPage1.length} withdrawals with pagination (first: 5, skip: 0)`,
        )
      })

      it('should handle non-existent position gracefully', async () => {
        const setup = testClientId
          ? createAdminSdkTestSetup(testClientId)
          : createSdkTestSetup(testConfigKey)
        const { sdk, chainId } = setup

        const sdkType = testClientId ? 'Admin SDK' : 'User SDK'

        // Setup: Create position ID for non-existent position
        const fakeWalletAddress = '0x0000000000000000000000000000000000000001'
        const fakeFleetAddress = '0x0000000000000000000000000000000000000002'

        const fakeAddress = Address.createFromEthereum({ value: fakeWalletAddress })
        const user = User.createFrom({
          chainInfo: getChainInfoByChainId(chainId),
          wallet: Wallet.createFrom({ address: fakeAddress }),
        })

        const fakePositionId = ArmadaPositionId.createFrom({
          id: `${fakeWalletAddress.toLowerCase()}-${fakeFleetAddress.toLowerCase()}`,
          user,
        })

        // Execute
        const withdrawals = await sdk.armada.users.getWithdrawals({ positionId: fakePositionId })

        // Verify: Should return empty array for non-existent position
        expect(withdrawals).toBeDefined()
        expect(Array.isArray(withdrawals)).toBe(true)
        expect(withdrawals.length).toBe(0)

        console.log(
          `[${sdkType}] Non-existent position returned empty withdrawals array as expected`,
        )
      })
    })
  })
})
