import { BlockchainClientProvider } from '@summerfi/blockchain-client-provider'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ContractsProviderFactory } from '@summerfi/contracts-provider-service'
import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { decodeAllowanceCalldata } from '@summerfi/testing-utils/utils/AllowanceDecoding'
import { AllowanceManagerFactory, type AllowanceManager } from '../src'

describe('Armada Protocol Service', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

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

  const tokenAddress = DAI.address

  const tokenAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '123.45',
  })

  let allowanceManager: AllowanceManager

  beforeEach(() => {
    const configProvider = new ConfigurationProvider()
    const blockchainClientProvider = new BlockchainClientProvider({ configProvider })
    const contractsProvider = ContractsProviderFactory.newContractsProvider({
      configProvider,
      blockchainClientProvider,
    })

    allowanceManager = AllowanceManagerFactory.newAllowanceManager({
      configProvider,
      contractsProvider,
    })
  })

  it('should return approval transaction correctly', async () => {
    const transactionInfo = await allowanceManager.getApproval({
      chainInfo,
      spender: fleetAddress,
      amount: tokenAmount,
    })

    expect(transactionInfo.length).toBe(1)
    expect(transactionInfo[0].transaction.target.value).toBe(tokenAddress.value)
    expect(transactionInfo[0].transaction.value).toBe('0')

    const decodedCalldata = decodeAllowanceCalldata(transactionInfo[0].transaction.calldata)
    if (!decodedCalldata) {
      fail('Decoded calldata is undefined')
    }

    expect(decodedCalldata.spender.toString()).toBe(fleetAddress.value)
    expect(decodedCalldata.amount.toString()).toBe(tokenAmount.toBaseUnit())
  })
})
