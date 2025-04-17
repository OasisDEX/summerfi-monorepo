import type { IImportPositionParameters } from '@summerfi/sdk-common'
import { IImportSimulation } from '@summerfi/sdk-common'
import { importPosition } from '@summerfi/simulator-service/strategies'
import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

const inputSchema = z.custom<IImportPositionParameters>((parameters) => parameters !== undefined)

export const getImportSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<IImportSimulation> => {
    const args: IImportPositionParameters = opts.input

    return await importPosition(args)
  })
