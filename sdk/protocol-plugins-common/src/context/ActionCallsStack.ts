import { ActionCall, ActionCallBatch } from '../actions/Types'
import { Maybe } from '@summerfi/sdk-common'

/**
 * @name ActionCallsStack
 * Keeps track of the different calls batches in a subcontext and returns that batch when a subcontext is finished
 */
export class ActionCallsStack {
  private callsStack: ActionCallBatch[]
  private customData: unknown[]

  constructor() {
    this.callsStack = []
    this.customData = []
  }

  /**
   * Adds a call to the current subcontext
   * @param call The call to be added
   */
  public addCall(params: { call: ActionCall }): void {
    // Check that at least one subcontext is open
    if (this.subContextLevels === 0) {
      throw new Error('Cannot add a call outside of a subcontext')
    }

    const currentBatch = this.callsStack[this.callsStack.length - 1]
    currentBatch.push(params.call)
  }

  /**
   * Starts a new subcontext
   * @param customData Optional custom data to be saved as part of the subcontext
   */
  public startSubContext(params: { customData?: unknown } = {}): void {
    this.callsStack.push([])
    this.customData.push(params.customData)
  }

  /**
   * Ends the current subcontext and returns the calls batch and the custom data saved in the subcontext
   * @returns The calls batch and the custom data saved in the subcontext
   */
  public endSubContext(): { callsBatch: ActionCallBatch; customData: Maybe<unknown> } {
    const callsBatch = this.callsStack.pop() as ActionCallBatch
    const customData = this.customData.pop() as Maybe<unknown>
    return { callsBatch, customData }
  }

  /**
   * The current subcontext levels
   */
  public get subContextLevels(): number {
    return this.callsStack.length
  }
}
