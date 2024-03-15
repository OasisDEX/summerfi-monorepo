import { OrderPlannerContext } from '@summerfi/order-planner-common/context'

export class OrderPlannerContextMock extends OrderPlannerContext {
  public checkpoints: string[] = []

  constructor() {
    super()
  }

  public setCheckpoint(name: string) {
    this.checkpoints.push(name)
  }
}
