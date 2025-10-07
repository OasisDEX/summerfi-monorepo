import { Address, getChainInfoByChainId, User } from '@summerfi/sdk-common'

import { TestConfigs } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import assert from 'assert'
import { stringifyArmadaPosition } from './utils/stringifiers'

jest.setTimeout(300000)

describe('Armada Protocol - Positions', () => {
  const {
    chainId,
    fleetAddressValue: fleetAddress,
    userAddressValue: userAddress,
  } = TestConfigs.SelfManaged

  const chainInfo = getChainInfoByChainId(chainId)
  const user = User.createFromEthereum(chainId, userAddress)

  console.log(`Running on ${chainInfo.name} for user ${user.wallet.address.value}`)

  const sdk = createTestSDK()

  it.skip(`should get all user positions`, async () => {
    const positions = await sdk.armada.users.getUserPositions({
      user,
    })
    console.log('All user positions:\n', positions.map(stringifyArmadaPosition).join('\n'))
  })

  it(`should get user position for a specific fleet`, async () => {
    const position = await sdk.armada.users.getUserPosition({
      user: user,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    assert(position != null, 'User position not found')
    console.log(`Specific user position:\n`, stringifyArmadaPosition(position))
  })
})
