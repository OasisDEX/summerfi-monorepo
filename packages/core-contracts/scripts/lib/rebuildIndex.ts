import { resolve } from 'path'
import { Deployments } from '@summerfi/contracts-utils'

Deployments.rebuildIndex(
  resolve(__dirname, '../../deployments'),
  resolve(__dirname, '../../src'),
  true,
)
