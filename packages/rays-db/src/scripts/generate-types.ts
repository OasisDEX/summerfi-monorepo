import { Kysely } from 'kysely'
import { ExportStatementNode, PostgresDialect, Serializer, Transformer } from 'kysely-codegen'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function generateTypes(db: Kysely<unknown>) {
  const dialect = new PostgresDialect()
  const transformer = new Transformer()
  const instrospection = await dialect.introspector.introspect({
    //@ts-ignore
    db: db,
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
  await fs.writeFile(path.join(__dirname, '../database-types.ts'), data)

  await db.destroy()
}
