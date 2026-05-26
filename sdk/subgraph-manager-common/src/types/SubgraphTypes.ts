export const SubgraphTypes = {
  protocol: 'protocol',
  institutions: 'institutions',
  dca: 'dca',
  rwa: 'rwa',
} as const
export type SubgraphType = keyof typeof SubgraphTypes
