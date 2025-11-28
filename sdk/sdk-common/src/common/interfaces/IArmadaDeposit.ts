import { z } from 'zod'
import { isTokenAmount, type ITokenAmount } from './ITokenAmount'
import { isFiatCurrencyAmount, type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { isAddressValue, type AddressValue } from '../types/AddressValue'
import { isHexData, type HexData } from '../types/HexData'

/**
 * @description Zod schema for IArmadaDeposit
 */
export const ArmadaDepositDataSchema = z.object({
  from: z.custom<AddressValue>((val) => isAddressValue(val)),
  to: z.custom<AddressValue>((val) => isAddressValue(val)),
  amount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  amountUsd: z.custom<IFiatCurrencyAmount>((val) => isFiatCurrencyAmount(val)),
  timestamp: z.number(),
  txHash: z.custom<HexData>((val) => isHexData(val)),
  vaultBalance: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  vaultBalanceUsd: z.custom<IFiatCurrencyAmount>((val) => isFiatCurrencyAmount(val)),
})

/**
 * @interface IArmadaDeposit
 * @description Interface for an Armada Protocol deposit transaction
 */
export type IArmadaDeposit = Readonly<z.infer<typeof ArmadaDepositDataSchema>>

/**
 * @description Type guard for IArmadaDeposit
 * @param maybeArmadaDeposit Object to be checked
 * @returns true if the object is an IArmadaDeposit
 */
export function isArmadaDeposit(
  maybeArmadaDeposit: unknown,
  returnedErrors?: string[],
): maybeArmadaDeposit is IArmadaDeposit {
  const zodReturn = ArmadaDepositDataSchema.safeParse(maybeArmadaDeposit)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
