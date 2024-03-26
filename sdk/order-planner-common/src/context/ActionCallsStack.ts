import { ActionCall, ActionCallBatch } from '@summerfi/protocol-plugins-common'
import { Maybe } from '@summerfi/sdk-common/common'

export class ActionCallsStack {
  private callsStack: ActionCallBatch[]
  private customData: unknown[]

  constructor() {
    this.callsStack = []
    this.customData = []
  }

  public addCall(params: { call: ActionCall }): void {
    // Check that at least one subcontext is open
    if (this.subContextLevels === 0) {
      throw new Error('Cannot add a call outside of a subcontext')
    }

    const currentBatch = this.callsStack[this.callsStack.length - 1]
    currentBatch.push(params.call)
  }

  public startSubContext(params: { customData?: unknown } = {}): void {
    this.callsStack.push([])
    this.customData.push(params.customData)
  }

  public endSubContext(): { callsBatch: ActionCallBatch; customData: Maybe<unknown> } {
    const callsBatch = this.callsStack.pop() as ActionCallBatch
    const customData = this.customData.pop() as Maybe<unknown>
    return { callsBatch, customData }
  }

  public get subContextLevels(): number {
    return this.callsStack.length
  }
}
