import { TokenAmount } from "@summerfi/sdk-common/common";
import type { Token } from "@summerfi/sdk-common/common";
import type { ReferencableField, SimulationStrategy, ValueReference } from "@summerfi/sdk-common/simulation";
import type { Tail } from "~swap-service/interfaces/helperTypes";

export function makeStrategy<T extends SimulationStrategy>(strategy: T): T {
    return strategy
}

export function isReference<T>(value: ReferencableField<T>): value is ValueReference<T> {
    return (value as ValueReference<T>).path !== undefined && (value as ValueReference<T>).estimatedValue !== undefined
}

export function getReferencedValue<T>(referencableValue: ReferencableField<T>): T {
    if (isReference(referencableValue)) {
        return referencableValue.estimatedValue
    }
    return referencableValue
}

export function getTokenBalance(token: Token, balances: Record<string, TokenAmount>): TokenAmount {
    return balances[token.address.hexValue] || TokenAmount.createFrom({ amount: '0', token })
}

export function addBalance(amount: TokenAmount, balance: Record<string, TokenAmount>): Record<string, TokenAmount> {
    return {
        ...balance,
        [amount.token.address.hexValue]: balance[amount.token.address.hexValue] ? balance[amount.token.address.hexValue].add(amount) : amount
    }
}

export function subtractBalance(amount: TokenAmount, balance: Record<string, TokenAmount>): Record<string, TokenAmount> {
    return {
        ...balance,
        [amount.token.address.hexValue]: balance[amount.token.address.hexValue].substrac(amount)
    }
}

export function switchCheck(_a: never): never {
    throw new Error('Run out of cases')
}

export function tail<T extends readonly any[]>(arr: T): Tail<T> {
    const [_, ...rest] = arr
  
    return rest as any as Tail<T>
  }