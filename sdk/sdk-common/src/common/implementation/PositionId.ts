import { SerializationManager } from '~sdk-common/common'

interface IPositionIdSerialized {
  readonly id: string
}

export class PositionId implements IPositionIdSerialized {
  readonly id: string

  private constructor(params: IPositionIdSerialized) {
    this.id = params.id
  }

  static createFrom({ id }: { id: string }): PositionId {
    return new PositionId({ id })
  }

  toString(): string {
    return `PositionId: ${this.id}`
  }
}

SerializationManager.registerClass(PositionId)
