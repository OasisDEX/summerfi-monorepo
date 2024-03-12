import { isValueReference, steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'
import {
  ParamsMapping as InputSlotsMapping,
  StorageInputsMapType,
  StorageOutputsMapType,
} from './Types'
import assert from 'assert'
import { BaseAction } from '../actions/BaseAction'

export class ExecutionStorageMapper {
  private slotsMap: Map<string, number> = new Map()

  // Slot number starts from 1 because the contract will subtract 1 from the slot number
  private currentSlot: number = 1

  public addStorageMap<Step extends steps.Steps, Action extends BaseAction>(params: {
    step: Step
    action: Action
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Action>>
  }): InputSlotsMapping {
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

    return this._resolveParamsMapping(params)
  }

  public getOutputSlot(params: {
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

  private _resolveParamsMapping<Step extends steps.Steps, Action extends BaseAction>(params: {
    action: Action
    step: Step
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
  }): InputSlotsMapping {
    const paramsMapping: InputSlotsMapping = [0, 0, 0, 0]

    for (const [key, value] of Object.entries(params.step.inputs)) {
      if (!isValueReference(value)) {
        continue
      }

      const actionStorageName = params.connectedInputs[key as keyof Step['inputs']]
      if (actionStorageName === undefined) {
        continue
      }

      const [stepName, referenceName] = value.path

      const paramSlotValue = this.getOutputSlot({ stepName, referenceName })
      if (paramSlotValue === undefined) {
        throw new Error(`Reference not found in storage: ${stepName}-${referenceName}`)
      }

      const paramSlotIndex = params.action.config.storageInputs.findIndex(
        (storageInputName) => storageInputName === actionStorageName,
      )
      if (paramSlotIndex === -1) {
        throw new Error(`Input not found in action storage inputs: ${actionStorageName}`)
      }

      paramsMapping[paramSlotIndex] = paramSlotValue
    }

    return paramsMapping
  }
}
