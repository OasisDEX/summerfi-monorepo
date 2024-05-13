import { TestManagerProvider, TestProviderType } from './TestManagerProvider'
import { ManagerWithProvidersBase } from '../../src'

export class TestManager extends ManagerWithProvidersBase<TestProviderType, TestManagerProvider> {
  constructor(params: { providers: TestManagerProvider[] }) {
    super(params)
  }
}
