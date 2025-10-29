import { Address, getChainInfoByChainId, User } from '@summerfi/sdk-common'

import { ClientIds } from './utils/testConfig'
import { stringifyArmadaPosition } from './utils/stringifiers'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import type { PositionsScenario } from './utils/types'
import assert from 'assert'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('Armada Protocol - Positions', () => {
  const scenarios: PositionsScenario[] = [
    {
      description: 'get all user positions',
      testSpecificFleet: false,
    },
    {
      description: 'get user position for specific fleet',
      testSpecificFleet: true,
    },
    {
      description: 'get all user positions for ACME',
      clientId: ClientIds.ACME,
      testSpecificFleet: false,
    },
    {
      description: 'get user position for specific fleet for ACME',
      clientId: ClientIds.ACME,
      testSpecificFleet: true,
    },
    {
      description: 'get all user positions for Targen',
      clientId: ClientIds.Targen,
      testSpecificFleet: false,
    },
    {
      description: 'get user position for specific fleet for Targen',
      clientId: ClientIds.Targen,
      testSpecificFleet: true,
    },
  ]

  test.each(scenarios)(
    'should $description',
    async ({ description: _description, clientId, testSpecificFleet = false }) => {
      // Choose SDK setup based on scenario
      const setup = clientId ? createAdminSdkTestSetup(clientId) : createSdkTestSetup()
      const { sdk, chainId, fleetAddress, userAddress } = setup

      const chainInfo = getChainInfoByChainId(chainId)
      const user = User.createFromEthereum(chainId, userAddress.value)
      const sdkType = clientId ? 'Admin SDK' : 'User SDK'
      console.log(`[${sdkType}] Running on ${chainInfo.name} for user ${user.wallet.address.value}`)

      if (testSpecificFleet) {
        // Test for specific fleet
        const position = await sdk.armada.users.getUserPosition({
          user: user,
          fleetAddress: Address.createFromEthereum({ value: fleetAddress.value }),
        })

        assert(position != null, 'User position not found')
        console.log(`[${sdkType}] Specific user position:\n`, stringifyArmadaPosition(position))
      } else {
        // Test for all positions
        const positions = await sdk.armada.users.getUserPositions({
          user,
        })

        console.log(
          `[${sdkType}] All user positions:\n`,
          positions.map(stringifyArmadaPosition).join('\n'),
        )
      }
    },
  )
})
