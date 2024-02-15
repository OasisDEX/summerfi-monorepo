import { RefinanceSimulationManager } from '~sdk/simulations'
import { RefinanceParameters, RefinanceSimulation, SimulationType } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/users'
import { Address, TokenAmount } from '~sdk/common'
import { FlashloanProvider, SimulationSteps, Steps } from '~sdk/orders/interfaces/common/Simulation'

function createNewEmptyPosition(pool: Pool): Position {
  return {
    positionId: { id: '' },
    debtAmount: TokenAmount.createFrom({ amount: '0', token: pool.debtToken }),
    collateralAmount: TokenAmount.createFrom({ amount: '0', token: pool.collateralToken }),
    pool,
  }
}

class Simulator {
  private steps: Steps[] = []
  private balances: Record<string, TokenAmount> = {}
  private positions: Record<string, Position> = {}

  next(getNext: (ctx: {
    steps: Steps[],
    balances: Record<string, TokenAmount>,
  }, index: number,) => Steps): Simulator {
    this.steps.push(getNext({
      steps: this.steps,
      balances: this.balances,
    }, this.steps.length))

    return this
  }

  conditionalNext(
    getNext: (ctx: {
      steps: Steps[],
      balances: Record<string, TokenAmount>,
    }, index: number,) => Steps,
    condition: (ctx: {
      steps: Steps[],
      balances: Record<string, TokenAmount>,
    }, index: number,) => boolean
  ) {
    return this
  }
}


export class RefinanceSimulationManagerClientImpl implements RefinanceSimulationManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateRefinancePosition(params: {
    position: Position
    pool: Pool
    parameters: RefinanceParameters
  }): Promise<RefinanceSimulation> {
    const { position, pool, parameters } = params

    const targetPosition = createNewEmptyPosition(pool)

    const areDebtTokensEqual = position.debtAmount.token.address === pool.debtToken.address
    const areCollateralTokensEqual = position.collateralAmount.token.address === pool.collateralToken.address


    new Simulator(
      {
        defaultContext: {
          positions: {
            'sourcePosition': position,
          }
        }
        meta: {}
      }
    )
      .next(
        () => ({
          storageKey: 'Flashloan',
          type: SimulationSteps.Flashloan,
          amount: position.debtAmount,
          provider: FlashloanProvider.Maker
        })
      )
      .next(
        ({ fromStorage }) => ({
          type: SimulationSteps.Repay,
          amount: fromStorage('flashloan'),
        })
      ).conditionalNext(
        ({ctx}) => ({
          storageKey: 'collateralSwap',
          type: SimulationSteps.Swap,
          fromTokenAmount: TokenAmount,
          toTokenAmount: TokenAmount,
          slippage: number,
          fee: number,
        }), 
        (ctx) => false /* */),
        defaultOutput:  {}
      ).next(
        (ctx) => ({
          type: SimulationSteps.DepositBorrow,
          depositAmount: TokenAmount.createFrom({ amount: ctx.getStorage('collateralSwap') || someAmount, token: pool.collateralToken }),
        })
      )





    // TODO: Implement
    return {
      simulationType: SimulationType.Refinance,
      sourcePosition: position,
      targetPosition,
      steps: [
        {
          type: SimulationSteps.Flashloan,
          amount: TokenAmount.createFrom({ amount: '0', token: pool.debtToken }),
          provider: FlashloanProvider.Maker
        },
        {
          type: SimulationSteps.Repay,
          amount: TokenAmount.createFrom({ amount: '0', token: pool.debtToken }),
        },
        {
          type: SimulationSteps.Withdraw,
          amount: TokenAmount.createFrom({ amount: Number.MAX_SAFE_INTEGER.toString(), token: pool.collateralToken }),
        },
        {
          type: SimulationSteps.Swap,
          fromTokenAmount: TokenAmount,
          toTokenAmount: TokenAmount,
          slippage: number,
          fee: number,
        },
        {
          type: SimulationSteps.Deposit,
          amount: TokenAmount.createFrom({ amount: '0', token: pool })
        },
        {
          type: SimulationSteps.Borrow,
          amount: TokenAmount.createFrom({ amount: '0', token: pool })
        },
        {
          type: SimulationSteps.Swap,
          fromTokenAmount: TokenAmount,
          toTokenAmount: TokenAmount,
          slippage: number,
          fee: number,
        },
      ]
    }
  }
}
