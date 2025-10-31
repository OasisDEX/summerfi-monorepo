export const SubgraphTypes = {
  protocol: 'protocol',
  institutions: 'institutions',
} as const
export type SubgraphType = keyof typeof SubgraphTypes
