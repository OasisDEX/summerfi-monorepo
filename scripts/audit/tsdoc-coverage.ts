#!/usr/bin/env tsx
/**
 * TSDoc coverage auditor for SDK packages.
 *
 * Walks the public API surface of each package — the exports of src/index.ts,
 * following re-export chains — using the TypeScript compiler API, and reports
 * which exported symbols (and public class/interface members) carry doc
 * comments. Symbols re-exported from another package are counted separately
 * and not held against the re-exporting package.
 *
 * Usage:
 *   pnpm tsx scripts/audit/tsdoc-coverage.ts [--packages sdk/sdk-client,...]
 *       [--out docs/audit/2026-06/coverage] [--matrix]
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import ts from 'typescript'

const ROOT = path.resolve(__dirname, '..', '..')

const DEFAULT_PACKAGES = [
  'sdk/sdk-client',
  'sdk/sdk-client-react',
  'sdk/sdk-common',
  ...fs
    .readdirSync(path.join(ROOT, 'sdk'))
    .filter((d) => d.endsWith('-common') && d !== 'sdk-server-common')
    .map((d) => `sdk/${d}`),
  'sdk/sdk-server-common',
].filter((p, i, arr) => arr.indexOf(p) === i && fs.existsSync(path.join(ROOT, p, 'src/index.ts')))

interface Item {
  file: string
  line: number
  symbolKind: string
  name: string
  missing: string[]
}

interface Report {
  package: string
  repo: 'summerfi-monorepo'
  language: 'typescript'
  entryPoint: string
  metrics: {
    exportedSymbols: { total: number; documented: number; partial: number }
    members: { total: number; documented: number }
    byKind: Record<string, { total: number; documented: number }>
    reexportedExternal: number
  }
  coveragePct: number
  items: Item[]
  quality: Record<string, never>
  verdict: 'thorough' | 'partial' | 'sparse' | 'empty'
}

function loadProgram(pkgDir: string): ts.Program {
  const configPath = ['tsconfig.build.json', 'tsconfig.json']
    .map((f) => path.join(pkgDir, f))
    .find(fs.existsSync)
  if (!configPath) throw new Error(`no tsconfig in ${pkgDir}`)
  const raw = ts.readConfigFile(configPath, ts.sys.readFile)
  if (raw.error) throw new Error(ts.flattenDiagnosticMessageText(raw.error.messageText, '\n'))
  const parsed = ts.parseJsonConfigFileContent(raw.config, ts.sys, pkgDir)
  // composite/incremental demand .d.ts of project references; we type-walk sources directly
  parsed.options.composite = false
  parsed.options.incremental = false
  parsed.options.tsBuildInfoFile = undefined
  parsed.options.skipLibCheck = true
  parsed.options.noEmit = true
  return ts.createProgram(parsed.fileNames, parsed.options)
}

function symbolKind(sym: ts.Symbol): string {
  const f = sym.flags
  if (f & ts.SymbolFlags.Class) return 'class'
  if (f & ts.SymbolFlags.Interface) return 'interface'
  if (f & ts.SymbolFlags.TypeAlias) return 'typeAlias'
  if (f & ts.SymbolFlags.Enum || f & ts.SymbolFlags.ConstEnum) return 'enum'
  if (f & ts.SymbolFlags.Function) return 'function'
  if (f & ts.SymbolFlags.Module) return 'namespace'
  if (f & ts.SymbolFlags.Variable) return 'variable'
  return 'other'
}

function hasDoc(sym: ts.Symbol, checker: ts.TypeChecker): boolean {
  if (sym.getDocumentationComment(checker).length > 0) return true
  // re-exports may carry the doc on the original declaration's JSDoc node
  return (sym.declarations ?? []).some((d) => ts.getJSDocCommentsAndTags(d).length > 0)
}

function fnSignatureGaps(decl: ts.SignatureDeclaration): string[] {
  const gaps: string[] = []
  const paramTags = new Set(
    ts.getJSDocParameterTags
      ? decl.parameters.flatMap((p) => ts.getJSDocParameterTags(p).map((t) => t.name.getText()))
      : [],
  )
  const undocumented = decl.parameters.filter((p) => {
    const name = p.name.getText()
    return !paramTags.has(name)
  })
  if (decl.parameters.length > 0 && undocumented.length > 0) gaps.push('params')
  const retType = decl.type?.getText()
  const returnsSomething = retType && !/^(void|Promise<void>)$/.test(retType)
  if (returnsSomething && ts.getJSDocReturnTag(decl) == null) gaps.push('returns')
  return gaps
}

function isPublicMember(m: ts.Symbol): boolean {
  const decl = m.declarations?.[0]
  if (!decl) return false
  const mods = ts.canHaveModifiers(decl) ? ts.getModifiers(decl) : undefined
  if (
    mods?.some(
      (mod) =>
        mod.kind === ts.SyntaxKind.PrivateKeyword || mod.kind === ts.SyntaxKind.ProtectedKeyword,
    )
  )
    return false
  if (m.name.startsWith('_') || m.name.startsWith('#')) return false
  return (
    (m.flags & (ts.SymbolFlags.Method | ts.SymbolFlags.Property | ts.SymbolFlags.Accessor)) !== 0
  )
}

function auditPackage(pkgRel: string): Report {
  const pkgDir = path.join(ROOT, pkgRel)
  const program = loadProgram(pkgDir)
  const checker = program.getTypeChecker()
  const entry = path.join(pkgDir, 'src/index.ts')
  const sourceFile = program.getSourceFile(entry)
  if (!sourceFile) throw new Error(`entry not in program: ${entry}`)
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) throw new Error(`no module symbol for ${entry}`)

  const exports = checker.getExportsOfModule(moduleSymbol)
  const items: Item[] = []
  const byKind: Record<string, { total: number; documented: number }> = {}
  let total = 0
  let documented = 0
  let partial = 0
  let memberTotal = 0
  let memberDocumented = 0
  let external = 0
  const srcPrefix = path.join(pkgDir, 'src') + path.sep

  for (const exp of exports.sort((a, b) => a.name.localeCompare(b.name))) {
    let sym = exp
    if (sym.flags & ts.SymbolFlags.Alias) {
      try {
        sym = checker.getAliasedSymbol(sym)
      } catch {
        /* keep alias */
      }
    }
    const decl = sym.declarations?.[0] ?? exp.declarations?.[0]
    if (!decl) continue
    const file = decl.getSourceFile()
    if (!file.fileName.startsWith(srcPrefix)) {
      external++
      continue
    }
    const kind = symbolKind(sym)
    const { line } = file.getLineAndCharacterOfPosition(decl.getStart())
    const rel = path.relative(ROOT, file.fileName)
    byKind[kind] ??= { total: 0, documented: 0 }
    byKind[kind].total++
    total++

    const documentedHere = hasDoc(sym, checker) || hasDoc(exp, checker)
    const missing: string[] = []
    if (!documentedHere) missing.push('summary')

    if (kind === 'function' && ts.isFunctionLike(decl)) {
      missing.push(...fnSignatureGaps(decl as ts.SignatureDeclaration))
    }

    if ((kind === 'class' || kind === 'interface') && documentedHere) {
      const members = checker
        .getTypeAtLocation(decl)
        .getProperties()
        .filter(isPublicMember)
        .filter((m) => m.declarations?.[0]?.getSourceFile().fileName.startsWith(srcPrefix))
      for (const m of members.sort((a, b) => a.name.localeCompare(b.name))) {
        memberTotal++
        if (hasDoc(m, checker)) {
          memberDocumented++
        } else if (m.flags & ts.SymbolFlags.Method) {
          // undocumented public methods are actionable; bare properties are often self-evident
          const mDecl = m.declarations![0]
          const mFile = mDecl.getSourceFile()
          const { line: mLine } = mFile.getLineAndCharacterOfPosition(mDecl.getStart())
          items.push({
            file: path.relative(ROOT, mFile.fileName),
            line: mLine + 1,
            symbolKind: 'member',
            name: `${exp.name}.${m.name}`,
            missing: ['summary'],
          })
        }
      }
    }

    if (documentedHere) {
      byKind[kind].documented++
      if (missing.length > 0) partial++
      else documented++
    }
    if (missing.length > 0) {
      items.push({ file: rel, line: line + 1, symbolKind: kind, name: exp.name, missing })
    }
  }

  const surface = total + memberTotal
  const covered = documented + partial + memberDocumented
  const pct = surface ? Math.round((1000 * covered) / surface) / 10 : 100
  const fullPct = total ? documented / total : 1
  const verdict: Report['verdict'] =
    surface === 0
      ? 'empty'
      : pct >= 90 && fullPct >= 0.85
        ? 'thorough'
        : pct >= 55
          ? 'partial'
          : 'sparse'

  return {
    package: pkgRel,
    repo: 'summerfi-monorepo',
    language: 'typescript',
    entryPoint: path.relative(ROOT, entry),
    metrics: {
      exportedSymbols: { total, documented, partial },
      members: { total: memberTotal, documented: memberDocumented },
      byKind,
      reexportedExternal: external,
    },
    coveragePct: pct,
    items,
    quality: {},
    verdict,
  }
}

function renderMatrix(reports: Report[], outPath: string) {
  const lines = [
    '# TSDoc coverage matrix — summerfi-monorepo',
    '',
    'Coverage = exported symbols (and public members of documented classes/',
    'interfaces) carrying a doc comment, over the public API surface reachable',
    'from each package’s src/index.ts. Symbols re-exported from other packages',
    'are counted on their defining package.',
    '',
    '| Package | Exported symbols (full / partial) | Members | Re-exported | Coverage | Verdict |',
    '|---|---|---|---|---|---|',
  ]
  for (const r of [...reports].sort((a, b) => a.coveragePct - b.coveragePct)) {
    const s = r.metrics.exportedSymbols
    const m = r.metrics.members
    lines.push(
      `| ${r.package} | ${s.documented + s.partial}/${s.total} (${s.documented} full, ${s.partial} partial) ` +
        `| ${m.documented}/${m.total} | ${r.metrics.reexportedExternal} | ${r.coveragePct}% | ${r.verdict} |`,
    )
  }
  fs.writeFileSync(outPath, lines.join('\n') + '\n')
}

function main() {
  const args = process.argv.slice(2)
  const getFlag = (name: string): string | undefined => {
    const i = args.indexOf(`--${name}`)
    return i >= 0 ? args[i + 1] : undefined
  }
  const pkgs = getFlag('packages')?.split(',') ?? DEFAULT_PACKAGES
  const outRel = getFlag('out') ?? 'docs/audit/2026-06/coverage'
  const outDir = path.isAbsolute(outRel) ? outRel : path.join(ROOT, outRel)
  fs.mkdirSync(outDir, { recursive: true })

  const reports: Report[] = []
  for (const pkg of pkgs) {
    try {
      const report = auditPackage(pkg)
      reports.push(report)
      const slug = pkg.replace(/\//g, '__')
      fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(report, null, 2) + '\n')
      const s = report.metrics.exportedSymbols
      console.log(
        `${pkg}: ${report.coveragePct}% (${report.verdict}) — ` +
          `${s.documented + s.partial}/${s.total} symbols documented (${s.partial} partial)`,
      )
    } catch (err) {
      console.error(`${pkg}: FAILED — ${(err as Error).message}`)
      process.exitCode = 1
    }
  }

  if (args.includes('--matrix')) {
    const matrixPath = path.join(path.dirname(outDir), 'coverage-matrix.md')
    renderMatrix(reports, matrixPath)
    console.log(`matrix → ${path.relative(ROOT, matrixPath)}`)
  }
}

main()
