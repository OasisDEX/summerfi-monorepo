import { ArmadaVaultId, makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { ArmadaMigrationType, User, Wallet } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, testConfig } from './utils/testConfig'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import assert from 'assert'

jest.setTimeout(300000)

describe.skip('Armada Protocol Claim', () => {
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

      describe(`getMigratablePositions`, () => {
        it(`should get available migratable positions`, async () => {
          const positions = await sdk.armada.users.getMigratablePositions({
            chainInfo,
            user,
            migrationType: ArmadaMigrationType.Compound,
          })
          console.log(positions)
          expect(positions.length).toBeGreaterThan(0)
          expect(positions[0].amount.toSolidityValue()).toBeGreaterThan(0n)
        })
      })

      describe.skip(`migrate first migratable position`, () => {
        it(`should migrate first migratable position`, async () => {
          const positionsBefore = await sdk.armada.users.getMigratablePositions({
            chainInfo,
            user,
            migrationType: ArmadaMigrationType.Compound,
          })
          assert(positionsBefore.length > 0, 'No migratable positions found')

          const vaultId = ArmadaVaultId.createFrom({
            chainInfo,
            fleetAddress,
          })

          const TXs = await sdk.armada.users.getMigrationTX({
            vaultId,
            user,
            ...positionsBefore[0],
          })

          console.log('before', positionsBefore)

          const { statuses } = await sendAndLogTransactions({
            chainInfo,
            transactions: TXs,
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

          console.log('after', positionsAfter)

          expect(positionsAfter.length).toBeLessThan(positionsBefore.length)
        })
      })
    })
  }
})
