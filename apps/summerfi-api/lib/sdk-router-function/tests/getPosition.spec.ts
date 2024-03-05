import { zeroAddress } from '@summerfi/common'
import { ChainFamilyMap, makeSDK } from '@summerfi/sdk-client'
import type { PositionId } from '@summerfi/sdk-common/common/implementation/PositionId'
import { Wallet } from '@summerfi/sdk-common/common/implementation/Wallet'

import { testAppRouter } from '~src/test-utils'

describe('getPosition', () => {
  const sdk = makeSDK()

  const wallet = Wallet.createFrom({ value: zeroAddress })
  it.skip('should get position by Id', async () => {
    const chain = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    expect(chain).toBeDefined()
    if (!chain) {
      fail('Chain is not defined')
    }

    const positionId: PositionId = {
      id: '1',
    }
    const position = await testAppRouter.getPosition({
      id: positionId,
      chain: chain,
      wallet,
    })
    expect(position?.positionId).toEqual(positionId)
  })
})
