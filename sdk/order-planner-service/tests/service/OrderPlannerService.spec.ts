import { ChainFamilyMap, IUser } from '@summerfi/sdk-client'
import { FlashloanProvider, Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import {
  MakerPaybackAction,
  MakerWithdrawAction,
  ProtocolPluginsRegistry,
  SparkBorrowAction,
  SparkDepositAction,
} from '@summerfi/protocol-plugins'
import { MakerPoolId } from '@summerfi/sdk-common/protocols'

import { SetupDeployments } from '../utils/SetupDeployments'
import { UserMock } from '../mocks/UserMock'
import { SwapManagerMock } from '../mocks/SwapManagerMock'
import { SkippableActionCall, decodeOpExecutorCalldata } from '../utils/OpExecutorDecoding'
import { decodeActionCalldata } from '../utils/ActionDecoding'
import { FlashloanAction, ReturnFundsAction } from '../../src/actions'
import { getRefinanceSimulation } from '../utils/RefinanceSimulation/RefinanceSimulation'
import { OrderPlannerService } from '../../src/implementation/OrderPlannerService'
import { getMakerPosition } from '../utils/Maker/MakerSourcePosition'
import { getSparkPosition } from '../utils/Spark/SparkTargetPosition'

import assert from 'assert'
import { getErrorMessage } from '../utils/ErrorMessage'

describe('Order Planner Service', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet
  let orderPlannerService: OrderPlannerService
  const deploymentsIndex: DeploymentIndex = SetupDeployments()
  const user: IUser = new UserMock({
    chainInfo: chainInfo,
    walletAddress: Address.createFrom({ value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43' }),
  })
  const positionsManager: IPositionsManager = {
    address: Address.ZeroAddressEthereum,
  }
  let swapManager: ISwapManager

  beforeEach(() => {
    swapManager = new SwapManagerMock()

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
        protocolsRegistry: ProtocolPluginsRegistry,
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
      protocolsRegistry: ProtocolPluginsRegistry,
      swapManager,
      simulation: refinanceSimulation,
    })

    assert(order, 'Order is not defined')
    expect(order.simulation).toEqual(refinanceSimulation)
    expect(order.transactions.length).toBe(1)

    const deployments = deploymentsIndex[`${chainInfo.name}.standard`]
    assert(deployments, 'Deployments is not defined')

    const opExecutorAddress = deployments.contracts.OperationExecutor.address

    expect(order.transactions[0].transaction.target.value).toEqual(opExecutorAddress)

    const opExecutorParams = decodeOpExecutorCalldata(order.transactions[0].transaction.calldata)
    assert(opExecutorParams, 'OpExecutorParams is not defined')

    expect(opExecutorParams.operationName).toEqual(SimulationType.Refinance)

    // Flashloan is at the beginning, so we get the flashloan call plus the return funds call
    expect(opExecutorParams.actionCalls.length).toBe(2)

    const flashloanCall = decodeActionCalldata({
      action: new FlashloanAction(),
      calldata: opExecutorParams.actionCalls[0].callData,
    })

    assert(flashloanCall, 'FlashloanCall is not defined')
    expect(flashloanCall.args.length).toBe(6)

    /* Decode flashloan sub-calls */
    const flashloanSubcalls = flashloanCall.args[5] as SkippableActionCall[]

    // PaybackWithdraw in Maker and DepositBorrow in Spark take 2 actions each
    expect(flashloanSubcalls.length).toBe(4)

    const makerPaybackAction = decodeActionCalldata({
      action: new MakerPaybackAction(),
      calldata: flashloanSubcalls[0].callData,
    })

    assert(makerPaybackAction, 'MakerPaybackAction is not defined')
    expect(makerPaybackAction.args).toEqual([
      BigInt((sourcePosition.pool.poolId as MakerPoolId).vaultId),
      user.wallet.address.value,
      BigInt(sourcePosition.debtAmount.toBaseUnit()),
      true,
    ])
    expect(makerPaybackAction.mapping).toEqual([0, 0, 0, 0])

    const makerWithdrawAction = decodeActionCalldata({
      action: new MakerWithdrawAction(),
      calldata: flashloanSubcalls[1].callData,
    })

    assert(makerWithdrawAction, 'MakerWithdrawAction is not defined')
    expect(makerWithdrawAction.args).toEqual([
      BigInt((sourcePosition.pool.poolId as MakerPoolId).vaultId),
      user.wallet.address.value,
      deployments.dependencies.MCD_JOIN_DAI.address,
      BigInt(sourcePosition.collateralAmount.toBaseUnit()),
    ])
    expect(makerWithdrawAction.mapping).toEqual([0, 0, 0, 0])

    const sparkDepositAction = decodeActionCalldata({
      action: new SparkDepositAction(),
      calldata: flashloanSubcalls[2].callData,
    })

    assert(sparkDepositAction, 'SparkDepositAction is not defined')
    expect(sparkDepositAction.args).toEqual([
      targetPosition.collateralAmount.token.address.value,
      BigInt(targetPosition.collateralAmount.toBaseUnit()),
      false,
      true,
    ])
    expect(sparkDepositAction.mapping).toEqual([0, 0, 0, 0])

    const sparkBorrowAction = decodeActionCalldata({
      action: new SparkBorrowAction(),
      calldata: flashloanSubcalls[3].callData,
    })

    assert(sparkBorrowAction, 'SparkBorrowAction is not defined')
    expect(sparkBorrowAction.args).toEqual([
      targetPosition.debtAmount.token.address.value,
      BigInt(targetPosition.debtAmount.toBaseUnit()),
      positionsManager.address.value,
    ])
    expect(sparkBorrowAction.mapping).toEqual([0, 0, 0, 0])

    // Remove last element as it is the calldata and it has been verified above
    expect(flashloanCall.args.slice(0, 5)).toEqual([
      BigInt(sourcePosition.debtAmount.toBaseUnit()),
      sourcePosition.debtAmount.token.address.value,
      true,
      true,
      FlashloanProvider.Balancer,
    ])
    expect(flashloanCall.mapping).toEqual([0, 0, 0, 0])

    const returnFundsCall = decodeActionCalldata({
      action: new ReturnFundsAction(),
      calldata: opExecutorParams.actionCalls[1].callData,
    })

    assert(returnFundsCall, 'ReturnFundsCall is not defined')
    expect(returnFundsCall.args).toEqual([sourcePosition.debtAmount.token.address.value])
    expect(returnFundsCall.mapping).toEqual([0, 0, 0, 0])
  })
})
