import { prisma } from '@/helpers/prisma-client'

export async function getProductHubData() {
  return await prisma.productHubItems
    .findMany()
    .then((rawTable) => {
      return rawTable
    })
    .catch((error) => {
      return {
        errorMessage: 'Error getting product hub data',
        error: error.toString(),
      }
    })
}
