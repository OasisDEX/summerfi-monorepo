import { FlashloanProvider, Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { Address, AddressValue, ChainFamilyMap, ChainInfo } from '@summerfi/sdk-common/common'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import {
  FlashloanAction,
  ReturnFundsAction,
  SetApprovalAction,
} from '@summerfi/protocol-plugins/plugins/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

import { SetupDeployments } from '../utils/SetupDeployments'
import { UserMock } from '../mocks/UserMock'
import { SwapManagerMock } from '../mocks/SwapManagerMock'
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
import {
  IContractProvider,
  IPriceService,
  IProtocolPluginsRegistry,
  ITokenService,
} from '@summerfi/protocol-plugins-common'
import { PublicClient } from 'viem'
import {
  MakerPaybackAction,
  MakerPoolId,
  MakerProtocolPlugin,
  MakerWithdrawAction,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  SparkBorrowAction,
  SparkDepositAction,
  SparkProtocolPlugin,
} from '@summerfi/protocol-plugins/plugins/spark'
import { ProtocolPluginsRegistry } from '@summerfi/protocol-plugins/implementation'
import { getMakerPosition } from '../utils/MakerSourcePosition'
import { getSparkPosition } from '../utils/SparkTargetPosition'

describe('Order Planner Service', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet
  let orderPlannerService: OrderPlannerService
  const deploymentsIndex: DeploymentIndex = SetupDeployments()
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
        provider: undefined as unknown as PublicClient,
        tokenService: undefined as unknown as ITokenService,
        priceService: undefined as unknown as IPriceService,
      },
    })

    orderPlannerService = new OrderPlannerService({
      deployments: deploymentsIndex,
    })
  })

  it('should throw error if deployment is not found', async () => {
    const wrongOrderPlannerService = new OrderPlannerService({
      deployments: deploymentsIndex,
      deploymentConfigTag: 'somethingWrong',
    })

    const sourcePosition = getMakerPosition()
    const targetPosition = getSparkPosition()

    const refinanceSimulation: Simulation<SimulationType.Refinance> = getRefinanceSimulation({
      sourcePosition,
      targetPosition,
    })

    try {
      await wrongOrderPlannerService.buildOrder({
        user,
        positionsManager,
        protocolsRegistry,
        swapManager,
        simulation: refinanceSimulation,
      })

      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('No deployment found for chain Mainnet')
    }
  })

  it('should process refinance simulation correctly', async () => {
    const sourcePosition = getMakerPosition()
    const targetPosition = getSparkPosition()

    const refinanceSimulation: Simulation<SimulationType.Refinance> = getRefinanceSimulation({
      sourcePosition,
      targetPosition,
    })

    const order = await orderPlannerService.buildOrder({
      user,
      positionsManager,
      protocolsRegistry,
      swapManager,
      simulation: refinanceSimulation,
    })

    assert(order, 'Order is not defined')
    expect(order.simulation).toEqual(refinanceSimulation)
    expect(order.transactions.length).toBe(1)

    const deployments = deploymentsIndex[`${chainInfo.name}.standard`]
    assert(deployments, 'Deployments is not defined')

    expect(order.transactions[0].transaction.target.value).toEqual(positionsManager.address.value)

    const positionsManagerParams = decodePositionsManagerCalldata({
      calldata: order.transactions[0].transaction.calldata,
    })

    assert(
      positionsManagerParams,
      'Transaction calldata could not be decoded for Positions Manager',
    )

    const strategyExecutorAddress = Address.createFromEthereum({
      value: deployments.contracts.OperationExecutor.address as AddressValue,
    })

    expect(positionsManagerParams.target.value).toEqual(strategyExecutorAddress.value)

    const strategyExecutorParams = decodeStrategyExecutorCalldata(positionsManagerParams.calldata)

    assert(strategyExecutorParams, 'Calldata for Strategy Executor could not be decoded')

    expect(strategyExecutorParams.strategyName).toEqual(
      `${SimulationType.Refinance}${refinanceSimulation.sourcePosition?.pool.protocol.name}${refinanceSimulation.targetPosition.pool.protocol.name}`,
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
    expect(makerPaybackAction.args).toEqual([
      {
        vaultId: BigInt((sourcePosition.pool.poolId as MakerPoolId).vaultId),
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

    assert(makerWithdrawAction, 'MakerWithdrawAction is not defined')
    expect(makerWithdrawAction.args).toEqual([
      {
        vaultId: BigInt((sourcePosition.pool.poolId as MakerPoolId).vaultId),
        userAddress: positionsManager.address.value,
        joinAddr: deployments.dependencies.MCD_JOIN_ETH_A.address,
        amount: BigInt(sourcePosition.collateralAmount.toBaseUnit()),
      },
    ])
    expect(makerWithdrawAction.mapping).toEqual([0, 0, 0, 0])

    const setApprovalAction = decodeActionCalldata({
      action: new SetApprovalAction(),
      calldata: flashloanSubcalls[2].callData,
    })

    assert(setApprovalAction, 'SetApprovalAction is not defined')
    expect(setApprovalAction.args).toEqual([
      {
        asset: sourcePosition.collateralAmount.token.address.value,
        amount: BigInt(sourcePosition.collateralAmount.toBaseUnit()),
        delegate: deployments.dependencies.SparkLendingPool.address,
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
