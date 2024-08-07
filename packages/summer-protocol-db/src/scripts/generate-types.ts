import { Kysely } from 'kysely'
import { ExportStatementNode, PostgresDialect, Serializer, Transformer } from 'kysely-codegen'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { PostgresDB } from 'kysely-codegen/dist/dialects/postgres/postgres-db'

export async function generateTypes(db: Kysely<PostgresDB>) {
  const dialect = new PostgresDialect()
  const transformer = new Transformer()
  const instrospection = await dialect.introspector.introspect({
    db,
  })
  const nodes = transformer.transform({
    dialect,
    camelCase: true,
    metadata: instrospection,
  })

  const lastIndex = nodes.length - 1
  const last = nodes[lastIndex] as ExportStatementNode
  nodes[lastIndex] = {
    ...last,
    argument: {
      ...last.argument,
      name: 'Database',
    },
  }
  const serializer = new Serializer()
  const data = serializer.serialize(nodes)

  try {
    await fs.writeFile(path.join(__dirname, '../database-types.ts'), data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to write database types:', error)
    throw error
  }

  await db.destroy()
}
