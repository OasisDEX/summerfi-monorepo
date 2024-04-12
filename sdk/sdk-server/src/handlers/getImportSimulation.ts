import { z } from 'zod'
import type { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { importPosition } from '@summerfi/simulator-service/strategies'
import type { ImportPositionParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '../TRPC'

const inputSchema = z.custom<ImportPositionParameters>((parameters) => parameters !== undefined)

export const getImportSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<ISimulation<SimulationType.ImportPosition>> => {
    const args: ImportPositionParameters = opts.input

    return await importPosition(args)
  })
