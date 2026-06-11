#!/usr/bin/env node
/**
 * Assembles the monorepo's SDK GitBook tree (gitbook/) SUMMARY.md.
 *
 * The TypeDoc reference is generated directly into gitbook/reference/ by
 * `typedoc` (see typedoc.json `out`). This script renders gitbook/SUMMARY.md
 * from scripts/docs/summary.template.md, expanding the
 * <!-- @generated:sdk-reference --> marker with the per-package, kind-grouped
 * reference nav scanned from gitbook/reference/.
 *
 * Zero npm dependencies (bare Node).
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..')
const GITBOOK = path.join(ROOT, 'gitbook')
const REF = path.join(GITBOOK, 'reference')

function pageTitle(file) {
  const m = fs.readFileSync(file, 'utf8').match(/^# (.+)$/m)
  return m ? m[1].trim() : path.basename(file, '.md')
}

function referenceEntries() {
  if (!fs.existsSync(REF)) return ['<!-- SDK reference not generated yet — run pnpm docs:gen -->']
  const lines = []
  const relOf = (f) => path.relative(GITBOOK, f).split(path.sep).join('/')
  const walk = (dir, depth) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    const readme = entries.find((e) => e.isFile() && e.name === 'README.md')
    let childDepth = depth
    if (readme && dir !== REF) {
      lines.push(`${'  '.repeat(depth)}* [${pageTitle(path.join(dir, 'README.md'))}](${relOf(path.join(dir, 'README.md'))})`)
      childDepth = depth + 1
    }
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) walk(full, childDepth)
      else if (e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md')
        lines.push(`${'  '.repeat(childDepth)}* [${pageTitle(full)}](${relOf(full)})`)
    }
  }
  walk(REF, 0)
  return lines.length ? lines : ['<!-- SDK reference empty -->']
}

const template = fs.readFileSync(path.join(HERE, 'summary.template.md'), 'utf8')
fs.writeFileSync(
  path.join(GITBOOK, 'SUMMARY.md'),
  template.replace('<!-- @generated:sdk-reference -->', referenceEntries().join('\n')),
)
console.log('SDK SUMMARY.md rendered')
