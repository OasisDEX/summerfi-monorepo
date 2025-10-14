import { Address, ArmadaVaultId, getChainInfoByChainId, TokenAmount } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'

jest.setTimeout(5 * 60 * 1000) // 5 minutes

describe('Armada Protocol - Admin E2E Tests', () => {
  const { sdk, chainId, fleetAddress, governorSendTxTool } = createAdminSdkTestSetup()

  const chainInfo = getChainInfoByChainId(chainId)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  test('should fetch the list of available arks', async () => {
    const bufferArk = Address.createFromEthereum({
      value: '0x04acEf9ca748ABD2c2053beD4a7b6dbF8BdCCc31',
    })
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

    const fromArk = bufferArk
    const toArk = aaveArk
    const amount = TokenAmount.createFrom({
      amount: '0.5',
      token: usdc,
    })

    // validate maxRebalanceOutflow on fromArk
    const fromArkConfig = await sdk.armada.admin.arkConfig({
      chainId,
      arkAddressValue: fromArk.toSolidityValue(),
    })
    console.log('fromArkConfig', fromArkConfig)

    if (BigInt(fromArkConfig.maxRebalanceOutflow) < amount.toSolidityValue()) {
      console.log('fromArk maxRebalanceOutflow too low, sending tx to update it')
      // need to set maxRebalanceOutflow on fromArk
      const setMaxRebalanceOutflowTxInfo = await sdk.armada.admin.setArkMaxRebalanceOutflow({
        vaultId,
        ark: fromArk,
        maxRebalanceOutflow: amount,
      })
      expect(setMaxRebalanceOutflowTxInfo).toBeDefined()
      const setMaxRebalanceOutflowStatus = await governorSendTxTool(setMaxRebalanceOutflowTxInfo)
      expect(setMaxRebalanceOutflowStatus).toBe('success')
      console.log('Set maxRebalanceOutflow on fromArk Successful')
    }

    // validate deposit cap and maxRebalanceInflow on toArk
    const toArkConfig = await sdk.armada.admin.arkConfig({
      chainId,
      arkAddressValue: toArk.toSolidityValue(),
    })
    console.log('toArkConfig', toArkConfig)

    if (BigInt(toArkConfig.depositCap) < amount.toSolidityValue()) {
      console.log('toArk depositCap too low, sending tx to update it')
      // need to set depositCap on toArk
      const setDepositCapTxInfo = await sdk.armada.admin.setArkDepositCap({
        vaultId,
        ark: toArk,
        cap: amount,
      })
      expect(setDepositCapTxInfo).toBeDefined()
      const setDepositCapStatus = await governorSendTxTool(setDepositCapTxInfo)
      expect(setDepositCapStatus).toBe('success')
      console.log('Set depositCap on toArk Successful')
    }
    if (BigInt(toArkConfig.maxRebalanceInflow) < amount.toSolidityValue()) {
      console.log('toArk maxRebalanceInflow too low, sending tx to update it')
      // need to set maxRebalanceInflow on toArk
      const setMaxRebalanceInflowTxInfo = await sdk.armada.admin.setArkMaxRebalanceInflow({
        vaultId,
        ark: toArk,
        maxRebalanceInflow: amount,
      })
      expect(setMaxRebalanceInflowTxInfo).toBeDefined()
      const setMaxRebalanceInflowStatus = await governorSendTxTool(setMaxRebalanceInflowTxInfo)
      expect(setMaxRebalanceInflowStatus).toBe('success')
      console.log('Set maxRebalanceInflow on toArk Successful')
    }

    const rebalance = await sdk.armada.admin.rebalance({
      vaultId,
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
