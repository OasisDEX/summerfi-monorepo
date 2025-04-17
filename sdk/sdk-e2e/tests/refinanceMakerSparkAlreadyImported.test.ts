import {
  Address,
  AddressValue,
  ChainFamilyMap,
  Percentage,
  Token,
  TokenAmount,
  type Maybe,
} from '@summerfi/sdk-common'

import { Deployments } from '@summerfi/core-contracts'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { makeSDK, type Chain } from '@summerfi/sdk-client'
import {
  CommonTokenSymbols,
  Order,
  PositionsManager,
  RefinanceParameters,
  LendingPositionType,
  IRefinanceSimulation,
  isRefinanceSimulation,
} from '@summerfi/sdk-common'
import {
  TransactionUtils,
  decodeActionCalldata,
  decodePositionsManagerCalldata,
  decodeStrategyExecutorCalldata,
} from '@summerfi/testing-utils'

import {
  EmodeType,
  FlashloanAction,
  PositionCreatedAction,
  SendTokenAction,
  SetApprovalAction,
  ILKType,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerPaybackAction,
  MakerProtocol,
  MakerWithdrawAction,
  isMakerLendingPool,
  isMakerLendingPosition,
  isMakerLendingPositionId,
  isMakerProtocol,
  SparkBorrowAction,
  SparkDepositAction,
  SparkLendingPoolId,
  SparkProtocol,
  isSparkLendingPool,
  isSparkLendingPoolId,
  isSparkLendingPosition,
  isSparkLendingPositionId,
  isSparkProtocol,
} from '@summerfi/protocol-plugins'
import assert from 'assert'
import { Hex } from 'viem'

jest.setTimeout(300000)

const SDKAPiUrl = 'https://nkllstfoy8.execute-api.us-east-1.amazonaws.com/api/sdk'
const TenderlyForkUrl = 'https://rpc.tenderly.co/fork/50e01944-8635-4d67-9569-004d72113328'

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
    const userClient = await sdk.users.getUserClient({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(userClient).toBeDefined()
    expect(userClient.user.wallet.address).toEqual(walletAddress)
    expect(userClient.user.chainInfo).toEqual(chain.chainInfo)

    // Positions Manager
    const positionsManager = PositionsManager.createFrom({
      address: Address.createFromEthereum({
        value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
      }),
    })

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.WETH,
    })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.DAI,
    })
    assert(DAI, 'DAI not found')

    const maker = MakerProtocol.createFrom({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    if (!isMakerProtocol(maker)) {
      assert(false, 'Maker protocol type is not Maker')
    }

    const makerPoolId = MakerLendingPoolId.createFrom({
      protocol: maker,
      ilkType: ILKType.ETH_C,
      collateralToken: WETH,
      debtToken: DAI,
    })

    const makerPool = await chain.protocols.getLendingPool({
      poolId: makerPoolId,
    })

    assert(makerPool, 'Maker pool not found')

    if (!isMakerLendingPool(makerPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const makerPosition = MakerLendingPosition.createFrom({
      subtype: LendingPositionType.Multiply,
      id: MakerLendingPositionId.createFrom({
        id: '31646',
        vaultId: '31646',
      }),
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
    const spark = SparkProtocol.createFrom({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    if (!isSparkProtocol(spark)) {
      assert(false, 'Spark protocol type is not Spark')
    }

    const poolId = SparkLendingPoolId.createFrom({
      protocol: spark,
      collateralToken: WETH,
      debtToken: DAI,
      emodeType: EmodeType.None,
    })

    const sparkPool = await chain.protocols.getLendingPool({
      poolId,
    })

    assert(sparkPool, 'Pool not found')

    if (!isSparkLendingPoolId(sparkPool.id)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isSparkLendingPool(sparkPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: makerPosition,
      targetPool: sparkPool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation: IRefinanceSimulation =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(makerPosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(sparkPool.id)
    expect(refinanceSimulation.steps.length).toBe(5)

    const refinanceOrder: Maybe<Order> = await userClient.newOrder({
      positionsManager: {
        address: Address.createFromEthereum({
          value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
        }),
      },
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    expect(refinanceOrder.simulation.type).toEqual(refinanceSimulation.type)
    assert(isRefinanceSimulation(refinanceOrder.simulation), 'Simulation type is not Refinance')
    assert(refinanceOrder.simulation.sourcePosition, 'Source position not found')

    expect(refinanceOrder.simulation.sourcePosition.id).toEqual(
      refinanceSimulation.sourcePosition?.id,
    )
    expect(refinanceOrder.simulation.targetPosition.pool.id).toEqual(sparkPool.id)
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

    const strategyName = `${refinanceOrder.simulation.type}${refinanceOrder.simulation.sourcePosition?.pool.id.protocol.name}${refinanceOrder.simulation.targetPosition.pool.id.protocol.name}`

    assert(strategyExecutorParams, 'Cannot decode Strategy Executor calldata')
    expect(strategyExecutorParams.strategyName).toEqual(strategyName)
    expect(strategyExecutorParams.actionCalls.length).toEqual(2)

    // Decode Flashloan action
    const flashloanParams = decodeActionCalldata({
      action: new FlashloanAction(),
      calldata: strategyExecutorParams.actionCalls[0].callData,
    })

    assert(
      isMakerLendingPosition(refinanceOrder.simulation.sourcePosition),
      'Source position is not a Maker position',
    )
    assert(
      isSparkLendingPosition(refinanceOrder.simulation.targetPosition),
      'Target position is not a Spark position',
    )

    const sourcePosition = refinanceOrder.simulation.sourcePosition
    const targetPosition = refinanceOrder.simulation.targetPosition

    assert(isMakerLendingPositionId(sourcePosition.id), 'Source position is not a Maker position')
    assert(isSparkLendingPositionId(targetPosition.id), 'Target position is not a Spark position')

    assert(flashloanParams, 'Cannot decode Flashloan action calldata')

    const FlashloanMargin = 1.001
    const flashloanAmount = sourcePosition.debtAmount.multiply(FlashloanMargin)

    expect(flashloanParams.args[0].amount).toBe(flashloanAmount.toSolidityValue())
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
    }).toSolidityValue()

    assert(makerPaybackAction, 'Cannot decode Maker Payback action calldata')
    assert
    expect(makerPaybackAction.args[0].vaultId).toBe(BigInt(sourcePosition.id.vaultId))
    expect(makerPaybackAction.args[0].userAddress).toBe(positionsManager.address.value)
    expect(makerPaybackAction.args[0].amount).toBe(BigInt(paybackAmount))
    expect(makerPaybackAction.args[0].paybackAll).toBe(true)

    // Decode Maker Withdraw action
    const makerWithdrawAction = decodeActionCalldata({
      action: new MakerWithdrawAction(),
      calldata: flashloanSubcalls[1].callData,
    })

    assert(makerWithdrawAction, 'Cannot decode Maker Withdraw action calldata')

    expect(makerWithdrawAction.args[0].vaultId).toBe(BigInt(sourcePosition.id.vaultId))
    expect(makerWithdrawAction.args[0].userAddress).toBe(positionsManager.address.value)
    expect(makerWithdrawAction.args[0].joinAddr).toBe(
      deployment.dependencies.MCD_JOIN_ETH_C.address,
    )
    expect(makerWithdrawAction.args[0].amount).toBe(
      sourcePosition.collateralAmount.toSolidityValue(),
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
    expect(setApprovalAction.args[0].amount).toBe(sourcePosition.collateralAmount.toSolidityValue())
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
      sourcePosition.collateralAmount.toSolidityValue(),
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
    expect(sparkBorrowAction.args[0].amount).toBe(targetPosition.debtAmount.toSolidityValue())
    expect(sparkBorrowAction.args[0].to).toBe(positionsManager.address.value)

    // Decode Send Token action
    const sendTokenAction = decodeActionCalldata({
      action: new SendTokenAction(),
      calldata: flashloanSubcalls[5].callData,
    })

    assert(sendTokenAction, 'Cannot decode Send Token action calldata')

    expect(sendTokenAction.args[0].asset).toBe(sourcePosition.debtAmount.token.address.value)
    expect(sendTokenAction.args[0].to).toBe(strategyExecutorAddress.value)
    expect(sendTokenAction.args[0].amount).toBe(flashloanAmount.toSolidityValue())

    // Decode Position Created event action
    const positionCreatedParams = decodeActionCalldata({
      action: new PositionCreatedAction(),
      calldata: strategyExecutorParams.actionCalls[1].callData,
    })

    assert(positionCreatedParams, 'Cannot decode Position Created action calldata')

    expect(positionCreatedParams.args[0].protocol).toBe(targetPosition.pool.id.protocol.name)
    expect(positionCreatedParams.args[0].positionType).toBe(sourcePosition.type)
    expect(positionCreatedParams.args[0].collateralToken).toBe(
      targetPosition.collateralAmount.token.address.value,
    )
    expect(positionCreatedParams.args[0].debtToken).toBe(
      targetPosition.debtAmount.token.address.value,
    )

    // Send transaction
    console.log('Sending transaction...')

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      chainInfo: chain.chainInfo,
      rpcUrl: TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: refinanceOrder.transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
