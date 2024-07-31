import { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { BlockchainClientProvider } from '@summerfi/blockchain-client-provider'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ContractsProvider } from '@summerfi/contracts-provider-service'
import { Address, ChainFamilyMap, ChainInfo, IUser, Token, TokenAmount } from '@summerfi/sdk-common'
import { UserMock } from '@summerfi/testing-utils/mocks/UserMock'
import {
  decodeFleetDepositCalldata,
  decodeFleetWithdrawCalldata,
} from '@summerfi/testing-utils/utils/ArmadaDecoding'
import { ArmadaManager, ArmadaManagerFactory } from '../src'

describe('Armada Protocol Service', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Base.Mainnet

  const user: IUser = new UserMock({
    chainInfo: chainInfo,
    walletAddress: Address.createFromEthereum({
      value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    }),
  })

  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
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

  let armadaManager: ArmadaManager

  beforeEach(() => {
    const configProvider = new ConfigurationProvider()
    const blockchainClientProvider = new BlockchainClientProvider({
      configProvider,
    })
    const contractsProvider = new ContractsProvider({
      configProvider,
      blockchainClientProvider,
    })

    const allowanceManager = {
      getApproval: jest.fn().mockReturnValue([]),
    } as unknown as IAllowanceManager
    armadaManager = ArmadaManagerFactory.newArmadaManager({
      configProvider,
      allowanceManager,
      contractsProvider,
    })
  })

  it('should return deposit transaction correctly', async () => {
    const transactionInfo = await armadaManager.deposit({
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
    const transactionInfo = await armadaManager.withdraw({
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
