import { SerializationService } from '~sdk-common/services/SerializationService'

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

SerializationService.registerClass(PositionId)
