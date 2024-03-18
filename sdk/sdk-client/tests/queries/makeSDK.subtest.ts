import { makeSDK } from '../../src/implementation/MakeSDK'

export default async function makeSDKTest() {
  const apiURL = 'http://localhost:3000'

  const sdk = makeSDK({ apiURL })

  expect(sdk).toBeDefined()
}
