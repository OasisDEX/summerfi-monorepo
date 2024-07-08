import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { Address, ChainFamilyMap, ChainInfo, IUser, Token, TokenAmount } from '@summerfi/sdk-common'
import { UserMock } from '@summerfi/testing-utils/mocks/UserMock'
import {
  decodeFleetDepositCalldata,
  decodeFleetWithdrawCalldata,
} from '@summerfi/testing-utils/utils/EarnProtocolDecoding'
import { EarnProtocolManager, EarnProtocolManagerFactory } from '../src'

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

  it('should return deposit transaction correctly', async () => {
    const transactionInfo = await earnProtocolManager.deposit({
      chainInfo,
      fleetAddress,
      user,
      amount: tokenAmount,
    })

    expect(transactionInfo.length).toBe(1)
    expect(transactionInfo[0].transaction.target).toBe(fleetAddress)
    expect(transactionInfo[0].transaction.value).toBe('0')

    const decodedCalldata = decodeFleetDepositCalldata(transactionInfo[0].transaction.calldata)
    if (!decodedCalldata) {
      fail('Decoded calldata is undefined')
    }

    expect(decodedCalldata.assets.toString()).toBe(tokenAmount.toBaseUnit())
    expect(decodedCalldata.receiver).toBe(user.wallet.address.value)
  })

  it('should return withdraw transaction correctly', async () => {
    const transactionInfo = await earnProtocolManager.withdraw({
      chainInfo,
      fleetAddress,
      user,
      amount: tokenAmount,
    })

    expect(transactionInfo.length).toBe(1)
    expect(transactionInfo[0].transaction.target).toBe(fleetAddress)
    expect(transactionInfo[0].transaction.value).toBe('0')

    const decodedCalldata = decodeFleetWithdrawCalldata(transactionInfo[0].transaction.calldata)
    if (!decodedCalldata) {
      fail('Decoded calldata is undefined')
    }

    expect(decodedCalldata.assets.toString()).toBe(tokenAmount.toBaseUnit())
    expect(decodedCalldata.receiver).toBe(user.wallet.address.value)
    expect(decodedCalldata.owner).toBe(user.wallet.address.value)
  })
})
