import { Address, ArmadaVaultId, getChainInfoByChainId, TokenAmount } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'

describe('Armada Protocol - Admin E2E Tests', () => {
  const { sdk, chainId, fleetAddress, governorSendTxTool } = createAdminSdkTestSetup()

  const chainInfo = getChainInfoByChainId(chainId)

  test('should fetch the list of available arks', async () => {
    // const arks = await sdk.armada.admin.arks({
    //   vaultId: ArmadaVaultId.createFrom({
    //     chainInfo,
    //     fleetAddress,
    //   }),
    // })

    const aaveArk = Address.createFromEthereum({
      value: '0xC01348b33Dd2431980688DBd0D1956BA1e642172',
    })
    const compArk = Address.createFromEthereum({
      value: '0xBc2d7A8793159F40FB80e8CACcE00c8FdC7c4b42',
    })
    const morphoArk = Address.createFromEthereum({
      value: '0x0016087243e69BE85570f48fde1A33316aB1AA44',
    })
    const moonwellArk = Address.createFromEthereum({
      value: '0x0C2ccA4B3ba72Df9c2C8aC8d9e1a17066088c597',
    })

    const usdc = await sdk.tokens.getTokenBySymbol({
      chainId,
      symbol: 'USDC',
    })

    const fromArk = aaveArk
    const toArk = compArk
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

    const rebalanceStatus = await governorSendTxTool(rebalance)
    expect(rebalanceStatus).toBe('success')
    console.log('Rebalance Successful')
  })
})
