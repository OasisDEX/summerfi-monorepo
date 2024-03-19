const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);

const toKebabCase = (str) => str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

function toCamelCase(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return "";
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        })
        .replace(/-+/g, '')
        .replace(/_+/g, '');
}


const pluginsDirPath = path.join(__dirname, 'protocol-plugins');

const templateDirPath = path.join(__dirname, 'plugin-template');

async function processFileWithMustache(filePath, templateValues) {
    const fileContents = await readFile(filePath, 'utf8');
    const processedContents = mustache.render(fileContents, templateValues);
    await writeFile(filePath, processedContents, 'utf8');
}

async function renameTemplateFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });

    for (let entry of entries) {
        const filePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            // Recursively rename files in subdirectories
            await renameTemplateFiles(filePath);
        } else {
            if (filePath.endsWith('.template')) {
                const newFilePath = filePath.slice(0, -9) + '.ts';
                await rename(filePath, newFilePath);
            }
        }
    }
}

async function copyFilesRecursively(source, destination, templateValues) {
    const entries = await readdir(source, { withFileTypes: true });

    for (let entry of entries) {
        const sourcePath = path.join(source, entry.name);
        let destinationPath = path.join(destination, mustache.render(entry.name, templateValues));

        if (entry.isDirectory()) {
            await mkdir(destinationPath);
            await copyFilesRecursively(sourcePath, destinationPath, templateValues);
        } else {
            await copyFile(sourcePath, destinationPath);
            if (path.extname(sourcePath) === '.md' || path.extname(sourcePath) === '.js' || path.extname(sourcePath) === '.ts') {
                await processFileWithMustache(destinationPath, templateValues);
            }
        }
    }

    await renameTemplateFiles(destination);
}

async function createNewPlugin(pluginName) {
    const templateValues = {
        // TODO: Convert input to pascal case
        name: pluginName, // We're using PascalCase as default
        nameKebab: toKebabCase(pluginName),
        nameCamelCase: toCamelCase(pluginName)
    };

    const newPluginPath = path.join(pluginsDirPath, templateValues.nameKebab);

    try {
        if (fs.existsSync(newPluginPath)) {
            console.error(`Plugin "${pluginName}" already exists.`);
            return;
        }

        await mkdir(newPluginPath);

        await copyFilesRecursively(templateDirPath, newPluginPath, templateValues);

        console.log(`Plugin "${pluginName}" created successfully.`);
    } catch (error) {
        console.error(`Error creating plugin "${pluginName}": ${error.message}`);
    }
}

// Replace 'YourNewPluginName' with the desired new plugin name
createNewPlugin('YourNewPluginName');
