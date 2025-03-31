import type { RegisterOptions } from 'superjson/dist/class-registry'
import type { CustomTransfomer } from 'superjson/dist/custom-transformer-registry'
import type { JSONValue } from 'superjson/dist/types'
import { SuperJSON } from 'superjson'
import { LoggingService } from './LoggingService'

export type Class = object

const LOG_SERIALIZATION = false

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

  static parse<T>(v: unknown): T {
    console.log('>>>> TYPE: ', typeof v)
    return SuperJSON.parse(SuperJSON.stringify(v))
  }

  static getTransformer() {
    return {
      input: {
        serialize: (obj: unknown) => {
          const serializedData = SuperJSON.stringify(obj)
          if (LOG_SERIALIZATION) {
            LoggingService.debug(' => serialize request :: ', serializedData)
          }
          return serializedData
        },
        deserialize: (serializedData: string) => {
          if (LOG_SERIALIZATION) {
            LoggingService.debug(' => deserialize request :: ', serializedData)
          }
          return SuperJSON.parse(serializedData)
        },
      },
      output: {
        serialize: (obj: unknown) => {
          const serializedData = SuperJSON.stringify(obj)
          if (LOG_SERIALIZATION) {
            LoggingService.debug(' <= serialize resposne :: ', serializedData)
          }
          return serializedData
        },
        deserialize: (serializedData: string) => {
          if (LOG_SERIALIZATION) {
            LoggingService.debug(' <= deserialize response :: ', serializedData)
          }
          return SuperJSON.parse(serializedData)
        },
      },
    }
  }
}
