import {
  Address,
  ArmadaPositionId,
  getChainInfoByChainId,
  User,
  Wallet,
} from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Position History', () => {
  const { sdk, chainId, fleetAddress, userAddress } = createAdminSdkTestSetup()

  test('should retrieve position history for a valid position', async () => {
    // Setup: Create test user and position ID using real test configuration
    const user = User.createFromEthereum(chainId, userAddress.value)

    const positionId = ArmadaPositionId.createFrom({
      id: `${userAddress.value.toLowerCase()}-${fleetAddress.value.toLowerCase()}`,
      user,
    })

    console.log('Testing position history retrieval for position ID:', positionId.id)

    // Execute: Call getPositionHistory
    const history = await sdk.armada.users.getPositionHistory({ positionId })

    // Verify: Check response structure
    expect(history).toBeDefined()

    // If position exists, verify snapshot structure
    if (history.position) {
      // Verify hourly snapshots
      expect(Array.isArray(history.position.hourlyPositionHistory)).toBe(true)

      // Verify daily snapshots
      expect(Array.isArray(history.position.dailyPositionHistory)).toBe(true)

      // Verify weekly snapshots
      expect(Array.isArray(history.position.weeklyPositionHistory)).toBe(true)

      // Verify snapshot data structure if snapshots exist
      if (history.position.hourlyPositionHistory.length > 0) {
        const snapshot = history.position.hourlyPositionHistory[0]
        expect(snapshot).toHaveProperty('timestamp')
        expect(snapshot).toHaveProperty('netValue')
        expect(snapshot).toHaveProperty('deposits')
        expect(snapshot).toHaveProperty('withdrawals')

        console.log('Sample hourly snapshot:', {
          timestamp: snapshot.timestamp.toString(),
          netValue: snapshot.netValue,
          deposits: snapshot.deposits,
          withdrawals: snapshot.withdrawals,
        })
      }

      console.log('Position history retrieved successfully:', {
        hourlyCount: history.position.hourlyPositionHistory.length,
        dailyCount: history.position.dailyPositionHistory.length,
        weeklyCount: history.position.weeklyPositionHistory.length,
      })
    } else {
      console.log('Position not found (position may not exist or have no activity)')
      // This is expected for non-existent positions
      expect(history.position).toBeNull()
    }
  })

  test('should handle non-existent position gracefully', async () => {
    // Setup: Create position ID for non-existent position
    const fakeWalletAddress = '0x0000000000000000000000000000000000000001'
    const fakeFleetAddress = '0x0000000000000000000000000000000000000002'

    const fakeAddress = Address.createFromEthereum({
      value: fakeWalletAddress,
    })

    const user = User.createFrom({
      chainInfo: getChainInfoByChainId(chainId),
      wallet: Wallet.createFrom({ address: fakeAddress }),
    })

    const fakePositionId = ArmadaPositionId.createFrom({
      id: `${fakeWalletAddress.toLowerCase()}-${fakeFleetAddress.toLowerCase()}`,
      user,
    })

    // Execute: Call getPositionHistory
    const history = await sdk.armada.users.getPositionHistory({ positionId: fakePositionId })

    // Verify: Should return null position
    expect(history).toBeDefined()
    expect(history.position).toBeNull()

    console.log('Non-existent position handled correctly - returned null')
  })
})
