import { type ProductHubItems, type Protocol } from '@summerfi/app-db'
import { type ProductHubData } from '@summerfi/app-types'

import { networksList } from '@/constants/networks-list-ssr'
import { prisma } from '@/helpers/prisma-client'

const filterProductHubData = ({ id: _id, ...table }: ProductHubItems) => table

export const productHubFetcher = async (protocols: string[], testnet = false) => {
  try {
    const network = networksList
      .filter(({ testnet: isTestnet }) => isTestnet === testnet)
      .map(({ name: networkName }) => networkName)

    const response = await prisma.productHubItems.findMany({
      where: {
        OR: protocols.map((protocol) => ({
          protocol: {
            equals: protocol as Protocol,
          },
          network: {
            in: network,
          },
        })),
      },
    })

    return {
      table: response.map(filterProductHubData),
    } as ProductHubData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in productHubFetcher', error)

    throw error
  }
}
