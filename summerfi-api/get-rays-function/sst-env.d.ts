import 'sst/node/rds'

declare module 'sst/node/rds' {
  export interface RDSResources {
    'rays-database': {
      defaultDatabaseName: string
      secretArn: string
      clusterArn: string
    }
  }
}
