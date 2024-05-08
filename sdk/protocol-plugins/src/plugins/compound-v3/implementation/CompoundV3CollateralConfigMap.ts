import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { CompoundV3CollateralConfig } from './CompoundV3CollateralConfig'
import { ICompoundV3CollateralConfigMap } from '../interfaces/ICompoundV3CollateralConfigMap'
import { CollateralConfigMap } from '@summerfi/sdk-common/protocols'
import { ICompoundV3CollateralConfig } from '../interfaces/ICompoundV3CollateralConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export type CompoundV3CollateralConfigRecord = Record<AddressValue, CompoundV3CollateralConfig>

export class CompoundV3CollateralConfigMap
  extends CollateralConfigMap
  implements ICompoundV3CollateralConfigMap
{
  readonly record: CompoundV3CollateralConfigRecord = {}

  private constructor(params: ICompoundV3CollateralConfigMap) {
    super(params)

    this._importCollateralConfigMap(params)
  }

  static createFrom(params: ICompoundV3CollateralConfigMap): CompoundV3CollateralConfigMap {
    return new CompoundV3CollateralConfigMap(params)
  }

  public override add(params: {
    collateral: IToken
    collateralConfig: ICompoundV3CollateralConfig
  }): void {
    this.record[params.collateral.address.value] = CompoundV3CollateralConfig.createFrom(
      params.collateralConfig,
    )
  }

  public override get(params: { token: IToken }): Maybe<CompoundV3CollateralConfig> {
    return this.record[params.token.address.value]
  }
}

SerializationService.registerClass(CompoundV3CollateralConfigMap)
