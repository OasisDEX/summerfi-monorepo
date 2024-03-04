import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/utils'
import { BaseAction } from '~orderplannercommon/actions'
import { StorageInputsMapType, StorageOutputsMapType } from './Types'
import assert from 'assert'

export class ExecutionStorageManager {
  private slotsMap: Map<string, number> = new Map()

  // Slot number starts from 1 because the contract will subtract 1 from the slot number
  private currentSlot: number = 1

  public addStorageMap<Step extends steps.Steps, Action extends BaseAction>(params: {
    step: Step
    action: Action
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Action>>
  }): void {
    const baseSlot = this.currentSlot

    /* eslint-disable @typescript-eslint/no-explicit-any */
    for (const stepOutputName of Object.keys(params.step.outputs as any)) {
      if (params.connectedOutputs !== undefined) {
        const actionOutputName =
          params.connectedOutputs[stepOutputName as keyof StorageOutputsMapType<Step, Action>]

        if (actionOutputName === undefined) {
          continue
        }

        const slotKey = this._getSlotKey({
          stepName: params.step.name,
          referenceName: stepOutputName,
        })

        const slotOffset = params.action.config.storageOutputs.indexOf(actionOutputName)
        assert(slotOffset !== -1, 'Output not found in action storage outputs')

        this.slotsMap.set(slotKey, baseSlot + slotOffset)
      }

      this.currentSlot++
    }
  }

  public getSlot(params: {
    stepName: string
    referenceName: string | number | symbol
  }): Maybe<number> {
    const key = this._getSlotKey(params)
    return this.slotsMap.get(key)
  }

  private _getSlotKey(params: {
    stepName: string
    referenceName: string | number | symbol
  }): string {
    return `${params.stepName}-${String(params.referenceName)}`
  }
}
