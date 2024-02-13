export type PositionId = string
export function isPositionId(value: unknown): value is PositionId {
  return typeof value === 'string'
}
export class Position {
  constructor({ positionId }: { positionId: PositionId }) {
    this.positionId = positionId
  }
  positionId: PositionId
}

export type ProtocolEnum = string
export function isProtocolEnum(value: unknown): value is ProtocolEnum {
  return typeof value === 'string'
}
export class Protocol {
  constructor({ protocolEnum }: { protocolEnum: ProtocolEnum }) {
    this.protocolEnum = protocolEnum
  }
  protocolEnum: ProtocolEnum
}

export enum Protocols {
  AAVEv3 = 'AAVEv3',
  AAVEv2 = 'AAVEv2',
  Maker = 'Maker',
}
