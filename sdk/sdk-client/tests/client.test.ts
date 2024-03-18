import { makeSDK } from '../src/implementation/MakeSDK'

describe('SDK Client', () => {
  it('should create SDK client', () => {
    const apiURL = 'http://localhost:3000'

    const sdk = makeSDK({ apiURL })

    expect(sdk).toBeDefined()
  })
})
