import { IOracleManager } from '@summerfi/oracle-common'
import { OracleManagerFactory } from '../src'
import { MockConfigurationProvider } from './mocks/MockConfigurationProvider'

describe('TokensManagerFactory', () => {
  const configProvider = new MockConfigurationProvider()
  let oracleManager: IOracleManager

  beforeEach(() => {
    oracleManager = OracleManagerFactory.newOracleManager({
      configProvider,
    })
  })

  it('should return manager', async () => {
    expect(oracleManager).toBeDefined()
  })
})
