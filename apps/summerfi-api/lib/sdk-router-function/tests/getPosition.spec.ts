import { zeroAddress } from '@summerfi/common'
import { ChainFamilyMap, type IChainsManager } from '@summerfi/sdk-common/client'
import { makeSDK, type Chain } from '@summerfi/sdk-common/client/implementation'
import { Wallet, type PositionId } from '@summerfi/sdk-common/common/implementation'
import type { Maybe } from '@summerfi/sdk-common/utils'
import { testAppRouter } from '~src/test-utils'

describe('getPosition', () => {
  const sdk = makeSDK()

  const wallet = Wallet.createFrom({ hexValue: zeroAddress })
  it('should get position by Id', async () => {
    const chain: Maybe<Chain> = await (sdk.chains as IChainsManager).getChain({
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
