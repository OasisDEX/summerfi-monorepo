import { resolve } from 'path'
import { Deployments } from '../../../deployment-utils/src'

Deployments.rebuildIndex(
  resolve(__dirname, '../../deployments'),
  resolve(__dirname, '../../src'),
  true,
)
