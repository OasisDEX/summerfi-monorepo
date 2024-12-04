import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { User, Wallet } from '@summerfi/sdk-common'

import { ArmadaVaultId } from '@summerfi/armada-protocol-service'
import { SDKApiUrl, testConfig } from './utils/testConfig'

jest.setTimeout(300000)

describe.skip('Armada Protocol User', () => {
  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
  })

  for (const { chainInfo, fleetAddress, forkUrl, userAddress } of testConfig) {
    if (!forkUrl) {
      throw new Error('Missing fork url')
    }

    describe(`Positions on ${chainInfo.name} for user ${userAddress.value}`, () => {
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      describe(`getUserPositions`, () => {
        it(`should get first position with id: ${userAddress.value}-${fleetAddress.value}`, async () => {
          const positions = await sdk.armada.users.getUserPositions({
            user,
          })
          positions[0].id
          expect(positions).toHaveLength(1)
          expect(positions[0].id.id).toEqual(`${userAddress.value}-${fleetAddress.value}`)
        })
      })

      describe(`getUserPosition`, () => {
        it(`should get user position with id: ${userAddress.value}-${fleetAddress.value}`, async () => {
          const position = await sdk.armada.users.getUserPosition({
            user,
            fleetAddress,
          })
          expect(position.id.id).toEqual(`${userAddress.value}-${fleetAddress.value}`)
        })
      })
    })

    describe(`Vaults on ${chainInfo.name}`, () => {
      it('should getVaults', async () => {
        const raw = await sdk.armada.users.getVaultsRaw({
          chainInfo,
        })
        expect(raw.vaults).toHaveLength(1)
        expect(raw.vaults[0]?.id).toEqual(`${fleetAddress.value}`)
      })

      it('should getVault', async () => {
        const raw = await sdk.armada.users.getVaultRaw({
          vaultId: ArmadaVaultId.createFrom({
            chainInfo,
            fleetAddress,
          }),
        })
        expect(raw.vault?.id).toEqual(`${fleetAddress.value}`)
      })
    })
  }
})
