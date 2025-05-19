export const isPersistentStage = (env: string) => {
  const persistentStage = ['production', 'staging']
  return persistentStage.includes(env)
}

export const isProduction = (env: string) => {
  const productionStage = ['production']
  return productionStage.includes(env)
}
