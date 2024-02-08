import { makeSDK } from '../src'

describe('Entrypoint | SDK', () => {
  it('should create client SDK', () => {
    const sdk = makeSDK()

    expect(sdk).toBeDefined()
  })
})
