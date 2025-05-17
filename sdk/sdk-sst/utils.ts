export const isLongTermStage = (env: string) => {
  const longTermStages = ['production', 'staging']
  return longTermStages.includes(env)
}
