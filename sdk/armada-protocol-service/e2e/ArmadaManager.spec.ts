import { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { BlockchainClientProvider } from '@summerfi/blockchain-client-provider'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ContractsProvider } from '@summerfi/contracts-provider-service'
import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  IUser,
  Percentage,
  PositionType,
  Token,
  TokenAmount,
  User,
  Wallet,
} from '@summerfi/sdk-common'
import { SubgraphManagerFactory } from '@summerfi/subgraph-manager-service'
import { SwapManagerFactory } from '@summerfi/swap-service'
import {
  decodeFleetDepositCalldata,
  decodeFleetWithdrawCalldata,
} from '@summerfi/testing-utils/utils/ArmadaDecoding'
import { ArmadaPositionId } from '../src'
import { ArmadaManager } from '../src/common/implementation/ArmadaManager'
import { ArmadaManagerFactory } from '../src/common/implementation/ArmadaManagerFactory'
import { ArmadaVaultId } from '../../sdk-common/src/common/implementation/ArmadaVaultId'

describe('Armada Protocol Service', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Base.Base

  const user: IUser = User.createFrom({
    chainInfo: chainInfo,
    wallet: Wallet.createFrom({
      address: Address.createFromEthereum({
        value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
      }),
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

  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  const positionId = ArmadaPositionId.createFrom({
    id: 'Test',
    user,
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
    const subgraphManager = SubgraphManagerFactory.newArmadaSubgraph({
      configProvider,
    })
    const swapManager = SwapManagerFactory.newSwapManager({ configProvider })

    const allowanceManager = {
      getApproval: jest.fn().mockReturnValue(undefined),
    } as unknown as IAllowanceManager
    armadaManager = ArmadaManagerFactory.newArmadaManager({
      configProvider,
      allowanceManager,
      contractsProvider,
      subgraphManager,
      blockchainClientProvider,
      swapManager,
    })
  })

  it('should return new deposit transaction correctly', async () => {
    const transactionInfo = await armadaManager.getNewDepositTX({
      vaultId,
      user,
      amount: tokenAmount,
      slippage: Percentage.createFrom({ value: 0.01 }),
    })

    expect(transactionInfo.length).toBe(1)
    expect(transactionInfo[0].transaction.target).toBe(fleetAddress)
    expect(transactionInfo[0].transaction.value).toBe('0')

    const decodedCalldata = decodeFleetDepositCalldata(transactionInfo[0].transaction.calldata)
    if (!decodedCalldata) {
      fail('Decoded calldata is undefined')
    }

    expect(decodedCalldata.assets).toBe(tokenAmount.toSolidityValue())
    expect(decodedCalldata.receiver).toBe(user.wallet.address.value)
  })

  it('should return update deposit transaction correctly', async () => {
    const transactionInfo = await armadaManager.getUpdateDepositTX({
      vaultId,
      positionId,
      amount: tokenAmount,
      slippage: Percentage.createFrom({ value: 0.01 }),
    })

    expect(transactionInfo.length).toBe(1)
    expect(transactionInfo[0].transaction.target).toBe(fleetAddress)
    expect(transactionInfo[0].transaction.value).toBe('0')

    const decodedCalldata = decodeFleetDepositCalldata(transactionInfo[0].transaction.calldata)
    if (!decodedCalldata) {
      fail('Decoded calldata is undefined')
    }

    expect(decodedCalldata.assets).toBe(tokenAmount.toSolidityValue())
    expect(decodedCalldata.receiver).toBe(user.wallet.address.value)
  })

  it('should return withdraw transaction correctly', async () => {
    const transactionInfo = await armadaManager.getWithdrawTX({
      vaultId: vaultId,
      user,
      amount: tokenAmount,
      toToken: tokenAmount.token,
      slippage: Percentage.createFrom({ value: 0.01 }),
    })

    expect(transactionInfo.length).toBe(1)
    expect(transactionInfo[0].transaction.target).toBe(fleetAddress)
    expect(transactionInfo[0].transaction.value).toBe('0')

    const decodedCalldata = decodeFleetWithdrawCalldata(transactionInfo[0].transaction.calldata)
    if (!decodedCalldata) {
      fail('Decoded calldata is undefined')
    }

    expect(decodedCalldata.assets).toBe(tokenAmount.toSolidityValue())
    expect(decodedCalldata.receiver).toBe(user.wallet.address.value)
    expect(decodedCalldata.owner).toBe(user.wallet.address.value)
  })

  it('should return positions of a user with a correct data types', async () => {
    const chainInfo: ChainInfo = ChainFamilyMap.Base.Base

    const user: IUser = User.createFrom({
      chainInfo: chainInfo,
      wallet: Wallet.createFrom({
        address: Address.createFromEthereum({
          value: '0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da',
        }),
      }),
    })

    const fleetAddress = Address.createFromEthereum({
      value: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399', // FleetCommander on Base
    })

    const USDC = Token.createFrom({
      chainInfo,
      address: Address.createFromEthereum({
        value: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      }),
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    })

    const tokenAmount = TokenAmount.createFrom({
      token: USDC,
      amount: '15000000',
    })

    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })

    const positionId = ArmadaPositionId.createFrom({
      id: '0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da-0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
      user,
    })

    const positions = await armadaManager.getUserPositions({ user })
    expect(positions.length).toBe(1)
    expect(positions[0].id).toStrictEqual(positionId)
    expect(positions[0].type).toBe(PositionType.Armada)
    expect(positions[0].amount).toStrictEqual(tokenAmount)
    expect(positions[0].pool.id).toStrictEqual(poolId)
    expect(positions[0].shares).toBeDefined()
  })
})
