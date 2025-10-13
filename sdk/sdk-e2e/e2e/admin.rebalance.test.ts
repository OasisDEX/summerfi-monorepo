import { ArmadaVaultId, getChainInfoByChainId, TokenAmount } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'

describe('Armada Protocol - Admin E2E Tests', () => {
  const { sdk, chainId, fleetAddress, governorSendTxTool } = createAdminSdkTestSetup()

  const chainInfo = getChainInfoByChainId(chainId)

  test('should fetch the list of available arks', async () => {
    const arks = await sdk.armada.admin.arks({
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress,
      }),
    })

    expect(Array.isArray(arks)).toBe(true)
    expect(arks.length).toBeGreaterThan(0)
    arks.forEach((ark) => {
      expect(typeof ark).toBe('object')
      expect(ark.value).toMatch(/^0x[a-fA-F0-9]{40}$/)
      console.log('Ark Address:', ark.value)
    })

    const usdc = await sdk.tokens.getTokenBySymbol({
      chainId,
      symbol: 'USDC',
    })

    const fromArk = arks[0]
    const toArk = arks[1]
    const amount = TokenAmount.createFrom({
      amount: '0.5',
      token: usdc,
    })

    const rebalance = await sdk.armada.admin.rebalance({
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress,
      }),
      rebalanceData: [
        {
          fromArk,
          toArk,
          amount,
        },
      ],
    })

    expect(rebalance).toBeDefined()
    console.log('Rebalance Transaction:', rebalance)

    // const rebalanceStatus = await governorSendTxTool(rebalance)
    // expect(rebalanceStatus).toBe('success')
    // console.log('Rebalance Successful')
  })
})
