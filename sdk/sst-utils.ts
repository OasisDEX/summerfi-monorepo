export const isPersistentStage = (stage: string) => {
  const persistentStage = ['production', 'staging', 'development']
  return persistentStage.includes(stage)
}

export const isProductionStage = (stage: string) => {
  const productionStage = ['production']
  return productionStage.includes(stage)
}
