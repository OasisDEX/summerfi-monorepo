import { Maybe } from '@summerfi/sdk/utils'

export type VarNameType = string
export type StepNameType = string
export type SlotNumber = number

export class StepStorage {
  private _storage: Map<VarNameType, SlotNumber>

  public constructor() {
    this._storage = new Map()
  }

  public addSlot(name: VarNameType, slot: SlotNumber): void {
    this._storage.set(name, slot)
  }

  public getSlot(name: VarNameType): Maybe<SlotNumber> {
    return this._storage.get(name)
  }
}

export class StrategyStorage {
  private _storage: Map<StepNameType, StepStorage>

  public constructor() {
    this._storage = new Map()
  }

  public addSlot(stepName: StepNameType, variableName: VarNameType, slot: SlotNumber): void {
    let stepStorage = this._storage.get(stepName)
    if (!stepStorage) {
      stepStorage = new StepStorage()
      this._storage.set(stepName, stepStorage)
    }
    stepStorage.addSlot(variableName, slot)
  }

  public getSlot(stepName: StepNameType, variableName: VarNameType): Maybe<SlotNumber> {
    const stepStorage = this._storage.get(stepName)
    if (!stepStorage) {
      return undefined
    }
    return stepStorage.getSlot(variableName)
  }
}
