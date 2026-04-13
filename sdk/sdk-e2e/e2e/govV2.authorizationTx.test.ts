import { Address, ChainIds, User, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { makeSDK } from '@summerfi/sdk-client'
import { createSendTransactionTool } from '@summerfi/testing-utils'
import { SDKApiUrl, RpcUrls, SharedConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Gov V2 Authorization', () => {
  const scenarios: {
    userAddress: AddressValue
    chainId: ChainId
    shouldAuthorize: boolean
    target: AddressValue
  }[] = [
    {
      userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
      chainId: ChainIds.Base,
      shouldAuthorize: false,
      target: '0xfec27FAAF888Fb4C2Ce6d51547F82E5D05F5D12d', // aq
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { userAddress, chainId, shouldAuthorize, target } = scenario

    const sdk = makeSDK({ apiDomainUrl: SDKApiUrl })
    const userSendTxTool = createSendTransactionTool({
      chainId,
      rpcUrl: RpcUrls[chainId as keyof typeof RpcUrls],
      senderAddressValue: userAddress,
      signerPrivateKey: SharedConfig.testUserPrivateKey,
      simulateOnly: false,
    })

    const user = User.createFromEthereum(chainId, userAddress)

    // Use a deterministic test address as the authorized caller
    const testAuthorizedCaller = Address.createFromEthereum({
      value: target,
    })

    it('should send authorization transaction and set staking rewards caller authorization state', async () => {
      // Check initial authorization status
      const initialAuthStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: Address.createFromEthereum({ value: userAddress }),
        authorizedCaller: testAuthorizedCaller,
      })
      console.log(
        `Initial authorization status for ${testAuthorizedCaller.value}: ${initialAuthStatus}`,
      )

      // Skip if already in the desired state
      if (shouldAuthorize === initialAuthStatus) {
        console.log(
          `Skipping - caller is already ${shouldAuthorize ? 'authorized' : 'not authorized'}`,
        )
        return
      }

      // Set authorization
      const authorizeTx = await sdk.armada.users.authorizeStakingRewardsCallerV2({
        user,
        authorizedCaller: testAuthorizedCaller,
        isAuthorized: shouldAuthorize,
      })

      expect(authorizeTx).toBeDefined()
      expect(authorizeTx).toHaveLength(1)

      // Send the transaction
      const txStatus = await userSendTxTool(authorizeTx, { confirmations: 5 })
      expect(txStatus).toStrictEqual(['success'])

      // Verify the final authorization state matches the desired value
      const afterAuthStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: Address.createFromEthereum({ value: userAddress }),
        authorizedCaller: testAuthorizedCaller,
      })
      console.log(
        `Authorization status after ${shouldAuthorize ? 'authorization' : 'revocation'}: ${afterAuthStatus}`,
      )
      expect(afterAuthStatus).toBe(shouldAuthorize)
    })
  })
})
