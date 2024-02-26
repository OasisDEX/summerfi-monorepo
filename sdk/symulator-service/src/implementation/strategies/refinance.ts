import { FlashloanProvider, Simulation, SimulationSteps } from "@summerfi/sdk-common/simulation";
import { makeStrategy } from "~swap-service/implementation/helpers";
import { Position } from "@summerfi/sdk-common/users";
import { Pool } from "@summerfi/sdk-common/protocols";
import { Simulator } from "~swap-service/implementation/simulator-engine";
import { Token, TokenAmount } from "@summerfi/sdk-common/common";
import { SimulationType } from "@summerfi/sdk-common/orders";

export const refinanceStrategy = makeStrategy([
    {
        step: SimulationSteps.Flashloan,
        optional: false,
    },
    {
        step: SimulationSteps.PaybackWithdraw,
        optional: false,
    },
    {
        step: SimulationSteps.Swap,
        optional: true,
    },
    {
        step: SimulationSteps.DepositBorrow,
        optional: false,
    },
    {
        step: SimulationSteps.Swap,
        optional: true,
    },
    {
        step: SimulationSteps.PaybackFlashloan,
        optional: false,
    },
    {
        // In case of target debt being different then source debt we need a swap, 
        // We cannot forsee the exact amount of the swap, so we need to return excess tokens to user
        step: SimulationSteps.ReturnFunds,
        optional: true,
    }
])

export async function refinace(
    args: {
        position: Position,
        targetPool: Pool,
        slippage: number,
    },
    dependecies: {
        getQuote: (
            args: {from: TokenAmount,
            to: Token,
            slippage: number,
            fee: number}
        ) => Promise<{
            fromTokenAmount: TokenAmount,
            toTokenAmount: TokenAmount
            slippage: number
            fee: number
        }>,
    }
): Promise<Simulation<SimulationType.Refinance>> {
    const simulator = Simulator.create(refinanceStrategy)

    const simulation = simulator
        .next(async () => ({
            name: 'Flashloan',
            type: SimulationSteps.Flashloan,
            inputs: {
                amount: args.position.debtAmount, // TODO add some amount
                provider: FlashloanProvider.Maker
            },
        }))
        .next(async () => ({
            name: 'PaybackWithdraw',
            type: SimulationSteps.PaybackWithdraw,
            inputs: {
                paybackAmount: TokenAmount.createFrom({ amount: Number.MAX_SAFE_INTEGER.toString(), token: args.position.pool.debtToken }),
                withdrawAmount: TokenAmount.createFrom({ amount: Number.MAX_SAFE_INTEGER.toString(), token: args.position.pool.collateralToken }),
                position: args.position
            },
        })).next(async () => ({
            name: 'CollateralSwap',
            type: SimulationSteps.Swap,
            inputs: await dependecies.getQuote({
                from: args.position.collateralAmount,
                to: args.targetPool.collateralToken,
                slippage: args.slippage,
                fee: 0
            }),
            skip: args.position.pool.collateralToken === args.targetPool.collateralToken,
        })).next(async (ctx) => ({
            name: 'DepositBorrow',
            type: SimulationSteps.DepositBorrow,
            inputs: {
                depositAmount: ctx.getReference(['CollateralSwap', 'recievedAmount']),
                borrowAmount: args.position.debtAmount,
                position: args.position // TODO figure out how to reference target pool positon
            },
        })).next(async () => ({
            name: 'DebtSwap',
            type: SimulationSteps.Swap,
            inputs: await dependecies.getQuote({
                from: args.position.debtAmount,
                to: args.targetPool.collateralToken,
                slippage: args.slippage,
                fee: 0
            }),
            skip: args.position.pool.debtToken === args.targetPool.debtToken,
        })).next(async () => ({
            name: 'PaybackFlashloan',
            type: SimulationSteps.PaybackFlashloan,
            inputs: {
                amount: args.position.debtAmount, // TODO add some amount
            },
        })).next(async () => ({
            name: 'ReturnFunds',
            type: SimulationSteps.ReturnFunds,
            inputs: {
                token: args.targetPool.collateralToken,
            },
            skip: true,
        })).run()

    return {} as Simulation<SimulationType.Refinance>
}


