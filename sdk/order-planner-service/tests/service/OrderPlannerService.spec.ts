import {
  FlashloanAction,
  SetApprovalAction,
  ReturnFundsAction,
} from '@summerfi/protocol-plugins/plugins/common'
import { FlashloanProvider, ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { Address, AddressValue, ChainFamilyMap, ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { AddressBookManagerMock, SwapManagerMock, UserMock } from '@summerfi/testing-utils'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { SetupDeployments } from '../utils/SetupDeployments'
import { getRefinanceSimulation } from '../utils/RefinanceSimulation/RefinanceSimulation'
import { OrderPlannerService } from '../../src/implementation/OrderPlannerService'
import {
  decodeActionCalldata,
  SkippableActionCall,
  decodePositionsManagerCalldata,
  decodeStrategyExecutorCalldata,
  getErrorMessage,
} from '@summerfi/testing-utils'
import assert from 'assert'
import { IUser } from '@summerfi/sdk-common/user'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { http, createPublicClient } from 'viem'
import {
  MakerPaybackAction,
  MakerProtocolPlugin,
  MakerWithdrawAction,
  isMakerPositionId,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  SparkBorrowAction,
  SparkDepositAction,
  SparkProtocolPlugin,
} from '@summerfi/protocol-plugins/plugins/spark'
import { ProtocolPluginsRegistry } from '@summerfi/protocol-plugins/implementation'
import { getMakerPosition } from '../utils/MakerSourcePosition'
import { getSparkPosition } from '../utils/SparkTargetPosition'
import { mainnet } from 'viem/chains'
import { ITokensManager } from '@summerfi/tokens-common'
import { IOracleManager } from '@summerfi/oracle-common'

describe('Order Planner Service', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet
  let orderPlannerService: OrderPlannerService
  const addressBookManager = new AddressBookManagerMock()

  SetupDeployments(chainInfo, addressBookManager)

  const user: IUser = new UserMock({
    chainInfo: chainInfo,
    walletAddress: Address.createFromEthereum({
      value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    }),
  })
  const positionsManager: IPositionsManager = {
    address: Address.createFromEthereum({ value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138' }),
  }
  let swapManager: ISwapManager
  let protocolsRegistry: IProtocolPluginsRegistry

  beforeEach(() => {
    swapManager = new SwapManagerMock()
    protocolsRegistry = new ProtocolPluginsRegistry({
      plugins: {
        [ProtocolName.Maker]: MakerProtocolPlugin,
        [ProtocolName.Spark]: SparkProtocolPlugin,
      },
      context: {
        provider: createPublicClient({
          batch: {
            multicall: true,
          },
          chain: mainnet,
          transport: http(''),
        }),
        tokensManager: undefined as unknown as ITokensManager,
        oracleManager: undefined as unknown as IOracleManager,
        addressBookManager: addressBookManager,
        swapManager: swapManager,
      },
    })

    orderPlannerService = new OrderPlannerService()
  })

  it('should process refinance simulation correctly', async () => {
    const sourcePosition = getMakerPosition()
    const targetPosition = getSparkPosition()

    const refinanceSimulation: ISimulation<SimulationType.Refinance> = getRefinanceSimulation({
      sourcePosition,
      targetPosition,
    })

    const order = await orderPlannerService.buildOrder({
      user,
      positionsManager,
      protocolsRegistry,
      swapManager,
      simulation: refinanceSimulation,
      addressBookManager,
    })

    assert(order, 'Order is not defined')
    expect(order.simulation).toEqual(refinanceSimulation)
    expect(order.transactions.length).toBe(1)
    expect(order.transactions[0].transaction.target.value).toEqual(positionsManager.address.value)

    const positionsManagerParams = decodePositionsManagerCalldata({
      calldata: order.transactions[0].transaction.calldata,
    })

    assert(
      positionsManagerParams,
      'Transaction calldata could not be decoded for Positions Manager',
    )

    const strategyExecutorAddress = await addressBookManager.getAddressByName({
      chainInfo: chainInfo,
      name: 'OperationExecutor',
    })
    assert(strategyExecutorAddress, 'OperationExecutor address is not defined')

    expect(positionsManagerParams.target.value).toEqual(strategyExecutorAddress.value)

    const strategyExecutorParams = decodeStrategyExecutorCalldata(positionsManagerParams.calldata)

    assert(strategyExecutorParams, 'Calldata for Strategy Executor could not be decoded')

    expect(strategyExecutorParams.strategyName).toEqual(
      `${SimulationType.Refinance}${refinanceSimulation.sourcePosition?.pool.id.protocol.name}${refinanceSimulation.targetPosition.pool.id.protocol.name}`,
    )

    // Flashloan is at the beginning, so we get the flashloan call plus the return funds call
    expect(strategyExecutorParams.actionCalls.length).toBe(2)

    const flashloanCall = decodeActionCalldata({
      action: new FlashloanAction(),
      calldata: strategyExecutorParams.actionCalls[0].callData,
    })

    assert(flashloanCall, 'FlashloanCall is not defined')
    expect(flashloanCall.args.length).toBe(1)
    expect(flashloanCall.args[0].amount).toEqual(BigInt(sourcePosition.debtAmount.toBaseUnit()))
    expect(flashloanCall.args[0].asset).toEqual(sourcePosition.debtAmount.token.address.value)
    expect(flashloanCall.args[0].isProxyFlashloan).toBe(true)
    expect(flashloanCall.args[0].isDPMProxy).toBe(true)
    expect(flashloanCall.args[0].provider).toBe(FlashloanProvider.Balancer)
    expect(flashloanCall.args[0].calls).toBeDefined()
    expect(flashloanCall.mapping).toEqual([0, 0, 0, 0])

    /* Decode flashloan sub-calls */
    const flashloanSubcalls = flashloanCall.args[0].calls as SkippableActionCall[]

    // PaybackWithdraw in Maker and DepositBorrow in Spark take 2 actions each
    expect(flashloanSubcalls.length).toBe(6)

    const makerPaybackAction = decodeActionCalldata({
      action: new MakerPaybackAction(),
      calldata: flashloanSubcalls[0].callData,
    })

    assert(makerPaybackAction, 'MakerPaybackAction is not defined')
    assert(isMakerPositionId(sourcePosition.id), 'Source position ID is not a MakerPoolId')

    expect(makerPaybackAction.args).toEqual([
      {
        vaultId: BigInt(sourcePosition.id.vaultId),
        userAddress: positionsManager.address.value,
        amount: BigInt(sourcePosition.debtAmount.toBaseUnit()),
        paybackAll: true,
      },
    ])
    expect(makerPaybackAction.mapping).toEqual([0, 0, 0, 0])

    const makerWithdrawAction = decodeActionCalldata({
      action: new MakerWithdrawAction(),
      calldata: flashloanSubcalls[1].callData,
    })

    const mcdJoinEthAAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'MCD_JOIN_ETH_A',
    })
    assert(mcdJoinEthAAddress, 'MCD_JOIN_ETH_A address is not defined')

    assert(makerWithdrawAction, 'MakerWithdrawAction is not defined')
    expect(makerWithdrawAction.args).toEqual([
      {
        vaultId: BigInt(sourcePosition.id.vaultId),
        userAddress: positionsManager.address.value,
        joinAddr: mcdJoinEthAAddress.value,
        amount: BigInt(sourcePosition.collateralAmount.toBaseUnit()),
      },
    ])
    expect(makerWithdrawAction.mapping).toEqual([0, 0, 0, 0])

    const setApprovalAction = decodeActionCalldata({
      action: new SetApprovalAction(),
      calldata: flashloanSubcalls[2].callData,
    })

    const sparkLendingPoolAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'SparkLendingPool',
    })
    assert(sparkLendingPoolAddress, 'SparkLendingPool address is not defined')

    assert(setApprovalAction, 'SetApprovalAction is not defined')
    expect(setApprovalAction.args).toEqual([
      {
        asset: sourcePosition.collateralAmount.token.address.value,
        amount: BigInt(sourcePosition.collateralAmount.toBaseUnit()),
        delegate: sparkLendingPoolAddress?.value,
        sumAmounts: false,
      },
    ])

    const sparkDepositAction = decodeActionCalldata({
      action: new SparkDepositAction(),
      calldata: flashloanSubcalls[3].callData,
    })

    assert(sparkDepositAction, 'SparkDepositAction is not defined')
    expect(sparkDepositAction.args).toEqual([
      {
        asset: targetPosition.collateralAmount.token.address.value,
        amount: BigInt(targetPosition.collateralAmount.toBaseUnit()),
        sumAmounts: false,
        setAsCollateral: true,
      },
    ])
    expect(sparkDepositAction.mapping).toEqual([0, 0, 0, 0])

    const sparkBorrowAction = decodeActionCalldata({
      action: new SparkBorrowAction(),
      calldata: flashloanSubcalls[4].callData,
    })

    assert(sparkBorrowAction, 'SparkBorrowAction is not defined')
    expect(sparkBorrowAction.args).toEqual([
      {
        asset: targetPosition.debtAmount.token.address.value,
        amount: BigInt(targetPosition.debtAmount.toBaseUnit()),
        to: strategyExecutorAddress.value,
      },
    ])
    expect(sparkBorrowAction.mapping).toEqual([0, 0, 0, 0])

    const returnFundsAction = decodeActionCalldata({
      action: new ReturnFundsAction(),
      calldata: flashloanSubcalls[5].callData,
    })

    assert(returnFundsAction, 'ReturnFundsAction is not defined')
    expect(returnFundsAction.args).toEqual([
      { asset: targetPosition.debtAmount.token.address.value },
    ])
    expect(sparkBorrowAction.mapping).toEqual([0, 0, 0, 0])
  })
})
