import { ChainIds, getChainInfoByChainId, User } from '@summerfi/sdk-common'

import { RwaTestConfig } from './utils/testConfig'
import { stringifyArmadaPosition } from './utils/stringifiers'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('Armada Protocol - Positions', () => {
  const scenarios: {
    chainId: typeof ChainIds.Base
  }[] = [
    {
      chainId: RwaTestConfig.chainId,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId } = scenario

    it('should get user positions', async () => {
      const setup = createInstiSdkTestSetup({})
      const { sdk, clientId, userAddress } = setup

      const chainInfo = getChainInfoByChainId(chainId)

      console.log(
        `[RWA SDK] Running on chain ${chainId} (${chainInfo.name}) for clientId ${clientId}`,
      )

      const positions = await sdk.armada.users.getUserPositions({
        user: User.createFromEthereum(chainId, userAddress.value),
      })

      if (!positions || positions.length === 0) {
        console.log('No RWA positions found')
      } else {
        console.log(
          `[RWA SDK] All positions info:\n`,
          positions.map(stringifyArmadaPosition).join('\n'),
        )
      }
    })
  })
})
