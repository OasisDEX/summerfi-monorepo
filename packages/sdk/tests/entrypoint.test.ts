import { makeSDK } from '~sdk/entrypoint'

describe('Entrypoint | SDK', () => {
  it('should create client SDK', () => {
    const sdk = makeSDK()

    expect(sdk).toBeDefined()
  })
})
