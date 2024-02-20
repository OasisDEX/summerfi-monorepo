import { Maybe } from '@summerfi/sdk-common/utils'

export type Slot = number
export type ActionOutputName = string

export type ActionStorageList = ActionOutputName[]

export type StorageAliasMap = Record<string, ActionOutputName>

export class ExecutionStorageManager {
  private slotsMap: Map<string, number> = new Map()

  // Slot number starts from 1 because the contract will subtract 1 from the slot number
  private currentSlot: number = 1

  public addStorageMap(params: {
    stepName: string
    storedValuesNames: ActionStorageList
    storageAliasMap?: StorageAliasMap
  }): void {
    for (const actionOutputName of params.storedValuesNames) {
      if (params.storageAliasMap !== undefined) {
        const alias = params.storageAliasMap[actionOutputName]
        if (alias !== undefined) {
          const slotKey = this._getSlotKey({ stepName: params.stepName, referenceName: alias })
          this.slotsMap.set(slotKey, this.currentSlot)
        }
      }

      this.currentSlot++
    }
  }

  public getSlot(params: { key: string }): Maybe<number> {
    return this.slotsMap.get(params.key)
  }

  private _getSlotKey(params: { stepName: string; referenceName: string }): string {
    return `${params.stepName}-${params.referenceName}`
  }
}
