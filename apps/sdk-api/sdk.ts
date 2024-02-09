export type PositionId = string
export declare function isPositionId(value: unknown): value is PositionId
export declare class Position {
  constructor({ positionId }: { positionId: PositionId }) {}
}

export type ProtocolEnum = string
export declare function isProtocolEnum(value: unknown): value is ProtocolEnum
export declare class Protocol {
  constructor({ protocolEnum }: { protocolEnum: ProtocolEnum }) {}
}

export enum Protocols {
  AAVEv3 = 'AAVEv3',
  AAVEv2 = 'AAVEv2',
  Maker = 'Maker',
}
