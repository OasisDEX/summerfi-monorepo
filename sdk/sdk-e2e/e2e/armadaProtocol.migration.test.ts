import { ArmadaVaultId, makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { ArmadaMigrationType, Percentage, TokenAmount, User, Wallet } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, testConfig } from './utils/testConfig'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import assert from 'assert'

jest.setTimeout(300000)

describe('Armada Protocol Migration', () => {
  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
  })

  for (const { chainInfo, rpcUrl, userAddress, fleetAddress } of testConfig) {
    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }

    describe(`Running on ${chainInfo.name} for user ${userAddress.value}`, () => {
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      describe.skip(`getMigratablePositions`, () => {
        it(`should get all migratable positions`, async () => {
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
          expect(res.positions.length).toBeGreaterThan(0)
        })
      })

      describe(`getMigrationTX`, () => {
        it(`should migrate first migratable position`, async () => {
          const positionsBefore = await sdk.armada.users.getMigratablePositions({
            chainInfo,
            user,
            migrationType: ArmadaMigrationType.Compound,
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
            fleetAddress,
          })

          const positionIdsToMigrate = positionsBefore.positions.slice(0, 1).map((p) => p.id)
          positionIdsToMigrate.forEach((id, i) => {
            console.log(`- migrating position ${i}: `, id)
          })

          const [tx1, tx2] = await sdk.armada.users.getMigrationTX({
            vaultId,
            user,
            positionIds: positionIdsToMigrate,
            slippage: Percentage.createFrom({ value: 1 }),
          })

          console.log(
            'tx list: ',
            Array.isArray(tx1) ? tx1.map((i) => i.description).join(', ') : tx1.description,
            ', ',
            tx2?.description,
          )

          const { statuses } = await sendAndLogTransactions({
            chainInfo,
            transactions: [...(Array.isArray(tx1) ? tx1 : [tx1]), ...(tx2 != null ? [tx2] : [])],
            rpcUrl: rpcUrl,
            privateKey: signerPrivateKey,
          })
          statuses.forEach((status) => {
            expect(status).toBe('success')
          })

          const positionsAfter = await sdk.armada.users.getMigratablePositions({
            chainInfo,
            user,
            migrationType: ArmadaMigrationType.Compound,
          })

          console.log(
            'after',
            positionsAfter.positions.map((p) => ({
              ...p,
              positionTokenAmount: p.positionTokenAmount.toString(),
              underlyingTokenAmount: p.underlyingTokenAmount.toString(),
              usdValue: p.usdValue.toString(),
            })),
          ),
            expect(positionsAfter.positions.length).toBeLessThan(positionsBefore.positions.length)
        })

        it.skip(`should migrate multiple migratable positions`, async () => {
          const positionsBefore = await sdk.armada.users.getMigratablePositions({
            chainInfo,
            user,
            migrationType: ArmadaMigrationType.Compound,
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
            fleetAddress,
          })

          const positionIdsToMigrate = positionsBefore.positions.slice(0, 2).map((p) => p.id)
          positionIdsToMigrate.forEach((id, i) => {
            console.log(`- migrating position ${i}: `, id)
          })

          const [tx1, tx2] = await sdk.armada.users.getMigrationTX({
            vaultId,
            user,
            positionIds: positionIdsToMigrate,
            slippage: Percentage.createFrom({ value: 1 }),
          })

          const { statuses } = await sendAndLogTransactions({
            chainInfo,
            transactions: [...(Array.isArray(tx1) ? tx1 : [tx1]), ...(tx2 != null ? [tx2] : [])],
            rpcUrl: rpcUrl,
            privateKey: signerPrivateKey,
          })
          statuses.forEach((status) => {
            expect(status).toBe('success')
          })

          const positionsAfter = await sdk.armada.users.getMigratablePositions({
            chainInfo,
            user,
            migrationType: ArmadaMigrationType.Compound,
          })

          console.log(
            'after',
            positionsAfter.positions.map((p) => ({
              ...p,
              positionTokenAmount: p.positionTokenAmount.toString(),
              underlyingTokenAmount: p.underlyingTokenAmount.toString(),
              usdValue: p.usdValue.toString(),
            })),
          ),
            expect(positionsAfter.positions.length).toBeLessThan(positionsBefore.positions.length)
        })
      })
    })
  }
})
