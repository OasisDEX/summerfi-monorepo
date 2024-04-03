import {
  Percentage,
  PositionId,
  Token,
  TokenAmount,
  Position,
  Address,
  type Maybe,
  ChainFamilyMap,
  AddressValue,
} from '@summerfi/sdk-common/common'

import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { makeSDK, type Chain, type User, Protocol } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { IPositionsManager, IRefinanceParameters, Order } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { TransactionUtils } from './utils/TransactionUtils'
import {
  decodeActionCalldata,
  decodePositionsManagerCalldata,
  decodeStrategyExecutorCalldata,
} from '@summerfi/testing-utils'
import { Deployments } from '@summerfi/core-contracts'
import { DeploymentIndex } from '@summerfi/deployment-utils'

import { Hex } from 'viem'
import assert from 'assert'
import {
  EmodeType,
  FlashloanAction,
  SendTokenAction,
  SetApprovalAction,
} from '@summerfi/protocol-plugins/plugins/common'
import {
  ILKType,
  MakerPaybackAction,
  MakerPoolId,
  MakerWithdrawAction,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  SparkBorrowAction,
  SparkDepositAction,
  SparkPoolId,
  isSparkPoolId,
} from '@summerfi/protocol-plugins/plugins/spark'

jest.setTimeout(300000)

const SDKAPiUrl = 'https://zmjmtfsocb.execute-api.us-east-1.amazonaws.com/api/sdk'
const TenderlyForkUrl = 'https://rpc.tenderly.co/fork/47a20a20-3aa1-4d21-afd7-6a230b12a0cc'

describe.skip('Refinance Maker Spark | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK({ apiURL: SDKAPiUrl })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // Deployment
    const deploymentName = `${chain.chainInfo.name}.standard`
    const deployments = Deployments as DeploymentIndex
    const deployment = deployments[deploymentName]

    // Strategy Executor
    const strategyExecutorAddress = Address.createFromEthereum({
      value: deployment.contracts.OperationExecutor.address as AddressValue,
    })

    // User
    const walletAddress = Address.createFromEthereum({
      value: '0xbEf4befb4F230F43905313077e3824d7386E09F8',
    })
    const user: User = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Positions Manager
    const positionsManager: IPositionsManager = {
      address: Address.createFromEthereum({
        value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
      }),
    }

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WETH })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.DAI })
    assert(DAI, 'DAI not found')

    const maker = await chain.protocols.getProtocol({ name: ProtocolName.Maker })
    assert(maker, 'Maker protocol not found')

    const makerPoolId: MakerPoolId = {
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: chain.chainInfo,
      },
      ilkType: ILKType.ETH_C,
      vaultId: '31646',
    }

    const makerPool = await maker.getPool({
      poolId: makerPoolId,
    })
    assert(makerPool, 'Maker pool not found')

    if (!isLendingPool(makerPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const makerPosition: Position = Position.createFrom({
      positionId: PositionId.createFrom({ id: '31646' }),
      debtAmount: TokenAmount.createFromBaseUnit({
        token: DAI,
        amount: '3717915731044925295249',
      }),
      collateralAmount: TokenAmount.createFromBaseUnit({
        token: WETH,
        amount: '2127004370346054622',
      }),
      pool: makerPool,
    })

    // Target protocol
    // TODO: this should have spark protocol type so we don't need to cast, derive it from the protocol name
    const spark: Maybe<Protocol> = await chain.protocols.getProtocol({
      name: ProtocolName.Spark,
    })
    assert(spark, 'Spark not found')

    const poolId: SparkPoolId = {
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: chain.chainInfo,
      },
      emodeType: EmodeType.None,
    }

    const sparkPool = await spark.getPool({
      poolId,
    })

    assert(sparkPool, 'Pool not found')

    if (!isSparkPoolId(sparkPool.poolId)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isLendingPool(sparkPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    const refinanceSimulation: ISimulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition({
        position: makerPosition,
        targetPool: sparkPool,
        slippage: Percentage.createFrom({ value: 0.2 }),
      } as IRefinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.positionId).toEqual(makerPosition.positionId)
    expect(refinanceSimulation.targetPosition.pool.poolId).toEqual(sparkPool.poolId)
    expect(refinanceSimulation.steps.length).toBe(4)

    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager: {
        address: Address.createFromEthereum({
          value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
        }),
      },
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    expect(refinanceOrder.simulation.simulationType).toEqual(refinanceSimulation.simulationType)
    assert(refinanceOrder.simulation.sourcePosition, 'Source position not found')

    expect(refinanceOrder.simulation.sourcePosition.positionId).toEqual(
      refinanceSimulation.sourcePosition?.positionId,
    )
    expect(refinanceOrder.simulation.targetPosition.pool.poolId).toEqual(sparkPool.poolId)
    expect(refinanceOrder.simulation.steps.length).toEqual(refinanceSimulation.steps.length)

    for (let i = 0; i < refinanceOrder.simulation.steps.length; i++) {
      expect(refinanceOrder.simulation.steps[i].type).toEqual(refinanceSimulation.steps[i].type)
    }

    expect(refinanceOrder.transactions.length).toEqual(1)
    expect(refinanceOrder.transactions[0].transaction.target.value).toEqual(
      positionsManager.address.value,
    )

    const positionsManagerParams = decodePositionsManagerCalldata({
      calldata: refinanceOrder.transactions[0].transaction.calldata,
    })

    assert(positionsManagerParams, 'Cannot decode Positions Manager calldata')
    expect(positionsManagerParams.target.value).toEqual(strategyExecutorAddress.value)

    // Decode calldata
    const strategyExecutorParams = decodeStrategyExecutorCalldata(positionsManagerParams.calldata)

    const strategyName = `${refinanceOrder.simulation.simulationType}${refinanceOrder.simulation.sourcePosition?.pool.protocol.name}${refinanceOrder.simulation.targetPosition.pool.protocol.name}`

    assert(strategyExecutorParams, 'Cannot decode Strategy Executor calldata')
    expect(strategyExecutorParams.strategyName).toEqual(strategyName)
    expect(strategyExecutorParams.actionCalls.length).toEqual(1)

    // Decode Flashloan action
    const flashloanParams = decodeActionCalldata({
      action: new FlashloanAction(),
      calldata: strategyExecutorParams.actionCalls[0].callData,
    })

    const sourcePosition = Position.createFrom(refinanceOrder.simulation.sourcePosition)
    const targetPosition = Position.createFrom(refinanceOrder.simulation.targetPosition)

    assert(flashloanParams, 'Cannot decode Flashloan action calldata')

    const FlashloanMargin = 1.001
    const flashloanAmount = sourcePosition.debtAmount.multiply(FlashloanMargin)

    expect(flashloanParams.args[0].amount).toBe(BigInt(flashloanAmount.toBaseUnit()))
    expect(flashloanParams.args[0].asset).toBe(sourcePosition.debtAmount.token.address.value)
    expect(flashloanParams.args[0].isProxyFlashloan).toBe(true)
    expect(flashloanParams.args[0].isDPMProxy).toBe(true)
    expect(flashloanParams.args[0].provider).toBe(0)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const flashloanSubcalls = flashloanParams.args[0].calls as Array<any>
    expect(flashloanSubcalls.length).toBe(6)

    // Decode Maker Payback action
    const makerPaybackAction = decodeActionCalldata({
      action: new MakerPaybackAction(),
      calldata: flashloanSubcalls[0].callData,
    })

    const paybackAmount = TokenAmount.createFrom({
      amount: Number.MAX_SAFE_INTEGER.toString(),
      token: sourcePosition.debtAmount.token,
    }).toBaseUnit()

    assert(makerPaybackAction, 'Cannot decode Maker Payback action calldata')
    expect(makerPaybackAction.args[0].vaultId).toBe(
      BigInt((sourcePosition.pool.poolId as MakerPoolId).vaultId),
    )
    expect(makerPaybackAction.args[0].userAddress).toBe(positionsManager.address.value)
    expect(makerPaybackAction.args[0].amount).toBe(BigInt(paybackAmount))
    expect(makerPaybackAction.args[0].paybackAll).toBe(true)

    // Decode Maker Withdraw action
    const makerWithdrawAction = decodeActionCalldata({
      action: new MakerWithdrawAction(),
      calldata: flashloanSubcalls[1].callData,
    })

    assert(makerWithdrawAction, 'Cannot decode Maker Withdraw action calldata')

    expect(makerWithdrawAction.args[0].vaultId).toBe(
      BigInt((sourcePosition.pool.poolId as MakerPoolId).vaultId),
    )
    expect(makerWithdrawAction.args[0].userAddress).toBe(positionsManager.address.value)
    expect(makerWithdrawAction.args[0].joinAddr).toBe(
      deployment.dependencies.MCD_JOIN_ETH_C.address,
    )
    expect(makerWithdrawAction.args[0].amount).toBe(
      BigInt(sourcePosition.collateralAmount.toBaseUnit()),
    )

    // Set Approval
    const setApprovalAction = decodeActionCalldata({
      action: new SetApprovalAction(),
      calldata: flashloanSubcalls[2].callData,
    })

    assert(setApprovalAction, 'Cannot decode Set Approval action calldata')

    const sparkLendingPool = Address.createFromEthereum({
      value: deployment.dependencies.SparkLendingPool.address as AddressValue,
    })
    expect(setApprovalAction.args[0].asset).toBe(
      sourcePosition.collateralAmount.token.address.value,
    )
    expect(setApprovalAction.args[0].delegate).toBe(sparkLendingPool.value)
    expect(setApprovalAction.args[0].amount).toBe(
      BigInt(sourcePosition.collateralAmount.toBaseUnit()),
    )
    expect(setApprovalAction.args[0].sumAmounts).toBe(false)

    // Decode Spark Deposit action
    const sparkDepositAction = decodeActionCalldata({
      action: new SparkDepositAction(),
      calldata: flashloanSubcalls[3].callData,
    })

    assert(sparkDepositAction, 'Cannot decode Spark Deposit action calldata')

    expect(sparkDepositAction.args[0].asset).toBe(
      targetPosition.collateralAmount.token.address.value,
    )
    expect(sparkDepositAction.args[0].amount).toBe(
      BigInt(sourcePosition.collateralAmount.toBaseUnit()),
    )
    expect(sparkDepositAction.args[0].sumAmounts).toBe(false)
    expect(sparkDepositAction.args[0].setAsCollateral).toBe(true)

    // Decode Spark Borrow action
    const sparkBorrowAction = decodeActionCalldata({
      action: new SparkBorrowAction(),
      calldata: flashloanSubcalls[4].callData,
    })

    assert(sparkBorrowAction, 'Cannot decode Spark Borrow action calldata')

    expect(sparkBorrowAction.args[0].asset).toBe(targetPosition.debtAmount.token.address.value)
    expect(sparkBorrowAction.args[0].amount).toBe(BigInt(targetPosition.debtAmount.toBaseUnit()))
    expect(sparkBorrowAction.args[0].to).toBe(positionsManager.address.value)

    // Decode Send Token action
    const sendTokenAction = decodeActionCalldata({
      action: new SendTokenAction(),
      calldata: flashloanSubcalls[5].callData,
    })

    assert(sendTokenAction, 'Cannot decode Send Token action calldata')

    expect(sendTokenAction.args[0].asset).toBe(sourcePosition.debtAmount.token.address.value)
    expect(sendTokenAction.args[0].to).toBe(strategyExecutorAddress.value)
    expect(sendTokenAction.args[0].amount).toBe(BigInt(flashloanAmount.toBaseUnit()))

    // Send transaction
    console.log('Sending transaction...')

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      rpcUrl: TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: refinanceOrder.transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
