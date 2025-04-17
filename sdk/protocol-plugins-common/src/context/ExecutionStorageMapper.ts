import { isValueReference, steps, Maybe } from '@summerfi/sdk-common'
import assert from 'assert'
import { StorageInputsMapType, StorageOutputsMapType } from '../types/ActionStorageTypes'
import { BaseAction } from '../actions/BaseAction'
import { InputSlotsMapping } from '../types/InputSlotsMapping'
import { ActionConfig } from '../actions/Types'

export class ExecutionStorageMapper {
  private slotsMap: Map<string, number> = new Map()

  // Slot number starts from 1 because the contract will subtract 1 from the slot number
  private currentSlot: number = 1

  public addStorageMap<Step extends steps.Steps, Config extends ActionConfig>(params: {
    step: Step
    action: BaseAction<Config>
    connectedInputs: Partial<StorageInputsMapType<Step, Config>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Config>>
  }): InputSlotsMapping {
    const baseSlot = this.currentSlot
    const stepOutputs = (params.step.outputs as unknown) ?? {}

    for (const stepOutputName of Object.keys(stepOutputs)) {
      if (params.connectedOutputs !== undefined) {
        const actionOutputName =
          params.connectedOutputs[stepOutputName as keyof StorageOutputsMapType<Step, Config>]

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

  private _resolveParamsMapping<
    Step extends steps.Steps,
    Config extends ActionConfig,
    Action extends BaseAction<Config>,
  >(params: {
    action: Action
    step: Step
    connectedInputs: Partial<StorageInputsMapType<Step, Config>>
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
