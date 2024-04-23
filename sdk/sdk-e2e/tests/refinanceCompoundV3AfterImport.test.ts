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
  newEmptyPositionFromPool,
  PositionType,
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
  PositionCreatedAction,
} from '@summerfi/protocol-plugins/plugins/common'
import {
  CompoundV3PaybackAction,
  CompoundV3PoolId,
  CompoundV3WithdrawAction,
} from '@summerfi/protocol-plugins/plugins/compound-v3'
import {
  SparkBorrowAction,
  SparkDepositAction,
  SparkPoolId,
  isSparkPoolId,
} from '@summerfi/protocol-plugins/plugins/spark'

jest.setTimeout(300000)

const SDKAPiUrl = 'https://jghh34e4mj.execute-api.us-east-1.amazonaws.com/api/sdk'
const TenderlyForkUrl =
  'https://virtual.mainnet.rpc.tenderly.co/743cdd9e-f508-4240-9781-7f3942f45ca6'

/* revert to pre - import state
      curl -X POST https://virtual.mainnet.rpc.tenderly.co/743cdd9e-f508-4240-9781-7f3942f45ca6 \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "method": "evm_revert",
      "params": ["0x07ffc4b1683c5f911542c05f8bb335973cf0660278d06af0cc4a99fdea1ffa56"],
      "id": "1234"
    }'
 */

/* 
    "0x659de0ea7426ebf3658481941708805f7ecc3f3743ffe9b690fb9bda9420e1f2",take fl
    "0x36303c18db5a95d0dd17b9bac9bc1dbd0130264cd8a04fb5e9b427a3a03ad49e",approval
    "0xc368a54a4a2338057fa477649260f87b93c40c01ddbb97bd3f5fc6f0966e0992", compound payback
    "0x9d57e9172cbbae2b77d30b7ee80a8279c3d05ad42dfb5e665279de4b179bc833", compound withdraw
    "0x36303c18db5a95d0dd17b9bac9bc1dbd0130264cd8a04fb5e9b427a3a03ad49e", approval
    "0x2e5a52747552066d9a632214937a8417ea69760062f4039987cfe8d956646f2e", spark deposit
    "0x65cd19ae3299f6b487d3a50d8982beaadf479209df9404651ca1fa71abfc3beb", spark borrow
    "0x99a01a03a55f29ec20c6bf18507e20b640f963fe896c06188dfa3bf5a753ddc4", send token
    "0x29732f3b4202acea9e682f5fafacfe4172f3140412e66931b5d00a4dda200962"  position created
{
"actions": [
    "0x659de0ea7426ebf3658481941708805f7ecc3f3743ffe9b690fb9bda9420e1f2",
    "0x36303c18db5a95d0dd17b9bac9bc1dbd0130264cd8a04fb5e9b427a3a03ad49e",
    "0xc368a54a4a2338057fa477649260f87b93c40c01ddbb97bd3f5fc6f0966e0992",
    "0x9d57e9172cbbae2b77d30b7ee80a8279c3d05ad42dfb5e665279de4b179bc833",
    "0x36303c18db5a95d0dd17b9bac9bc1dbd0130264cd8a04fb5e9b427a3a03ad49e",
    "0x2e5a52747552066d9a632214937a8417ea69760062f4039987cfe8d956646f2e",
    "0x65cd19ae3299f6b487d3a50d8982beaadf479209df9404651ca1fa71abfc3beb",
    "0x99a01a03a55f29ec20c6bf18507e20b640f963fe896c06188dfa3bf5a753ddc4",
    "0x29732f3b4202acea9e682f5fafacfe4172f3140412e66931b5d00a4dda200962" 
],
"optional": [
0,0,0,0,0,0,0,0,0
],
"name": "RefinanceCompoundV3Spark"
}
 */
describe.skip('Refinance CompoundV3 Spark | SDK', () => {
  it('should allow refinance CompoundV3 -> Spark with same pair', async () => {
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
      value: '0x86f92d7ec49067226ac342cc00e668cb0285ed38',
    })
    const user: User = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Positions Manager
    // DPM proxy with imported position
    const positionsManager: IPositionsManager = {
      address: Address.createFromEthereum({
        value: '0x2a5c4585bee3531b6F6EC78B86711473696449dc',
      }),
    }

    // Tokens
    const WBTC: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WBTC })
    assert(WBTC, 'WBTC not found')

    const USDC: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.USDC })
    assert(USDC, 'USDC not found')

    const compoundV3 = await chain.protocols.getProtocol({ name: ProtocolName.CompoundV3 })
    assert(compoundV3, 'CompoundV3 protocol not found')

    const protocol = {
      name: ProtocolName.CompoundV3 as const,
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    }

    const compoundV3PoolId: CompoundV3PoolId = {
      protocol: protocol,
      collaterals: [TokenSymbol.WBTC],
      debt: TokenSymbol.USDC,
      comet: Address.createFromEthereum({ value: '0xc3d688B66703497DAA19211EEdff47f25384cdc3' }),
    }

    const compoundV3Pool = await compoundV3.getPool({
      poolId: compoundV3PoolId,
    })
    assert(compoundV3Pool, 'CompoundV3 pool not found')

    if (!isLendingPool(compoundV3Pool)) {
      assert(false, 'CompoundV3 pool type is not lending')
    }

    // Source position
    const compoundV3Position: Position = Position.createFrom({
      type: PositionType.Multiply,
      positionId: PositionId.createFrom({ id: '31646' }),
      debtAmount: TokenAmount.createFromBaseUnit({
        token: USDC,
        amount: '145000000000',
      }),
      collateralAmount: TokenAmount.createFromBaseUnit({
        token: WBTC,
        amount: '474938940',
      }),
      pool: compoundV3Pool,
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

    const emptyTargetPosition = newEmptyPositionFromPool(
      sparkPool,
      compoundV3Position.debtAmount.token,
      compoundV3Position.collateralAmount.token,
    )
    const refinanceSimulation: ISimulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition({
        sourcePosition: compoundV3Position,
        targetPosition: emptyTargetPosition,
        slippage: Percentage.createFrom({ value: 0.2 }),
      } as IRefinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.positionId).toEqual(compoundV3Position.positionId)
    expect(refinanceSimulation.targetPosition.pool.poolId).toEqual(sparkPool.poolId)
    expect(refinanceSimulation.steps.length).toBe(5)

    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager: {
        address: Address.createFromEthereum({
          value: '0x2a5c4585bee3531b6F6EC78B86711473696449dc',
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
    expect(strategyExecutorParams.actionCalls.length).toEqual(2)

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
    // expect(flashloanParams.args[0].provider).toBe(0)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const flashloanSubcalls = flashloanParams.args[0].calls as Array<any>
    expect(flashloanSubcalls.length).toBe(7)

    // Decode CompoundV3 Payback action
    const compoundV3PaybackAction = decodeActionCalldata({
      action: new CompoundV3PaybackAction(),
      calldata: flashloanSubcalls[1].callData,
    })

    const paybackAmount = TokenAmount.createFrom({
      amount: Number.MAX_SAFE_INTEGER.toString(),
      token: sourcePosition.debtAmount.token,
    }).toBaseUnit()

    assert(compoundV3PaybackAction, 'Cannot decode CompoundV3 Payback action calldata')
    // expect(compoundV3PaybackAction.args[0].vaultId).toBe(
    //   BigInt((sourcePosition.pool.poolId as CompoundV3PoolId).vaultId),
    // )
    // expect(compoundV3PaybackAction.args[0].userAddress).toBe(positionsManager.address.value)
    expect(compoundV3PaybackAction.args[0].amount).toBe(BigInt(paybackAmount))
    expect(compoundV3PaybackAction.args[0].paybackAll).toBe(true)

    // Decode CompoundV3 Withdraw action
    const compoundV3WithdrawAction = decodeActionCalldata({
      action: new CompoundV3WithdrawAction(),
      calldata: flashloanSubcalls[2].callData,
    })

    assert(compoundV3WithdrawAction, 'Cannot decode CompoundV3 Withdraw action calldata')
    console.log(compoundV3WithdrawAction.args[0])
    expect(compoundV3WithdrawAction.args[0].comet).toBe(
      (sourcePosition.pool.poolId as CompoundV3PoolId).comet.value,
    )
    expect(compoundV3WithdrawAction.args[0].source.toLowerCase()).toBe(
      walletAddress.value.toLowerCase(),
    )
    expect(compoundV3WithdrawAction.args[0].amount).toBe(
      BigInt(sourcePosition.collateralAmount.toBaseUnit()),
    )

    // Set Approval
    const setApprovalAction = decodeActionCalldata({
      action: new SetApprovalAction(),
      calldata: flashloanSubcalls[3].callData,
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
      calldata: flashloanSubcalls[4].callData,
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
      calldata: flashloanSubcalls[5].callData,
    })

    assert(sparkBorrowAction, 'Cannot decode Spark Borrow action calldata')

    expect(sparkBorrowAction.args[0].asset).toBe(targetPosition.debtAmount.token.address.value)
    expect(sparkBorrowAction.args[0].amount).toBe(BigInt(targetPosition.debtAmount.toBaseUnit()))
    expect(sparkBorrowAction.args[0].to).toBe(positionsManager.address.value)

    // Decode Send Token action
    const sendTokenAction = decodeActionCalldata({
      action: new SendTokenAction(),
      calldata: flashloanSubcalls[6].callData,
    })

    assert(sendTokenAction, 'Cannot decode Send Token action calldata')

    expect(sendTokenAction.args[0].asset).toBe(sourcePosition.debtAmount.token.address.value)
    expect(sendTokenAction.args[0].to).toBe(strategyExecutorAddress.value)
    expect(sendTokenAction.args[0].amount).toBe(BigInt(flashloanAmount.toBaseUnit()))

    // Decode Position Created event action
    const positionCreatedParams = decodeActionCalldata({
      action: new PositionCreatedAction(),
      calldata: strategyExecutorParams.actionCalls[1].callData,
    })

    assert(positionCreatedParams, 'Cannot decode Position Created action calldata')

    expect(positionCreatedParams.args[0].protocol).toBe(targetPosition.pool.protocol.name)
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
      rpcUrl: TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.impersonateSendTransaction({
      transaction: refinanceOrder.transactions[0].transaction,
      impersonate: walletAddress.value,
    })

    console.log('Transaction sent:', receipt)
  })
})
