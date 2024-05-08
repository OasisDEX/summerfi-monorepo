import { Address, TokenSymbol } from "@summerfi/sdk-common"

/**
 * Represents the parameters for a Compound V3 position.
 *
 * @remarks
 * This type is used to specify the parameters required to interact with a Compound V3 position.
 * TODO: handle positionAddress as IExternalPositionId (?) - needed for onBehalf actions
 * @property {Address} comet - The address of the Comet contract.
 * @property {TokenSymbol[]} collaterals - An array of token symbols that represent the collateral assets.
 * @property {TokenSymbol} debt - The token symbol that represents the debt asset.
 * @property {Address} positionAddress - The address of the position - either DPM or external position address.
 */
export type CompoundV3PositionParameters = {
    comet: Address
    collaterals: TokenSymbol[]
    debt: TokenSymbol
    positionAddress: Address
}
