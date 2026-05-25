export const SubgraphTypes = {
  protocol: 'protocol',
  institutions: 'institutions',
  dca: 'dca',
} as const
export type SubgraphType = keyof typeof SubgraphTypes
