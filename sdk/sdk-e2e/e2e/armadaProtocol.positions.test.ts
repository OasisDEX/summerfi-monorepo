import {
  Address,
  ChainIds,
  getChainInfoByChainId,
  User,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'

import { TestClientIds } from './utils/testConfig'
import { stringifyArmadaPosition } from './utils/stringifiers'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import assert from 'assert'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('Armada Protocol - Positions', () => {
  const scenarios: {
    userAddress?: AddressValue
    testClientId?: TestClientIds
    testSpecificFleet?: boolean
    chainId?: ChainId
  }[] = [
    {
      testSpecificFleet: false,
      userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
      chainId: ChainIds.Hyperliquid,
    },
    // {
    //   testSpecificFleet: true,
    // },
    // {
    //   testClientId: TestClientIds.ACME,
    //   testSpecificFleet: false,
    // },
    // {
    //   testClientId: TestClientIds.ACME,
    //   testSpecificFleet: true,
    // },
    // {
    //   testClientId: TestClientIds.Targen,
    //   testSpecificFleet: false,
    // },
    // {
    //   testClientId: TestClientIds.Targen,
    //   testSpecificFleet: true,
    // },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const {
      testClientId,
      testSpecificFleet = false,
      userAddress: scenarioUserAddress,
      chainId: scenarioChainId,
    } = scenario

    it('should get user positions', async () => {
      // Choose SDK setup based on scenario
      const setup = testClientId ? createAdminSdkTestSetup(testClientId) : createSdkTestSetup()
      const { sdk, chainId, fleetAddress, userAddress } = setup

      const chainInfo = getChainInfoByChainId(scenarioChainId ?? chainId)
      const user = User.createFromEthereum(
        scenarioChainId ?? chainId,
        scenarioUserAddress ?? userAddress.value,
      )
      const sdkType = testClientId ? 'Admin SDK' : 'User SDK'
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
    })
  })
})
