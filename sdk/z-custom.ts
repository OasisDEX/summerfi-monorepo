import { z } from 'zod/v4'

const jsonString = () =>
  z
    .string()
    .nonempty()
    .check((ctx) => {
      try {
        JSON.parse(ctx.value)
      } catch (error: { message: string } | any) {
        ctx.issues.push({
          message: `JSON Parse Error: ${error.message}`,
          input: ctx.value,
          code: 'custom',
        })
      }
    })

export const zCustom = {
  jsonString,
}
