import { Address, ChainFamilyMap, ChainInfo, IUser, Token, TokenAmount } from '@summerfi/sdk-common'
import {
  UserMock,
  decodeFleetDepositCalldata,
  decodeFleetWithdrawCalldata,
} from '@summerfi/testing-utils'
import assert from 'assert'
import { EarnProtocolManager, EarnProtocolManagerFactory } from '../src'
import { ConfigurationProvider } from '@summerfi/configuration-provider'

describe('Earn Protocol Service', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  const user: IUser = new UserMock({
    chainInfo: chainInfo,
    walletAddress: Address.createFromEthereum({
      value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    }),
  })

  const fleetAddress = Address.createFromEthereum({
    value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  })

  const tokenAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '123.45',
  })

  let earnProtocolManager: EarnProtocolManager

  beforeEach(() => {
    const configProvider = new ConfigurationProvider()
    earnProtocolManager = EarnProtocolManagerFactory.newEarnProtocolManager({ configProvider })
  })

  it('should return deposit transaction simulation correctly', async () => {
    const transactionInfo = await earnProtocolManager.deposit({
      chainInfo,
      fleetAddress,
      user,
      amount: tokenAmount,
    })

    expect(transactionInfo.length).toBe(1)
    expect(transactionInfo[0]. ).toBe(fleetAddress)
  })
})
