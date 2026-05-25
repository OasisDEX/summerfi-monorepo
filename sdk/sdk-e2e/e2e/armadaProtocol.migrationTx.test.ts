import {
  Address,
  ArmadaMigrationType,
  ArmadaVaultId,
  getChainInfoByChainId,
  Percentage,
  User,
} from '@summerfi/sdk-common'

import assert from 'assert'
import { ChainIds, type AddressValue } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { FleetAddresses } from './utils/testConfig'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol Migration', () => {
  const scenarios: {
    chainId: (typeof ChainIds)[keyof typeof ChainIds]
    fleetAddressValue: AddressValue
  }[] = [
    { chainId: ChainIds.Base, fleetAddressValue: FleetAddresses[ChainIds.Base].USDC },
    { chainId: ChainIds.ArbitrumOne, fleetAddressValue: FleetAddresses[ChainIds.ArbitrumOne].USDT },
    { chainId: ChainIds.Mainnet, fleetAddressValue: FleetAddresses[ChainIds.Mainnet].USDCLowRisk },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, fleetAddressValue } = scenario

    describe.skip('getMigrationTX', () => {
      const migrationType = ArmadaMigrationType.AaveV3

      it('should migrate first migratable position', async () => {
        const setup = createSdkTestSetup({ chainId })
        const { sdk, chainId: setupChainId, userAddress, userSendTxTool } = setup

        const chainInfo = getChainInfoByChainId(setupChainId)
        const user = User.createFromEthereum(setupChainId, userAddress.value)

        console.log(
          `Migrating positions on chain ${setupChainId} for chain ${setupChainId} with user ${userAddress.value}`,
        )

        const positionsBefore = await sdk.armada.users.getMigratablePositions({
          chainInfo,
          user,
          migrationType,
        })
        assert(positionsBefore.positions.length > 0, 'No migratable positions found')

        console.log(
          'before',
          positionsBefore.positions.map((p) => ({
            ...p,
            positionTokenAmount: p.positionTokenAmount.toString(),
            underlyingTokenAmount: p.underlyingTokenAmount.toString(),
            usdValue: p.usdValue.toString(),
          })),
        )

        const vaultId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
        })

        const positionIdsToMigrate = positionsBefore.positions.slice(0, 1).map((p) => p.id)
        assert(positionIdsToMigrate.length > 0, 'No position ids found')
        positionIdsToMigrate.forEach((id, i) => {
          console.log(`- migrating position ${i}: `, id)
        })

        const [tx1, tx2] = await sdk.armada.users.getMigrationTx({
          vaultId,
          user,
          positionIds: positionIdsToMigrate,
          slippage: Percentage.createFrom({ value: DEFAULT_SLIPPAGE_PERCENTAGE }),
        })

        console.log(
          'tx list: ',
          Array.isArray(tx1) ? tx1.map((i) => i.description).join(', ') : tx1.description,
          ', ',
          tx2?.description,
        )

        const transactions = [...(Array.isArray(tx1) ? tx1 : [tx1]), ...(tx2 != null ? [tx2] : [])]
        const statuses = await userSendTxTool(transactions)

        statuses.forEach((status) => {
          expect(status).toBe('success')
        })

        const positionsAfter = await sdk.armada.users.getMigratablePositions({
          chainInfo,
          user,
          migrationType,
        })

        console.log(
          'after',
          positionsAfter.positions.map((p) => ({
            ...p,
            positionTokenAmount: p.positionTokenAmount.toString(),
            underlyingTokenAmount: p.underlyingTokenAmount.toString(),
            usdValue: p.usdValue.toString(),
          })),
        )

        expect(positionsAfter.positions.length).toBeLessThan(positionsBefore.positions.length)
      })

      it.skip('should migrate multiple migratable positions', async () => {
        const setup = createSdkTestSetup({ chainId })
        const { sdk, chainId: setupChainId, userAddress, userSendTxTool } = setup

        const chainInfo = getChainInfoByChainId(setupChainId)
        const user = User.createFromEthereum(setupChainId, userAddress.value)

        console.log(
          `Migrating multiple positions on chain ${setupChainId} for chain ${setupChainId} with user ${userAddress.value}`,
        )

        const positionsBefore = await sdk.armada.users.getMigratablePositions({
          chainInfo,
          user,
          migrationType,
        })
        assert(positionsBefore.positions.length > 1, 'No multiple migratable positions found')

        console.log(
          'before',
          positionsBefore.positions.map((p) => ({
            ...p,
            positionTokenAmount: p.positionTokenAmount.toString(),
            underlyingTokenAmount: p.underlyingTokenAmount.toString(),
            usdValue: p.usdValue.toString(),
          })),
        )

        const vaultId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
        })

        const positionIdsToMigrate = positionsBefore.positions.slice(0, 2).map((p) => p.id)
        positionIdsToMigrate.forEach((id, i) => {
          console.log(`- migrating position ${i}: `, id)
        })

        const [tx1, tx2] = await sdk.armada.users.getMigrationTx({
          vaultId,
          user,
          positionIds: positionIdsToMigrate,
          slippage: Percentage.createFrom({ value: DEFAULT_SLIPPAGE_PERCENTAGE }),
        })

        const transactions = [...(Array.isArray(tx1) ? tx1 : [tx1]), ...(tx2 != null ? [tx2] : [])]
        const statuses = await userSendTxTool(transactions)

        statuses.forEach((status) => {
          expect(status).toBe('success')
        })

        const positionsAfter = await sdk.armada.users.getMigratablePositions({
          chainInfo,
          user,
          migrationType,
        })

        console.log(
          'after',
          positionsAfter.positions.map((p) => ({
            ...p,
            positionTokenAmount: p.positionTokenAmount.toString(),
            underlyingTokenAmount: p.underlyingTokenAmount.toString(),
            usdValue: p.usdValue.toString(),
          })),
        )

        expect(positionsAfter.positions.length).toBeLessThan(positionsBefore.positions.length)
      })
    })
  })
})
