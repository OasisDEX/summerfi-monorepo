import { z } from 'zod'
import type { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { importPosition } from '@summerfi/simulator-service/strategies'
import type { IImportPositionParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '../SDKTRPC'

const inputSchema = z.custom<IImportPositionParameters>((parameters) => parameters !== undefined)

export const getImportSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<ISimulation<SimulationType.ImportPosition>> => {
    const args: IImportPositionParameters = opts.input

    return await importPosition(args)
  })
