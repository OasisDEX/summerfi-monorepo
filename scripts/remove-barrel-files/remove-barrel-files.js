#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const ignore = require('ignore')

function isBarrelFileContent(content) {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.startsWith('//'))
  return (
    lines.length > 0 &&
    lines.every(
      (l) =>
        l.startsWith('export *') ||
        l.startsWith('export type *') ||
        l.startsWith('export { type') ||
        l.startsWith('export type {') ||
        l === '',
    )
  )
}

function getExportNamesRecursive(filePath, mainIndexPath, visited = new Set()) {
  if (visited.has(filePath)) return []
  visited.add(filePath)

  if (!fs.existsSync(filePath)) return []

  const content = fs.readFileSync(filePath, 'utf8')
  if (isBarrelFileContent(content)) {
    // Recursively follow export * from './foo'
    const exportStarRegex = /^export\s+\*\s+from\s+['"]([^'\"]+)['"];?$/gm
    let match
    let allExports = []
    while ((match = exportStarRegex.exec(content))) {
      const fromPath = match[1]
      if (fromPath.startsWith('.')) {
        const tryExts = [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '/index.ts',
          '/index.js',
          '/index.tsx',
          '/index.jsx',
        ]
        let absPath = null
        for (const ext of tryExts) {
          const candidate = path.resolve(path.dirname(filePath), fromPath + ext)
          if (fs.existsSync(candidate)) {
            absPath = candidate
            break
          }
        }
        if (absPath) {
          allExports = allExports.concat(getExportNamesRecursive(absPath, mainIndexPath, visited))
        }
      }
    }
    return allExports
  }

  // Collect direct and grouped exports, with type/value distinction
  const exportNames = []
  // Types
  const typeExportRegex = /export\s+(?:type|interface|enum)\s+([A-Za-z0-9_]+)/g
  let match
  while ((match = typeExportRegex.exec(content))) {
    const relPath =
      './' +
      path
        .relative(path.dirname(mainIndexPath), filePath)
        .replace(/\\/g, '/')
        .replace(/\.[tj]sx?$/, '')
    exportNames.push({ name: match[1], fromPath: relPath, isType: true })
  }
  // Values
  const valueExportRegex = /export\s+(?:const|let|var|function|class)\s+([A-Za-z0-9_]+)/g
  while ((match = valueExportRegex.exec(content))) {
    const relPath =
      './' +
      path
        .relative(path.dirname(mainIndexPath), filePath)
        .replace(/\\/g, '/')
        .replace(/\.[tj]sx?$/, '')
    exportNames.push({ name: match[1], fromPath: relPath, isType: false })
  }
  // Grouped exports (types and values)
  const groupedExportRegex = /export\s+(type\s+)?\{\s*([^}]+)\s*\}\s*from\s*['"]([^'\"]+)['"]/g
  while ((match = groupedExportRegex.exec(content))) {
    const isType = !!match[1]
    match[2].split(',').forEach((name) => {
      const clean = name.replace(/ as .+$/, '').trim()
      if (clean) exportNames.push({ name: clean, fromPath: match[3], isType })
    })
  }
  return exportNames
}

async function getGitIgnoredFilter(rootPath) {
  let ig = ignore()
  let gitignorePath = path.join(rootPath, '.gitignore')
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
    ig = ig.add(gitignoreContent)
  }
  // Also ignore node_modules and dist by default
  ig = ig.add(['node_modules', 'dist'])
  return (file) => {
    const rel = path.relative(rootPath, file)
    return !ig.ignores(rel) && !file.includes('node_modules') && !file.includes('dist')
  }
}

function updateMainIndex(pkgPath, dryRun = false, filter = () => true) {
  const mainIndex = path.join(pkgPath, 'src', 'index.ts')
  if (!fs.existsSync(mainIndex) || !filter(mainIndex)) {
    console.warn('[WARN] Main index file not found or ignored:', mainIndex)
    return
  }

  let content = fs.readFileSync(mainIndex, 'utf8')
  const exportStarRegex = /^export\s+\*\s+from\s+['"][^'\"]+['"];?$/gm

  const matches = [...content.matchAll(exportStarRegex)]
  if (matches.length === 0) {
    console.log('[INFO] No export * found in', mainIndex)
    return
  }

  let newExports = ''
  matches.forEach((match) => {
    const fromPath = match[0].match(/['"](.+)['"]/)[1]
    if (!fromPath.startsWith('.')) {
      console.warn(`[WARN] Skipping external export * from '${fromPath}' in ${mainIndex}`)
      return
    }
    const tryExts = [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '/index.ts',
      '/index.js',
      '/index.tsx',
      '/index.jsx',
    ]
    let absPath = null
    for (const ext of tryExts) {
      const candidate = path.resolve(path.dirname(mainIndex), fromPath + ext)
      if (fs.existsSync(candidate)) {
        absPath = candidate
        break
      }
    }
    if (!absPath || !filter(absPath)) {
      console.warn(`[WARN] Could not resolve file for export * from '${fromPath}' in ${mainIndex}`)
      return
    }
    const exportObjs = getExportNamesRecursive(absPath, mainIndex)
    // Group by fromPath and type/value
    const grouped = {}
    exportObjs.forEach(({ name, fromPath: realFrom, isType }) => {
      if (!grouped[realFrom]) grouped[realFrom] = { types: [], values: [] }
      if (isType) grouped[realFrom].types.push(name)
      else grouped[realFrom].values.push(name)
    })
    Object.entries(grouped).forEach(([realFrom, { types, values }]) => {
      if (values.length) newExports += `export { ${values.join(', ')} } from '${realFrom}';\n`
      if (types.length) newExports += `export type { ${types.join(', ')} } from '${realFrom}';\n`
    })
  })

  content = content.replace(exportStarRegex, '').trim()
  if (newExports.trim()) {
    content += '\n' + newExports.trim() + '\n'
    if (dryRun) {
      console.log('[DRY RUN] Would update main index:', mainIndex)
    } else {
      console.log('[SUCCESS] Updated main index:', mainIndex)
      fs.writeFileSync(mainIndex, content)
    }
  } else {
    console.warn('[WARN] No explicit exports generated for', mainIndex)
  }
}

function findPackageRoots(rootPath) {
  return glob.sync(`${rootPath}/**/package.json`).map((pkgJsonPath) => path.dirname(pkgJsonPath))
}

function getBarrelFiles(pkgPath, filter = () => true) {
  const mainIndex = path.join(pkgPath, 'src', 'index.ts')
  return glob
    .sync(`${pkgPath}/**/index.ts`, {
      ignore: [mainIndex],
    })
    .filter((file) => path.resolve(file) !== path.resolve(mainIndex) && filter(file))
}

function isBarrelFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  return isBarrelFileContent(content)
}

function removeBarrelFiles(pkgPath, dryRun = false, filter = () => true) {
  const barrels = getBarrelFiles(pkgPath, filter)
  barrels.forEach((file) => {
    if (isBarrelFile(file)) {
      if (dryRun) {
        console.log('[DRY RUN] Would remove barrel:', file)
      } else {
        fs.unlinkSync(file)
        console.log('Removed barrel:', file)
      }
    }
  })
}

if (require.main === module) {
  ;(async () => {
    const inputPath = process.argv[2]
    const dryRun = process.argv.includes('--dry')
    if (!inputPath) {
      console.error('Usage: node remove-barrel-files.js <package-path-or-root> [--dry]')
      process.exit(1)
    }

    let packageRoots = []
    if (fs.existsSync(path.join(inputPath, 'package.json'))) {
      // Single package
      packageRoots = [inputPath]
    } else {
      // Folder of packages
      packageRoots = findPackageRoots(inputPath)
    }

    const filter = await getGitIgnoredFilter(inputPath)

    packageRoots.forEach((pkgPath) => {
      if (!filter(pkgPath)) {
        console.log(`[INFO] Skipping gitignored or untracked package: ${pkgPath}`)
        return
      }
      console.log(`[INFO] Processing package: ${pkgPath}`)
      updateMainIndex(pkgPath, dryRun, filter)
      removeBarrelFiles(pkgPath, dryRun, filter)
    })
  })()
}
