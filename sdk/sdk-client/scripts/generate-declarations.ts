#!/usr/bin/env ts-node

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// Package folders to process (relative to sdk-client)
const packageFolders = ['../sdk-common', '../protocol-plugins', '../armada-protocol-common']

/**
 * Recursively copy a directory
 */
function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source directory ${src} does not exist`)
    return
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * Get the package folder name from a relative path
 */
function getPackageFolderName(packagePath: string): string {
  return path.basename(packagePath)
}

/**
 * Main function to generate and copy declarations
 */
async function generateDeclarations(): Promise<void> {
  console.log('🚀 Starting declaration generation process...\n')

  for (const packageFolder of packageFolders) {
    const packageName = getPackageFolderName(packageFolder)
    console.log(`📦 Processing package: ${packageName}`)

    // Resolve absolute path to the package
    const packagePath = path.resolve(packageFolder)

    if (!fs.existsSync(packagePath)) {
      throw new Error(`❌ Package folder does not exist: ${packagePath}`)
    }

    // Check if package.json exists
    const packageJsonPath = path.join(packagePath, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`❌ package.json not found in: ${packagePath}`)
    }

    try {
      // Run pnpm declarations in the package folder
      console.log(`   ⚡ Running pnpm declarations in ${packagePath}`)
      execSync('pnpm declarations', {
        cwd: packagePath,
        stdio: 'inherit',
        timeout: 300000, // 5 min timeout
      })

      // Check if declarations folder exists
      const declarationsPath = path.join(packagePath, 'declarations')
      if (!fs.existsSync(declarationsPath)) {
        throw new Error(
          `❌ Declarations folder not found after running command: ${declarationsPath}`,
        )
      }

      // Copy declarations to target location
      const targetPath = path.resolve('bundle/dist', packageName)
      console.log(`   📄 Copying declarations to ${targetPath}`)

      // Remove existing target directory if it exists
      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true })
      }

      // Copy the declarations folder
      copyDir(declarationsPath, targetPath)

      console.log(`   ✅ Successfully processed ${packageName}\n`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`❌ Error processing ${packagePath} ${packageName}: ${errorMessage}`)
    }
  }

  console.log('🎉 Declaration generation process completed!')

  console.log('📝 Updating declaration imports...')
  // Update all declaration files to replace @summerfi imports with absolute paths
  updateDeclarationImports()
}

/**
 * Update all .d.ts files in bundle/dist to replace @summerfi imports with absolute paths
 */
function updateDeclarationImports(): void {
  const bundleDistPath = path.resolve('bundle/dist')

  if (!fs.existsSync(bundleDistPath)) {
    console.warn('⚠️  bundle/dist directory not found, skipping declaration updates')
    return
  }

  try {
    console.log('📝 Updating declaration file imports...')

    // Recursively find all .d.ts files
    const dtsFiles = findDtsFiles(bundleDistPath)

    for (const filePath of dtsFiles) {
      // Read the current content
      let content = fs.readFileSync(filePath, 'utf8')

      // Replace @summerfi imports with absolute paths
      content = content.replace(/@summerfi\/sdk-common/g, `${bundleDistPath}/sdk-common`)
      content = content.replace(
        /@summerfi\/protocol-plugins/g,
        `${bundleDistPath}/protocol-plugins`,
      )
      content = content.replace(
        /@summerfi\/armada-protocol-common/g,
        `${bundleDistPath}/armada-protocol-common`,
      )

      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8')
    }

    console.log(`   ✅ Successfully updated ${dtsFiles.length} declaration files`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`❌ Error updating declaration imports: ${errorMessage}`)
  }
}

/**
 * Recursively find all .d.ts files in a directory
 */
function findDtsFiles(dir: string): string[] {
  const dtsFiles: string[] = []

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      dtsFiles.push(...findDtsFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      dtsFiles.push(fullPath)
    }
  }

  return dtsFiles
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDeclarations().catch((error: unknown) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { generateDeclarations }
