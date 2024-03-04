import { registerClass, registerCustom, stringify, parse } from 'superjson'
import type { RegisterOptions } from 'superjson/dist/class-registry'
import type { CustomTransfomer } from 'superjson/dist/custom-transformer-registry'
import type { JSONValue } from 'superjson/dist/types'

export type Class = object

export class SerializationService {
  static registerClass(v: Class, options?: string | RegisterOptions | undefined): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerClass(v as any, options)
  }

  static registerCustom<I, O extends JSONValue>(
    transformer: Omit<CustomTransfomer<I, O>, 'name'>,
    name: string,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerCustom(transformer, name)
  }

  static stringify(v: unknown): string {
    return stringify(v)
  }

  static parse<T>(v: string): T {
    return parse(v)
  }
}
