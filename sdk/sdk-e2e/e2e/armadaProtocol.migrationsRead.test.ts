import {
  ChainIds,
  getChainInfoByChainId,
  User,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'

import { SDKApiUrl, SharedConfig } from './utils/testConfig'
import { makeSDK } from '@summerfi/sdk-client'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Get Migratable Positions', () => {
  const scenarios: { chainId: ChainId; userAddress: AddressValue }[] = [
    { chainId: ChainIds.ArbitrumOne, userAddress: '0x10649c79428d718621821Cf6299e91920284743F' },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, userAddress } = scenario

    it('should get all migratable positions', async () => {
      const sdk = makeSDK({
        apiDomainUrl: SDKApiUrl,
      })

      const chainInfo = getChainInfoByChainId(chainId)
      const user = User.createFromEthereum(chainId, userAddress)

      console.log(`Getting migratable positions on chain ${chainId} for the user ${userAddress}`)

      const res = await sdk.armada.users.getMigratablePositions({
        chainInfo,
        user,
      })
      console.log(
        res.positions.map((p) => ({
          ...p,
          positionTokenAmount: p.positionTokenAmount.toString(),
          underlyingTokenAmount: p.underlyingTokenAmount.toString(),
          usdValue: p.usdValue.toString(),
        })),
      )

      if (res.positions.length > 0) {
        const apy = await sdk.armada.users.getMigratablePositionsApy({
          chainInfo,
          positionIds: res.positions.map((p) => p.id),
        })
        console.log(JSON.stringify(apy.apyByPositionId, null, 2))
      }
    })
  })
})
