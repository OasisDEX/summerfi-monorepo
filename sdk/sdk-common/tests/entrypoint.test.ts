import { makeSDK } from '~sdk-common/entrypoint'

describe('Entrypoint | SDK', () => {
  it('should create client SDK', () => {
    const sdk = makeSDK()

    expect(sdk).toBeDefined()
  })
})
