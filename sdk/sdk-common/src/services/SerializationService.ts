import type { RegisterOptions } from 'node_modules/superjson/dist/class-registry'
import type { CustomTransfomer } from 'node_modules/superjson/dist/custom-transformer-registry'
import type { JSONValue } from 'node_modules/superjson/dist/types'
import { SuperJSON } from 'superjson'

export type Class = object

export class SerializationService {
  static registerClass(v: Class, options?: string | RegisterOptions | undefined): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SuperJSON.registerClass(v as any, options)
  }

  static registerCustom<I, O extends JSONValue>(
    transformer: Omit<CustomTransfomer<I, O>, 'name'>,
    name: string,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SuperJSON.registerCustom(transformer, name)
  }

  static stringify(v: unknown): string {
    return SuperJSON.stringify(v)
  }

  static parse<T>(v: string): T {
    return SuperJSON.parse(SuperJSON.stringify(v))
  }

  static getTransformer() {
    return {
      input: {
        serialize: (data: unknown) => {
          console.log('input ser => ', data)
          return SuperJSON.stringify(data)
        },
        deserialize: (data: string) => {
          console.log('input des => ', data)
          return SuperJSON.parse(data)
        },
      },
      output: {
        serialize: (data: unknown) => {
          console.log('output ser => ', data)
          return SuperJSON.stringify(data)
        },
        deserialize: (data: string) => {
          console.log('output des => ', data)
          return SuperJSON.parse(data)
        },
      },
    }
  }
}
