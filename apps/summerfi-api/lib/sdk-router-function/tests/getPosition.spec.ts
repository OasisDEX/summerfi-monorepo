/* eslint-disable turbo/no-undeclared-env-vars */
import { ChainFamilyMap } from '@summerfi/sdk-common/chains'
import { Wallet } from '@summerfi/sdk-common/common'
import { zeroAddress } from '@summerfi/common'
import { makeSDK } from '@summerfi/sdk-common/entrypoint/implementation'
import type { PositionId } from '@summerfi/sdk-common/client'
import { testAppRouter } from '~src/test-utils'

describe('getPosition', () => {
  const sdk = makeSDK()

  const wallet = Wallet.createFrom({ hexValue: zeroAddress })
  it('should get position by Id', async () => {
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
      chainInfo: chain.chainInfo,
      wallet,
    })
    expect(position?.positionId).toEqual(positionId)
  })
})
