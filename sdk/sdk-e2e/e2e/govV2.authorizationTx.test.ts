import { Address, ChainIds, User } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Gov V2 Authorization', () => {
  const scenarios: {
    chainId: typeof ChainIds.Base
    shouldAuthorize: boolean
    target?: string
  }[] = [
    {
      chainId: ChainIds.Base,
      shouldAuthorize: true,
      target: '0xfec27FAAF888Fb4C2Ce6d51547F82E5D05F5D12d',
    },
    {
      chainId: ChainIds.Base,
      shouldAuthorize: false,
      target: '0xfec27FAAF888Fb4C2Ce6d51547F82E5D05F5D12d',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, shouldAuthorize, target } = scenario

    const { sdk, userAddress, userSendTxTool } = createSdkTestSetup({
      chainId,
      simulateOnly: false,
    })

    const user = User.createFromEthereum(chainId, userAddress.value)

    const authorizedCaller = target
      ? Address.createFromEthereum({ value: target as `0x${string}` })
      : undefined

    it('should send authorization transaction and set staking rewards caller authorization state', async () => {
      const initialAuthStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: userAddress,
        authorizedCaller,
      })
      console.log(
        `Initial authorization status for ${authorizedCaller?.value ?? 'default AQ'}: ${initialAuthStatus}`,
      )

      if (shouldAuthorize === initialAuthStatus) {
        console.log(
          `Skipping - caller is already ${shouldAuthorize ? 'authorized' : 'not authorized'}`,
        )
        return
      }

      const authorizeTx = await sdk.armada.users.authorizeStakingRewardsCallerV2({
        user,
        authorizedCaller,
        isAuthorized: shouldAuthorize,
      })

      expect(authorizeTx).toBeDefined()
      expect(authorizeTx).toHaveLength(1)

      const txStatus = await userSendTxTool(authorizeTx, { confirmations: 5 })
      expect(txStatus).toStrictEqual(['success'])

      const afterAuthStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: userAddress,
        authorizedCaller,
      })
      console.log(
        `Authorization status after ${shouldAuthorize ? 'authorization' : 'revocation'}: ${afterAuthStatus}`,
      )
      expect(afterAuthStatus).toBe(shouldAuthorize)
    })

    it('should check authorization status', async () => {
      const authStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: userAddress,
        authorizedCaller,
      })
      console.log(
        `isAuthorizedStakingRewardsCallerV2 (caller: ${authorizedCaller?.value ?? 'default AQ'}): ${authStatus}`,
      )
      expect(typeof authStatus).toBe('boolean')
    })

    it('should build authorize transaction', async () => {
      const authorizeTx = await sdk.armada.users.authorizeStakingRewardsCallerV2({
        user,
        authorizedCaller,
        isAuthorized: false,
      })

      expect(authorizeTx).toBeDefined()
      expect(authorizeTx).toHaveLength(1)
      expect(authorizeTx[0].transaction.target).toBeDefined()
      expect(authorizeTx[0].transaction.calldata).toBeDefined()
    })
  })
})
