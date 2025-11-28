import { z } from 'zod'
import { isTokenAmount, type ITokenAmount } from './ITokenAmount'
import { isFiatCurrencyAmount, type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { isAddressValue, type AddressValue } from '../types/AddressValue'
import { isHexData, type HexData } from '../types/HexData'

/**
 * @description Zod schema for IArmadaWithdrawal
 */
export const ArmadaWithdrawalDataSchema = z.object({
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
 * @interface IArmadaWithdrawal
 * @description Interface for an Armada Protocol withdrawal transaction
 */
export type IArmadaWithdrawal = Readonly<z.infer<typeof ArmadaWithdrawalDataSchema>>

/**
 * @description Type guard for IArmadaWithdrawal
 * @param maybeArmadaWithdrawal Object to be checked
 * @returns true if the object is an IArmadaWithdrawal
 */
export function isArmadaWithdrawal(
  maybeArmadaWithdrawal: unknown,
  returnedErrors?: string[],
): maybeArmadaWithdrawal is IArmadaWithdrawal {
  const zodReturn = ArmadaWithdrawalDataSchema.safeParse(maybeArmadaWithdrawal)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
