import { Address, ChainIds, User, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { makeSDK } from '@summerfi/sdk-client'
import { createSendTransactionTool } from '@summerfi/testing-utils'
import { SDKApiUrl, RpcUrls, TestConfigAccounts } from './utils/testConfig'

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
      signerPrivateKey: TestConfigAccounts.testUserPrivateKey,
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

    it('should check authorization with omitted authorizedCaller (defaults to AdmiralsQuarters)', async () => {
      // When authorizedCaller is omitted the server resolves the deployed AdmiralsQuarters address.
      // This test verifies the omitted-caller path returns a boolean without throwing.
      const authStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: Address.createFromEthereum({ value: userAddress }),
        // authorizedCaller intentionally omitted — server defaults to AdmiralsQuarters
      })
      console.log(`isAuthorizedStakingRewardsCallerV2 (default AQ caller): ${authStatus}`)
      expect(typeof authStatus).toBe('boolean')
    })

    it('should build authorize transaction with omitted authorizedCaller (defaults to AdmiralsQuarters)', async () => {
      // Verify that the omitted-caller path returns a well-formed transaction without throwing.
      // We do NOT send this transaction — simulation is sufficient.
      const authorizeTx = await sdk.armada.users.authorizeStakingRewardsCallerV2({
        user,
        // authorizedCaller intentionally omitted — server defaults to AdmiralsQuarters
        isAuthorized: false,
      })

      expect(authorizeTx).toBeDefined()
      expect(authorizeTx).toHaveLength(1)
      expect(authorizeTx[0].transaction.target).toBeDefined()
      expect(authorizeTx[0].transaction.calldata).toBeDefined()
    })
  })

  describe('getProtocolAddresses', () => {
    const sdk = makeSDK({ apiDomainUrl: SDKApiUrl })

    const supportedChains: ChainId[] = [
      ChainIds.Base,
      ChainIds.ArbitrumOne,
      ChainIds.Mainnet,
      ChainIds.Sonic,
    ]

    it.each(supportedChains)(
      'should return AdmiralsQuarters address from deployment provider for chainId %s',
      async (chainId) => {
        const addresses = await sdk.armada.users.getProtocolAddresses({ chainId })

        expect(addresses).toBeDefined()
        expect(typeof addresses.admiralsQuarters).toBe('string')
        // Must be a valid checksummed Ethereum address (0x + 40 hex chars)
        expect(addresses.admiralsQuarters).toMatch(/^0x[0-9a-fA-F]{40}$/)
        console.log(`getProtocolAddresses chainId=${chainId}: ${addresses.admiralsQuarters}`)
      },
    )

    it('should throw for an unsupported chainId', async () => {
      await expect(
        sdk.armada.users.getProtocolAddresses({ chainId: 9999 as ChainId }),
      ).rejects.toThrow()
    })

    it('getProtocolAddresses and omitted-caller default should resolve to the same AQ address on Base', async () => {
      const addresses = await sdk.armada.users.getProtocolAddresses({ chainId: ChainIds.Base })

      // Build an authorize tx with omitted caller — the target should equal the AQ address
      // returned by getProtocolAddresses, confirming both paths share the same source of truth.
      const testUser = User.createFromEthereum(
        ChainIds.Base,
        '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
      )
      const authorizeTx = await sdk.armada.users.authorizeStakingRewardsCallerV2({
        user: testUser,
        // authorizedCaller omitted — defaults to AQ
        isAuthorized: false,
      })

      // The calldata should encode the same AQ address that getProtocolAddresses returns
      expect(authorizeTx[0].transaction.calldata).toContain(
        addresses.admiralsQuarters.toLowerCase().slice(2),
      )
    })
  })
})
